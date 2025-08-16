#!/bin/bash

echo "🚀 啟動手繪風格任務管理系統..."
echo "=================================="

# 檢查Java是否安裝
if ! command -v java &> /dev/null; then
    echo "❌ 錯誤：未找到Java，請先安裝Java 17或更高版本"
    exit 1
fi

# 檢查Maven是否安裝
if ! command -v mvn &> /dev/null; then
    echo "❌ 錯誤：未找到Maven，請先安裝Maven"
    exit 1
fi

echo "✅ Java版本：$(java -version 2>&1 | head -n 1)"
echo "✅ Maven版本：$(mvn -version 2>&1 | head -n 1)"
echo ""

# 編譯項目
echo "🔨 編譯項目..."
mvn clean compile

if [ $? -ne 0 ]; then
    echo "❌ 編譯失敗，請檢查錯誤信息"
    exit 1
fi

echo "✅ 編譯成功！"
echo ""

# 啟動應用
echo "🚀 啟動Spring Boot應用..."
echo "📝 提示：應用啟動後，按 Ctrl+C 停止"
echo ""

# 在新終端中啟動應用
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && mvn spring-boot:run"'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    gnome-terminal -- bash -c "cd $(pwd) && mvn spring-boot:run; exec bash" 2>/dev/null || \
    xterm -e "cd $(pwd) && mvn spring-boot:run; exec bash" 2>/dev/null || \
    konsole -e "cd $(pwd) && mvn spring-boot:run; exec bash" 2>/dev/null || \
    echo "請手動在新終端中運行：mvn spring-boot:run"
else
    # Windows或其他
    echo "請手動在新終端中運行：mvn spring-boot:run"
fi

echo ""
echo "⏳ 等待應用啟動..."
sleep 5

# 檢查應用是否啟動
echo "🔍 檢查應用狀態..."
if curl -s http://localhost:8080/ > /dev/null 2>&1; then
    echo "✅ 應用啟動成功！"
    echo ""
    echo "🌐 訪問地址："
    echo "   📱 主界面：http://localhost:8080"
    echo "   🗄️ H2數據庫控制台：http://localhost:8080/h2-console"
    echo ""
    echo "📊 數據庫連接信息："
    echo "   JDBC URL: jdbc:h2:file:./taskdb"
    echo "   用戶名: sa"
    echo "   密碼: password"
    echo ""
    echo "🧪 測試重複任務功能："
    echo "   1. 點擊「新增任務」按鈕"
    echo "   2. 選擇重複類型（每日/每週/每月/每年）"
    echo "   3. 設定重複間隔和結束日期"
    echo "   4. 點擊儲存創建重複任務"
    echo ""
    echo "🎯 重複任務功能特點："
    echo "   ✅ 支援每日、每週、每月、每年重複"
    echo "   ✅ 可設定重複間隔（每1天、每2週等）"
    echo "   ✅ 可設定重複結束日期"
    echo "   ✅ 智能日期計算，保持任務持續時間"
    echo "   ✅ 手繪風格的界面設計"
    echo ""
    echo "🔄 應用將在後台運行，關閉此終端不會影響應用"
    echo "🛑 如需停止應用，請在運行應用的終端中按 Ctrl+C"
else
    echo "❌ 應用啟動失敗，請檢查錯誤信息"
    echo "💡 提示：應用可能需要更多時間啟動，請稍後再試"
fi
