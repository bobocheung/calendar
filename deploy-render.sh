#!/bin/bash

# Render 部署腳本
# 自動化部署到Render平台

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
            git commit -m "${commit_msg:-"準備Render部署"}"
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
    print_info "Render部署說明"
    echo
    echo "請按照以下步驟在Render上部署："
    echo
    echo "1. 訪問 https://render.com"
    echo "2. 使用GitHub賬戶登錄"
    echo "3. 創建新賬戶（如果還沒有）"
    echo "4. 點擊 'New +' 按鈕"
    echo "5. 選擇 'Blueprint'（藍圖部署）"
    echo "6. 連接您的GitHub賬戶"
    echo "7. 選擇您的 'calendar' 倉庫"
    echo "8. Render會自動檢測 render.yaml 文件"
    echo "9. 確認服務配置："
    echo "   - PostgreSQL數據庫：calendar-postgres"
    echo "   - Java應用：calendar-task-system"
    echo "10. 點擊 'Apply' 開始部署"
    echo
    echo "部署完成後，您將獲得："
    echo "- 免費PostgreSQL數據庫"
    echo "- 免費Java應用託管"
    echo "- 自動HTTPS支持"
    echo "- 全球CDN加速"
    echo
    echo "詳細說明請查看 RENDER_DEPLOYMENT_GUIDE.md"
}

# 檢查render.yaml文件
check_render_config() {
    print_info "檢查Render配置文件..."
    
    if [ ! -f "render.yaml" ]; then
        print_error "未找到 render.yaml 文件"
        exit 1
    fi
    
    # 檢查配置文件語法
    if command -v python3 &> /dev/null; then
        if python3 -c "import yaml; yaml.safe_load(open('render.yaml'))" 2>/dev/null; then
            print_success "render.yaml 語法檢查通過"
        else
            print_warning "render.yaml 語法可能有問題"
        fi
    else
        print_warning "無法檢查YAML語法，請手動確認"
    fi
    
    print_success "Render配置文件檢查完成"
}

# 主函數
main() {
    echo "=========================================="
    echo "    Render 部署腳本"
    echo "=========================================="
    echo
    
    # 檢查依賴
    check_dependencies
    
    # 檢查Git狀態
    check_git_status
    
    # 檢查Render配置
    check_render_config
    
    # 構建項目
    build_project
    
    # 推送到GitHub
    push_to_github
    
    # 顯示部署說明
    show_deployment_instructions
    
    echo
    print_success "Render部署準備完成！"
    echo
    echo "下一步："
    echo "1. 按照上述說明在Render上創建服務"
    echo "2. 等待自動部署完成"
    echo "3. 配置數據庫連接"
    echo "4. 測試應用功能"
    echo
    echo "重要提醒："
    echo "- 免費計劃每月有750小時限制"
    echo "- 應用會在15分鐘無活動後休眠"
    echo "- 首次訪問可能需要等待應用喚醒"
}

# 執行主函數
main "$@"
