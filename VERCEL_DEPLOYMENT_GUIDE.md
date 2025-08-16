# 🌐 Vercel部署詳細指南

## 📋 部署前準備

### 1. 註冊帳號
- 訪問 [Vercel](https://vercel.com)
- 使用GitHub帳號登入
- 完成帳號驗證

### 2. 準備GitHub倉庫
- 確保代碼已推送到GitHub
- 倉庫地址：`https://github.com/bobocheung/calendar.git`
- 確保倉庫是公開的

## 🚀 部署步驟

### 步驟1：創建新項目
1. 在Vercel控制台點擊 "New Project"
2. 選擇 "Import Git Repository"
3. 找到並選擇 `bobocheung/calendar` 倉庫
4. 點擊 "Import"

### 步驟2：配置項目設置
```
Project Name: calendar-task-system
Framework Preset: Other
Root Directory: ./
Build Command: mvn clean package -DskipTests
Output Directory: target
Install Command: (留空)
```

### 步驟3：配置環境變量
在 "Environment Variables" 部分添加：

```bash
# 基本配置
SPRING_PROFILES_ACTIVE=production
PORT=8080

# 數據庫配置
DATABASE_URL=your_database_url
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# 安全配置
JWT_SECRET=your-very-long-and-secure-secret-key

# 應用配置
APP_NAME=手繪風格任務管理系統
APP_VERSION=1.0.0
```

### 步驟4：部署配置
1. 點擊 "Deploy" 按鈕
2. 等待構建完成
3. 檢查部署日誌

## 🔧 部署配置詳解

### 使用簡化配置（推薦）
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main/resources/static/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-url.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/src/main/resources/static/$1"
    }
  ]
}
```

### 使用完整配置
```json
{
  "version": 2,
  "builds": [
    {
      "src": "pom.xml",
      "use": "@vercel/java"
    }
  ],
  "functions": {
    "api/**/*.java": {
      "runtime": "java17"
    }
  }
}
```

## 🗄️ 數據庫配置

### 方案1：Railway PostgreSQL（推薦）
1. 訪問 [Railway](https://railway.app)
2. 創建PostgreSQL數據庫
3. 獲取連接字符串
4. 配置環境變量

### 方案2：H2內嵌數據庫
- 適合開發和測試
- 不需要外部數據庫
- 數據會定期重置

### 方案3：其他雲數據庫
- **Supabase** - 免費層級
- **PlanetScale** - 免費層級
- **Neon** - 免費層級

## 🌍 域名配置

### 自動域名
- 部署完成後會獲得 `.vercel.app` 域名
- 格式：`calendar-task-system-xxx.vercel.app`

### 自定義域名
1. 在項目設置中點擊 "Domains"
2. 添加你的域名
3. 更新DNS記錄
4. 等待SSL證書生效

### 免費域名選項
- `.tk` - Freenom
- `.ml` - Freenom
- `.ga` - Freenom

## 📱 多用戶系統配置

### 用戶註冊
```bash
POST /api/users/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "displayName": "測試用戶"
}
```

### 用戶登入
```bash
POST /api/users/login
{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

### 任務創建
```bash
POST /api/tasks
{
  "title": "測試任務",
  "startTime": "2025-08-17 10:00:00",
  "userId": 1
}
```

## 🔐 安全配置

### JWT密鑰生成
```bash
# 生成強密鑰
openssl rand -base64 64

# 或使用在線工具
# https://generate-secret.vercel.app/64
```

### 環境變量管理
- 不要在代碼中硬編碼敏感信息
- 使用Vercel的環境變量功能
- 定期輪換密鑰

### CORS配置
```yaml
app:
  cors:
    allowed-origins: 
      - "https://yourdomain.com"
      - "https://www.yourdomain.com"
    allowed-methods: "GET,POST,PUT,DELETE,OPTIONS"
    allowed-headers: "*"
```

## 📊 監控和分析

### Vercel Analytics
- 自動啟用
- 查看訪問統計
- 性能監控

### 自定義監控
- **UptimeRobot** - 可用性監控
- **Google Analytics** - 用戶行為分析
- **Sentry** - 錯誤追蹤

## 🚨 故障排除

### 常見問題

#### 1. 構建失敗
```bash
# 檢查Java版本
java -version

# 檢查Maven版本
mvn -version

# 清理並重新構建
mvn clean package
```

#### 2. 數據庫連接失敗
- 檢查數據庫URL格式
- 確認防火牆設置
- 檢查數據庫狀態

#### 3. CORS錯誤
- 檢查CORS配置
- 確認域名設置
- 檢查請求頭

### 調試技巧
```bash
# 查看構建日誌
# 在Vercel控制台中查看

# 本地測試
mvn spring-boot:run

# 檢查API端點
curl -X GET https://yourdomain.vercel.app/api/health
```

## 📈 性能優化

### 前端優化
- 啟用Gzip壓縮
- 使用CDN加速
- 圖片優化

### 後端優化
- 數據庫連接池
- 緩存策略
- 異步處理

## 🔄 自動部署

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 自動化流程
1. 推送代碼到GitHub
2. 自動觸發構建
3. 自動部署到Vercel
4. 自動更新域名

## 🎯 最佳實踐

### 開發流程
1. 本地開發和測試
2. 推送到GitHub
3. 自動部署到Vercel
4. 生產環境測試

### 版本管理
- 使用語義化版本號
- 維護CHANGELOG
- 標籤重要版本

### 備份策略
- 定期備份數據庫
- 版本控制所有配置
- 文檔同步更新

---

**部署狀態：** 🚧 準備中  
**最後更新：** 2025-08-17  
**版本：** 1.0.0  
**作者：** Augment Agent
