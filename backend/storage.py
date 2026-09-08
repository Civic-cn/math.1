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
    """)#功能文字实验室表
    cur.execute ("CREATE INDEX IF NOT EXISTS idx_history_session_created " \
    "ON history(session_id, created_at)")
    #建立索引 名字叫 idx 时间这一列和id是频繁查询的，所以创建索引不亏
    # 旅行日志表
    cur.execute("""
    CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        province TEXT NOT NULL,
        city TEXT NOT NULL,
        visit_date TEXT,
        sentiment_score REAL,
        sentiment_label TEXT,
        keywords TEXT,
        created_at TEXT
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        caption TEXT
    )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_trips_province ON trips(province)")

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
def add_trip(trip):  # trip 是字典，存一条旅程记录
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO trips (title, content, province, city, visit_date, "
        "sentiment_score, sentiment_label, keywords, created_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [trip["title"], trip["content"], trip["province"], trip["city"],
         trip["visit_date"], trip["sentiment_score"], trip["sentiment_label"],
         trip["keywords"], trip["created_at"]],
    )
    conn.commit()
    trip_id = cur.lastrowid   # 拿回数据库自动分配的 id
    conn.close()
    return trip_id

def get_trips(province=None, city=None):
    # 不带筛选就返回全部；带省份就只查这个省
    sql = "SELECT * FROM trips"
    args = []
    if province:
        sql += " WHERE province = ?"
        args.append(province)
        if city:
            sql += " AND city = ?"
            args.append(city)
    sql += " ORDER BY visit_date DESC"
    conn = get_conn()
    rows = conn.execute(sql, args).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_trip(trip_id):
    conn = get_conn()
    row = conn.execute("SELECT * FROM trips WHERE id = ?", [trip_id]).fetchone()
    conn.close()
    return dict(row) if row else None

def delete_trip(trip_id):
    conn = get_conn()
    conn.execute("DELETE FROM trips WHERE id = ?", [trip_id])
    conn.commit()
    conn.close()

def get_province_stats():
    """地图数据：每个省去过几次（按省分组计数）"""
    conn = get_conn()
    rows = conn.execute(
        "SELECT province, COUNT(*) AS trips FROM trips GROUP BY province"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
