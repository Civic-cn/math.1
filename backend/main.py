#get 和post方法都写在这里 
import uuid #随机生成id用
import re            # 万一大模型乱回复，兜底抠出 JSON 用
import json          # 解析 Ollama 返回的 JSON格式
import httpx         # 用来调本地 Ollama 的 HTTP 客户端
from fastapi import FastAPI,Request, Response
from pydantic import BaseModel #专门管数据的解析和校验
from fastapi.middleware.cors import CORSMiddleware #添加中间件
from pypinyin import lazy_pinyin, Style #外部库 用于生成拼音，style声调，lazy_pinyin用于去掉一个中括号
from snownlp import SnowNLP #外部库 用于计算感情值
from storage import init_db, save_record, get_history #从存储层引入
from datetime import datetime, timezone #

OLLAMA_URL = "http://localhost:11434/api/generate"#大模型地址
OLLAMA_MODEL = "qwen2.5:1.5b"   # ← 本地大模型版本

init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://101.96.206.125", "https://101.96.206.125"],
    allow_methods=["GET", "POST"],#允许哪些方法
    allow_headers=["*"],
    allow_credentials=True,          # ← 新增：允许跨源请求带上 cookie
) #中间件，解决跨源问题

def get_session_id(request: Request, response: Response) -> str:
    sid = request.cookies.get("session_id")      # 先看有没有纸条
    if not sid:                                  # 第一次来，没有——发一张
        sid = uuid.uuid4().hex                    # 一串随机、不重复的 id
        response.set_cookie(   #把id写进set-cookie
            "session_id", sid,
            httponly=True, samesite="lax",
            max_age=60 * 60 * 24 * 30,            # 记 30 天
        )
    return sid
# 

profile = {
    "heroTitle": "关于我来自后端",
    "heroSubtitle": "项目，创意，灵感，心得，我的作品",
    "featuredWork": {
        "kicker": "作品",
        "title": "文字实验室",
        "copy": "拼音和情绪，挖掘中文里的细节",
        "linkLabel": "打开作品",
    },
    "identity": {
        "motto": "已识乾坤大，尤怜草木青",
        "learning": "零到全栈",
    },
}
class AnalyzeRequest(BaseModel):
    text: str
#规定analyze的格式要求是str basemodel继承了str的格式给到analyze

def analyze_sentiment(text: str):
    """用本地 Ollama 判断情感，失败则回退 SnowNLP"""
    prompt = (
        "你是中文情感分析助手。请判断下面文本的情感倾向，"
        "只返回一个JSON：{\"score\": 0到1的小数，越接近1越积极，中性评价给分0.5左右，积极向上的词给分高于0.5，负面的词给出低于0.5}。\n"
        f"文本：{text}"
    )#prompt写回复规则
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": {
            "type": "object",
            "properties": {"score": {"type": "number"}},
            "required": ["score"],
        },#发给大模型的内容 模型是谁，prompt是什么，stream=false意思一次性说完
    }# fomat 是大模型的答题模版
    try:
        r = httpx.post(OLLAMA_URL, json=payload, timeout=120)
        r.raise_for_status()
        raw = r.json()["response"]
        #上面的try用于发请求和收请求，还设置超时时间
        try:
            score = float(json.loads(raw)["score"])      # 正常：干净 JSON
        except Exception:
            m = re.search(r"\{.*\}", raw, re.DOTALL)      # 兜底：从思考包裹里抠 JSON
            score = float(json.loads(m.group())["score"]) if m else SnowNLP(text).sentiments
        score = max(0.0, min(1.0, score))
    except Exception:#最坏的情况，大模型不行，退回snowlp
        score = SnowNLP(text).sentiments
    return round(score, 2)

def score_label(score):
    if score >= 0.8:
        return "乐观主义者"      
    elif score >= 0.6:
        return "至少是positive"     
    elif score >= 0.4:
        return "中！！！"        
    elif score >= 0.2:
        return "似乎有点糟糕"      
    else:
        return "看起来很糟糕"     

# label单独用一个函数来实现，因为逻辑较为简单



@app.get("/api/history")
def history(request: Request, response: Response, limit: int = 10):
    sid = get_session_id(request, response)
    return get_history(sid, limit)    # 只回这个会话自己的
#打开网页就自动请求一个api出现自我介绍文本
# 框架把handmake里面的4对细节都封装了， 请求头 请求体 空行啊，状态头啊，状态体啊，空行啊

@app.post("/api/analyze")
def analyze(req: AnalyzeRequest, request: Request, response: Response):
    sid = get_session_id(request, response)
    text = req.text
    score = analyze_sentiment(text)    # 原来调 SnowNLP，现调本地 Ollama
    result = {
        "text": text,
        "score": score,
        "label": score_label(score),
        "pinyin": " ".join(lazy_pinyin(text, style=Style.TONE)),
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    save_record(sid, result)          # 存的时候盖上这个会话的记号
    return result                     # ← 返回体一个字没变，session_id 只走 cookie

# @app 接口层
# 函数定义 业务层
# 怎么存，怎么取 存储层 有点复杂，我们选择单独一个文件
# 等 网页长得足够大，我们在把业务层和接口层分开