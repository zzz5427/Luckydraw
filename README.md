# 抽籤與分組小幫手 (Lucky Draw & Grouping App)

這個專案是一個基於 React + Vite + Gemini AI 的抽籤與分組工具。

## 🌟 功能特色
- **人員管理**：支援手動輸入或匯入名單。
- **幸運抽獎**：公平隨機的抽獎動畫。
- **AI 智慧分組**：自動分組並透過 Gemini AI 產生有趣的隊名。
- **響應式設計**：支援手機與桌面版使用。

## 🚀 快速開始

### 前置需求
- Node.js (建議 v18 以上)
- Google AI Studio API Key (用於 AI 命名功能)

### 1. 安裝套件
```bash
npm install
```

### 2. 設定環境變數
請複製 `.env` 範例檔並填入您的 API Key：
1. 建立 `.env` 檔案。
2. 加入以下內容：
   ```env
   GEMINI_API_KEY=您的_API_KEY
   ```

### 3. 啟動開發伺服器
```bash
npm run dev
```
啟動後請訪問：`http://localhost:3000`

## 📦 部署 (GitHub Pages)

本專案已設定 GitHub Actions，只需將程式碼推送到 GitHub 的 `main` 分支即可自動部署。

### 設定步驟
1. 將專案上傳至 GitHub。
2. 前往 Repository 的 **Settings** > **Pages**。
3. 在 **Build and deployment** 區塊，將 Source 改為 **GitHub Actions**。
4. 設定 **Secrets** (若需要)：
   - 前往 **Settings** > **Secrets and variables** > **Actions**。
   - 新增 `GEMINI_API_KEY` (若您希望在部署環境中使用)。
   > 注意：由於這是前端專案，API Key 會暴露在瀏覽器端，建議設定適當的 API 限制或使用 Proxy。

## 🛠️ 開發指令
- `npm run dev`：啟動開發伺服器
- `npm run build`：建置生產版本
- `npm run preview`：預覽建置結果
