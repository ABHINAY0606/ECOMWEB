import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../models/order-item.model';

@Injectable({ providedIn: 'root' })
export class OrderItemService {
  private apiUrl = 'http://ecom-app-mm743.eastus.azurecontainer.io:8080/api/order-items';

  constructor(private http: HttpClient) { }

  getAllOrderItems(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.apiUrl);
  }

  getOrdersByUser(userId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}/user/${userId}`);
  }

  addOrderItem(orderItem: any): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.apiUrl, orderItem);
  }
}
