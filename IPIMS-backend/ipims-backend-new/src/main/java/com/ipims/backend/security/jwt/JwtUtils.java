package com.ipims.backend.security.jwt;

import com.ipims.backend.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${ipims.app.jwtSecret}")
    private String jwtSecret;

    @Value("${ipims.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getEmailFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .setSigningKey(key())
                    .build()
                    .parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            // Log Malformed JWT exception
        } catch (ExpiredJwtException e) {
            // Log Expired JWT exception
        } catch (UnsupportedJwtException e) {
            // Log Unsupported JWT exception
        } catch (IllegalArgumentException e) {
            // Log JWT claims string is empty
        }
        return false;
    }
}
