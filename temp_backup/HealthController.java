package com.taskmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {
    
    @GetMapping("/api/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"status\":\"healthy\",\"message\":\"Calendar Task System is running\"}");
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> simpleHealth() {
        return ResponseEntity.ok("ok");
    }
    
    @GetMapping("/")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("Calendar Task System is running");
    }
}
