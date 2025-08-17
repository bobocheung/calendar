package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * 用戶登入DTO
 * 用於接收用戶登入請求的數據
 */
public class UserLoginDto {

    @NotBlank(message = "用戶名或郵箱不能為空")
    private String usernameOrEmail;

    @NotBlank(message = "密碼不能為空")
    private String password;

    private boolean rememberMe = false;

    // Constructors
    public UserLoginDto() {
    }

    public UserLoginDto(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    public UserLoginDto(String usernameOrEmail, String password, boolean rememberMe) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
        this.rememberMe = rememberMe;
    }

    // Getters and Setters
    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(boolean rememberMe) {
        this.rememberMe = rememberMe;
    }
}
