#!/bin/bash

echo "🚀 Railway 啟動腳本"
echo "=================="

# 設置環境變量
export SPRING_PROFILES_ACTIVE=production
export PORT=${PORT:-8080}

echo "環境變量設置完成："
echo "SPRING_PROFILES_ACTIVE: $SPRING_PROFILES_ACTIVE"
echo "PORT: $PORT"

# 檢查 JAR 文件
if [ -f "target/calendar-task-system-1.0.0.jar" ]; then
    echo "✅ JAR 文件存在"
    ls -la target/calendar-task-system-1.0.0.jar
else
    echo "❌ JAR 文件不存在"
    exit 1
fi

# 檢查 Java 版本
echo "Java 版本："
java -version

# 啟動應用
echo "🚀 啟動應用..."
java -jar target/calendar-task-system-1.0.0.jar
