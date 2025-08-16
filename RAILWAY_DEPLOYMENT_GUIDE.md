# Railway 部署指南

## 🚀 Railway 免費部署步驟

### 1. 準備工作
- 確保代碼已推送到 GitHub
- 註冊 Railway 帳號 (https://railway.app)

### 2. 創建 Railway 項目

#### 方法一：從 GitHub 導入
1. 登入 Railway
2. 點擊 "New Project"
3. 選擇 "Deploy from GitHub repo"
4. 選擇你的 GitHub 倉庫
5. Railway 會自動檢測並配置

#### 方法二：手動創建
1. 點擊 "New Project"
2. 選擇 "Empty Project"
3. 添加 GitHub 倉庫

### 3. 配置環境變量

在 Railway 項目設置中添加以下環境變量：

```bash
# 數據庫配置
SPRING_PROFILES_ACTIVE=production
DB_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# JWT 配置
JWT_SECRET=your-secret-key-here

# 管理員配置
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password

# 端口配置
PORT=8080
```

### 4. 添加 PostgreSQL 數據庫

1. 在項目中點擊 "New"
2. 選擇 "Database" → "PostgreSQL"
3. Railway 會自動提供數據庫連接信息
4. 複製數據庫 URL 並設置為環境變量：
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

### 5. 部署應用

1. Railway 會自動檢測 `pom.xml` 並使用 Maven 構建
2. 構建完成後會自動部署
3. 查看部署日誌確保沒有錯誤

### 6. 獲取應用 URL

1. 部署完成後，Railway 會提供一個域名
2. 例如：`https://your-app-name.railway.app`
3. 點擊域名即可訪問應用

## 🔧 故障排除

### 構建失敗
- 檢查 `pom.xml` 是否正確
- 查看構建日誌中的錯誤信息
- 確保所有依賴都能正常下載

### 數據庫連接失敗
- 檢查 `DATABASE_URL` 環境變量
- 確保 PostgreSQL 服務已啟動
- 檢查數據庫用戶權限

### 應用啟動失敗
- 檢查 `startCommand` 是否正確
- 查看應用日誌
- 確保端口配置正確

## 📝 注意事項

1. **免費限制**：Railway 免費版有使用限制
2. **自動部署**：每次推送到 GitHub 都會觸發自動部署
3. **環境變量**：敏感信息請使用環境變量，不要寫在代碼中
4. **數據庫備份**：定期備份重要數據

## 🎯 成功部署後

- 應用將在 `https://your-app-name.railway.app` 運行
- 可以註冊新用戶並開始使用
- 所有功能都應該正常工作
