"use client";

// 旅行记录列表页：展示所有旅程 + 新增旅程表单
import { useState, useEffect } from "react";

export default function TripsView() {
  const [trips, setTrips] = useState([]);       // 旅程列表
  const [loading, setLoading] = useState(true); // 加载状态
  const [showForm, setShowForm] = useState(false); // 控制新增表单显示/隐藏

  // 新增表单的字段
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [visitDate, setVisitDate] = useState("");

  // ① 进页面就拉取所有旅程
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`)
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ② 提交新增旅程
  const handleSubmit = (e) => {
    e.preventDefault();  // 阻止表单默认刷新页面
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        province,
        city,
        visit_date: visitDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // 新增成功：把新记录插到列表最前面
        setTrips([data, ...trips]);
        // 清空表单
        setTitle("");
        setContent("");
        setProvince("");
        setCity("");
        setVisitDate("");
        setShowForm(false);
      });
  };

  // ③ 删除旅程
  const handleDelete = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTrips(trips.filter((t) => t.id !== id));  // 从列表里移除
    });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>旅行记录</h1>

      {/* 新增按钮 */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          display: "block",
          margin: "0 auto 20px",
          padding: "8px 24px",
          fontSize: "14px",
          background: "#5470c6",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {showForm ? "收起表单" : "+ 新增旅程"}
      </button>

      {/* 新增表单（点按钮才显示） */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <input
            placeholder="标题（如：云南米线之旅）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="正文内容（会自动算情感和关键词）"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              placeholder="省份（如：云南）"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              placeholder="城市（如：昆明）"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#37a2da",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            提交
          </button>
        </form>
      )}

      {/* 旅程列表 */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#888" }}>加载中...</p>
      ) : trips.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>还没有旅程记录，快添加第一条吧！</p>
      ) : (
        trips.map((trip) => (
          <div
            key={trip.id}
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "16px 20px",
              marginBottom: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "17px" }}>
                {trip.title}
                <span style={{ fontSize: "13px", color: "#888", marginLeft: "8px" }}>
                  {trip.province} · {trip.city}
                </span>
              </h3>
              <button
                onClick={() => handleDelete(trip.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#e74c3c",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                删除
              </button>
            </div>
            {trip.content && (
              <p style={{ color: "#555", margin: "8px 0", fontSize: "14px" }}>{trip.content}</p>
            )}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
              {trip.visit_date && (
                <span style={tagStyle}>📅 {trip.visit_date}</span>
              )}
              <span style={tagStyle}>
                🎭 {trip.sentiment_label}（{trip.sentiment_score}）
              </span>
              {trip.keywords && (
                <span style={tagStyle}>🔑 {trip.keywords}</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// 表单输入框的统一样式
const inputStyle = {
  padding: "8px 12px",
  border: "1px solid #d0d0d0",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
};

// 标签的统一样式
const tagStyle = {
  fontSize: "12px",
  padding: "3px 10px",
  background: "#f0f4ff",
  borderRadius: "12px",
  color: "#5470c6",
};
