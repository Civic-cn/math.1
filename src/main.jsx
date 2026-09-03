import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// 4.1 那 8 个 CSS 原样搬过来——React 不管 CSS 内部细节。
// 顺序和 4.1 的 html <link> 一致。
import "./css/reset.css";
import "./css/variables.css";
import "./css/layout.css";
import "./css/hero.css";
import "./css/nav.css";
import "./css/cards.css";
import "./css/lab.css";
import "./css/responsive.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

//main.jsx文件是app的入口文件
//不能直接把app直接挂在html上，那里面没有css样式等不说，
// 且不标准，不规范，我只能这么理解了
