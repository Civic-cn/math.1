    "use client";

    // 旅行地图：ECharts 中国地图 + 左侧功能栏 + 点击省份弹记录
    import { useEffect, useRef, useState } from "react";
    import * as echarts from "echarts";
    import chinaJson from "../public/data/china.json";

    export default function MapView() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);  // 左侧栏开关
    const [selectedProvince, setSelectedProvince] = useState(null);  // 点中的省份
    const [provinceTrips, setProvinceTrips] = useState([]);  // 该省的旅行记录
    const [tripsLoading, setTripsLoading] = useState(false);
    const [showTripsPanel, setShowTripsPanel] = useState(false);  // 旅行日志面板开关
    const [allTrips, setAllTrips] = useState([]);  // 所有旅行记录
    const [tripsLoading2, setTripsLoading2] = useState(false);

  // 新增表单字段
    const [tripTitle, setTripTitle] = useState("");
    const [tripContent, setTripContent] = useState("");
    const [tripProvince, setTripProvince] = useState("");
    const [tripCity, setTripCity] = useState("");
    const [tripDate, setTripDate] = useState("");
    const [showTripForm, setShowTripForm] = useState(false);


    // ① 拉取省份统计
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/provinces/stats`)
        .then((res) => res.json())
        .then((data) => {
            setStats(data);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    // ② 点击省份后，拉取该省的旅行记录
    const fetchProvinceTrips = (provinceName) => {
        setTripsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips?province=${encodeURIComponent(provinceName)}`)
        .then((res) => res.json())
        .then((data) => {
            setProvinceTrips(data);
            setTripsLoading(false);
        })
        .catch(() => setTripsLoading(false));
    };

    // 拉取所有旅行记录
    const fetchAllTrips = () => {
        setTripsLoading2(true);
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`)
        .then((res) => res.json())
        .then((data) => {
            setAllTrips(data);
            setTripsLoading2(false);
        })
        .catch(() => setTripsLoading2(false));
    };

    // 提交新增旅程
    const handleTripSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: tripTitle,
            content: tripContent,
            province: tripProvince,
            city: tripCity,
            visit_date: tripDate,
        }),
        })
        .then((res) => res.json())
        .then((data) => {
            setAllTrips([data, ...allTrips]);
            setTripTitle("");
            setTripContent("");
            setTripProvince("");
            setTripCity("");
            setTripDate("");
            setShowTripForm(false);
        });
    };


    // ③ 画地图
    useEffect(() => {
        if (!chartRef.current ) return;

        echarts.registerMap("china", chinaJson);

                const chartData = stats.map((item) => {
          // 去掉用户可能多写的后缀，再统一补"省"
        let name = item.province
            .replace(/省$/, "")
            .replace(/市$/, "")
            .replace(/自治区$/, "");
        name = name + "省";  // china.json 里都是"XX省"
        return { name, value: item.trips };
        });


        if (chartInstance.current) chartInstance.current.dispose();
        chartInstance.current = echarts.init(chartRef.current);

        chartInstance.current.setOption({
        tooltip: {
            trigger: "item",
            formatter: (p) => {
            if (p.value) return `${p.name}：${p.value} 次旅行`;
            return `${p.name}：还没去过`;
            },
        },
        title: {
            text: "旅行足迹",
            left: "center",
            textStyle: { fontSize: 20, color: "#333" },
        },
        series: [
            {
            type: "map",
            map: "china",
            roam: true,
            zoom: 1.6,             // 默认放大 1.2 倍
            center: [104, 36],     // 默认中心点偏中国中部
            label: { show: false },
            emphasis: {
                label: { show: true, color: "#333" },
                itemStyle: { areaColor: "#ffd700" },
            },
            data: chartData,
            },
        ],
        visualMap: {
            min: 0,
            max: 5,
            left: 30,
            bottom: 30,
            calculable: true,
            inRange: {
            color: ["#e0e0e0", "#5470c6", "#37a2da"],
            },
            text: ["多", "少"],
        },
        });

        // ④ 点击省份：弹出该省旅行记录
        chartInstance.current.on("click", (params) => {
        setSelectedProvince(params.name);
        fetchProvinceTrips(params.name);
        });

        const handleResize = () => chartInstance.current?.resize();
        window.addEventListener("resize", handleResize);
        return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.current?.dispose();
        };
    }, [stats]);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative", background: "#fff" }}>

        {/* 左侧半透明功能栏 */}
        <div
            style={{
            position: "absolute",
            left: sidebarOpen ? "0" : "-180px",
            top: "0",
            width: "180px",
            height: "100%",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            borderRight: "1px solid rgba(0,0,0,0.08)",
            padding: "20px 16px",
            zIndex: 100,
            transition: "left 0.3s ease",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            }}
        >
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>
            功能模块
            </div>
                <div
                style={{
                ...menuItemStyle,
                background: showTripsPanel ? "rgba(84,112,198,0.1)" : "transparent",
            }}
            onClick={() => {
            if (!showTripsPanel) {
                fetchAllTrips();
            }
            setShowTripsPanel(!showTripsPanel);
            }}
        >
        📍 旅行日志
        </div>

            <div style={menuItemStyle}>📷 相册</div>
            <div style={{ marginTop: "auto", fontSize: "12px", color: "#aaa" }}>
            v0.1
            </div>
        </div>

        {/* 左侧栏收起/展开按钮 */}
        <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
            position: "absolute",
            left: sidebarOpen ? "180px" : "0",
            top: "50%",
            transform: "translateY(-50%)",
            width: "24px",
            height: "48px",
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderLeft: "none",
            borderRadius: "0 6px 6px 0",
            cursor: "pointer",
            fontSize: "12px",
            color: "#666",
            zIndex: 101,
            transition: "left 0.3s ease",
            }}
        >
            {sidebarOpen ? "◀" : "▶"}
        </button>

        {/* 地图主体 */}
        {loading && <p style={{ textAlign: "center", color: "#888" }}>加载中...</p>}
        <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>

        {/* 旅行日志面板（点左侧栏旅行日志弹出） */}
        {showTripsPanel && (
            <div
            style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                width: "360px",
                maxHeight: "75%",
                overflowY: "auto",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                padding: "20px",
                zIndex: 100,
            }}
            >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "17px" }}>旅行日志</h3>
                <button
                onClick={() => setShowTripsPanel(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#999" }}
                >
                ✕
                </button>
            </div>

            {/* 新增按钮 */}
            <button
                onClick={() => setShowTripForm(!showTripForm)}
                style={{
                width: "100%",
                padding: "8px",
                marginBottom: "12px",
                background: "#5470c6",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                }}
            >
                {showTripForm ? "收起表单" : "+ 新增旅程"}
            </button>

            {/* 新增表单 */}
            {showTripForm && (
                <form
                onSubmit={handleTripSubmit}
                style={{
                    background: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
                >
                <input
                    placeholder="标题（如：云南米线之旅）"
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    required
                    style={inputStyle}
                />
                <textarea
                    placeholder="正文（自动算情感和关键词）"
                    value={tripContent}
                    onChange={(e) => setTripContent(e.target.value)}
                    rows={3}
                    style={inputStyle}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                    placeholder="省份"
                    value={tripProvince}
                    onChange={(e) => setTripProvince(e.target.value)}
                    required
                    style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                    placeholder="城市"
                    value={tripCity}
                    onChange={(e) => setTripCity(e.target.value)}
                    required
                    style={{ ...inputStyle, flex: 1 }}
                    />
                </div>
                <input
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    style={inputStyle}
                />
                <button
                    type="submit"
                    style={{
                    padding: "8px",
                    background: "#37a2da",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    }}
                >
                    提交
                </button>
                </form>
            )}

            {/* 记录列表 */}
            {tripsLoading2 ? (
                <p style={{ color: "#888", textAlign: "center" }}>加载中...</p>
            ) : allTrips.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center" }}>还没有记录</p>
            ) : (
                allTrips.map((trip) => (
                <div
                    key={trip.id}
                    style={{
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: "10px",
                    marginBottom: "10px",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: "0", fontSize: "15px" }}>
                        {trip.title}
                        <span style={{ fontSize: "12px", color: "#888", marginLeft: "6px" }}>
                        {trip.province} · {trip.city}
                        </span>
                    </h4>
                    <button
                        onClick={() => {
                        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips/${trip.id}`, {
                            method: "DELETE",
                        }).then(() => {
                            setAllTrips(allTrips.filter((t) => t.id !== trip.id));
                        });
                        }}
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
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#555" }}>{trip.content}</p>
                    )}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
                    {trip.visit_date && <span style={tagStyle}>📅 {trip.visit_date}</span>}
                    <span style={tagStyle}>🎭 {trip.sentiment_label}（{trip.sentiment_score}）</span>
                    {trip.keywords && <span style={tagStyle}>🔑 {trip.keywords}</span>}
                    </div>
                </div>
                ))
            )}
            </div>
        )}

    
        {/* 点击省份后弹出的记录面板 */}
        {selectedProvince && (
            <div
            style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                width: "320px",
                maxHeight: "70%",
                overflowY: "auto",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                padding: "20px",
                zIndex: 100,
            }}
            >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "17px" }}>
                {selectedProvince} 的旅行记录
                </h3>
                <button
                onClick={() => setSelectedProvince(null)}
                style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: "#999",
                }}
                >
                ✕
                </button>
            </div>

            {tripsLoading ? (
                <p style={{ color: "#888", textAlign: "center" }}>加载中...</p>
            ) : provinceTrips.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center" }}>该省份还没有旅行记录</p>
            ) : (
                provinceTrips.map((trip) => (
                <div
                    key={trip.id}
                    style={{
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: "12px",
                    marginBottom: "12px",
                    }}
                >
                    <h4 style={{ margin: "0 0 4px", fontSize: "15px" }}>
                    {trip.title}
                    <span style={{ fontSize: "12px", color: "#888", marginLeft: "6px" }}>
                        {trip.city}
                    </span>
                    </h4>
                    {trip.content && (
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#555" }}>
                        {trip.content}
                    </p>
                    )}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
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
        )}
        </div>
    );
    }

    const menuItemStyle = {
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
    transition: "background 0.2s",
    };

    const tagStyle = {
    fontSize: "12px",
    padding: "2px 8px",
    background: "#f0f4ff",
    borderRadius: "10px",
    color: "#5470c6",
    };
    
    const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #d0d0d0",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    };


