# Railway 部署指南

## 概述
本指南將幫助您將任務管理系統部署到Railway，包括免費的PostgreSQL數據庫和Java後端應用。

## 優勢
- **免費PostgreSQL數據庫**：每月500MB免費額度
- **Java應用部署**：支持Spring Boot應用
- **自動部署**：GitHub集成，自動構建和部署
- **SSL證書**：自動HTTPS支持
- **全球CDN**：快速訪問

## 部署步驟

### 1. 準備GitHub倉庫
確保您的代碼已經推送到GitHub：
```bash
git add .
git commit -m "準備Railway部署"
git push origin main
```

### 2. 註冊Railway賬戶
1. 訪問 [Railway.app](https://railway.app)
2. 使用GitHub賬戶登錄
3. 創建新項目

### 3. 創建PostgreSQL數據庫
1. 在Railway項目中點擊 "New Service"
2. 選擇 "Database" → "PostgreSQL"
3. 等待數據庫創建完成
4. 記錄數據庫連接信息

### 4. 部署Java應用
1. 在Railway項目中點擊 "New Service"
2. 選擇 "GitHub Repo"
3. 選擇您的 `calendar` 倉庫
4. 選擇 `main` 分支
5. 點擊 "Deploy Now"

### 5. 配置環境變量
在Java服務中設置以下環境變量：

#### 數據庫配置
```
SPRING_PROFILES_ACTIVE=production
DATABASE_URL=postgresql://username:password@host:port/database
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

#### 安全配置
```
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password
```

#### 服務器配置
```
PORT=8080
```

### 6. 獲取PostgreSQL連接信息
1. 點擊PostgreSQL服務
2. 在 "Connect" 標籤頁找到連接字符串
3. 複製連接信息到Java服務的環境變量

### 7. 等待部署完成
- Railway會自動構建您的Java應用
- 構建完成後會自動部署
- 檢查部署日誌確保沒有錯誤

### 8. 測試應用
1. 點擊Java服務的域名
2. 測試任務創建功能
3. 測試用戶註冊和登錄

## 數據庫遷移

### 自動遷移
應用啟動時會自動創建表結構（`ddl-auto: update`）

### 手動遷移（可選）
如果需要手動執行SQL：
```sql
-- 創建用戶表
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 創建任務表
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    category VARCHAR(100),
    color VARCHAR(7),
    all_day BOOLEAN DEFAULT FALSE,
    repeat_type VARCHAR(20),
    repeat_interval INTEGER DEFAULT 1,
    repeat_end_date TIMESTAMP,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 監控和維護

### 查看日誌
1. 點擊Java服務
2. 查看 "Deployments" 標籤頁
3. 點擊最新部署查看日誌

### 重啟服務
1. 點擊Java服務
2. 點擊 "Redeploy" 按鈕

### 擴展資源
- 免費計劃：每月$5信用額度
- 付費計劃：按使用量計費

## 故障排除

### 常見問題

#### 1. 構建失敗
- 檢查Java版本（需要Java 17+）
- 檢查Maven依賴
- 查看構建日誌

#### 2. 數據庫連接失敗
- 檢查環境變量
- 確認PostgreSQL服務狀態
- 檢查防火牆設置

#### 3. 應用啟動失敗
- 檢查端口配置
- 查看啟動日誌
- 確認環境變量設置

### 獲取幫助
- Railway文檔：https://docs.railway.app
- 社區論壇：https://community.railway.app
- GitHub Issues：在您的倉庫中創建issue

## 下一步

部署完成後，您可以：
1. 配置自定義域名
2. 設置SSL證書
3. 配置監控告警
4. 設置自動備份
5. 集成CI/CD流程

---

**版本：** 1.0.0  
**作者：** Augment Agent  
**更新日期：** 2025-08-17
