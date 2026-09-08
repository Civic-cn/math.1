"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);



  const topItems = [
    { name: "首页", path: "/" },
    { name: "旅行日志", path: "/trips" },   // ← 加这行
  ];

  const dropdownItems = [
    { name: "文字实验室", path: "/text-lab" },
    { name: "关键词提取", path: "/keywords" },
  ];


  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="nav">
      <div className="nav-brand">学不来Math.</div>
      <ul className="nav-menu">
        {topItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={isActive(item.path) ? "nav-link active" : "nav-link"}
            >
              {item.name}
            </Link>
          </li>
        ))}

        {/* 文字下拉菜单 */}
        <li className="nav-dropdown">
          <span
            className={`nav-link nav-dropdown-toggle ${
              isActive("/text-lab") || isActive("/keywords") ? "active" : ""
            }`}
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: "pointer" }}
          >
            文字 ▾
          </span>
          {showDropdown && (
            <ul className="nav-dropdown-menu">
              {dropdownItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`nav-dropdown-link ${
                      isActive(item.path) ? "active" : ""
                    }`}
                    onClick={() => setShowDropdown(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
