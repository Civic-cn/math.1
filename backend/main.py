#get 和post方法都写在这里 
from fastapi import FastAPI
from pydantic import BaseModel #专门管数据的解析和校验

app = FastAPI()

profile = {
    "heroTitle": "关于我",
    "heroSubtitle": "项目，创意，灵感，心得，我的作品",
}
class AnalyzeRequest(BaseModel):
    text: str
#规定analyze的格式要求是str basemodel继承了str的格式给到analyze

@app.get("/api/profile")
def get_profile():
    return profile

# 框架把handmake里面的4对细节都封装了， 请求头 请求体 空行啊，状态头啊，状态体啊，空行啊

@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    return {
        "text": req.text,
        "score": 0.5,
        "label": "偏平静",
        "pinyin": "（模块 6 再说）",
    }