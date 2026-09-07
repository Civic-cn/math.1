        "use client";

        import { useState } from "react";
        import Nav from "./Nav.jsx";
        import PageHeading from "./PageHeading.jsx";
        import AnimatedCardGrid from "./AnimatedCardGrid.jsx";

        export default function KeywordsView() {
        const [input, setInput] = useState("");
        const [result, setResult] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const handleExtract = async () => {
            if (!input.trim()) return;
            setLoading(true);
            setError(null);
            try {
            const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            const url = base + "/api/keywords";
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "提取失败");
            }
            const data = await res.json();
            setResult(data);
            } catch (e) {
            setError(e.message);
            } finally {
            setLoading(false);
            }
        };

        return (
            <>
            <Nav />
            <AnimatedCardGrid>
                <PageHeading
                title="关键词"
                subtitle="服务器小模型解决"
                />

                {/* 输入卡片 */}
                <div className="card">
                <h2>输入文本</h2>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={4}
                    placeholder="输入你想分析的文本..."
                    style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "18px",
                    border: "1px solid var(--border-soft)",
                    background: "var(--surface)",
                    color: "var(--text-main)",
                    fontSize: "14px",
                    resize: "vertical",
                    }}
                />
                <button
                    onClick={handleExtract}
                    disabled={loading || !input.trim()}
                    style={{
                    marginTop: "12px",
                    padding: "10px 24px",
                    background: "var(--brand)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "18px",
                    cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                    opacity: loading || !input.trim() ? 0.6 : 1,
                    }}
                >
                    {loading ? "提取中..." : "提取关键词"}
                </button>
                </div>

                {/* 输出卡片 */}
                <div className="card">
                <h2>提取结果</h2>
                {error && (
                    <p style={{ color: "#ff6b6b" }}>{error}</p>
                )}
                {result ? (
                    <>
                    <p style={{ color: "var(--text-soft)", marginBottom: "8px" }}>
                        原文：{result.text}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {result.keywords
    .split(/[,，、；\n]/)
    .map((kw) => kw.trim().replace(/\d+[\.、，、。]/g, "").replace(/[（）()【】\[\]]/g, ""))
    .filter(Boolean)
    .map((kw, i) => (
        <span
        key={i}
        style={{
            padding: "6px 14px",
            background: "var(--brand)",
            color: "#fff",
            borderRadius: "20px",
            fontSize: "14px",
        }}
        >
        {kw}
        </span>
    ))}

                    </div>
                    </>
                ) : (
                    <p style={{ color: "var(--text-soft)" }}>
                    输入文本后点击按钮提取关键词
                    </p>
                )}
                </div>
            </AnimatedCardGrid>
            </>
        );
        }
