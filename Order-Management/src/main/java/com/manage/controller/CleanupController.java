package com.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cleanup")
public class CleanupController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public String cleanup() {
        // Disable foreign key checks to avoid constraint issues during bulk delete
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0;");

        jdbcTemplate.execute("DELETE FROM order_items;");
        jdbcTemplate.execute("DELETE FROM orders;");
        jdbcTemplate.execute("DELETE FROM products;");
        jdbcTemplate.execute("DELETE FROM users WHERE username != 'admin' AND username != 'ADMIN';");

        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1;");

        return "Database cleaned up! (Admin preserved)";
    }
}
