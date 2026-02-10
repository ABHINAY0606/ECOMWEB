import { User } from './user.model';

export interface Order {
  order_id: number;
  user: User;
  status: string;          // PLACED / SHIPPED / DELIVERED
  payment_status: string;  // PENDING / COMPLETED
  total_amount: number;
  order_date: string;      // ISO timestamp
  orderItems: any[];       // List of OrderItem
}
