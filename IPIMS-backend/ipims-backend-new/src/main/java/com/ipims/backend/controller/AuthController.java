package com.ipims.backend.controller;

import com.ipims.backend.dto.AuthResponse;
import com.ipims.backend.dto.LoginRequest;
import com.ipims.backend.dto.SignupRequest;
import com.ipims.backend.model.User;
import com.ipims.backend.security.jwt.JwtUtils;
import com.ipims.backend.security.services.UserDetailsImpl;
import com.ipims.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5175")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, AuthService authService, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFullName()
        ));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {

        try {
            User newUser = authService.registerUser(signupRequest);
            return ResponseEntity.ok("User registered successfully! ID: " + newUser.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
