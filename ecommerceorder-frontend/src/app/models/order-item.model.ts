import { Product } from './product.model';   // <-- add this line

export interface OrderItem {
  order_item_id: number;
  product: Product;
  quantity: number;
  order: {
    order_id: number;
    user: { user_id: number; username: string };
    status: string; // "PLACED" or "DELIVERED"
  };
}
