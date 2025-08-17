package com.taskmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

/**
 * 任務實體類別
 * 
 * 功能說明：
 * - 定義任務的資料結構和屬性
 * - 提供JPA實體映射到資料庫表格
 * - 包含任務的完整生命週期管理
 * - 支援JSON序列化和反序列化
 * 
 * 資料庫設計：
 * - 表格名稱：tasks
 * - 主鍵：id（自動遞增）
 * - 索引：startTime, status, priority, category
 * 
 * 業務規則：
 * - 任務標題為必填欄位
 * - 開始時間為必填欄位
 * - 結束時間為可選欄位
 * - 支援全天任務設定
 * - 自動記錄創建和更新時間
 * 
 * @author Augment Agent
 * @version 1.0.0
 * @since 2024-01-15
 */
@Entity
@Table(name = "tasks")
public class Task {

        /**
     * 任務唯一識別碼
     * 資料庫主鍵，自動遞增
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 任務標題
     * 必填欄位，用於簡潔描述任務內容
     */
    @NotBlank(message = "任務標題不能為空")
    @Column(nullable = false)
    private String title;
    
    /**
     * 任務詳細描述
     * 可選欄位，提供任務的詳細說明
     */
    @Column(length = 1000)
    private String description;
    
    /**
     * 任務開始時間
     * 必填欄位，定義任務的開始時間點
     */
    @NotNull(message = "開始時間不能為空")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;
    
    /**
     * 任務結束時間
     * 可選欄位，定義任務的結束時間點
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
    
    /**
     * 任務優先級
     * 預設為中等優先級
     */
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;
    
    /**
     * 任務狀態
     * 預設為待處理狀態
     */
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
    
    /**
     * 任務分類
     * 可選欄位，用於任務分組管理
     */
    @Column(length = 50)
    private String category;
    
    /**
     * 任務顏色標識
     * 預設為手繪風格的米色，用於視覺區分
     */
    @Column(length = 20)
    private String color = "#FFE4B5";
    
    /**
     * 是否為全天任務
     * 全天任務不需要具體的開始和結束時間
     */
    private boolean isAllDay = false;
    
    /**
     * 重複類型
     * 定義任務的重複模式：無重複、每日、每週、每月、每年
     */
    @Enumerated(EnumType.STRING)
    private RepeatType repeatType = RepeatType.NONE;
    
    /**
     * 重複間隔
     * 重複的頻率，例如每1天、每2週等
     */
    private Integer repeatInterval = 1;
    
    /**
     * 重複結束日期
     * 重複任務的結束日期，null表示無限重複
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime repeatEndDate;
    
    /**
     * 原始任務ID
     * 用於標識重複任務的來源任務
     */
    private Long originalTaskId;

    /**
     * 任務所屬用戶
     * 用於多用戶系統的任務隔離
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    /**
     * 任務創建時間
     * 自動設定，記錄任務的創建時間點
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    /**
     * 任務最後更新時間
     * 自動更新，記錄任務的最後修改時間點
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }

    public enum RepeatType {
        NONE, DAILY, WEEKLY, MONTHLY, YEARLY
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
    public Task() {
    }

    public Task(String title, String description, LocalDateTime startTime) {
        this.title = title;
        this.description = description;
        this.startTime = startTime;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isAllDay() {
        return isAllDay;
    }

    public void setAllDay(boolean allDay) {
        isAllDay = allDay;
    }

    public RepeatType getRepeatType() {
        return repeatType;
    }

    public void setRepeatType(RepeatType repeatType) {
        this.repeatType = repeatType;
    }

    public Integer getRepeatInterval() {
        return repeatInterval;
    }

    public void setRepeatInterval(Integer repeatInterval) {
        this.repeatInterval = repeatInterval;
    }

    public LocalDateTime getRepeatEndDate() {
        return repeatEndDate;
    }

    public void setRepeatEndDate(LocalDateTime repeatEndDate) {
        this.repeatEndDate = repeatEndDate;
    }

    public Long getOriginalTaskId() {
        return originalTaskId;
    }

    public void setOriginalTaskId(Long originalTaskId) {
        this.originalTaskId = originalTaskId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
}