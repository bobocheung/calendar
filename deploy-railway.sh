#!/bin/bash

# Railway 部署腳本
# 自動化部署到Railway平台

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函數
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查依賴
check_dependencies() {
    print_info "檢查依賴..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git 未安裝"
        exit 1
    fi
    
    if ! command -v mvn &> /dev/null; then
        print_error "Maven 未安裝"
        exit 1
    fi
    
    if ! command -v java &> /dev/null; then
        print_error "Java 未安裝"
        exit 1
    fi
    
    print_success "所有依賴已安裝"
}

# 檢查Git狀態
check_git_status() {
    print_info "檢查Git狀態..."
    
    if [ ! -d ".git" ]; then
        print_error "當前目錄不是Git倉庫"
        exit 1
    fi
    
    # 檢查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "發現未提交的更改"
        echo "未提交的文件："
        git status --porcelain
        
        read -p "是否要提交這些更改？(y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            read -p "輸入提交信息: " commit_msg
            git commit -m "${commit_msg:-"準備Railway部署"}"
        else
            print_error "請先提交或暫存更改"
            exit 1
        fi
    fi
    
    print_success "Git狀態檢查完成"
}

# 構建項目
build_project() {
    print_info "構建項目..."
    
    # 清理之前的構建
    mvn clean
    
    # 編譯和打包
    mvn package -DskipTests
    
    if [ $? -eq 0 ]; then
        print_success "項目構建成功"
    else
        print_error "項目構建失敗"
        exit 1
    fi
}

# 推送到GitHub
push_to_github() {
    print_info "推送到GitHub..."
    
    # 檢查遠程倉庫
    if ! git remote get-url origin &> /dev/null; then
        print_error "未找到遠程倉庫 'origin'"
        exit 1
    fi
    
    # 推送到main分支
    git push origin main
    
    if [ $? -eq 0 ]; then
        print_success "代碼已推送到GitHub"
    else
        print_error "推送失敗"
        exit 1
    fi
}

# 顯示部署說明
show_deployment_instructions() {
    print_info "部署說明"
    echo
    echo "請按照以下步驟在Railway上部署："
    echo
    echo "1. 訪問 https://railway.app"
    echo "2. 使用GitHub賬戶登錄"
    echo "3. 創建新項目"
    echo "4. 添加PostgreSQL數據庫服務："
    echo "   - 點擊 'New Service'"
    echo "   - 選擇 'Database' → 'PostgreSQL'"
    echo "5. 添加Java應用服務："
    echo "   - 點擊 'New Service'"
    echo "   - 選擇 'GitHub Repo'"
    echo "   - 選擇您的 'calendar' 倉庫"
    echo "   - 選擇 'main' 分支"
    echo "6. 配置環境變量（在Java服務中）："
    echo
    echo "   數據庫配置："
    echo "   SPRING_PROFILES_ACTIVE=production"
    echo "   DATABASE_URL=postgresql://username:password@host:port/database"
    echo "   DB_USERNAME=your_db_username"
    echo "   DB_PASSWORD=your_db_password"
    echo "   DB_DRIVER=org.postgresql.Driver"
    echo "   HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect"
    echo
    echo "   安全配置："
    echo "   JWT_SECRET=your-super-secret-jwt-key-here"
    echo "   ADMIN_USERNAME=admin"
    echo "   ADMIN_PASSWORD=your-admin-password"
    echo
    echo "   服務器配置："
    echo "   PORT=8080"
    echo
    echo "7. 等待自動部署完成"
    echo "8. 測試應用功能"
    echo
    echo "詳細說明請查看 RAILWAY_DEPLOYMENT_GUIDE.md"
}

# 主函數
main() {
    echo "=========================================="
    echo "    Railway 部署腳本"
    echo "=========================================="
    echo
    
    # 檢查依賴
    check_dependencies
    
    # 檢查Git狀態
    check_git_status
    
    # 構建項目
    build_project
    
    # 推送到GitHub
    push_to_github
    
    # 顯示部署說明
    show_deployment_instructions
    
    echo
    print_success "Railway部署準備完成！"
    echo
    echo "下一步："
    echo "1. 按照上述說明在Railway上創建項目"
    echo "2. 配置PostgreSQL數據庫"
    echo "3. 部署Java應用"
    echo "4. 設置環境變量"
    echo "5. 測試應用"
}

# 執行主函數
main "$@"
