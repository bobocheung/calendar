package com.taskmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "*")
public class TestController {
    
    @GetMapping("/")
    public String root() {
        return "Calendar Task System is running!";
    }
    
    @GetMapping("/test")
    public String test() {
        return "Hello World!";
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
    
    @GetMapping("/health")
    public String health() {
        return "healthy";
    }
}
