# 多階段構建 - 構建階段
FROM maven:latest AS build

WORKDIR /app

# 複製 pom.xml 和源代碼
COPY pom.xml .
COPY src ./src

# 構建應用
RUN mvn clean package -DskipTests

# 運行階段
FROM openjdk:17-jdk-slim

WORKDIR /app

# 從構建階段複製 JAR 文件
COPY --from=build /app/target/calendar-task-system-1.0.0.jar app.jar

# 暴露端口
EXPOSE 8080

# 設置環境變量
ENV SPRING_PROFILES_ACTIVE=production
ENV PORT=8080

# 啟動應用
CMD ["java", "-jar", "app.jar"]
