package com.ipims.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IpimsApplication {
    public static void main(String[] args) {
        SpringApplication.run(IpimsApplication.class, args);
        System.out.println("IPIMS Application Started Successfully");
    }
}