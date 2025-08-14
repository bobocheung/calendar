/**
 * 日曆組件類別
 * 
 * 功能說明：
 * - 提供月曆檢視功能，以網格形式顯示日期
 * - 整合任務資料，在日曆上顯示任務預覽
 * - 支援月份導航和日期選擇
 * - 響應式設計，適配不同螢幕尺寸
 * 
 * 設計特色：
 * - 手繪風格的日曆格子
 * - 任務顏色標識和預覽
 * - 流暢的動畫效果
 * 
 * @author Augment Agent
 * @version 1.0.0
 */
class Calendar {
    /**
     * 建構函數：初始化日曆組件
     */
    constructor() {
        // 當前顯示的日期（用於月份導航）
        this.currentDate = new Date();
        
        // 當前月份的任務資料
        this.tasks = [];
        
        // 用戶選中的日期
        this.selectedDate = null;
        
        // 月份名稱陣列（繁體中文）
        this.monthNames = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        
        // 星期名稱陣列（繁體中文）
        this.dayNames = ['日', '一', '二', '三', '四', '五', '六'];
        
        // 初始化日曆組件
        this.init();
    }

    /**
     * 初始化日曆組件
     * 設定事件監聽器、渲染初始檢視、載入任務資料
     */
    init() {
        this.bindEvents();  // 綁定事件監聽器
        this.render();      // 渲染日曆檢視
        this.loadTasks();   // 載入任務資料
    }

    /**
     * 綁定事件監聽器
     * 設定月份導航按鈕的點擊事件
     */
    bindEvents() {
        // 上一個月按鈕事件
        document.getElementById('prevMonth').addEventListener('click', () => {
            // 將當前日期設定為上一個月
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            // 重新渲染日曆
            this.render();
            // 重新載入該月份的任務
            this.loadTasks();
        });

        // 下一個月按鈕事件
        document.getElementById('nextMonth').addEventListener('click', () => {
            // 將當前日期設定為下一個月
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            // 重新渲染日曆
            this.render();
            // 重新載入該月份的任務
            this.loadTasks();
        });
    }

