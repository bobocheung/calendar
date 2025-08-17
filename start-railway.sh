#!/bin/bash

echo "🚀 Railway 啟動腳本"
echo "=================="

# 顯示環境變量
echo "📋 環境變量："
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "SPRING_PROFILES_ACTIVE: $SPRING_PROFILES_ACTIVE"
echo "DB_DRIVER: $DB_DRIVER"
echo "HIBERNATE_DIALECT: $HIBERNATE_DIALECT"

# 檢查 JAR 文件
echo ""
echo "📦 檢查 JAR 文件："
if [ -f "target/calendar-task-system-1.0.0.jar" ]; then
    echo "✅ JAR 文件存在"
    ls -la target/calendar-task-system-1.0.0.jar
else
    echo "❌ JAR 文件不存在，嘗試構建..."
    mvn clean package -DskipTests
fi

# 啟動應用
echo ""
echo "🚀 啟動應用..."
java -jar target/calendar-task-system-1.0.0.jar
