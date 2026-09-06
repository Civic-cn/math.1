#get 和post方法都写在这里 
from fastapi import FastAPI
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
    allow_credentials=True,
    allow_methods=["GET", "POST"],#允许哪些方法
    allow_headers=["*"],
) #后端认可前端3000这个端口，解决跨源问题


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

@app.get("/api/profile")
def get_profile():
    return profile
#打开网页就自动请求一个api出现自我介绍文本

# 框架把handmake里面的4对细节都封装了， 请求头 请求体 空行啊，状态头啊，状态体啊，空行啊

def score_label(score):
    if score >= 0.6:
        return "非常optimistic"
    elif score <= 0.4:
        return "有点emo了"
    else:
        return "中性"
# label单独用一个函数来实现，因为逻辑较为简单
@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    text = req.text
    score = round(SnowNLP(text).sentiments, 2)
    result = {
        "text": text,
        "score": score,
        "label": score_label(score),
        "pinyin": " ".join(lazy_pinyin(text, style=Style.TONE)),
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),  # ← 新增字段，用世界标准时区代替时间
    }
    save_record(result)         # ← 存档到文件
    return result

@app.get("/api/history")
def history():
    return get_history(10)#这里改返回的条数

# @app 接口层
# 函数定义 业务层
# 怎么存，怎么取 存储层 有点复杂，我们选择单独一个文件
# 等 网页长得足够大，我们在把业务层和接口层分开