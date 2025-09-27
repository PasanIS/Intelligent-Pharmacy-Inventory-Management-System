package com.ipims.backend.repository;

import com.ipims.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Used during login/signup to check for existence
    Optional<User> findByEmail(String email);

    // Used during signup to prevent duplicate emails
    Boolean existsByEmail(String email);
}
