package com.taskmanager.controller;

import com.taskmanager.model.Task;
import com.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    // 获取所有任务
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    
    // 根据ID获取任务
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    // 创建新任务
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }
    
    // 更新任务
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(id, taskDetails);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }
    
    // 删除任务
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // 根据状态获取任务
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable Task.Status status) {
        List<Task> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }
    
    // 根据优先级获取任务
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable Task.Priority priority) {
        List<Task> tasks = taskService.getTasksByPriority(priority);
        return ResponseEntity.ok(tasks);
    }
    
    // 根据分类获取任务
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Task>> getTasksByCategory(@PathVariable String category) {
        List<Task> tasks = taskService.getTasksByCategory(category);
        return ResponseEntity.ok(tasks);
    }
    
    // 获取指定日期范围内的任务
    @GetMapping("/date-range")
    public ResponseEntity<List<Task>> getTasksInDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            List<Task> tasks = taskService.getTasksInDateRange(start, end);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 获取今天的任务
    @GetMapping("/today")
    public ResponseEntity<List<Task>> getTodayTasks() {
        List<Task> tasks = taskService.getTodayTasks();
        return ResponseEntity.ok(tasks);
    }
    
    // 获取本周的任务
    @GetMapping("/this-week")
    public ResponseEntity<List<Task>> getThisWeekTasks() {
        List<Task> tasks = taskService.getThisWeekTasks();
        return ResponseEntity.ok(tasks);
    }
    
    // 获取本月的任务
    @GetMapping("/this-month")
    public ResponseEntity<List<Task>> getThisMonthTasks() {
        List<Task> tasks = taskService.getThisMonthTasks();
        return ResponseEntity.ok(tasks);
    }
    
    // 搜索任务
    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(@RequestParam String keyword) {
        List<Task> tasks = taskService.searchTasks(keyword);
        return ResponseEntity.ok(tasks);
    }
    
    // 获取即将到期的任务
    @GetMapping("/upcoming")
    public ResponseEntity<List<Task>> getUpcomingTasks() {
        List<Task> tasks = taskService.getUpcomingTasks();
        return ResponseEntity.ok(tasks);
    }
    
    // 获取过期任务
    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        List<Task> tasks = taskService.getOverdueTasks();
        return ResponseEntity.ok(tasks);
    }
    
    // 标记任务为完成
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Task> markTaskAsCompleted(@PathVariable Long id) {
        Task updatedTask = taskService.markTaskAsCompleted(id);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }
    
    // 更新任务状态
    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @RequestBody Task.Status status) {
        Task updatedTask = taskService.updateTaskStatus(id, status);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }
}