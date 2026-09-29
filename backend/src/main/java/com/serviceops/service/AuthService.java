package com.serviceops.service;

import com.serviceops.dto.AuthRequest;
import com.serviceops.dto.AuthResponse;
import com.serviceops.dto.UserDto;
import com.serviceops.entity.User;
import com.serviceops.exception.UnauthorizedException;
import com.serviceops.mapper.IncidentMapper;
import com.serviceops.repository.UserRepository;
import com.serviceops.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password credentials."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password credentials.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        UserDto userDto = IncidentMapper.toUserDto(user);

        return new AuthResponse(token, tokenProvider.getExpirationMs(), userDto);
    }
}
