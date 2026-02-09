package com.manage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.manage.model.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    // JpaRepository gives us save(), findAll(), delete() for free!
}