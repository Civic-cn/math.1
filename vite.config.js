import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
plugins: [react()],
});
//首先是下载插件 npm install -D @vitejs/plugin-react

//然后这个脚本作用是让react插件挂在vite上，
// vite才能看懂react的代码

//标志我们使用了前端框架