package com.ipims.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Matches the 'Email' from  UI
    @Column(unique = true, nullable = false)
    private String email;

    // Matches the 'Full Name' from  UI
    private String fullName;

    // Stores the BCrypt HASH, NOT the raw password
    @Column(nullable = false)
    private String password;
}