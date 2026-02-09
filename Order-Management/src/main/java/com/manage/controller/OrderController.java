package com.manage.controller;

import com.manage.dto.*;
import com.manage.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(@RequestBody @jakarta.validation.Valid OrderRequest request) {
        String result = orderService.placeOrder(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public java.util.List<com.manage.model.Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/user/{userId}")
    public java.util.List<com.manage.model.Order> getOrdersByUser(@PathVariable Integer userId) {
        return orderService.getOrdersByUser(userId);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer id, @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus) {
        return ResponseEntity.ok(orderService.updateStatus(id, status, paymentStatus));
    }
}