#get 和post方法都写在这里 
import uuid #随机生成id用
from fastapi import FastAPI,Request, Response
from pydantic import BaseModel #专门管数据的解析和校验
from fastapi.middleware.cors import CORSMiddleware #添加中间件
from pypinyin import lazy_pinyin, Style #外部库 用于生成拼音，style声调，lazy_pinyin用于去掉一个中括号
from snownlp import SnowNLP #外部库 用于计算感情值
from storage import init_db, save_record, get_history #从存储层引入
from datetime import datetime, timezone #

init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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


def score_label(score):
    if score >= 0.6:
        return "非常optimistic"
    elif score <= 0.4:
        return "有点emo了"
    else:
        return "中性"
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
    score = round(SnowNLP(text).sentiments, 2)
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