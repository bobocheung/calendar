# Render Docker 部署指南

## 🚀 Render Docker 部署步驟

### 1. 準備工作
- 確保代碼已推送到 GitHub
- 註冊 Render 帳號 (https://render.com)

### 2. 創建 Render 項目

#### 方法一：使用 Blueprint（推薦）
1. 登入 Render
2. 點擊 "New +" → "Blueprint"
3. 連接 GitHub 倉庫
4. 選擇 `render.yaml` 文件
5. Render 會自動創建 PostgreSQL 和 Docker Web 服務

#### 方法二：手動創建
1. 點擊 "New +" → "Web Service"
2. 連接 GitHub 倉庫
3. 選擇 "Docker" 作為運行環境
4. Render 會自動檢測 Dockerfile

### 3. Docker 配置詳情

#### Dockerfile 特點：
- **多階段構建** - 減少最終鏡像大小
- **Maven 構建** - 在容器內構建應用
- **OpenJDK 17** - 運行時環境
- **健康檢查** - `/ping` 端點

#### 環境變量：
- `DATABASE_URL` - PostgreSQL 連接字符串（自動設置）
- `DB_USERNAME` - 數據庫用戶名（自動設置）
- `DB_PASSWORD` - 數據庫密碼（自動設置）
- `JWT_SECRET` - 自動生成的 JWT 密鑰
- `ADMIN_PASSWORD` - 自動生成的管理員密碼

### 4. 本地測試

#### 使用 Docker Compose：
```bash
# 構建並啟動所有服務
docker-compose up --build

# 訪問應用
curl http://localhost:8080/ping
```

#### 單獨測試 Docker 鏡像：
```bash
# 構建鏡像
docker build -t calendar-task-system .

# 運行容器
docker run -p 8080:8080 calendar-task-system
```

### 5. 部署完成

部署完成後，你會看到：
- ✅ PostgreSQL 數據庫運行中
- ✅ Docker Web 服務運行中
- 🌐 應用 URL（例如：`https://your-app-name.onrender.com`）

### 6. 訪問應用

1. 點擊 Web 服務的 URL
2. 會自動跳轉到登入頁面
3. 註冊新用戶或使用管理員帳戶

## 🔧 故障排除

### Docker 構建失敗
- 檢查 Dockerfile 語法
- 確保 Maven 依賴能正常下載
- 檢查 Java 版本（需要 Java 17）

### 啟動失敗
- 檢查應用日誌
- 確保環境變量正確設置
- 檢查數據庫連接

### 健康檢查失敗
- 確保 `/ping` 端點正常響應
- 檢查端口配置
- 查看容器日誌

## 📝 注意事項

1. **免費限制**：Render 免費版有使用限制
2. **自動部署**：每次推送到 GitHub 都會觸發自動部署
3. **數據庫備份**：定期備份重要數據
4. **環境變量**：敏感信息使用環境變量

## 🎯 成功部署後

- 應用將在 `https://your-app-name.onrender.com` 運行
- 可以註冊新用戶並開始使用
- 所有功能都應該正常工作
- 支持多用戶系統

## 🔗 有用的鏈接

- [Render 文檔](https://render.com/docs)
- [Docker 部署](https://render.com/docs/deploy-docker)
- [PostgreSQL 配置](https://render.com/docs/databases)
- [環境變量](https://render.com/docs/environment-variables)
