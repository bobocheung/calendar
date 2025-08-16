package api;

import com.taskmanager.CalendarTaskSystemApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ApiHandler {

    private static ConfigurableApplicationContext context;
    private static boolean isInitialized = false;

    @RequestMapping(value = "/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
    public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!isInitialized) {
            initializeApplication();
        }
        
        // 轉發請求到Spring Boot應用
        forwardRequest(request, response);
    }

    private synchronized void initializeApplication() {
        if (!isInitialized) {
            try {
                System.out.println("🚀 初始化Spring Boot應用...");
                
                // 設置必要的系統屬性
                System.setProperty("server.port", System.getenv("PORT") != null ? System.getenv("PORT") : "8080");
                System.setProperty("spring.profiles.active", "production");
                
                // 啟動Spring Boot應用
                context = SpringApplication.run(CalendarTaskSystemApplication.class);
                isInitialized = true;
                
                System.out.println("✅ Spring Boot應用初始化完成！");
            } catch (Exception e) {
                System.err.println("❌ Spring Boot應用初始化失敗: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("應用初始化失敗", e);
            }
        }
    }

    private void forwardRequest(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 這裡應該實現請求轉發邏輯
            // 由於Vercel的限制，我們需要一個更簡單的方法
            
            // 暫時返回一個響應，表示API正在工作
            response.setContentType("application/json");
            response.setStatus(200);
            response.getWriter().write("{\"message\":\"API正在運行\",\"status\":\"running\"}");
            
        } catch (Exception e) {
            try {
                response.setStatus(500);
                response.getWriter().write("{\"error\":\"內部服務器錯誤\"}");
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
        }
    }

    @GetMapping("/health")
    public String health() {
        return "{\"status\":\"healthy\",\"message\":\"API服務正常運行\"}";
    }
}
