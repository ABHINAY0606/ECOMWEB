 package com.manage.dto;

public class UserDTO {
    private Integer user_id;
    private String username;
    private String email;
    private String role;

    // Standard Default Constructor
    public UserDTO() {}

    // Manual All-Args Constructor to fix the "Undefined" error
    public UserDTO(Integer user_id, String username, String email, String role) {
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public Integer getUser_id() { return user_id; }
    public void setUser_id(Integer user_id) { this.user_id = user_id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}