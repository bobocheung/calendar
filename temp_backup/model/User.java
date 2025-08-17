package com.taskmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用戶實體類別
 * 
 * 功能說明：
 * - 定義用戶的資料結構和屬性
 * - 提供JPA實體映射到資料庫表格
 * - 包含用戶的認證和個人資訊
 * - 支援JSON序列化和反序列化
 * 
 * 資料庫設計：
 * - 表格名稱：users
 * - 主鍵：id（自動遞增）
 * - 唯一索引：email, username
 * 
 * 業務規則：
 * - 用戶名和郵箱為必填欄位
 * - 郵箱必須唯一
 * - 用戶名必須唯一
 * - 密碼加密存儲
 * 
 * @author Augment Agent
 * @version 1.0.0
 * @since 2025-08-17
 */
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "username")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "用戶名不能為空")
    @Size(min = 3, max = 50, message = "用戶名長度必須在3-50個字符之間")
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @NotBlank(message = "郵箱不能為空")
    @Email(message = "郵箱格式不正確")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "密碼不能為空")
    @Size(min = 6, message = "密碼長度至少6個字符")
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(length = 100)
    private String displayName;

    @Column(length = 500)
    private String avatar;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(length = 20)
    private String timezone = "Asia/Taipei";

    @Column(length = 10)
    private String language = "zh-TW";

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastLoginAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // 關聯關係
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Task> tasks;

    public enum UserRole {
        USER, ADMIN, MODERATOR
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED, DELETED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    // 業務方法
    public boolean isActive() {
        return UserStatus.ACTIVE.equals(this.status);
    }

    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }

    public String getDisplayNameOrUsername() {
        return displayName != null && !displayName.trim().isEmpty() ? displayName : username;
    }
}
