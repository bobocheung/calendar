# 🚀 手繪風格任務管理系統 - 部署指南

## 🌐 0成本部署方案

### 方案1：Vercel (推薦)
**優點：**
- 完全免費
- 支援Java應用
- 自動部署
- 全球CDN
- 自定義域名支援

**部署步驟：**
1. 註冊 [Vercel](https://vercel.com) 帳號
2. 連接GitHub倉庫
3. 配置環境變量
4. 自動部署

### 方案2：Netlify
**優點：**
- 免費層級很慷慨
- 支援靜態網站
- 自動部署
- 表單處理

**限制：**
- 不支援Java後端
- 需要分離前後端

### 方案3：Railway
**優點：**
- 免費層級支援小型應用
- 支援Java Spring Boot
- 自動部署
- 簡單配置

**限制：**
- 免費層級有使用限制

### 方案4：Heroku
**優點：**
- 支援Java應用
- 簡單部署
- 穩定可靠

**限制：**
- 免費層級已取消
- 價格相對較高

## 🔧 部署準備

### 1. 環境要求
- Java 17+
- Maven 3.6+
- Git

### 2. 數據庫選擇
**免費選項：**
- **H2 (內嵌)** - 適合開發和測試
- **PostgreSQL** - 免費層級，適合生產
- **MySQL** - 免費層級，適合生產

**推薦：**
- 開發/測試：H2
- 生產環境：PostgreSQL (Railway免費層級)

### 3. 安全配置
- 生成強密碼
- 配置JWT密鑰
- 設置CORS策略

## 🚀 Vercel部署詳細步驟

### 步驟1：準備項目
```bash
# 構建項目
mvn clean package

# 確保生成JAR文件
ls target/*.jar
```

### 步驟2：配置Vercel
1. 創建 `vercel.json` 配置文件
2. 設置環境變量
3. 配置構建命令

### 步驟3：連接GitHub
1. 推送代碼到GitHub
2. 在Vercel中導入項目
3. 配置自動部署

### 步驟4：設置環境變量
```bash
# 在Vercel控制台中設置
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
```

## 🗄️ 數據庫部署

### PostgreSQL (推薦)
**Railway免費部署：**
1. 註冊 [Railway](https://railway.app)
2. 創建PostgreSQL數據庫
3. 獲取連接字符串
4. 配置環境變量

**連接字符串格式：**
```
postgresql://username:password@host:port/database
```

### 數據庫遷移
```sql
-- 創建用戶表
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar VARCHAR(500),
    role VARCHAR(20) DEFAULT 'USER',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    timezone VARCHAR(20) DEFAULT 'Asia/Taipei',
    language VARCHAR(10) DEFAULT 'zh-TW',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 更新任務表，添加用戶關聯
ALTER TABLE tasks ADD COLUMN user_id BIGINT NOT NULL;
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id);
```

## 🔐 安全配置

### JWT配置
```yaml
app:
  jwt:
    secret: ${JWT_SECRET:your-very-long-and-secure-secret-key}
    expiration: 86400000 # 24小時
```

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

### 密碼加密
```java
// 生產環境必須使用密碼加密
@Autowired
private PasswordEncoder passwordEncoder;

// 註冊時加密密碼
user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));

// 登入時驗證密碼
if (passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
    // 登入成功
}
```

## 📱 多用戶系統功能

### 用戶管理
- ✅ 用戶註冊
- ✅ 用戶登入
- ✅ 用戶資料更新
- ✅ 用戶狀態管理

### 任務隔離
- ✅ 每個用戶只能看到自己的任務
- ✅ 任務創建時自動關聯用戶
- ✅ 用戶刪除時軟刪除任務

### 權限控制
- ✅ 普通用戶：管理自己的任務
- ✅ 管理員：管理所有用戶和任務
- ✅ 調節員：協助管理用戶

## 🌍 域名和SSL

### 自定義域名
1. 在Vercel中配置自定義域名
2. 更新DNS記錄
3. 自動SSL證書

### 免費域名選項
- `.tk` - Freenom免費域名
- `.ml` - Freenom免費域名
- `.ga` - Freenom免費域名

## 📊 監控和分析

### 免費監控工具
- **UptimeRobot** - 網站可用性監控
- **Google Analytics** - 用戶行為分析
- **Vercel Analytics** - 性能監控

### 日誌管理
```yaml
logging:
  level:
    com.taskmanager: INFO
    org.springframework.security: DEBUG
  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 30
```

## 🚨 故障排除

### 常見問題
1. **構建失敗**
   - 檢查Java版本
   - 檢查Maven配置
   - 檢查依賴版本

2. **數據庫連接失敗**
   - 檢查連接字符串
   - 檢查防火牆設置
   - 檢查數據庫狀態

3. **CORS錯誤**
   - 檢查CORS配置
   - 檢查域名設置
   - 檢查請求頭

### 調試技巧
```bash
# 查看應用日誌
tail -f logs/application.log

# 檢查數據庫連接
java -cp target/calendar-task-system-1.0.0.jar org.h2.tools.Server

# 測試API端點
curl -X GET https://yourdomain.vercel.app/api/users/stats
```

## 📈 擴展建議

### 性能優化
- 添加Redis緩存
- 實現數據庫連接池
- 添加CDN加速

### 功能擴展
- 實現郵箱驗證
- 添加社交登入
- 實現任務分享
- 添加團隊協作

### 商業化
- 實現免費/付費功能
- 添加API使用限制
- 實現多租戶架構

---

**部署狀態：** 🚧 進行中  
**最後更新：** 2025-08-17  
**版本：** 1.0.0  
**作者：** Augment Agent
