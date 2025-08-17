#!/bin/bash

# 設置環境變量
export SPRING_PROFILES_ACTIVE=production
export PORT=${PORT:-8080}

# 直接啟動應用
java -jar target/calendar-task-system-1.0.0.jar
