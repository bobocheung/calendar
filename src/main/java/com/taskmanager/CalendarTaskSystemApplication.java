package com.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 手繪風格任務管理系統主應用程式類別
 * 
 * 功能說明：
 * - Spring Boot應用程式的入口點
 * - 自動配置Spring Boot相關組件
 * - 啟動內嵌的Web伺服器
 * - 初始化應用程式上下文
 * 
 * 系統特色：
 * - 手繪風格UI設計，營造溫暖親切的用戶體驗
 * - 完整的任務管理功能（CRUD操作）
 * - 日曆檢視整合，直觀顯示任務安排
 * - RESTful API設計，支援前後端分離
 * - 響應式設計，適配多種設備
 * 
 * 技術架構：
 * - Spring Boot 3.2.0 - 企業級Java框架
 * - Spring Data JPA - 資料持久化
 * - H2 Database - 內存資料庫（開發環境）
 * - Maven - 專案管理工具
 * 
 * @author Augment Agent
 * @version 1.0.0
 * @since 2024-01-15
 */
@SpringBootApplication
public class CalendarTaskSystemApplication {
    
    /**
     * 應用程式主入口方法
     * 
     * @param args 命令列參數
     */
    public static void main(String[] args) {
        // 啟動Spring Boot應用程式
        SpringApplication.run(CalendarTaskSystemApplication.class, args);
    }
}