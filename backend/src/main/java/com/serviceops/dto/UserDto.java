package com.serviceops.dto;

import com.serviceops.entity.Role;

public record UserDto(
    String id,
    String name,
    String email,
    Role role,
    String department,
    String team,
    String phone,
    String avatarUrl
) {}
