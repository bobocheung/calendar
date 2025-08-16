#!/bin/bash

echo "🚀 開始Vercel構建..."

# 檢查Java版本
echo "📋 檢查Java版本..."
java -version

# 檢查Maven版本
echo "📋 檢查Maven版本..."
mvn -version

# 清理並構建項目
echo "🔨 構建Spring Boot應用..."
mvn clean package -DskipTests

# 檢查構建結果
if [ $? -eq 0 ]; then
    echo "✅ 構建成功！"
    echo "📁 構建產物："
    ls -la target/
    
    # 創建Vercel需要的目錄結構
    echo "📁 創建Vercel目錄結構..."
    mkdir -p .vercel/output/static
    mkdir -p .vercel/output/functions
    
    # 複製靜態文件
    echo "📋 複製靜態文件..."
    cp -r src/main/resources/static/* .vercel/output/static/
    
    # 複製JAR文件
    echo "📋 複製JAR文件..."
    cp target/*.jar .vercel/output/functions/
    
    echo "🎉 Vercel構建完成！"
else
    echo "❌ 構建失敗！"
    exit 1
fi
