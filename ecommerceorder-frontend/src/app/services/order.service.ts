import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://ecom-app-mm743.eastus.azurecontainer.io:8080/api/orders';

  constructor(private http: HttpClient) { }

  placeOrder(orderRequest: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/place`, orderRequest, { responseType: 'text' });
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOrdersByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateOrderStatus(orderId: number, status?: string, paymentStatus?: string): Observable<any> {
    let params = `?`;
    if (status) params += `status=${status}&`;
    if (paymentStatus) params += `paymentStatus=${paymentStatus}`;

    // Remove trailing & if strictly needed (though usually fine)
    if (params.endsWith('&')) params = params.slice(0, -1);

    return this.http.put(`${this.apiUrl}/update/${orderId}${params}`, {});
  }
}
