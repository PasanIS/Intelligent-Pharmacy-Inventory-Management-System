package com.ipims.backend.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        // Configuration to skip mapping null values and IDs when converting DTO to new Entity
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        return modelMapper;
    }
}
