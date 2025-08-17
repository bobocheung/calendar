# 使用 OpenJDK 17 作為基礎鏡像
FROM openjdk:17-jdk-slim

WORKDIR /app

# 複製 JAR 文件
COPY target/calendar-task-system-1.0.0.jar app.jar

# 暴露端口
EXPOSE 8080

# 設置環境變量
ENV SPRING_PROFILES_ACTIVE=production
ENV PORT=8080

# 啟動應用
CMD ["java", "-jar", "app.jar"]
