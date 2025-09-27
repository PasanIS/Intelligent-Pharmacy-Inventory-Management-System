package com.ipims.backend.security.services;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ipims.backend.model.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

// This class implements the core Spring Security interface
public class UserDetailsImpl implements UserDetails {

    @Getter
    private final Long id;
    private final String email;
    @Getter
    private final String fullName;

    @JsonIgnore
    private final String password;

    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String email, String fullName, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.authorities = authorities;
    }

    // Static factory method to build UserDetailsImpl from User entity
    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = List.of();

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPassword(),
                authorities);
    }

    // --- Core UserDetails Interface Implementations ---

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Standard equals/hashCode based on ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
