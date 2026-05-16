package config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.TimeUnit;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    // Her bir IP/User için son 1 dakikadaki istek sayısını tutar
    private final Cache<String, Integer> requestCounts = Caffeine.newBuilder()
            .expireAfterWrite(1, TimeUnit.MINUTES)
            .build();

    private static final int MAX_REQUESTS_PER_MINUTE = 5; // AI uçları için dakikada max 5 istek

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();
        
        // Sadece AI endpoint'leri için rate limiting uygula
        if (uri.startsWith("/api/ai/")) {
            String clientIp = request.getRemoteAddr();
            // Eğer giriş yapmış kullanıcı varsa onun ID'sini almak daha mantıklı olabilir ama IP şimdilik yeterli.
            String username = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : clientIp;
            String key = "ai_limit_" + username;

            Integer requests = requestCounts.getIfPresent(key);
            if (requests == null) {
                requests = 0;
            }

            if (requests >= MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests. Please try again later.");
                return false;
            }

            requestCounts.put(key, requests + 1);
        }
        
        return true;
    }
}