    async loadTasks() {
        try {
            // 获取当前月份的任务
            const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
            const endOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0, 23, 59, 59);
            
            const startDate = this.formatDateTime(startOfMonth);
            const endDate = this.formatDateTime(endOfMonth);
            
            this.tasks = await window.taskAPI.getTasksInDateRange(startDate, endDate);
            this.updateCalendarWithTasks();
        } catch (error) {
            console.error('加载任务失败:', error);
        }
    }

    render() {
        this.updateMonthTitle();
        this.renderCalendarGrid();
    }

    updateMonthTitle() {
        const monthTitle = document.getElementById('currentMonth');
        monthTitle.textContent = `${this.currentDate.getFullYear()}年${this.monthNames[this.currentDate.getMonth()]}`;
    }

    renderCalendarGrid() {
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        // 渲染星期标题
        this.dayNames.forEach(day => {
            const headerCell = document.createElement('div');
            headerCell.className = 'calendar-cell calendar-header-cell';
            headerCell.textContent = day;
            calendarGrid.appendChild(headerCell);
        });

        // 获取月份信息
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // 渲染日期单元格
        const today = new Date();
        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);
            
            const cell = this.createDateCell(cellDate, month, today);
            calendarGrid.appendChild(cell);
        }
    }

    createDateCell(date, currentMonth, today) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        
        // 添加日期数字
        const dateNumber = document.createElement('div');
        dateNumber.className = 'date-number';
        dateNumber.textContent = date.getDate();
        cell.appendChild(dateNumber);

        // 添加任务指示器容器
        const taskIndicators = document.createElement('div');
        taskIndicators.className = 'task-indicators';
        cell.appendChild(taskIndicators);

        // 设置样式类
        if (date.getMonth() !== currentMonth) {
            cell.classList.add('other-month');
        }

        if (this.isSameDay(date, today)) {
            cell.classList.add('today');
        }

        // 添加点击事件
        cell.addEventListener('click', () => {
            this.selectDate(date);
        });

        // 存储日期数据
        cell.dataset.date = this.formatDate(date);

        return cell;
    }

    updateCalendarWithTasks() {
        // 清除现有的任务指示器
        document.querySelectorAll('.task-indicators').forEach(container => {
            container.innerHTML = '';
        });

        // 按日期分组任务
        const tasksByDate = this.groupTasksByDate(this.tasks);

        // 为每个日期添加任务指示器
        Object.keys(tasksByDate).forEach(dateStr => {
            const cell = document.querySelector(`[data-date="${dateStr}"]`);
            if (cell) {
                const tasks = tasksByDate[dateStr];
                cell.classList.add('has-tasks');
                
                const taskIndicators = cell.querySelector('.task-indicators');
                
                // 显示最多3个任务预览
                tasks.slice(0, 3).forEach(task => {
                    const preview = document.createElement('div');
                    preview.className = 'task-preview';
                    preview.textContent = task.title;
                    preview.style.backgroundColor = task.color || '#FFE4B5';
                    preview.title = `${task.title} - ${this.formatTime(task.startTime)}`;
                    taskIndicators.appendChild(preview);
                });

                // 如果有更多任务，显示数量
                if (tasks.length > 3) {
                    const moreIndicator = document.createElement('div');
                    moreIndicator.className = 'task-preview';
                    moreIndicator.textContent = `+${tasks.length - 3}`;
                    moreIndicator.style.backgroundColor = '#DDD';
                    taskIndicators.appendChild(moreIndicator);
                }
            }
        });
    }

    groupTasksByDate(tasks) {
        const grouped = {};
        tasks.forEach(task => {
            const date = new Date(task.startTime);
            const dateStr = this.formatDate(date);
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            grouped[dateStr].push(task);
        });
        return grouped;
    }

    selectDate(date) {
        // 移除之前选中的日期
        document.querySelectorAll('.calendar-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });

        // 选中新日期
        const dateStr = this.formatDate(date);
        const cell = document.querySelector(`[data-date="${dateStr}"]`);
        if (cell) {
            cell.classList.add('selected');
        }

        this.selectedDate = date;
        
        // 触发日期选择事件
        this.onDateSelected(date);
    }

    onDateSelected(date) {
        // 可以在这里添加日期选择后的处理逻辑
        console.log('选中日期:', date);
        
        // 显示该日期的任务
        this.showTasksForDate(date);
    }

    showTasksForDate(date) {
        const dateStr = this.formatDate(date);
        const tasksForDate = this.tasks.filter(task => {
            const taskDate = new Date(task.startTime);
            return this.formatDate(taskDate) === dateStr;
        });

        // 这里可以显示一个弹窗或侧边栏显示该日期的任务
        console.log(`${dateStr} 的任务:`, tasksForDate);
    }

    // 工具方法
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    formatDate(date) {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    }

    formatDateTime(date) {
        return this.formatDate(date) + ' ' + 
               String(date.getHours()).padStart(2, '0') + ':' + 
               String(date.getMinutes()).padStart(2, '0') + ':' + 
               String(date.getSeconds()).padStart(2, '0');
    }

    formatTime(dateTimeStr) {
        const date = new Date(dateTimeStr);
        return String(date.getHours()).padStart(2, '0') + ':' + 
               String(date.getMinutes()).padStart(2, '0');
    }

    // 获取当前显示的月份任务
    getCurrentMonthTasks() {
        return this.tasks;
    }

    // 刷新日历
    refresh() {
        this.render();
        this.loadTasks();
    }

    // 跳转到今天
    goToToday() {
        this.currentDate = new Date();
        this.render();
        this.loadTasks();
    }

    // 跳转到指定日期
    goToDate(date) {
        this.currentDate = new Date(date);
        this.render();
        this.loadTasks();
    }
}

// 添加选中日期的样式
const style = document.createElement('style');
style.textContent = `
    .calendar-cell.selected {
        background-color: var(--accent-yellow) !important;
        border: 2px solid var(--ink-blue) !important;
        transform: rotate(0deg) scale(1.05);
        z-index: 3;
    }
`;
document.head.appendChild(style);