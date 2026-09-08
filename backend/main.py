#get 和post方法都写在这里 
from fastapi import FastAPI
from storage import init_db
from fastapi.middleware.cors import CORSMiddleware #添加中间件
from jiekou.jiekou import router

OLLAMA_URL = "http://localhost:11434/api/generate"#大模型地址
OLLAMA_MODEL = "qwen2.5:1.5b"   # ← 本地大模型版本 deepseek-r1:7b qwen2.5:1.5b

init_db()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://101.96.206.125", "https://101.96.206.125"],
    allow_methods=["GET", "POST"],#允许哪些方法
    allow_headers=["*"],
    allow_credentials=True,          # ← 新增：允许跨源请求带上 cookie
) #中间件，解决跨源问题

# 注册路由：以后旅行功能 = routers/trips.py，在这里加一行 app.include_router(trips.router)
app.include_router(router)


# @app 接口层
# 函数定义 业务层
# 怎么存，怎么取 存储层 有点复杂，我们选择单独一个文件
# 等 网页长得足够大，我们在把业务层和接口层分开

