package com.taskmanager.controller;

import com.taskmanager.model.User;
import com.taskmanager.dto.UserRegistrationDto;
import com.taskmanager.dto.UserLoginDto;
import com.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * 用戶控制器
 * 處理用戶相關的HTTP請求
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 用戶註冊
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            User user = userService.registerUser(registrationDto);
            
            // 返回用戶信息（不包含密碼）
            Map<String, Object> response = new HashMap<>();
            response.put("message", "用戶註冊成功");
            response.put("user", user);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 用戶登入
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDto loginDto) {
        try {
            var userOpt = userService.loginUser(loginDto);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // 返回用戶信息（不包含密碼）
                Map<String, Object> response = new HashMap<>();
                response.put("message", "登入成功");
                response.put("user", user);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "用戶名/郵箱或密碼錯誤");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "登入失敗: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * 檢查用戶名是否可用
     */
    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsernameAvailability(@PathVariable String username) {
        boolean isAvailable = userService.isUsernameAvailable(username);
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("available", isAvailable);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 檢查郵箱是否可用
     */
    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailAvailability(@PathVariable String email) {
        boolean isAvailable = userService.isEmailAvailable(email);
        
        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("available", isAvailable);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 獲取用戶資料
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        var userOpt = userService.findById(id);
        
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "用戶不存在");
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 更新用戶資料
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 獲取用戶統計信息
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() {
        long totalUsers = userService.getUserCount();
        long activeUsers = userService.getActiveUserCount();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        
        return ResponseEntity.ok(stats);
    }
}
