import uuid #随机生成id用
from fastapi import APIRouter, Request, Response
from pydantic import BaseModel #专门管数据的解析和校验
from pypinyin import lazy_pinyin, Style #外部库 用于生成拼音，style声调，lazy_pinyin用于去掉一个中括号
from storage import save_record, get_history #从存储层引入
from yewuluoji.sentiment import analyze_sentiment, score_label
from yewuluoji.keywords import extract_keywords
from datetime import datetime, timezone #获取时间

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str


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



profile = {#一打开主页面就请求的自建api
    "heroTitle": "关于我的作品",
    "heroSubtitle": "完全的灵感,还在完善更多功能中......",
    "featuredWork": {
        "kicker": "功能A",
        "title": "文字实验室",
        "copy": "拼音和情绪，挖掘中文里的细节",
        "linkLabel": "打开作品",
    },
    "featuredWork2": {
        "kicker": "功能B",
        "title": "旅行日志",
        "copy": "记录足迹，在地图上点亮去过的地方",
        "linkLabel": "点击进入",
    },
    "identity": {
        "motto": "此情可待成追忆，只是当时已惘然",
        "coding": "毕业作品",
    },
}

@router.get("/api/profile")#调用
def get_profile():
    return profile

@router.get("/api/history")
def history(request: Request, response: Response, limit: int = 10):
    sid = get_session_id(request, response)
    return get_history(sid, limit)    # 只回这个会话自己的
# 框架把handmake里面的4对细节都封装了， 请求头 请求体 空行啊，状态头啊，状态体啊，空行啊


@router.post("/api/analyze")
def analyze(req: AnalyzeRequest, request: Request, response: Response):
    sid = get_session_id(request, response)
    text = req.text
    score =    analyze_sentiment(text)   # 调业务层 
    result = {
        "text": text,
        "score": score,
        "label": score_label(score),
        "pinyin": " ".join(lazy_pinyin(text, style=Style.TONE)),
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    save_record(sid, result)          # 存的时候盖上这个会话的记号
    return result  

@router.post("/api/keywords")
def keywords(req: AnalyzeRequest):
    return {"text": req.text, "keywords": extract_keywords(req.text)}