# 接口层：旅行记录接口（只认 HTTP，算数的事喊 yewuluoji）
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from storage import add_trip, get_trips, get_trip, delete_trip, get_province_stats
from yewuluoji.sentiment import analyze_sentiment, score_label
from yewuluoji.keywords import extract_keywords

router = APIRouter()

class TripIn(BaseModel):
    title: str
    content: str = ""
    province: str
    city: str
    visit_date: str = ""

@router.post("/api/trips")
def create_trip(trip: TripIn):
    text = trip.title + "。" + trip.content   # 给 AI 分析的文本
    score = analyze_sentiment(text)           # 调业务层算情感
    result = {
        "title": trip.title,
        "content": trip.content,
        "province": trip.province,
        "city": trip.city,
        "visit_date": trip.visit_date,
        "sentiment_score": score,
        "sentiment_label": score_label(score),
        "keywords": extract_keywords(text),   # 调业务层提关键词
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    trip_id = add_trip(result)                # 存库，拿回 id
    return {"id": trip_id, **result}

@router.get("/api/trips")
def list_trips(province: str = "", city: str = ""):
    return get_trips(province or None, city or None)

@router.get("/api/trips/{trip_id}")
def trip_detail(trip_id: int):
    trip = get_trip(trip_id)
    if not trip:
        return {"error": "记录不存在"}
    return trip

@router.delete("/api/trips/{trip_id}")
def remove_trip(trip_id: int):
    delete_trip(trip_id)
    return {"ok": True}

@router.get("/api/provinces/stats")
def province_stats():
    return get_province_stats()
