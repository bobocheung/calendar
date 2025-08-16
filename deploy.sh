#!/bin/bash

echo "🚀 手繪風格任務管理系統 - 部署腳本"
echo "=================================="

# 檢查必要的工具
check_requirements() {
    echo "📋 檢查部署要求..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git未安裝"
        exit 1
    fi
    
    if ! command -v java &> /dev/null; then
        echo "❌ Java未安裝"
        exit 1
    fi
    
    if ! command -v mvn &> /dev/null; then
        echo "❌ Maven未安裝"
        exit 1
    fi
    
    echo "✅ 所有要求已滿足"
}

# 構建項目
build_project() {
    echo "🔨 構建項目..."
    mvn clean package -DskipTests
    
    if [ $? -eq 0 ]; then
        echo "✅ 構建成功"
    else
        echo "❌ 構建失敗"
        exit 1
    fi
}

# 部署到Vercel
deploy_vercel() {
    echo "🌐 部署到Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
    else
        echo "⚠️  Vercel CLI未安裝，請手動部署"
        echo "   1. 訪問 https://vercel.com"
        echo "   2. 連接GitHub倉庫"
        echo "   3. 配置環境變量"
        echo "   4. 部署"
    fi
}

# 部署到Railway
deploy_railway() {
    echo "🚂 部署到Railway..."
    
    if command -v railway &> /dev/null; then
        railway up
    else
        echo "⚠️  Railway CLI未安裝，請手動部署"
        echo "   1. 訪問 https://railway.app"
        echo "   2. 連接GitHub倉庫"
        echo "   3. 配置環境變量"
        echo "   4. 部署"
    fi
}

# 部署到Docker
deploy_docker() {
    echo "🐳 部署到Docker..."
    
    if command -v docker &> /dev/null; then
        docker-compose up -d
        echo "✅ Docker部署完成"
        echo "🌐 訪問地址: http://localhost:8080"
    else
        echo "❌ Docker未安裝"
    fi
}

# 主菜單
show_menu() {
    echo ""
    echo "請選擇部署方式："
    echo "1) 部署到Vercel (前端靜態)"
    echo "2) 部署到Railway (後端Java)"
    echo "3) 部署到Docker (本地完整)"
    echo "4) 構建項目"
    echo "5) 退出"
    echo ""
    read -p "請輸入選項 (1-5): " choice
    
    case $choice in
        1)
            check_requirements
            build_project
            deploy_vercel
            ;;
        2)
            check_requirements
            build_project
            deploy_railway
            ;;
        3)
            check_requirements
            build_project
            deploy_docker
            ;;
        4)
            check_requirements
            build_project
            ;;
        5)
            echo "👋 再見！"
            exit 0
            ;;
        *)
            echo "❌ 無效選項"
            show_menu
            ;;
    esac
}

# 主程序
main() {
    echo "歡迎使用部署腳本！"
    show_menu
}

# 執行主程序
main
