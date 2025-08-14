package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // 根据状态查询任务
    List<Task> findByStatus(Task.Status status);

    // 根据优先级查询任务
    List<Task> findByPriority(Task.Priority priority);

    // 根据分类查询任务
    List<Task> findByCategory(String category);

    // 查询指定时间范围内的任务
    @Query("SELECT t FROM Task t WHERE t.startTime >= :startDate AND t.startTime <= :endDate ORDER BY t.startTime")
    List<Task> findTasksInDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

        // 查询今天的任务
    @Query("SELECT t FROM Task t WHERE CAST(t.startTime AS date) = CURRENT_DATE ORDER BY t.startTime")
    List<Task> findTodayTasks();
    
    // 查询本周的任务
    @Query("SELECT t FROM Task t WHERE t.startTime >= :startOfWeek AND t.startTime <= :endOfWeek ORDER BY t.startTime")
    List<Task> findThisWeekTasks(@Param("startOfWeek") LocalDateTime startOfWeek, @Param("endOfWeek") LocalDateTime endOfWeek);
    
    // 查询本月的任务
    @Query("SELECT t FROM Task t WHERE t.startTime >= :startOfMonth AND t.startTime <= :endOfMonth ORDER BY t.startTime")
    List<Task> findThisMonthTasks(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);

    // 根据标题模糊查询
    List<Task> findByTitleContainingIgnoreCase(String title);

    // 查询即将到期的任务（未来24小时内）
    @Query("SELECT t FROM Task t WHERE t.startTime BETWEEN CURRENT_TIMESTAMP AND :tomorrow AND t.status != 'COMPLETED' ORDER BY t.startTime")
    List<Task> findUpcomingTasks(@Param("tomorrow") LocalDateTime tomorrow);

    // 查询过期未完成的任务
    @Query("SELECT t FROM Task t WHERE t.endTime < CURRENT_TIMESTAMP AND t.status != 'COMPLETED' AND t.status != 'CANCELLED' ORDER BY t.endTime")
    List<Task> findOverdueTasks();
}