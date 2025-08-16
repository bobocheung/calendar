# Render 部署指南

## 概述
本指南將幫助您將任務管理系統部署到Render，包括免費的PostgreSQL數據庫和Java後端應用。

## Render的優勢
- **免費PostgreSQL數據庫**：每月750小時免費額度
- **免費Java應用託管**：每月750小時免費額度
- **自動部署**：GitHub集成，自動構建和部署
- **SSL證書**：自動HTTPS支持
- **全球CDN**：快速訪問
- **簡單配置**：使用render.yaml文件配置

## 部署步驟

### 1. 準備GitHub倉庫
確保您的代碼已經推送到GitHub：
```bash
git add .
git commit -m "準備Render部署"
git push origin main
```

### 2. 註冊Render賬戶
1. 訪問 [Render.com](https://render.com)
2. 使用GitHub賬戶登錄
3. 創建新賬戶

### 3. 創建新服務
1. 在Render Dashboard中點擊 "New +"
2. 選擇 "Blueprint"（藍圖部署）
3. 連接您的GitHub賬戶
4. 選擇您的 `calendar` 倉庫

### 4. 配置部署
1. Render會自動檢測 `render.yaml` 文件
2. 確認服務配置：
   - **PostgreSQL數據庫**：`calendar-postgres`
   - **Java應用**：`calendar-task-system`
3. 點擊 "Apply" 開始部署

### 5. 等待部署完成
- Render會自動構建您的Java應用
- 創建PostgreSQL數據庫
- 配置環境變量
- 部署完成後會顯示訪問URL

## 配置詳解

### render.yaml 配置說明

#### PostgreSQL數據庫配置
```yaml
- type: pserv
  name: calendar-postgres
  env: postgresql
  plan: free
  region: oregon
```
- **type**: `pserv` 表示PostgreSQL服務
- **plan**: `free` 免費計劃
- **region**: 選擇離您最近的區域

#### Java應用配置
```yaml
- type: web
  name: calendar-task-system
  env: java
  plan: free
  buildCommand: mvn clean package -DskipTests
  startCommand: java -jar target/calendar-task-system-1.0.0.jar
```

#### 環境變量
- **SPRING_PROFILES_ACTIVE**: 生產環境配置
- **PORT**: 應用端口
- **DB_DRIVER**: PostgreSQL驅動
- **HIBERNATE_DIALECT**: PostgreSQL方言
- **JWT_SECRET**: 自動生成的JWT密鑰
- **ADMIN_PASSWORD**: 自動生成的管理員密碼

#### 數據庫連接
```yaml
database:
  name: calendar-postgres
  user: calendar_user
  database: calendar_db
```

## 部署後配置

### 1. 獲取數據庫連接信息
1. 在Render Dashboard中點擊PostgreSQL服務
2. 查看 "Connections" 標籤頁
3. 記錄連接字符串

### 2. 配置環境變量（如果需要）
在Java服務中檢查環境變量是否正確設置：
- `DATABASE_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

### 3. 測試應用
1. 訪問Java服務的URL
2. 測試任務創建功能
3. 測試用戶註冊和登錄

## 監控和維護

### 查看日誌
1. 在Render Dashboard中點擊Java服務
2. 查看 "Logs" 標籤頁
3. 實時監控應用運行狀態

### 重啟服務
1. 點擊Java服務
2. 點擊 "Manual Deploy" 按鈕

### 擴展資源
- 免費計劃：每月750小時
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
- Render文檔：https://render.com/docs
- 社區論壇：https://community.render.com
- GitHub Issues：在您的倉庫中創建issue

## 下一步

部署完成後，您可以：
1. 配置自定義域名
2. 設置SSL證書
3. 配置監控告警
4. 設置自動備份
5. 集成CI/CD流程

## 免費計劃限制

### PostgreSQL數據庫
- 每月750小時免費額度
- 數據庫大小限制
- 連接數限制

### Java應用
- 每月750小時免費額度
- 休眠策略（15分鐘無活動後休眠）
- 內存限制

---

**版本：** 1.0.0  
**作者：** Augment Agent  
**更新日期：** 2025-08-17
