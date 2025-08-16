#!/bin/bash

# Railway 部署腳本
echo "🚀 準備部署到 Railway..."

# 檢查 Git 狀態
echo "📋 檢查 Git 狀態..."
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 有未提交的更改，請先提交或暫存更改"
    git status
    exit 1
fi

# 檢查是否在 main 分支
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  當前分支是 $current_branch，建議切換到 main 分支"
    read -p "是否繼續？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 構建項目
echo "🔨 構建項目..."
if ! mvn clean package -DskipTests; then
    echo "❌ 構建失敗"
    exit 1
fi

# 推送到 GitHub
echo "📤 推送到 GitHub..."
if ! git push origin main; then
    echo "❌ 推送失敗"
    exit 1
fi

echo "✅ 代碼已推送到 GitHub"
echo ""
echo "🎯 接下來請在 Railway 上："
echo "1. 登入 https://railway.app"
echo "2. 創建新項目並連接 GitHub 倉庫"
echo "3. 添加 PostgreSQL 數據庫"
echo "4. 配置環境變量（參考 RAILWAY_DEPLOYMENT_GUIDE.md）"
echo "5. 等待自動部署完成"
echo ""
echo "📖 詳細步驟請查看 RAILWAY_DEPLOYMENT_GUIDE.md"
