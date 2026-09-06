#get 和post方法都写在这里 
from fastapi import FastAPI
from pydantic import BaseModel #专门管数据的解析和校验
from fastapi.middleware.cors import CORSMiddleware #添加中间件
from pypinyin import lazy_pinyin, Style #外部库 用于生成拼音，style声调，lazy_pinyin用于去掉一个中括号

from snownlp import SnowNLP #外部库 用于计算感情值

import json
from datetime import datetime, timezone #

HISTORY_FILE = "history.json"

def load_history():
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f: #with open 打开文件
            return json.load(f)
    except FileNotFoundError:
        return []

def save_record(record):
    records = load_history() #先把所有数据都读出来
    records.append(record)   #在记录新数据，再一次性再写回去
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

#文件存储模式记录数据



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
    records = load_history()   # 读出文件里的全部记录
    records.reverse()
    return records[:2]
