package com.manage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer product_id;

	@jakarta.validation.constraints.NotBlank(message = "Product name is required")
	private String name;
	@jakarta.validation.constraints.NotNull(message = "Price is required")
	@jakarta.validation.constraints.Positive(message = "Price must be positive")
	private Double price;
	@jakarta.validation.constraints.Min(value = 0, message = "Stock quantity cannot be negative")
	private Integer stock_quantity;
	@Column(length = 1000)
	private String description;

	@Column(name = "image_url", length = 1000)
	private String imageUrl; // URL to the product image

	public Integer getProduct_id() {
		return product_id;
	}

	public void setProduct_id(Integer product_id) {
		this.product_id = product_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getStock_quantity() {
		return stock_quantity;
	}

	public void setStock_quantity(Integer stock_quantity) {
		this.stock_quantity = stock_quantity;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

}