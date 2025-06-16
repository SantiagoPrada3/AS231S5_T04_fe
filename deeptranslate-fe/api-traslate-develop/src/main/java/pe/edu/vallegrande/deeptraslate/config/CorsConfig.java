package pe.edu.vallegrande.deeptraslate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        // Permitir localhost para desarrollo local
        corsConfig.addAllowedOrigin("http://localhost:4200");
        // Permitir el dominio de Cloud Workstations
        corsConfig.addAllowedOrigin("https://8080-firebase-angular-translate-1749170023834.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev");
        // Permitir cualquier subdominio de cloudworkstations.dev
        corsConfig.addAllowedOriginPattern("https://*.cloudworkstations.dev");
        // Permitir todos los métodos HTTP
        corsConfig.addAllowedMethod("*");
        // Permitir todos los headers
        corsConfig.addAllowedHeader("*");
        // Permitir credenciales
        corsConfig.setAllowCredentials(true);
        // Permitir exponer headers
        corsConfig.addExposedHeader("*");
        // Establecer el tiempo máximo de caché para las respuestas preflight
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
