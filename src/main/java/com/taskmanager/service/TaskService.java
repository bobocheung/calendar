package com.taskmanager.service;

import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    // 创建任务
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }
    
    // 获取所有任务
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    // 根据ID获取任务
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    // 更新任务
    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setStartTime(taskDetails.getStartTime());
            task.setEndTime(taskDetails.getEndTime());
            task.setPriority(taskDetails.getPriority());
            task.setStatus(taskDetails.getStatus());
            task.setCategory(taskDetails.getCategory());
            task.setColor(taskDetails.getColor());
            task.setAllDay(taskDetails.isAllDay());
            return taskRepository.save(task);
        }
        return null;
    }
    
    // 删除任务
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // 根据状态获取任务
    public List<Task> getTasksByStatus(Task.Status status) {
        return taskRepository.findByStatus(status);
    }
    
    // 根据优先级获取任务
    public List<Task> getTasksByPriority(Task.Priority priority) {
        return taskRepository.findByPriority(priority);
    }
    
    // 根据分类获取任务
    public List<Task> getTasksByCategory(String category) {
        return taskRepository.findByCategory(category);
    }
    
    // 获取指定日期范围内的任务
    public List<Task> getTasksInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return taskRepository.findTasksInDateRange(startDate, endDate);
    }
    
    // 获取今天的任务
    public List<Task> getTodayTasks() {
        return taskRepository.findTodayTasks();
    }
    
    // 获取本周的任务
    public List<Task> getThisWeekTasks() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(java.time.DayOfWeek.MONDAY).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfWeek = startOfWeek.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        return taskRepository.findThisWeekTasks(startOfWeek, endOfWeek);
    }
    
    // 获取本月的任务
    public List<Task> getThisMonthTasks() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusDays(1).withHour(23).withMinute(59).withSecond(59);
        return taskRepository.findThisMonthTasks(startOfMonth, endOfMonth);
    }
    
    // 搜索任务
    public List<Task> searchTasks(String keyword) {
        return taskRepository.findByTitleContainingIgnoreCase(keyword);
    }
    
    // 获取即将到期的任务
    public List<Task> getUpcomingTasks() {
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        return taskRepository.findUpcomingTasks(tomorrow);
    }
    
    // 获取过期任务
    public List<Task> getOverdueTasks() {
        return taskRepository.findOverdueTasks();
    }
    
    // 标记任务为完成
    public Task markTaskAsCompleted(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus(Task.Status.COMPLETED);
            return taskRepository.save(task);
        }
        return null;
    }
    
    // 更新任务状态
    public Task updateTaskStatus(Long id, Task.Status status) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus(status);
            return taskRepository.save(task);
        }
        return null;
    }
}