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

        // 重複類型選擇事件監聽器
        document.getElementById('taskRepeatType').addEventListener('change', (e) => {
            this.updateRepeatOptions(e.target.value);
        });

        // 重複間隔輸入事件監聽器
        document.getElementById('taskRepeatInterval').addEventListener('input', (e) => {
            this.updateRepeatIntervalText();
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
                ${task.repeatType && task.repeatType !== 'NONE' ? `<span class="tag-handdrawn tag-repeat">${this.getRepeatTypeText(task.repeatType)}</span>` : ''}
                ${task.originalTaskId ? `<span class="tag-handdrawn tag-repeating">重複任務</span>` : ''}
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
        
        // 設置重複任務選項
        if (task.repeatType) {
            document.getElementById('taskRepeatType').value = task.repeatType;
            this.updateRepeatOptions(task.repeatType);
        } else {
            document.getElementById('taskRepeatType').value = 'NONE';
            this.updateRepeatOptions('NONE');
        }
        
        if (task.repeatInterval) {
            document.getElementById('taskRepeatInterval').value = task.repeatInterval;
        }
        
        if (task.repeatEndDate) {
            const endDate = new Date(task.repeatEndDate);
            document.getElementById('taskRepeatEndDate').value = this.formatDate(endDate);
        }
    }

    async handleTaskSubmit() {
        const formData = new FormData(document.getElementById('taskForm'));
        
        // 處理日期時間格式轉換
        let startTime = formData.get('startTime');
        let endTime = formData.get('endTime') || null;
        
        // 將前端日期時間格式轉換為後端期望的格式
        if (startTime) {
            try {
                // 處理標準ISO格式：2025-08-17T12:22
                let startDate = new Date(startTime);
                
                // 檢查日期是否有效
                if (isNaN(startDate.getTime())) {
                    throw new Error('無效的開始時間格式');
                }
                
                // 轉換為後端期望的格式：YYYY-MM-DD HH:mm:ss
                const year = startDate.getFullYear();
                const month = String(startDate.getMonth() + 1).padStart(2, '0');
                const day = String(startDate.getDate()).padStart(2, '0');
                const hours = String(startDate.getHours()).padStart(2, '0');
                const minutes = String(startDate.getMinutes()).padStart(2, '0');
                const seconds = String(startDate.getSeconds()).padStart(2, '0');
                
                startTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                
                console.log('開始時間格式化:', formData.get('startTime'), '->', startTime);
            } catch (error) {
                console.error('開始時間格式轉換失敗:', error);
                window.taskAPI.showError('開始時間格式錯誤，請重新選擇');
                return;
            }
        }
        
        if (endTime) {
            try {
                // 處理標準ISO格式：2025-08-17T16:22
                let endDate = new Date(endTime);
                
                // 檢查日期是否有效
                if (isNaN(endDate.getTime())) {
                    throw new Error('無效的結束時間格式');
                }
                
                // 轉換為後端期望的格式：YYYY-MM-DD HH:mm:ss
                const year = endDate.getFullYear();
                const month = String(endDate.getMonth() + 1).padStart(2, '0');
                const day = String(endDate.getDate()).padStart(2, '0');
                const hours = String(endDate.getHours()).padStart(2, '0');
                const minutes = String(endDate.getMinutes()).padStart(2, '0');
                const seconds = String(endDate.getSeconds()).padStart(2, '0');
                
                endTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                
                console.log('結束時間格式化:', formData.get('endTime'), '->', endTime);
            } catch (error) {
                console.error('結束時間格式轉換失敗:', error);
                window.taskAPI.showError('結束時間格式錯誤，請重新選擇');
                return;
            }
        }
        
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            startTime: startTime,
            endTime: endTime,
            priority: formData.get('priority'),
            category: formData.get('category') || null,
            color: formData.get('color'),
            allDay: formData.has('allDay'),
            repeatType: formData.get('repeatType'),
            repeatInterval: parseInt(formData.get('repeatInterval')) || 1,
            repeatEndDate: null
        };

        // 處理重複結束日期格式轉換
        if (formData.get('repeatEndDate')) {
            try {
                const repeatEndDate = formData.get('repeatEndDate');
                // 將日期轉換為完整的日期時間格式
                const endDate = new Date(repeatEndDate);
                endDate.setHours(23, 59, 59, 999);
                
                // 轉換為後端期望的格式：YYYY-MM-DD HH:mm:ss
                const year = endDate.getFullYear();
                const month = String(endDate.getMonth() + 1).padStart(2, '0');
                const day = String(endDate.getDate()).padStart(2, '0');
                const hours = String(endDate.getHours()).padStart(2, '0');
                const minutes = String(endDate.getMinutes()).padStart(2, '0');
                const seconds = String(endDate.getSeconds()).padStart(2, '0');
                
                taskData.repeatEndDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                
                console.log('重複結束日期格式化:', formData.get('repeatEndDate'), '->', taskData.repeatEndDate);
            } catch (error) {
                console.error('重複結束日期格式轉換失敗:', error);
                window.taskAPI.showError('重複結束日期格式錯誤，請重新選擇');
                return;
            }
        }

        // 添加調試信息
        console.log('發送到後端的任務數據:', JSON.stringify(taskData, null, 2));
        console.log('開始時間類型:', typeof taskData.startTime, '值:', taskData.startTime);
        console.log('結束時間類型:', typeof taskData.endTime, '值:', taskData.endTime);
        console.log('重複結束日期類型:', typeof taskData.repeatEndDate, '值:', taskData.repeatEndDate);

        // 验证必填字段
        if (!taskData.title || !taskData.startTime) {
            let errorMessage = '';
            if (!taskData.title) {
                errorMessage += '請填寫任務標題\n';
            }
            if (!taskData.startTime) {
                errorMessage += '請選擇開始時間\n';
            }
            window.taskAPI.showError(errorMessage.trim());
            return;
        }

        // 驗證日期邏輯
        if (taskData.endTime && taskData.startTime) {
            const startDate = new Date(taskData.startTime);
            const endDate = new Date(taskData.endTime);
            if (endDate <= startDate) {
                window.taskAPI.showError('結束時間必須晚於開始時間');
                return;
            }
        }

        // 驗證重複任務設定
        if (taskData.repeatType && taskData.repeatType !== 'NONE') {
            if (taskData.repeatInterval < 1) {
                window.taskAPI.showError('重複間隔必須大於0');
                return;
            }
            if (taskData.repeatEndDate) {
                const startDate = new Date(taskData.startTime);
                const endDate = new Date(taskData.repeatEndDate);
                if (endDate <= startDate) {
                    window.taskAPI.showError('重複結束日期必須晚於開始時間');
                    return;
                }
            }
        }

        try {
            let result;
            if (this.currentEditingTask) {
                result = await window.taskAPI.updateTask(this.currentEditingTask.id, taskData);
            } else {
                result = await window.taskAPI.createTask(taskData);
                
                // 如果设置了重复，创建重复任务
                if (result && taskData.repeatType && taskData.repeatType !== 'NONE') {
                    await this.createRepeatingTasks(result.id, taskData);
                }
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
            // 提供更詳細的錯誤信息
            let errorMessage = '保存任務失敗';
            if (error.message) {
                if (error.message.includes('HTTP 400')) {
                    errorMessage = '任務資料格式錯誤，請檢查必填欄位和日期格式';
                } else if (error.message.includes('HTTP 500')) {
                    errorMessage = '伺服器內部錯誤，請稍後再試';
                } else {
                    errorMessage = error.message;
                }
            }
            window.taskAPI.showError(errorMessage);
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
     * 格式化日期為HTML date input的格式
     * 將Date對象轉換為YYYY-MM-DD格式的字符串
     * 
     * @param {Date} date 日期對象
     * @returns {string} 格式化後的日期字符串
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
    
    /**
     * 創建重複任務
     * 調用後端API創建重複任務
     * 
     * @param {number} taskId 原始任務ID
     * @param {object} taskData 任務數據
     */
    async createRepeatingTasks(taskId, taskData) {
        try {
            const params = new URLSearchParams({
                repeatType: taskData.repeatType,
                repeatInterval: taskData.repeatInterval
            });
            
            if (taskData.repeatEndDate) {
                try {
                    // 處理本地化的日期格式
                    let endDate;
                    if (taskData.repeatEndDate.includes('/')) {
                        // 處理本地化格式：2025/11/30
                        const dateParts = taskData.repeatEndDate.split('/');
                        const year = parseInt(dateParts[0]);
                        const month = parseInt(dateParts[1]) - 1; // 月份從0開始
                        const day = parseInt(dateParts[2]);
                        
                        endDate = new Date(year, month, day);
                    } else {
                        // 處理標準格式
                        endDate = new Date(taskData.repeatEndDate);
                    }
                    
                    // 檢查日期是否有效
                    if (isNaN(endDate.getTime())) {
                        throw new Error('無效的重複結束日期格式');
                    }
                    
                    // 設定為當天的最後時刻
                    endDate.setHours(23, 59, 59, 999);
                    
                    // 使用與後端一致的格式：YYYY-MM-DD HH:mm:ss
                    const year = endDate.getFullYear();
                    const month = String(endDate.getMonth() + 1).padStart(2, '0');
                    const day = String(endDate.getDate()).padStart(2, '0');
                    const hours = String(endDate.getHours()).padStart(2, '0');
                    const minutes = String(endDate.getMinutes()).padStart(2, '0');
                    const seconds = String(endDate.getSeconds()).padStart(2, '0');
                    
                    const formattedEndDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                    params.append('repeatEndDate', formattedEndDate);
                    
                    console.log('重複結束日期格式化:', taskData.repeatEndDate, '->', formattedEndDate);
                } catch (error) {
                    console.error('重複結束日期格式轉換失敗:', error);
                    window.taskAPI.showError('重複結束日期格式錯誤，請重新選擇');
                    return;
                }
            }
            
            const response = await fetch(`/api/tasks/${taskId}/repeat?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const createdTasks = await response.json();
                console.log(`成功創建 ${createdTasks.length} 個重複任務`);
                window.taskAPI.showSuccess(`成功創建 ${createdTasks.length} 個重複任務`);
            } else {
                console.error('創建重複任務失敗');
                const errorText = await response.text();
                console.error('錯誤詳情:', errorText);
                window.taskAPI.showError('創建重複任務失敗');
            }
        } catch (error) {
            console.error('創建重複任務時發生錯誤:', error);
            window.taskAPI.showError('創建重複任務時發生錯誤: ' + error.message);
        }
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
    
    /**
     * 獲取重複類型的繁體中文顯示文字
     * 將英文重複類型代碼轉換為用戶友好的繁體中文
     * 
     * @param {string} repeatType - 重複類型代碼（DAILY/WEEKLY/MONTHLY/YEARLY）
     * @returns {string} 繁體中文重複類型文字
     */
    getRepeatTypeText(repeatType) {
        const repeatTypeMap = {
            'DAILY': '每日',
            'WEEKLY': '每週',
            'MONTHLY': '每月',
            'YEARLY': '每年'
        };
        return repeatTypeMap[repeatType] || repeatType;
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
    
    /**
     * 更新重複選項的顯示
     * 根據選擇的重複類型顯示或隱藏相關選項
     * 
     * @param {string} repeatType 重複類型
     */
    updateRepeatOptions(repeatType) {
        const intervalContainer = document.getElementById('repeatIntervalContainer');
        const endDateContainer = document.getElementById('repeatEndDateContainer');
        const intervalText = document.getElementById('repeatIntervalText');
        
        if (repeatType === 'NONE') {
            intervalContainer.style.display = 'none';
            endDateContainer.style.display = 'none';
        } else {
            intervalContainer.style.display = 'flex';
            endDateContainer.style.display = 'block';
            
            // 更新間隔文字
            this.updateRepeatIntervalText();
        }
    }
    
    /**
     * 更新重複間隔的文字描述
     * 根據重複類型和間隔值顯示適當的文字
     */
    updateRepeatIntervalText() {
        const repeatType = document.getElementById('taskRepeatType').value;
        const repeatInterval = document.getElementById('taskRepeatInterval').value;
        const intervalText = document.getElementById('repeatIntervalText');
        
        const textMap = {
            'DAILY': repeatInterval === '1' ? '天' : '天',
            'WEEKLY': repeatInterval === '1' ? '週' : '週',
            'MONTHLY': repeatInterval === '1' ? '月' : '月',
            'YEARLY': repeatInterval === '1' ? '年' : '年'
        };
        
        intervalText.textContent = textMap[repeatType] || '天';
    }
}