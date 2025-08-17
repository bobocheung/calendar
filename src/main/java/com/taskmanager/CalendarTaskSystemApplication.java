package com.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.taskmanager.controller")
public class CalendarTaskSystemApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CalendarTaskSystemApplication.class, args);
    }
}