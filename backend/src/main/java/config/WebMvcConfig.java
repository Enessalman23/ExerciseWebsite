package config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final CurrentUserArgumentResolver currentUserArgumentResolver;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map the /gifs/** URL to the exercisedb_v1_sample directory
        registry.addResourceHandler("/gifs/**")
                .addResourceLocations("file:./exercisedb_v1_sample/");

        // Map the /exercise-images/** URL to the exercises-data/exercises directory
        Path exercisesPath = Paths.get("exercises-data", "exercises");
        String absolutePath = exercisesPath.toFile().getAbsolutePath();
        
        registry.addResourceHandler("/exercise-images/**")
                .addResourceLocations("file:///" + absolutePath + "/");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserArgumentResolver);
    }

    @Override
    public void addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry registry) {
        registry.addInterceptor(new RateLimitInterceptor());
    }
}
