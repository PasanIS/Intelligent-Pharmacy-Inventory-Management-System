package com.ipims.backend.service;

import com.ipims.backend.dto.LoginRequest;
import com.ipims.backend.dto.SignupRequest;
import com.ipims.backend.model.User;
import com.ipims.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final ModelMapper modelMapper;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;
    }

    public User registerUser(SignupRequest signupRequest) {

        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = modelMapper.map(signupRequest, User.class);

        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        return userRepository.save(user);
    }

    public User createUser(LoginRequest loginRequest) {
        String hashedPassword = passwordEncoder.encode(loginRequest.getPassword()); // <--- Must be here

        User newUser = new User();
        newUser.setEmail(loginRequest.getEmail());
        newUser.setPassword(hashedPassword); // Store the HASHED password
        newUser.setFullName("Default Name");

        return userRepository.save(newUser);
    }

}
