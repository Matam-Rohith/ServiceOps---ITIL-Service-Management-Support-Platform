package com.serviceops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * ServiceOps - Enterprise ITIL Service Management & Support Platform
 * Core Spring Boot 3 Application Bootstrapper
 */
@SpringBootApplication
@EnableScheduling
@EnableTransactionManagement
public class ServiceOpsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceOpsApplication.class, args);
    }
}
