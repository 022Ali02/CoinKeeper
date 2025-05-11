package org.example.coinkeeper;

import org.example.coinkeeper.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class CoinKeeperApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoinKeeperApplication.class, args);
    }
}