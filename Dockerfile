# 使用OpenJDK 17作為基礎鏡像
FROM openjdk:17-jdk-slim

# 設置工作目錄
WORKDIR /app

# 複製Maven配置文件
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# 複製源代碼
COPY src src

# 構建應用
RUN ./mvnw clean package -DskipTests

# 創建運行時目錄
RUN mkdir -p /app/runtime

# 複製JAR文件到運行時目錄
RUN cp target/*.jar /app/runtime/app.jar

# 設置環境變量
ENV SPRING_PROFILES_ACTIVE=production
ENV SERVER_PORT=8080

# 暴露端口
EXPOSE 8080

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# 啟動應用
CMD ["java", "-jar", "/app/runtime/app.jar"]
