# 手繪風格任務管理系統

一個具有手繪風格UI的任務與時間管理系統，包含日曆記事功能。

## 功能特色

### 🎨 手繪風格UI設計
- **不規則線條**: 模仿手繪的自然線條，避免完美的幾何形狀
- **有機形狀**: 按鈕、卡片等元素採用不規則的手繪風格邊框
- **紙張紋理**: 背景模擬真實紙張的質感和紋理
- **手寫字體**: 使用Kalam和Caveat字體營造手寫感
- **柔和色彩**: 採用溫暖、柔和的色彩搭配
- **輕微傾斜**: 元素帶有隨機的輕微旋轉，增加手工感

### 📅 日曆功能
- **月檢視**: 清晰的月度日曆展示
- **任務預覽**: 日曆單元格中顯示任務概覽
- **日期選擇**: 點擊日期查看詳細任務
- **今日高亮**: 特殊標記當前日期
- **任務指示器**: 用顏色和圖標標識有任務的日期

### ✅ 任務管理
- **任務CRUD**: 創建、讀取、更新、刪除任務
- **優先級管理**: 低、中、高、緊急四個級別
- **狀態跟蹤**: 待處理、進行中、已完成、已取消
- **分類管理**: 工作、個人、學習、健康等分類
- **時間管理**: 支援開始時間、結束時間、全天任務
- **顏色標記**: 自訂任務顏色便於識別

### 🔍 智慧篩選
- **狀態篩選**: 按任務狀態過濾
- **優先級篩選**: 按優先級過濾
- **分類篩選**: 按分類過濾
- **時間範圍**: 今日任務、本週任務、本月任務
- **搜尋功能**: 按標題搜尋任務

### 📊 資料統計
- **任務統計**: 總任務數、已完成、待完成
- **過期提醒**: 自動識別過期任務
- **即將到期**: 顯示24小時內到期的任務

## 技术栈

### 后端
- **Java 17**: 现代Java版本
- **Spring Boot 3.2.0**: 企业级框架
- **Spring Data JPA**: 数据持久化
- **H2 Database**: 内存数据库（开发环境）
- **Maven**: 项目管理工具

### 前端
- **HTML5**: 语义化标记
- **CSS3**: 手绘风格样式
- **Vanilla JavaScript**: 原生JS，无框架依赖
- **Font Awesome**: 图标库
- **Google Fonts**: 手写风格字体

## 快速开始

### 环境要求
- Java 17 或更高版本
- Maven 3.6 或更高版本

### 运行步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd calendar-task-system
   ```

2. **编译项目**
   ```bash
   mvn clean compile
   ```

3. **运行应用**
   ```bash
   mvn spring-boot:run
   ```

4. **访问应用**
   打开浏览器访问: http://localhost:8080

### 数据库管理
- H2控制台: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:taskdb`
- 用户名: `sa`
- 密码: `password`

## API文档

### 任务管理API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/tasks` | 获取所有任务 |
| GET | `/api/tasks/{id}` | 获取指定任务 |
| POST | `/api/tasks` | 创建新任务 |
| PUT | `/api/tasks/{id}` | 更新任务 |
| DELETE | `/api/tasks/{id}` | 删除任务 |
| GET | `/api/tasks/today` | 获取今日任务 |
| GET | `/api/tasks/this-week` | 获取本周任务 |
| GET | `/api/tasks/this-month` | 获取本月任务 |
| GET | `/api/tasks/upcoming` | 获取即将到期任务 |
| GET | `/api/tasks/overdue` | 获取过期任务 |
| PATCH | `/api/tasks/{id}/complete` | 标记任务完成 |

### 任务数据模型

```json
{
  "id": 1,
  "title": "任务标题",
  "description": "任务描述",
  "startTime": "2024-01-15T09:00:00",
  "endTime": "2024-01-15T10:00:00",
  "priority": "HIGH",
  "status": "PENDING",
  "category": "work",
  "color": "#FFE4B5",
  "allDay": false,
  "createdAt": "2024-01-14T20:00:00",
  "updatedAt": "2024-01-14T20:00:00"
}
```

## 项目结构

```
src/
├── main/
│   ├── java/com/taskmanager/
│   │   ├── CalendarTaskSystemApplication.java  # 主应用类
│   │   ├── model/
│   │   │   └── Task.java                       # 任务实体
│   │   ├── repository/
│   │   │   └── TaskRepository.java             # 数据访问层
│   │   ├── service/
│   │   │   └── TaskService.java                # 业务逻辑层
│   │   └── controller/
│   │       └── TaskController.java             # 控制器层
│   └── resources/
│       ├── application.yml                     # 应用配置
│       └── static/                             # 静态资源
│           ├── index.html                      # 主页面
│           ├── css/                            # 样式文件
│           │   ├── handdrawn-styles.css        # 手绘风格样式
│           │   ├── calendar.css                # 日历样式
│           │   └── tasks.css                   # 任务样式
│           └── js/                             # JavaScript文件
│               ├── api.js                      # API交互
│               ├── calendar.js                 # 日历组件
│               ├── tasks.js                    # 任务管理
│               └── app.js                      # 主应用
```

## 设计理念

### 手绘风格的实现
1. **视觉不完美**: 故意引入轻微的不规则性和随机性
2. **人性化交互**: 温暖、友好的用户体验
3. **情感连接**: 通过手工感建立与用户的情感纽带
4. **创意表达**: 打破数字界面的冰冷感

### 用户体验考虑
- **可读性优先**: 风格服务于功能，确保信息清晰可读
- **一致性**: 保持整体视觉语言的统一
- **响应式设计**: 适配不同设备和屏幕尺寸
- **无障碍访问**: 考虑色彩对比度和可访问性

## 开发指南

### 添加新功能
1. 后端：在相应的层（Controller、Service、Repository）添加代码
2. 前端：在对应的JS文件中添加功能，更新CSS样式
3. 保持手绘风格的一致性

### 样式指南
- 使用CSS变量定义颜色和尺寸
- 为新元素添加轻微的旋转和不规则边框
- 保持柔和的色彩搭配
- 使用手写风格字体

### 测试建议
- 测试不同浏览器的兼容性
- 验证响应式设计
- 检查API接口的正确性
- 测试用户交互流程

## 部署说明

### 生产环境配置
1. 替换H2数据库为MySQL或PostgreSQL
2. 配置生产环境的数据库连接
3. 设置适当的日志级别
4. 配置HTTPS和安全设置

### Docker部署
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/calendar-task-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

---

**享受手绘风格的任务管理体验！** ✨# hand-drawn-calendar-inspired-by-calendar
# hand-drawn-calendar-inspired-by-calendar
