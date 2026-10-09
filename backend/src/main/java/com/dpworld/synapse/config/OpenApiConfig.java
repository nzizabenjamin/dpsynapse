package com.dpworld.synapse.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("DP World Synapse - Kigali Operations & Logistics Intelligence API")
                        .version("1.0.0")
                        .description("Executive REST API and Operational Intelligence Engine for DP World Kigali Inland Dry Port (Masaka Hub). Provides macro KPI telemetry, warehouse utilization, customs tracking, corridor fleet logistics, and AI briefing orchestration.")
                        .contact(new Contact()
                                .name("DP World Kigali Technology & Operations")
                                .email("synapse.kigali@dpworld.com")
                                .url("https://www.dpworld.com/rwanda"))
                        .license(new License()
                                .name("Proprietary - DP World Logistics")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development Server")
                ));
    }
}
