# 基于 Web 的智能个人记录与分析平台

一个集文字分析、旅行记录、地图可视化于一体的个人智能 Web 平台。

## 功能模块

### 文字实验室
- 中文情感分析（SnowNLP）：输入文本，自动计算情感分数并分类
- 拼音标注（pypinyin）：将中文文本转为带声调的拼音
- 历史记录：自动保存分析结果，支持会话隔离

### 关键词提取
- TextRank 算法提取关键词，短文本自动退回 TF-IDF 兜底
- 基于 jieba 分词，支持中英文混合输入

### 旅行记忆地图
- ECharts 中国地图可视化，按省份点亮去过的地方
- 旅行记录管理：新增、查看、删除（含自动情感分析和关键词提取）
- 点击省份查看该省所有旅行记录
- 左侧半透明功能栏，可收起

## 技术栈

### 前端
- Next.js 15 + React 19
- ECharts 6（地图可视化）
- anime.js（动画效果）

### 后端
- Python 3.13 + FastAPI
- 分层架构：接口层（jiekou）/ 业务层（yewuluoji）/ 存储层（storage）
- SQLite（aiosqlite 异步读写）

### AI 能力
- SnowNLP：中文情感分析
- jieba：中文分词 + TextRank/TF-IDF 关键词提取
- bge-m3（规划中）：语义向量搜索

## 项目结构

```
test/
├── app/                    # Next.js App Router 路由
│   ├── layout.jsx          # 全站外壳（导航栏 + 全局样式）
│   ├── page.jsx            # 首页 /
│   ├── text-lab/page.jsx   # 文字实验室 /text-lab
│   ├── keywords/page.jsx   # 关键词提取 /keywords
│   └── trips/page.jsx      # 旅行地图 /trips
├── components/             # React 组件
│   ├── Nav.jsx             # 导航栏
│   ├── HomeView.jsx        # 首页
│   ├── TextLabView.jsx     # 文字实验室
│   ├── KeywordsView.jsx    # 关键词提取
│   ├── MapView.jsx         # 旅行地图（ECharts + 左侧栏 + 记录面板）
│   ├── InputCard.jsx       # 文本输入
│   ├── ResultCard.jsx      # 结果展示
│   ├── AnimatedCardGrid.jsx
│   └── PageHeading.jsx
├── backend/                # Python 后端
│   ├── main.py             # FastAPI 入口（CORS + 路由挂载）
│   ├── storage.py          # 存储层（SQLite 读写）
│   ├── jiekou/             # 接口层
│   │   ├── jiekou.py       # 文字相关接口
│   │   └── trips.py        # 旅行相关接口
│   └── yewuluoji/          # 业务层
│       ├── sentiment.py    # 情感分析
│       └── keywords.py     # 关键词提取
├── data/site.js            # 前端静态数据
├── public/data/china.json  # 中国地图边界数据
└── css/                    # 样式文件
```

## 本地开发

### 前端
```bash
cd test
npm install
npm run dev    # http://localhost:3000
```

### 后端
```bash
cd test/backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn snownlp pypinyin jieba httpx pydantic
fastapi dev main.py    # http://localhost:8000
```

### 环境变量
项目根目录创建 `.env.local`：
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 部署
- 服务器：Ubuntu 24.04（火山云 ECS）
- Web 服务器：nginx（静态文件托管 + /api 反向代理）
- 构建命令：`npm run build`（生成 out/ 静态导出）
- 后端运行：`nohup uvicorn main:app --host 127.0.0.1 --port 8000`

## 作者
王晨嘉 · 湖南财政经济学院 · 计算机科学与技术
