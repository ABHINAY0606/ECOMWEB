import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Added for input if needed, though not strictly used in loop
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard {
  role: string = 'USER';
  activeSection: string = 'welcome'; // 'welcome', 'products', 'cart', 'orders'
  username: string = '';
  products: Product[] = [];
  myOrders: any[] = [];
  cart: { product: Product, quantity: number, error?: string }[] = [];

  // Modal State
  showPaymentModal: boolean = false;
  lastOrderId: string = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadMyOrders();
    this.loadCart();

    // Auth check
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user || !user.username) {
      this.router.navigate(['/']);
    } else {
      this.username = user.username;
      // Debug: Verify who is logged in
      console.log('Logged in as:', this.username);
      if (this.username.toLowerCase() === 'admin' || this.username.toLowerCase() === 'edmund') {
        // If you really are admin, maybe warn? 
        // But relying on role check above is better. 
        // This is just to ensure variable is set.
      }
    }
  }

  showSection(section: string) {
    this.activeSection = section;
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  loadMyOrders() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user.user_id) {
      this.orderService.getOrdersByUser(user.user_id).subscribe((data: any[]) => {
        this.myOrders = data;
        // FORCE UPDATE: Verify we have data effectively
        this.myOrders = [...this.myOrders];
        this.cdr.detectChanges();
      });
    }
  }

  // Cart Management
  loadCart() {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  addToCart(product: Product) {
    // Check if product already in cart
    const existingItem = this.cart.find(item => item.product.product_id === product.product_id);

    if (existingItem) {
      // Optional: Check stock before adding
      if (existingItem.quantity < product.stock_quantity) {
        existingItem.quantity++;
      } else {
        alert('Max stock reached in cart!');
        return;
      }
    } else {
      this.cart.push({ product: product, quantity: 1 });
    }
    this.saveCart();

    // Force UI Update (Header Cart Count)
    this.cart = [...this.cart]; // Trigger Angular detection on array
    this.cdr.detectChanges(); // Force Paint

    // Removed alert as per request
    // setTimeout(() => { alert('Added to cart!'); }, 200);
  }

  validateQuantity(item: any) {
    if (item.quantity < 1) {
      item.error = 'Quantity must be at least 1';
    } else if (item.quantity > item.product.stock_quantity) {
      item.error = 'Quantity exceeds stock';
    } else {
      item.error = '';
    }
    this.saveCart();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  getCartTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  isCartValid(): boolean {
    if (this.cart.length === 0) return false;
    return !this.cart.some(item => (item as any).error || item.quantity < 1);
  }

  placeOrder() {
    if (!this.isCartValid()) return;

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    // Log local time validation
    console.log('Placing order at local time:', new Date().toString());

    const orderRequest = {
      userId: user.user_id,
      orderDate: new Date().toISOString(),
      items: this.cart.map(item => ({
        productId: item.product.product_id,
        quantity: item.quantity
      }))
    };

    this.orderService.placeOrder(orderRequest).subscribe({
      next: (response: any) => {
        // 1. Clear Data Immediately
        this.cart = [];
        this.saveCart();

        // 2. Switch Section
        this.showSection('orders');
        this.loadMyOrders();

        // 3. Force UI Update (Nuclear Option)
        this.cart = [...this.cart]; // Force array update
        this.cdr.detectChanges();   // Force repaint

        // 4. Show Payment Modal
        // Assuming response might be just text or contain ID. 
        this.lastOrderId = this.extractOrderId(response) || 'Pending';
        this.showPaymentModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        // Option build-in handled via template normally, added for robustness
        console.error('Order Error:', err);
      }
    });
  }

  // Helper to extract Order ID from message "Order Placed Successfully under ID: 123" if applicable
  private extractOrderId(msg: string): string | null {
    if (!msg) return null;
    const match = msg.toString().match(/ID:\s*(\d+)/);
    return match ? match[1] : null;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  showHelp() {
    alert("For any queries please reach out to:\nMail: sample@ecom.com");
  }

  logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('cart');
    this.router.navigate(['/']);
  }

  trackByFn(index: number, item: any): any {
    return item.product.product_id; // Unique ID for tracking
  }
}
