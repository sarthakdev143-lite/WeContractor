package github.sarthakdev.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CorsProperties {

    @Value("${allowed.origins}")
    private String allowedOrigins;

    @Bean
    public String getAllowedOrigins() {
        return allowedOrigins;
    }
}
