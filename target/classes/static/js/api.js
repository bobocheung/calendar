/**
 * 任務API交互模組
 * 
 * 功能說明：
 * - 提供與後端REST API的完整交互功能
 * - 處理所有HTTP請求和響應
 * - 管理載入狀態和錯誤處理
 * - 顯示用戶友好的通知訊息
 * 
 * 設計模式：單例模式，全域只有一個API實例
 * 
 * @author Augment Agent
 * @version 1.0.0
 */
class TaskAPI {
    /**
     * 建構函數：初始化API設定
     */
    constructor() {
        // API基礎URL，所有請求都會以此為前綴
        this.baseURL = '/api/tasks';
        
        // HTTP請求標頭設定
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    /**
     * 顯示載入狀態覆蓋層
     * 用於長時間操作時給用戶視覺反饋
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    /**
     * 隱藏載入狀態覆蓋層
     * 操作完成後移除載入提示
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    /**
     * 處理API響應
     * 統一處理HTTP響應，包含錯誤檢查和JSON解析
     * 
     * @param {Response} response - Fetch API返回的響應物件
     * @returns {Object|null} 解析後的JSON資料或null
     * @throws {Error} 當HTTP狀態碼表示錯誤時拋出異常
     */
    async handleResponse(response) {
        // 檢查HTTP狀態碼是否表示成功
        if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
                // 嘗試解析JSON錯誤信息
                const errorJson = JSON.parse(errorText);
                if (errorJson.message) {
                    errorText = errorJson.message;
                } else if (errorJson.error) {
                    errorText = errorJson.error;
                }
            } catch (e) {
                // 如果不是JSON格式，使用原始文本
                errorText = errorText || `HTTP ${response.status}`;
            }
            
            // 根據HTTP狀態碼提供用戶友好的錯誤信息
            let userMessage = '';
            switch (response.status) {
                case 400:
                    userMessage = '請求資料格式錯誤：' + errorText;
                    break;
                case 401:
                    userMessage = '未授權訪問，請重新登入';
                    break;
                case 403:
                    userMessage = '權限不足，無法執行此操作';
                    break;
                case 404:
                    userMessage = '請求的資源不存在';
                    break;
                case 500:
                    userMessage = '伺服器內部錯誤，請稍後再試';
                    break;
                default:
                    userMessage = `請求失敗 (${response.status}): ${errorText}`;
            }
            
            throw new Error(userMessage);
        }
        
