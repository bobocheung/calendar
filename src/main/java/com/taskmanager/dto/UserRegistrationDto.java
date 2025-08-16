package com.taskmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 用戶註冊DTO
 * 用於接收用戶註冊請求的數據
 */
public class UserRegistrationDto {

    @NotBlank(message = "用戶名不能為空")
    @Size(min = 3, max = 50, message = "用戶名長度必須在3-50個字符之間")
    private String username;

    @NotBlank(message = "郵箱不能為空")
    @Email(message = "郵箱格式不正確")
    private String email;

    @NotBlank(message = "密碼不能為空")
    @Size(min = 6, message = "密碼長度至少6個字符")
    private String password;

    @Size(max = 100, message = "顯示名稱不能超過100個字符")
    private String displayName;

    // Constructors
    public UserRegistrationDto() {
    }

    public UserRegistrationDto(String username, String email, String password, String displayName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
