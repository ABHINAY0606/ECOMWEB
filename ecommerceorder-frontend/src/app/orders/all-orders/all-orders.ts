import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-orders.html',
  styleUrls: ['./all-orders.css']
})
export class AllOrders {
  allOrders: any[] = [];

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(data => {
      this.allOrders = data;
      this.cdr.detectChanges();
    });
  }
}
