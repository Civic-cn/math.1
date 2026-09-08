import sqlite3
DB_FILE = "history.db"


def get_conn():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row      # 让查询结果带上列名（默认是元组）
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(""" 
    CREATE TABLE IF NOT EXISTS history ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        score REAL,
        label TEXT,
        pinyin TEXT,
        created_at TEXT,
        session_id TEXT
    )
    """)#如果没有表，才建立文字实验室表，不会每次都建
    cur.execute ("CREATE INDEX IF NOT EXISTS idx_history_session_created " \
    "ON history(session_id, created_at)")
    #建立索引 名字叫 idx 
    # 时间这一列和id是频繁查询的，所以创建索引不亏
    conn.commit()
    conn.close()
#代码建表

def save_record(session_id, record):#每次存时都要给出id
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO history (session_id, text, score, label, pinyin, created_at)"
        " VALUES (?, ?, ?, ?, ?, ?)",
        [session_id, record["text"], record["score"],
        record["label"], record["pinyin"], record["created_at"]],
    )
    conn.commit()
    conn.close()



def get_history(session_id, limit):
    conn = get_conn()
    cur = conn.cursor()
    rows = cur.execute(
        "SELECT * FROM history WHERE session_id = ? ORDER BY created_at DESC LIMIT ?",
        [session_id, limit],
    ).fetchall()
    conn.close()

    records = []
    for row in rows:
        records.append(dict(row)) 
    return records

#limit在main写定了，不要写数字在存储层， 


## 功能文字分析的数据库


## 功能旅行日志的数据库