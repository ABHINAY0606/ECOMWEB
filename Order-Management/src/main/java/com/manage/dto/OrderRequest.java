package com.manage.dto;

import java.util.List;
import lombok.Data;

@Data
public class OrderRequest {
	@jakarta.validation.constraints.NotNull(message = "User ID is required")
	private Integer userId;

	@jakarta.validation.constraints.NotEmpty(message = "Order items cannot be empty")
	@jakarta.validation.Valid
	private List<OrderItemRequest> items;

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public List<OrderItemRequest> getItems() {
		return items;
	}

	public void setItems(List<OrderItemRequest> items) {
		this.items = items;
	}

}
