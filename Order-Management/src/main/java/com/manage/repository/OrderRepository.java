package com.manage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.manage.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {

}