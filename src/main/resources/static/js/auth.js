/**
 * 認證系統 JavaScript
 * 處理登入和註冊功能
 */

class AuthManager {
    constructor() {
        this.currentForm = 'login';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // 表單切換
        document.getElementById('showRegisterLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('register');
        });

        document.getElementById('showLoginLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });

        // 登入表單提交
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // 註冊表單提交
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // 密碼切換按鈕
        this.bindPasswordToggles();

        // 實時驗證
        this.bindRealTimeValidation();
    }

    bindPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.closest('.input-group').querySelector('input');
                const icon = e.target.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    bindRealTimeValidation() {
        // 用戶名驗證
        const usernameInput = document.getElementById('registerUsername');
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => this.validateUsername());
            usernameInput.addEventListener('input', () => this.clearFeedback('usernameFeedback'));
        }

        // 郵箱驗證
        const emailInput = document.getElementById('registerEmail');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
            emailInput.addEventListener('input', () => this.clearFeedback('emailFeedback'));
        }

        // 密碼驗證
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('registerConfirmPassword');
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword());
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => this.validatePassword());
        }
    }

    showForm(formType) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (formType === 'register') {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            this.currentForm = 'register';
        } else {
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            this.currentForm = 'login';
        }
    }

    async handleLogin() {
        const form = document.getElementById('loginFormElement');
        const formData = new FormData(form);
        
        const loginData = {
            usernameOrEmail: formData.get('usernameOrEmail'),
            password: formData.get('password'),
            rememberMe: formData.get('rememberMe') === 'on'
        };

        try {
            this.showLoading(true);
            
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('登入成功！正在跳轉...', 'success');
                
                // 保存用戶信息到 localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('isLoggedIn', 'true');
                
                // 延遲跳轉到主頁
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1500);
            } else {
                this.showMessage(result.error || '登入失敗，請檢查用戶名和密碼', 'error');
            }
        } catch (error) {
            console.error('登入錯誤:', error);
            this.showMessage('網絡錯誤，請稍後再試', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegister() {
        const form = document.getElementById('registerFormElement');
        const formData = new FormData(form);
        
        // 驗證密碼
        if (!this.validatePassword()) {
            return;
        }

        const registerData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            displayName: formData.get('displayName') || formData.get('username')
        };

        try {
            this.showLoading(true);
            
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('註冊成功！請登入您的帳戶', 'success');
                
                // 清空表單
                form.reset();
                
                // 切換到登入表單
                setTimeout(() => {
                    this.showForm('login');
                }, 2000);
            } else {
                this.showMessage(result.error || '註冊失敗，請稍後再試', 'error');
            }
        } catch (error) {
            console.error('註冊錯誤:', error);
            this.showMessage('網絡錯誤，請稍後再試', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    validateUsername() {
        const username = document.getElementById('registerUsername').value;
        const feedback = document.getElementById('usernameFeedback');
        
        if (username.length < 3) {
            this.showInputFeedback('usernameFeedback', '用戶名至少需要3個字符', 'error');
            return false;
        }
        
        if (username.length > 50) {
            this.showInputFeedback('usernameFeedback', '用戶名不能超過50個字符', 'error');
            return false;
        }
        
        // 檢查用戶名是否可用
        this.checkUsernameAvailability(username);
        return true;
    }

    validateEmail() {
        const email = document.getElementById('registerEmail').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showInputFeedback('emailFeedback', '請輸入有效的郵箱地址', 'error');
            return false;
        }
        
        // 檢查郵箱是否可用
        this.checkEmailAvailability(email);
        return true;
    }

    validatePassword() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const feedback = document.getElementById('passwordFeedback');
        
        if (password.length < 6) {
            this.showInputFeedback('passwordFeedback', '密碼至少需要6個字符', 'error');
            return false;
        }
        
        if (confirmPassword && password !== confirmPassword) {
            this.showInputFeedback('passwordFeedback', '兩次輸入的密碼不一致', 'error');
            return false;
        }
        
        if (confirmPassword && password === confirmPassword) {
            this.showInputFeedback('passwordFeedback', '密碼匹配', 'success');
        }
        
        return true;
    }

    async checkUsernameAvailability(username) {
        try {
            const response = await fetch(`/api/users/check-username/${username}`);
            const result = await response.json();
            
            if (result.available) {
                this.showInputFeedback('usernameFeedback', '用戶名可用', 'success');
            } else {
                this.showInputFeedback('usernameFeedback', '用戶名已被使用', 'error');
            }
        } catch (error) {
            console.error('檢查用戶名可用性錯誤:', error);
        }
    }

    async checkEmailAvailability(email) {
        try {
            const response = await fetch(`/api/users/check-email/${email}`);
            const result = await response.json();
            
            if (result.available) {
                this.showInputFeedback('emailFeedback', '郵箱可用', 'success');
            } else {
                this.showInputFeedback('emailFeedback', '郵箱已被使用', 'error');
            }
        } catch (error) {
            console.error('檢查郵箱可用性錯誤:', error);
        }
    }

    showInputFeedback(elementId, message, type) {
        const feedback = document.getElementById(elementId);
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `input-feedback ${type}`;
        }
    }

    clearFeedback(elementId) {
        const feedback = document.getElementById(elementId);
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'input-feedback';
        }
    }

    showMessage(message, type) {
        // 移除現有消息
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 創建新消息
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 
                        type === 'error' ? 'fas fa-exclamation-circle' : 
                        'fas fa-info-circle';
        
        const text = document.createElement('span');
        text.textContent = message;
        
        messageDiv.appendChild(icon);
        messageDiv.appendChild(text);

        // 插入到表單容器頂部
        const formContainer = document.querySelector('.auth-form-container');
        formContainer.insertBefore(messageDiv, formContainer.firstChild);

        // 自動移除消息
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !show);
        }
    }

    checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // 如果已登入，跳轉到主頁
            window.location.href = '/index.html';
        }
    }
}

// 初始化認證管理器
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
