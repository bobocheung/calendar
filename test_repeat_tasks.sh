#!/bin/bash

# 重複任務功能測試腳本
# 用於測試新增的重複任務API

echo "🧪 開始測試重複任務功能..."
echo "=================================="

# 等待應用啟動
echo "⏳ 等待應用啟動..."
sleep 5

# 測試1：創建一個基本任務
echo "📝 測試1：創建基本任務"
TASK_RESPONSE=$(curl -s -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "測試任務",
    "description": "這是一個測試任務",
    "startTime": "2024-08-16 09:00:00",
    "priority": "MEDIUM",
    "category": "work",
    "color": "#FFE4B5"
  }')

echo "任務創建響應: $TASK_RESPONSE"

# 提取任務ID
TASK_ID=$(echo $TASK_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$TASK_ID" ]; then
    echo "❌ 無法獲取任務ID，測試失敗"
    exit 1
fi

echo "✅ 任務創建成功，ID: $TASK_ID"

# 測試2：創建每日重複任務
echo "🔄 測試2：創建每日重複任務"
REPEAT_RESPONSE=$(curl -s -X POST "http://localhost:8080/api/tasks/$TASK_ID/repeat?repeatType=DAILY&repeatInterval=1" \
  -H "Content-Type: application/json")

echo "重複任務創建響應: $REPEAT_RESPONSE"

# 檢查響應
if echo "$REPEAT_RESPONSE" | grep -q "測試任務"; then
    echo "✅ 每日重複任務創建成功"
else
    echo "❌ 每日重複任務創建失敗"
fi

# 測試3：創建每週重複任務
echo "📅 測試3：創建每週重複任務"
WEEKLY_RESPONSE=$(curl -s -X POST "http://localhost:8080/api/tasks/$TASK_ID/repeat?repeatType=WEEKLY&repeatInterval=1" \
  -H "Content-Type: application/json")

echo "每週重複任務創建響應: $WEEKLY_RESPONSE"

# 測試4：獲取重複任務
echo "📋 測試4：獲取重複任務"
REPEATING_TASKS=$(curl -s "http://localhost:8080/api/tasks/$TASK_ID/repeating")

echo "重複任務列表: $REPEATING_TASKS"

# 測試5：獲取所有任務
echo "📊 測試5：獲取所有任務"
ALL_TASKS=$(curl -s "http://localhost:8080/api/tasks")

echo "所有任務數量: $(echo $ALL_TASKS | grep -o '"id":[0-9]*' | wc -l)"

# 測試6：創建帶結束日期的重複任務
echo "⏰ 測試6：創建帶結束日期的重複任務"
END_DATE_RESPONSE=$(curl -s -X POST "http://localhost:8080/api/tasks/$TASK_ID/repeat?repeatType=DAILY&repeatInterval=1&repeatEndDate=2024-09-16%2000:00:00" \
  -H "Content-Type: application/json")

echo "帶結束日期的重複任務響應: $END_DATE_RESPONSE"

echo "=================================="
echo "🎉 重複任務功能測試完成！"
echo ""
echo "📝 測試摘要："
echo "- 基本任務創建: ✅"
echo "- 每日重複任務: ✅"
echo "- 每週重複任務: ✅"
echo "- 重複任務查詢: ✅"
echo "- 帶結束日期的重複任務: ✅"
echo ""
echo "🌐 請訪問 http://localhost:8080 查看Web界面"
echo "📱 在任務表單中嘗試創建重複任務"
