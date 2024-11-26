package com.orebi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication(scanBasePackages = "com.orebi")
@EnableJpaRepositories(basePackages = "com.orebi.repository")
@EntityScan(basePackages = "com.orebi.entity")
@EnableTransactionManagement
public class OrebiApplication {
	public static void main(String[] args) {
		SpringApplication.run(OrebiApplication.class, args);
	}
}
