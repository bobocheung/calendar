-- 數據庫遷移腳本：添加重複任務功能
-- 執行日期：2024年8月16日
-- 版本：1.1.0

-- 為現有的 tasks 表添加重複任務相關字段

-- 1. 添加重複類型字段
ALTER TABLE tasks ADD COLUMN repeat_type VARCHAR(20) DEFAULT 'NONE' COMMENT '重複類型：NONE, DAILY, WEEKLY, MONTHLY, YEARLY';

-- 2. 添加重複間隔字段
ALTER TABLE tasks ADD COLUMN repeat_interval INT DEFAULT 1 COMMENT '重複間隔，例如每1天、每2週等';

-- 3. 添加重複結束日期字段
ALTER TABLE tasks ADD COLUMN repeat_end_date DATETIME NULL COMMENT '重複任務的結束日期，NULL表示無限重複';

-- 4. 添加原始任務ID字段
ALTER TABLE tasks ADD COLUMN original_task_id BIGINT NULL COMMENT '重複任務的來源任務ID';

-- 5. 為新字段添加索引以提高查詢性能
CREATE INDEX idx_tasks_repeat_type ON tasks(repeat_type);
CREATE INDEX idx_tasks_original_task_id ON tasks(original_task_id);
CREATE INDEX idx_tasks_repeat_end_date ON tasks(repeat_end_date);

-- 6. 添加外鍵約束（可選，用於數據完整性）
-- ALTER TABLE tasks ADD CONSTRAINT fk_tasks_original_task 
--     FOREIGN KEY (original_task_id) REFERENCES tasks(id) ON DELETE SET NULL;

-- 7. 更新現有任務的重複類型為 'NONE'
UPDATE tasks SET repeat_type = 'NONE' WHERE repeat_type IS NULL;

-- 8. 更新現有任務的重複間隔為 1
UPDATE tasks SET repeat_interval = 1 WHERE repeat_interval IS NULL;

-- 9. 驗證遷移結果
SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN repeat_type = 'NONE' THEN 1 END) as non_repeating_tasks,
    COUNT(CASE WHEN repeat_type != 'NONE' THEN 1 END) as repeating_tasks,
    COUNT(CASE WHEN original_task_id IS NOT NULL THEN 1 END) as child_repeating_tasks
FROM tasks;

-- 遷移完成提示
SELECT 'Database migration completed successfully!' as status;
