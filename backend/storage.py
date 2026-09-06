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
        created_at TEXT
    )
    """)#如果没有表，才建立文字实验室表，不会每次都建
    conn.commit()
    conn.close()
#代码建表
    cur.execute("CREATE INDEX IF NOT EXISTS idx_history_created ON history(created_at)")
#建立索引 名字叫 idx 时间这一列是频繁使用的，所以创建索引不亏


def save_record(record):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO history (text, score, label, pinyin, created_at) VALUES (?, ?, ?, ?, ?)",
        [record["text"], record["score"], record["label"], record["pinyin"], record["created_at"]],
    )#防注入，全置为问号，怎么防的不用管 create at是标准时间前面main有
    conn.commit()
    conn.close()



def get_history(limit):
    conn = get_conn()
    cur = conn.cursor()
    rows = cur.execute(
        "SELECT * FROM history ORDER BY created_at DESC LIMIT ?",
        [limit],
    ).fetchall()#fetchall，把查到的所有数据一次性拿成一个list
    conn.close()

    records = []
    for row in rows: #for循环在这里是把取出来的值转换为对用户友好的格式
        records.append(dict(row))
    return records

#limit在main写定了，不要写数字在存储层， 