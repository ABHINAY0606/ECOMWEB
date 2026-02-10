export interface Product {
  product_id: number;
  name: string;
  price: number;
  stock_quantity: number;
  description?: string;
  imageUrl?: string;
}
