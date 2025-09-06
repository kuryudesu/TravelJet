import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 你可以創建這個檔案來放一些全域 CSS 樣式
import App from './App';

// 找到 public/index.html 中的 <div id="root"></div>
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// 將 App 組件渲染到 root 元素中
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
