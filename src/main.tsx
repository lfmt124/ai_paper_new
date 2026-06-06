import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles.css";

// React 应用入口：把 App 挂载到 index.html 里的 #root。
// 后续如果接全局 Provider，例如路由、状态管理、主题配置，也从这里包裹 App。
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
