/**
 * 任務管理組件類別
 * 
 * 功能說明：
 * - 管理所有任務的CRUD操作（創建、讀取、更新、刪除）
 * - 提供任務篩選和搜尋功能
 * - 處理任務表單的顯示和提交
 * - 管理任務狀態和優先級
 * - 提供統計資訊顯示
 * 
 * 設計特色：
 * - 手繪風格的任務卡片
 * - 直觀的篩選和分類系統
 * - 響應式的任務表單
 * - 即時的統計更新
 * 
 * @author Augment Agent
 * @version 1.0.0
 */
class TaskManager {
    /**
     * 建構函數：初始化任務管理組件
     */
    constructor() {
        // 所有任務的完整列表
        this.tasks = [];
        
        // 經過篩選後的任務列表
        this.filteredTasks = [];
        
        // 當前正在編輯的任務（用於編輯模式）
        this.currentEditingTask = null;
        
        // 當前的篩選條件
        this.currentFilter = {
            status: '',      // 狀態篩選
            priority: '',    // 優先級篩選
            category: ''     // 分類篩選
        };
        
        // 初始化組件
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTasks();
        this.updateTodayDate();
    }

    bindEvents() {
        // 新增任務按鈕事件監聽器
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.showTaskModal();
        });

        // 模態框關閉按鈕事件監聽器
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideTaskModal();
        });

        // 取消按鈕事件監聽器
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideTaskModal();
        });

        // 點擊模態框外部關閉事件監聽器
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') {
                this.hideTaskModal();
            }
        });

        // 任務表單提交事件監聽器
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskSubmit();
        });

        // 狀態篩選器事件監聽器
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.currentFilter.status = e.target.value;
            this.applyFilters();
        });

        // 優先級篩選器事件監聽器
        document.getElementById('priorityFilter').addEventListener('change', (e) => {
            this.currentFilter.priority = e.target.value;
            this.applyFilters();
        });

        // 顏色預設選擇事件監聽器
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                e.preventDefault();
                const color = e.target.dataset.color;
                document.getElementById('taskColor').value = color;
            });
        });

        // 全天任務複選框事件監聽器
        document.getElementById('taskAllDay').addEventListener('change', (e) => {
            const endTimeInput = document.getElementById('taskEndTime');
            if (e.target.checked) {
                endTimeInput.disabled = true;
                endTimeInput.value = '';
            } else {
                endTimeInput.disabled = false;
            }
        });

        // 分類篩選事件監聽器
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });
        });
    }

    async loadTasks() {
        try {
            this.tasks = await window.taskAPI.getAllTasks();
            this.filteredTasks = [...this.tasks];
            this.renderTasks();
            this.updateStatistics();
        } catch (error) {
            console.error('加载任务失败:', error);
        }
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        container.innerHTML = '';

        if (this.filteredTasks.length === 0) {
            this.renderEmptyState(container, '暂无任务', '点击"添加任务"按钮创建您的第一个任务');
            return;
        }

        this.filteredTasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card ${task.status.toLowerCase().replace('_', '-')}`;
        if (this.isOverdue(task)) {
            card.classList.add('overdue');
        }
        
        card.style.backgroundColor = task.color || '#FFE4B5';
        card.innerHTML = `
            <div class="priority-indicator priority-${task.priority.toLowerCase()}"></div>
            <div class="task-header">
                <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                <div class="task-actions">
                    <button class="task-action-btn edit" onclick="taskManager.editTask(${task.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn complete" onclick="taskManager.toggleTaskComplete(${task.id})" title="${task.status === 'COMPLETED' ? '标记未完成' : '标记完成'}">
                        <i class="fas ${task.status === 'COMPLETED' ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="task-action-btn delete" onclick="taskManager.deleteTask(${task.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                <div class="task-time">
                    <i class="fas fa-clock"></i>
                    ${this.formatTaskTime(task)}
                </div>
            </div>
            <div class="task-tags">
                <span class="tag-handdrawn tag-priority-${task.priority.toLowerCase()}">${this.getPriorityText(task.priority)}</span>
                <span class="tag-handdrawn tag-status-${task.status.toLowerCase().replace('_', '-')}">${this.getStatusText(task.status)}</span>
                ${task.category ? `<span class="tag-handdrawn">${this.escapeHtml(task.category)}</span>` : ''}
            </div>
        `;

        return card;
    }

    showTaskModal(task = null) {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const title = document.getElementById('modalTitle');

        this.currentEditingTask = task;

        if (task) {
            title.textContent = '编辑任务';
            this.populateForm(task);
        } else {
            title.textContent = '添加新任务';
            form.reset();
            // 设置默认开始时间为当前时间
            const now = new Date();
            document.getElementById('taskStartTime').value = this.formatDateTimeLocal(now);
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideTaskModal() {
        const modal = document.getElementById('taskModal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        this.currentEditingTask = null;
    }

    populateForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskStartTime').value = this.formatDateTimeLocal(new Date(task.startTime));
        document.getElementById('taskEndTime').value = task.endTime ? this.formatDateTimeLocal(new Date(task.endTime)) : '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskCategory').value = task.category || '';
        document.getElementById('taskColor').value = task.color || '#FFE4B5';
        document.getElementById('taskAllDay').checked = task.allDay || false;
    }

    async handleTaskSubmit() {
        const formData = new FormData(document.getElementById('taskForm'));
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime') || null,
            priority: formData.get('priority'),
            category: formData.get('category') || null,
            color: formData.get('color'),
            allDay: formData.has('allDay')
        };

        // 验证必填字段
        if (!taskData.title || !taskData.startTime) {
            window.taskAPI.showError('请填写任务标题和开始时间');
            return;
        }

        try {
            let result;
            if (this.currentEditingTask) {
                result = await window.taskAPI.updateTask(this.currentEditingTask.id, taskData);
            } else {
                result = await window.taskAPI.createTask(taskData);
            }

            if (result) {
                this.hideTaskModal();
                await this.loadTasks();
                
                // 刷新日历
                if (window.calendar) {
                    window.calendar.refresh();
                }
            }
        } catch (error) {
            console.error('保存任务失败:', error);
        }
    }

    async editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.showTaskModal(task);
        }
    }

    async deleteTask(id) {
        if (confirm('确定要删除这个任务吗？')) {
            const success = await window.taskAPI.deleteTask(id);
            if (success) {
                await this.loadTasks();
                
                // 刷新日历
                if (window.calendar) {
                    window.calendar.refresh();
                }
            }
        }
    }

    async toggleTaskComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
            const result = await window.taskAPI.updateTaskStatus(id, newStatus);
            if (result) {
                await this.loadTasks();
                
                // 刷新日历
                if (window.calendar) {
                    window.calendar.refresh();
                }
            }
        }
    }

    applyFilters() {
        this.filteredTasks = this.tasks.filter(task => {
            if (this.currentFilter.status && task.status !== this.currentFilter.status) {
                return false;
            }
            if (this.currentFilter.priority && task.priority !== this.currentFilter.priority) {
                return false;
            }
            if (this.currentFilter.category && task.category !== this.currentFilter.category) {
                return false;
            }
            return true;
        });
        
        this.renderTasks();
    }

    filterByCategory(category) {
        this.currentFilter.category = this.currentFilter.category === category ? '' : category;
        this.applyFilters();
        
        // 更新分类项的选中状态
        document.querySelectorAll('.category-item').forEach(item => {
            if (item.dataset.category === category && this.currentFilter.category === category) {
                item.style.backgroundColor = 'var(--highlight-yellow)';
            } else {
                item.style.backgroundColor = '';
            }
        });
    }

    async loadTodayTasks() {
        try {
            const todayTasks = await window.taskAPI.getTodayTasks();
            this.renderTodayTasks(todayTasks);
        } catch (error) {
            console.error('加载今日任务失败:', error);
        }
    }

    renderTodayTasks(tasks) {
        const container = document.getElementById('todayTasks');
        container.innerHTML = '';

        if (tasks.length === 0) {
            this.renderEmptyState(container, '今天没有任务', '享受您的空闲时光！');
            return;
        }

        tasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
    }

    async loadUpcomingTasks() {
        try {
            const upcomingTasks = await window.taskAPI.getUpcomingTasks();
            this.renderUpcomingTasks(upcomingTasks);
        } catch (error) {
            console.error('加载即将到期任务失败:', error);
        }
    }

    renderUpcomingTasks(tasks) {
        const container = document.getElementById('upcomingTasks');
        container.innerHTML = '';

        if (tasks.length === 0) {
            this.renderEmptyState(container, '没有即将到期的任务', '一切都在掌控之中！');
            return;
        }

        tasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
    }

    renderEmptyState(container, title, message) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    updateStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'COMPLETED').length;
        const pending = this.tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    updateTodayDate() {
        const today = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        document.getElementById('todayDate').textContent = today.toLocaleDateString('zh-CN', options);
    }

    // 工具方法
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTaskTime(task) {
        const start = new Date(task.startTime);
        const startStr = start.toLocaleString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        if (task.endTime) {
            const end = new Date(task.endTime);
            const endStr = end.toLocaleString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            return `${startStr} - ${endStr}`;
        }

        return startStr;
    }

    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    /**
     * 獲取優先級的繁體中文顯示文字
     * 將英文優先級代碼轉換為用戶友好的繁體中文
     * 
     * @param {string} priority - 優先級代碼（LOW/MEDIUM/HIGH/URGENT）
     * @returns {string} 繁體中文優先級文字
     */
    getPriorityText(priority) {
        const priorityMap = {
            'LOW': '低',
            'MEDIUM': '中',
            'HIGH': '高',
            'URGENT': '緊急'
        };
        return priorityMap[priority] || priority;
    }

    /**
     * 獲取狀態的繁體中文顯示文字
     * 將英文狀態代碼轉換為用戶友好的繁體中文
     * 
     * @param {string} status - 狀態代碼（PENDING/IN_PROGRESS/COMPLETED/CANCELLED）
     * @returns {string} 繁體中文狀態文字
     */
    getStatusText(status) {
        const statusMap = {
            'PENDING': '待處理',
            'IN_PROGRESS': '進行中',
            'COMPLETED': '已完成',
            'CANCELLED': '已取消'
        };
        return statusMap[status] || status;
    }

    isOverdue(task) {
        if (task.status === 'COMPLETED' || task.status === 'CANCELLED') {
            return false;
        }
        
        const now = new Date();
        const endTime = task.endTime ? new Date(task.endTime) : new Date(task.startTime);
        return endTime < now;
    }

    // 刷新任务列表
    async refresh() {
        await this.loadTasks();
    }
}