        // 檢查響應內容類型是否為JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return null;
    }

    /**
     * 獲取所有任務
     * 從後端API獲取完整的任務列表
     * 
     * @returns {Array} 任務陣列，失敗時返回空陣列
     */
    async getAllTasks() {
        try {
            // 顯示載入狀態
            this.showLoading();
            
            // 發送GET請求獲取所有任務
            const response = await fetch(this.baseURL, {
                method: 'GET',
                headers: this.headers
            });
            
            // 處理響應並返回資料
            return await this.handleResponse(response);
        } catch (error) {
            // 錯誤處理：記錄錯誤並顯示用戶友好訊息
            console.error('獲取任務失敗:', error);
            this.showError('獲取任務失敗: ' + error.message);
            return [];
        } finally {
            // 無論成功或失敗都要隱藏載入狀態
            this.hideLoading();
        }
    }

    /**
     * 根據ID獲取特定任務
     * 用於獲取單一任務的詳細資訊
     * 
     * @param {number} id - 任務的唯一識別碼
     * @returns {Object|null} 任務物件或null（如果失敗）
     */
    async getTaskById(id) {
        try {
            // 發送GET請求獲取特定任務
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            // 錯誤處理
            console.error('獲取任務詳情失敗:', error);
            this.showError('獲取任務詳情失敗: ' + error.message);
            return null;
        }
    }

    /**
     * 創建新任務
     * 將新任務資料發送到後端進行儲存
     * 
     * @param {Object} taskData - 包含任務資訊的物件
     * @param {string} taskData.title - 任務標題（必填）
     * @param {string} taskData.description - 任務描述
     * @param {string} taskData.startTime - 開始時間（ISO格式）
     * @param {string} taskData.endTime - 結束時間（ISO格式）
     * @param {string} taskData.priority - 優先級（LOW/MEDIUM/HIGH/URGENT）
     * @param {string} taskData.category - 分類
     * @param {string} taskData.color - 顏色代碼
     * @param {boolean} taskData.allDay - 是否為全天任務
     * @returns {Object|null} 創建成功的任務物件或null
     */
    async createTask(taskData) {
        try {
            // 顯示載入狀態
            this.showLoading();
            
            // 發送POST請求創建任務
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(taskData)
            });
            
            // 處理響應
            const result = await this.handleResponse(response);
            
            // 顯示成功訊息
            this.showSuccess('任務創建成功！');
            return result;
        } catch (error) {
            // 錯誤處理
            console.error('創建任務失敗:', error);
            this.showError('創建任務失敗: ' + error.message);
            return null;
        } finally {
            // 隱藏載入狀態
            this.hideLoading();
        }
    }

    // 更新任务
    async updateTask(id, taskData) {
        try {
            this.showLoading();
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(taskData)
            });
            const result = await this.handleResponse(response);
            this.showSuccess('任务更新成功！');
            return result;
        } catch (error) {
            console.error('更新任务失败:', error);
            this.showError('更新任务失败: ' + error.message);
            return null;
        } finally {
            this.hideLoading();
        }
    }

    // 删除任务
    async deleteTask(id) {
        try {
            this.showLoading();
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'DELETE',
                headers: this.headers
            });
            await this.handleResponse(response);
            this.showSuccess('任务删除成功！');
            return true;
        } catch (error) {
            console.error('删除任务失败:', error);
            this.showError('删除任务失败: ' + error.message);
            return false;
        } finally {
            this.hideLoading();
        }
    }

    // 根据状态获取任务
    async getTasksByStatus(status) {
        try {
            const response = await fetch(`${this.baseURL}/status/${status}`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取任务失败:', error);
            return [];
        }
    }

    // 根据优先级获取任务
    async getTasksByPriority(priority) {
        try {
            const response = await fetch(`${this.baseURL}/priority/${priority}`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取任务失败:', error);
            return [];
        }
    }

    // 根据分类获取任务
    async getTasksByCategory(category) {
        try {
            const response = await fetch(`${this.baseURL}/category/${category}`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取任务失败:', error);
            return [];
        }
    }

    // 获取指定日期范围内的任务
    async getTasksInDateRange(startDate, endDate) {
        try {
            const params = new URLSearchParams({
                startDate: startDate,
                endDate: endDate
            });
            const response = await fetch(`${this.baseURL}/date-range?${params}`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取日期范围任务失败:', error);
            return [];
        }
    }

    // 获取今天的任务
    async getTodayTasks() {
        try {
            const response = await fetch(`${this.baseURL}/today`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取今日任务失败:', error);
            return [];
        }
    }

    // 获取本周的任务
    async getThisWeekTasks() {
        try {
            const response = await fetch(`${this.baseURL}/this-week`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取本周任务失败:', error);
            return [];
        }
    }

    // 获取本月的任务
    async getThisMonthTasks() {
        try {
            const response = await fetch(`${this.baseURL}/this-month`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取本月任务失败:', error);
            return [];
        }
    }

    // 搜索任务
    async searchTasks(keyword) {
        try {
            const params = new URLSearchParams({ keyword });
            const response = await fetch(`${this.baseURL}/search?${params}`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('搜索任务失败:', error);
            return [];
        }
    }

    // 获取即将到期的任务
    async getUpcomingTasks() {
        try {
            const response = await fetch(`${this.baseURL}/upcoming`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取即将到期任务失败:', error);
            return [];
        }
    }

    // 获取过期任务
    async getOverdueTasks() {
        try {
            const response = await fetch(`${this.baseURL}/overdue`, {
                method: 'GET',
                headers: this.headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('获取过期任务失败:', error);
            return [];
        }
    }

    // 标记任务为完成
    async markTaskAsCompleted(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}/complete`, {
                method: 'PATCH',
                headers: this.headers
            });
            const result = await this.handleResponse(response);
            this.showSuccess('任务已标记为完成！');
            return result;
        } catch (error) {
            console.error('标记任务完成失败:', error);
            this.showError('标记任务完成失败: ' + error.message);
            return null;
        }
    }

    // 更新任务状态
    async updateTaskStatus(id, status) {
        try {
            const response = await fetch(`${this.baseURL}/${id}/status`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(status)
            });
            const result = await this.handleResponse(response);
            this.showSuccess('任务状态更新成功！');
            return result;
        } catch (error) {
            console.error('更新任务状态失败:', error);
            this.showError('更新任务状态失败: ' + error.message);
            return null;
        }
    }

    /**
     * 顯示成功訊息
     * 用於操作成功後的用戶反饋
     * 
     * @param {string} message - 要顯示的成功訊息
     */
    showSuccess(message) {
        // 創建成功提示元素
        const successDiv = document.createElement('div');
        successDiv.className = 'api-message success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
            <button class="close-message" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // 添加到頁面
        document.body.appendChild(successDiv);
        
        // 自動隱藏
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 5000);
    }

    /**
     * 顯示錯誤訊息
     * 用於操作失敗後的用戶反饋
     * 
     * @param {string} message - 要顯示的錯誤訊息
     */
    showError(message) {
        // 創建錯誤提示元素
        const errorDiv = document.createElement('div');
        errorDiv.className = 'api-message error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="close-message" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // 添加到頁面
        document.body.appendChild(errorDiv);
        
        // 自動隱藏
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 8000);
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background-color: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            border: 2px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            border-radius: 12px 15px 13px 16px / 13px 12px 17px 14px;
            padding: 16px;
            box-shadow: var(--sketch-shadow);
            transform: rotate(-0.5deg);
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            font-family: var(--body-font);
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 关闭按钮事件
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // 自动关闭
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // 添加动画样式
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%) rotate(-2deg);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0) rotate(-0.5deg);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0) rotate(-0.5deg);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%) rotate(-2deg);
                        opacity: 0;
                    }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color 0.3s ease;
                }
                .notification-close:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// 创建全局API实例
window.taskAPI = new TaskAPI();