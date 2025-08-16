package com.taskmanager.service;

import com.taskmanager.model.User;
import com.taskmanager.dto.UserRegistrationDto;
import com.taskmanager.dto.UserLoginDto;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 用戶服務類
 * 處理用戶相關的業務邏輯
 */
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * 用戶註冊
     */
    public User registerUser(UserRegistrationDto registrationDto) {
        // 檢查用戶名是否已存在
        if (userRepository.findByUsername(registrationDto.getUsername()).isPresent()) {
            throw new RuntimeException("用戶名已存在");
        }

        // 檢查郵箱是否已存在
        if (userRepository.findByEmail(registrationDto.getEmail()).isPresent()) {
            throw new RuntimeException("郵箱已存在");
        }

        // 創建新用戶（暫時使用明文密碼，生產環境需要加密）
        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(registrationDto.getPassword()); // TODO: 生產環境需要加密
        user.setDisplayName(registrationDto.getDisplayName());
        user.setStatus(User.UserStatus.ACTIVE);
        user.setRole(User.UserRole.USER);

        return userRepository.save(user);
    }

    /**
     * 用戶登入
     */
    public Optional<User> loginUser(UserLoginDto loginDto) {
        // 根據用戶名或郵箱查找用戶
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(
            loginDto.getUsernameOrEmail()
        );

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // 檢查用戶狀態
            if (!user.isActive()) {
                return Optional.empty();
            }

            // 驗證密碼（暫時使用明文比較，生產環境需要加密）
            if (loginDto.getPassword().equals(user.getPassword())) {
                // 更新最後登入時間
                user.setLastLoginAt(LocalDateTime.now());
                userRepository.save(user);
                return userOpt;
            }
        }

        return Optional.empty();
    }

    /**
     * 根據ID查找用戶
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * 根據用戶名查找用戶
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * 根據郵箱查找用戶
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * 獲取所有用戶
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * 更新用戶資料
     */
    public User updateUser(Long userId, User userDetails) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用戶不存在"));

        // 更新允許修改的欄位
        if (userDetails.getDisplayName() != null) {
            user.setDisplayName(userDetails.getDisplayName());
        }
        if (userDetails.getAvatar() != null) {
            user.setAvatar(userDetails.getAvatar());
        }
        if (userDetails.getTimezone() != null) {
            user.setTimezone(userDetails.getTimezone());
        }
        if (userDetails.getLanguage() != null) {
            user.setLanguage(userDetails.getLanguage());
        }

        return userRepository.save(user);
    }

    /**
     * 刪除用戶
     */
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用戶不存在"));
        
        // 軟刪除：將狀態設為DELETED
        user.setStatus(User.UserStatus.DELETED);
        userRepository.save(user);
    }

    /**
     * 檢查用戶名是否可用
     */
    public boolean isUsernameAvailable(String username) {
        return !userRepository.findByUsername(username).isPresent();
    }

    /**
     * 檢查郵箱是否可用
     */
    public boolean isEmailAvailable(String email) {
        return !userRepository.findByEmail(email).isPresent();
    }

    /**
     * 獲取用戶統計信息
     */
    public long getUserCount() {
        return userRepository.count();
    }

    /**
     * 獲取活躍用戶數量
     */
    public long getActiveUserCount() {
        return userRepository.countByStatus(User.UserStatus.ACTIVE);
    }
}
