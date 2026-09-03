import { useState } from "react";
import HomePage from "./components/HomePage.jsx";
import TextLabPage from "./components/TextLabPage.jsx";

export default function App() {
  // page 是个"状态"——它一变，下面的界面就跟着重新渲染。
  // 这一节先把它当"框架的规则"用、不展开；"状态到底替你管什么"，留到 4.4。
  const [page, setPage] = useState("home");

  return (
    <div className="app-shell">
      <div className="page-shell">
        <main className="page-content">
          {/* 两个页面来回切——靠的是组件，不再是两个独立的 html 文件 */}
          {page === "home"
            ? <HomePage current={page} onNavigate={setPage} />
            : <TextLabPage current={page} onNavigate={setPage} />}
        </main>
      </div>
    </div>
  );
}
//把两个大组件最终挂载到一个超大组件app

//！！！！！
//小组件result.jsx入口文件因为大组件textlabpage而废弃
//而大组件textlab.jsx入口文件和大组件home.jsx入口文件（没有写了，因为我们准备挂载到超大组件app上）
//而被废弃，最终我们只要一个超大组件app的入口文件
//！！！！！
