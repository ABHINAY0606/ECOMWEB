package com.manage.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
	@jakarta.validation.constraints.NotNull(message = "Product ID is required")
	private Integer productId;

	@jakarta.validation.constraints.Min(value = 1, message = "Quantity must be at least 1")
	private Integer quantity;

	public Integer getProductId() {
		return productId;
	}

	public void setProductId(Integer productId) {
		this.productId = productId;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

}
