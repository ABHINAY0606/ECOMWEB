package com.manage.controller;

import com.manage.model.OrderItem;
import com.manage.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    // 1. Get all items in the system (Admin only view)
    @GetMapping
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // 2. Get details for a specific Order (View Order Details)
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItem>> getItemsByOrderId(@PathVariable Integer orderId) {
        List<OrderItem> items = orderItemRepository.findAll().stream()
                .filter(item -> item.getOrder().getOrder_id().equals(orderId))
                .collect(Collectors.toList());
        
        return items.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(items);
    }

    // 3. Get a single item detail by its specific ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderItemById(@PathVariable Integer id) {
        return orderItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}