#!/bin/bash

# Docker構建腳本
# 解決Docker registry訪問問題

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

# 檢查Docker
check_docker() {
    print_info "檢查Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安裝"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker 服務未運行"
        exit 1
    fi
    
    print_success "Docker 檢查通過"
}

# 配置Docker鏡像源
configure_docker_mirrors() {
    print_info "配置Docker鏡像源..."
    
    # 創建或更新Docker daemon配置
    if [ ! -d "$HOME/.docker" ]; then
        mkdir -p "$HOME/.docker"
    fi
    
    cat > "$HOME/.docker/daemon.json" << EOF
{
    "registry-mirrors": [
        "https://registry.cn-hangzhou.aliyuncs.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://hub-mirror.c.163.com",
        "https://mirror.baidubce.com"
    ]
}
EOF
    
    print_info "Docker鏡像源配置已更新，請重啟Docker服務"
    print_info "macOS: 在Docker Desktop中重啟"
    print_info "Linux: sudo systemctl restart docker"
}

# 構建Docker鏡像（標準）
build_standard() {
    print_info "使用標準Dockerfile構建..."
    
    docker build -t calendar-task-system:latest .
    
    if [ $? -eq 0 ]; then
        print_success "標準構建成功"
    else
        print_error "標準構建失敗"
        return 1
    fi
}

# 構建Docker鏡像（多階段）
build_multi_stage() {
    print_info "使用多階段Dockerfile構建..."
    
    docker build -f Dockerfile.multi -t calendar-task-system:latest .
    
    if [ $? -eq 0 ]; then
        print_success "多階段構建成功"
    else
        print_error "多階段構建失敗"
        return 1
    fi
}

# 構建Docker鏡像（簡化版本）
build_simple() {
    print_info "使用簡化版Dockerfile構建..."
    
    docker build -f Dockerfile.simple -t calendar-task-system:latest .
    
    if [ $? -eq 0 ]; then
        print_success "簡化版構建成功"
    else
        print_error "簡化版構建失敗"
        return 1
    fi
}

# 構建Docker鏡像（國內鏡像源）
build_china_mirror() {
    print_info "使用國內鏡像源構建..."
    
    # 嘗試多個國內鏡像源
    local mirrors=(
        "registry.cn-hangzhou.aliyuncs.com/library/java:17-jdk-slim"
        "registry.cn-hangzhou.aliyuncs.com/library/maven:3.9.5-jdk-17"
        "docker.mirrors.ustc.edu.cn/library/java:17-jdk-slim"
        "docker.mirrors.ustc.edu.cn/library/maven:3.9.5-jdk-17"
    )
    
    local success=false
    
    for mirror in "${mirrors[@]}"; do
        print_info "嘗試鏡像源: $mirror"
        if docker pull "$mirror" &> /dev/null; then
            print_success "成功拉取: $mirror"
            success=true
            break
        else
            print_warning "拉取失敗: $mirror"
        fi
    done
    
    if [ "$success" = false ]; then
        print_warning "所有國內鏡像源都失敗，嘗試使用官方鏡像源..."
        docker pull openjdk:17-jdk-slim
    fi
    
    docker build -t calendar-task-system:latest .
    
    if [ $? -eq 0 ]; then
        print_success "國內鏡像源構建成功"
    else
        print_error "國內鏡像源構建失敗"
        return 1
    fi
}

# 測試Docker鏡像
test_image() {
    print_info "測試Docker鏡像..."
    
    # 檢查鏡像是否存在
    if ! docker image inspect calendar-task-system:latest &> /dev/null; then
        print_error "鏡像不存在"
        return 1
    fi
    
    print_success "鏡像測試通過"
    
    # 顯示鏡像信息
    docker images calendar-task-system:latest
}

# 運行Docker容器
run_container() {
    print_info "運行Docker容器..."
    
    # 停止並移除舊容器
    docker stop calendar-task-system 2>/dev/null || true
    docker rm calendar-task-system 2>/dev/null || true
    
    # 運行新容器
    docker run -d \
        --name calendar-task-system \
        -p 8080:8080 \
        -e SPRING_PROFILES_ACTIVE=production \
        -e SERVER_PORT=8080 \
        calendar-task-system:latest
    
    if [ $? -eq 0 ]; then
        print_success "容器啟動成功"
        print_info "應用運行在: http://localhost:8080"
        
        # 等待應用啟動
        print_info "等待應用啟動..."
        sleep 10
        
        # 檢查健康狀態
        if curl -f http://localhost:8080/api/health &> /dev/null; then
            print_success "應用健康檢查通過"
        else
            print_warning "應用可能還在啟動中，請稍後檢查"
        fi
    else
        print_error "容器啟動失敗"
        return 1
    fi
}

# 清理Docker資源
cleanup() {
    print_info "清理Docker資源..."
    
    # 停止並移除容器
    docker stop calendar-task-system 2>/dev/null || true
    docker rm calendar-task-system 2>/dev/null || true
    
    # 移除鏡像
    docker rmi calendar-task-system:latest 2>/dev/null || true
    
    print_success "清理完成"
}

# 顯示幫助
show_help() {
    echo "Docker構建腳本使用方法："
    echo
    echo "  ./docker-build.sh [選項]"
    echo
    echo "選項："
    echo "  standard     使用標準Dockerfile構建"
    echo "  multi        使用多階段Dockerfile構建"
    echo "  simple       使用簡化版Dockerfile構建（推薦）"
    echo "  china        使用國內鏡像源構建"
    echo "  test         測試構建的鏡像"
    echo "  run          構建並運行容器"
    echo "  clean        清理Docker資源"
    echo "  mirrors      配置Docker鏡像源"
    echo "  help         顯示此幫助信息"
    echo
    echo "示例："
    echo "  ./docker-build.sh simple   # 使用簡化版構建（推薦）"
    echo "  ./docker-build.sh china    # 使用國內鏡像源構建"
    echo "  ./docker-build.sh run      # 構建並運行"
}

# 主函數
main() {
    echo "=========================================="
    echo "    Docker 構建腳本"
    echo "=========================================="
    echo
    
    # 檢查Docker
    check_docker
    
    # 解析參數
    case "${1:-help}" in
        "standard")
            build_standard
            ;;
        "multi")
            build_multi_stage
            ;;
        "simple")
            build_simple
            ;;
        "china")
            build_china_mirror
            ;;
        "test")
            test_image
            ;;
        "run")
            build_simple && run_container
            ;;
        "clean")
            cleanup
            ;;
        "mirrors")
            configure_docker_mirrors
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 執行主函數
main "$@"
