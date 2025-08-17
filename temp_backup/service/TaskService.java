package com.taskmanager.service;

import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

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
    
    /**
     * 創建重複任務
     * 根據重複類型和間隔創建多個重複的任務
     * 
     * @param originalTask 原始任務
     * @param repeatType 重複類型
     * @param repeatInterval 重複間隔
     * @param repeatEndDate 重複結束日期
     * @return 創建的任務列表
     */
    public List<Task> createRepeatingTasks(Task originalTask, Task.RepeatType repeatType, 
                                         Integer repeatInterval, LocalDateTime repeatEndDate) {
        List<Task> createdTasks = new ArrayList<>();
        
        if (repeatType == Task.RepeatType.NONE || repeatInterval <= 0) {
            return createdTasks;
        }
        
        LocalDateTime currentDate = originalTask.getStartTime();
        LocalDateTime endDate = repeatEndDate != null ? repeatEndDate : 
                               currentDate.plusYears(1); // 默認重複一年
        
        int taskCount = 0;
        int maxTasks = 1000; // 防止無限循環
        
        while (currentDate.isBefore(endDate) && taskCount < maxTasks) {
            if (taskCount > 0) { // 跳過第一個任務（原始任務）
                Task repeatingTask = new Task();
                repeatingTask.setTitle(originalTask.getTitle());
                repeatingTask.setDescription(originalTask.getDescription());
                repeatingTask.setStartTime(currentDate);
                repeatingTask.setEndTime(calculateEndTime(originalTask, currentDate));
                repeatingTask.setPriority(originalTask.getPriority());
                repeatingTask.setStatus(Task.Status.PENDING);
                repeatingTask.setCategory(originalTask.getCategory());
                repeatingTask.setColor(originalTask.getColor());
                repeatingTask.setAllDay(originalTask.isAllDay());
                repeatingTask.setRepeatType(Task.RepeatType.NONE); // 重複任務本身不再重複
                repeatingTask.setOriginalTaskId(originalTask.getId());
                
                createdTasks.add(taskRepository.save(repeatingTask));
            }
            
            // 計算下一個重複日期
            currentDate = calculateNextRepeatDate(currentDate, repeatType, repeatInterval);
            taskCount++;
        }
        
        return createdTasks;
    }
    
    /**
     * 計算重複任務的結束時間
     * 保持原始任務的持續時間
     */
    private LocalDateTime calculateEndTime(Task originalTask, LocalDateTime newStartTime) {
        if (originalTask.getEndTime() == null) {
            return null;
        }
        
        long durationInSeconds = java.time.Duration.between(
            originalTask.getStartTime(), 
            originalTask.getEndTime()
        ).getSeconds();
        
        return newStartTime.plusSeconds(durationInSeconds);
    }
    
    /**
     * 計算下一個重複日期
     * 根據重複類型和間隔計算
     */
    private LocalDateTime calculateNextRepeatDate(LocalDateTime currentDate, 
                                                Task.RepeatType repeatType, 
                                                Integer repeatInterval) {
        switch (repeatType) {
            case DAILY:
                return currentDate.plusDays(repeatInterval);
            case WEEKLY:
                return currentDate.plusWeeks(repeatInterval);
            case MONTHLY:
                return currentDate.plusMonths(repeatInterval);
            case YEARLY:
                return currentDate.plusYears(repeatInterval);
            default:
                return currentDate;
        }
    }
    
    /**
     * 獲取重複任務
     * 根據原始任務ID獲取所有相關的重複任務
     */
    public List<Task> getRepeatingTasks(Long originalTaskId) {
        return taskRepository.findByOriginalTaskId(originalTaskId);
    }
    
    /**
     * 刪除重複任務
     * 刪除指定原始任務的所有重複任務
     */
    public boolean deleteRepeatingTasks(Long originalTaskId) {
        List<Task> repeatingTasks = taskRepository.findByOriginalTaskId(originalTaskId);
        taskRepository.deleteAll(repeatingTasks);
        return true;
    }
}