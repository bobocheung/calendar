/**
 * 主應用程式類別
 * 
 * 功能說明：
 * - 統一管理整個應用程式的初始化和生命週期
 * - 協調日曆組件和任務管理組件之間的交互
 * - 處理視圖切換和導航邏輯
 * - 管理全域事件監聽器和鍵盤快捷鍵
 * - 提供用戶設定的儲存和恢復功能
 * 
 * 設計模式：
 * - 單例模式：確保全域只有一個應用程式實例
 * - 觀察者模式：監聽和響應各種用戶事件
 * - 策略模式：根據不同視圖採用不同的資料載入策略
 * 
 * @author Augment Agent
 * @version 1.0.0
 */
class App {
    /**
     * 建構函數：初始化主應用程式
     */
    constructor() {
        // 當前活動的視圖名稱（calendar/tasks/today/upcoming）
        this.currentView = 'calendar';
        
        // 日曆組件實例
        this.calendar = null;
        
        // 任務管理組件實例
        this.taskManager = null;
        
        // 初始化應用程式
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // 初始化组件
        this.calendar = new Calendar();
        this.taskManager = new TaskManager();
        
        // 设置全局引用
        window.calendar = this.calendar;
        window.taskManager = this.taskManager;
        
        // 绑定事件
        this.bindEvents();
        
        // 设置初始视图
        this.showView('calendar');
        
        // 加载初始数据
        this.loadInitialData();
        
        console.log('任务管理系统初始化完成');
    }

    bindEvents() {
        // 导航菜单
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                this.showView(view);
                this.updateActiveNavItem(e.currentTarget);
            });
        });

        // 视图切换按钮
        document.getElementById('viewToggle').addEventListener('click', () => {
            this.toggleView();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    showView(viewName) {
        // 隐藏所有视图
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
        });

        // 显示指定视图
        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
            
            // 根据视图加载相应数据
            this.loadViewData(viewName);
        }
    }

    async loadViewData(viewName) {
        switch (viewName) {
            case 'calendar':
                if (this.calendar) {
                    this.calendar.refresh();
                }
                break;
                
            case 'tasks':
                if (this.taskManager) {
                    await this.taskManager.refresh();
                }
                break;
                
            case 'today':
                if (this.taskManager) {
                    await this.taskManager.loadTodayTasks();
                }
                break;
                
            case 'upcoming':
                if (this.taskManager) {
                    await this.taskManager.loadUpcomingTasks();
                }
                break;
        }
    }

    updateActiveNavItem(activeItem) {
        // 移除所有活动状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加活动状态到当前项
        activeItem.classList.add('active');
    }

    toggleView() {
        const button = document.getElementById('viewToggle');
        const icon = button.querySelector('i');
        
        if (this.currentView === 'calendar') {
            this.showView('tasks');
            button.innerHTML = '<i class="fas fa-calendar"></i> 日历视图';
        } else {
            this.showView('calendar');
            button.innerHTML = '<i class="fas fa-th"></i> 月视图';
        }
    }

    async loadInitialData() {
        try {
            // 加载任务数据
            await this.taskManager.loadTasks();
            
            // 加载今日任务
            await this.taskManager.loadTodayTasks();
            
            // 加载即将到期的任务
            await this.taskManager.loadUpcomingTasks();
            
        } catch (error) {
            console.error('加载初始数据失败:', error);
            window.taskAPI.showError('加载数据失败，请刷新页面重试');
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + N: 新建任务
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.taskManager.showTaskModal();
        }
        
        // Escape: 关闭模态框
        if (e.key === 'Escape') {
            const modal = document.getElementById('taskModal');
            if (modal.classList.contains('show')) {
                this.taskManager.hideTaskModal();
            }
        }
        
        // 数字键切换视图
        if (e.key >= '1' && e.key <= '4') {
            const views = ['calendar', 'tasks', 'today', 'upcoming'];
            const viewIndex = parseInt(e.key) - 1;
            if (views[viewIndex]) {
                this.showView(views[viewIndex]);
                
                // 更新导航状态
                const navItem = document.querySelector(`[data-view="${views[viewIndex]}"]`);
                if (navItem) {
                    this.updateActiveNavItem(navItem);
                }
            }
        }
    }

    handleResize() {
        // 响应式处理
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth <= 768) {
            // 移动端布局调整
            if (sidebar && mainContent) {
                mainContent.style.gridTemplateColumns = '1fr';
            }
        } else {
            // 桌面端布局
            if (sidebar && mainContent) {
                mainContent.style.gridTemplateColumns = '300px 1fr';
            }
        }
    }

    // 添加手绘风格动画效果
    addSketchAnimation(element) {
        element.classList.add('animate-sketch-in');
        setTimeout(() => {
            element.classList.remove('animate-sketch-in');
        }, 500);
    }

    // 显示欢迎消息
    showWelcomeMessage() {
        const now = new Date();
        const hour = now.getHours();
        let greeting;
        
        if (hour < 6) {
            greeting = '夜深了，注意休息哦';
        } else if (hour < 12) {
            greeting = '早上好';
        } else if (hour < 18) {
            greeting = '下午好';
        } else {
            greeting = '晚上好';
        }
        
        window.taskAPI.showNotification(`${greeting}！欢迎使用任务管理系统`, 'info');
    }

    // 检查浏览器兼容性
    checkBrowserCompatibility() {
        const isCompatible = 
            'fetch' in window &&
            'Promise' in window &&
            'classList' in document.documentElement &&
            'addEventListener' in window;
            
        if (!isCompatible) {
            window.taskAPI.showError('您的浏览器版本过低，可能影响系统正常使用，建议升级到最新版本');
        }
    }

    // 自动保存功能
    enableAutoSave() {
        // 定期保存用户的筛选设置等
        setInterval(() => {
            const settings = {
                currentView: this.currentView,
                filters: this.taskManager.currentFilter,
                lastVisit: new Date().toISOString()
            };
            
            localStorage.setItem('taskManagerSettings', JSON.stringify(settings));
        }, 30000); // 每30秒保存一次
    }

    // 恢复用户设置
    restoreUserSettings() {
        try {
            const settings = localStorage.getItem('taskManagerSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                
                // 恢复视图
                if (parsed.currentView) {
                    this.showView(parsed.currentView);
                }
                
                // 恢复筛选器
                if (parsed.filters && this.taskManager) {
                    this.taskManager.currentFilter = parsed.filters;
                }
            }
        } catch (error) {
            console.warn('恢复用户设置失败:', error);
        }
    }

    // 性能监控
    startPerformanceMonitoring() {
        // 监控页面加载性能
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`页面加载完成，耗时: ${loadTime.toFixed(2)}ms`);
            
            if (loadTime > 3000) {
                console.warn('页面加载较慢，建议优化');
            }
        });
    }
}

// 初始化应用程序
const app = new App();

// 设置全局错误处理
window.addEventListener('error', (e) => {
    console.error('全局错误:', e.error);
    if (window.taskAPI) {
        window.taskAPI.showError('系统出现错误，请刷新页面重试');
    }
});

// 设置未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的Promise拒绝:', e.reason);
    if (window.taskAPI) {
        window.taskAPI.showError('网络请求失败，请检查网络连接');
    }
});

// 导出全局引用
window.app = app;