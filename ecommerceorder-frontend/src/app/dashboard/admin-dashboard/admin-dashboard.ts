import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service'; // Changed service
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  activeSection: string = 'welcome'; // 'welcome', 'products' or 'orders'
  products: Product[] = [];
  allOrders: any[] = []; // Using any for Order to include user info easily

  // Product Editing
  editingProductId: number | null = null;
  editedProduct: Product = { product_id: 0, name: '', price: 0, stock_quantity: 0, description: '', imageUrl: '' };
  newProduct: Product = { product_id: 0, name: '', price: 0, stock_quantity: 0, description: '', imageUrl: '' };
  adding: boolean = false;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadOrders();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user || (user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN')) {
      this.router.navigate(['/']); // Protect route
    }
  }

  showSection(section: string) {
    this.activeSection = section;
  }

  loadProducts() {
    // Add timestamp to force fresh fetch
    this.productService.getProducts().subscribe(data => {
      // Filter out any invalid products (ID 0 or null)
      this.products = data.filter(p => p.product_id && p.product_id > 0);
      this.cdr.detectChanges();
    });
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(data => this.allOrders = data);
  }

  startEdit(product: Product) {
    if (!product.product_id || product.product_id === 0) {
      alert("Cannot edit this product (Invalid ID). Please refresh the page to clean up.");
      return;
    }
    this.editingProductId = product.product_id;
    this.editedProduct = { ...product };
  }

  saving: boolean = false; // Prevent double clicks

  saveEdit() {
    if (!this.editedProduct) return;
    if (this.saving) return;

    this.saving = true;
    const tempProduct = { ...this.editedProduct }; // Capture state

    this.productService.updateProduct(this.editedProduct).subscribe({
      next: () => {
        // 1. Optimistic Update (Instant Visual Change)
        const index = this.products.findIndex(p => p.product_id === tempProduct.product_id);
        if (index !== -1) {
          this.products[index] = tempProduct;
          this.products = [...this.products]; // Force Angular Change Detection
        }

        // 2. Force Repaint NOW
        this.cdr.detectChanges();

        // 3. Reset Form
        this.saving = false;
        this.editedProduct = { product_id: 0, name: '', price: 0, stock_quantity: 0, description: '', imageUrl: '' };
        this.editingProductId = null;

        // 4. Alert Success (WAIT for Paint)
        setTimeout(() => alert("Product Updated Successfully!"), 500);

        // 5. Background Refresh
        setTimeout(() => this.loadProducts(), 1000);
      },
      error: (err) => {
        this.saving = false;
        console.error('Update failed', err);
        let msg = 'Unknown Error';
        if (err.error && typeof err.error === 'string') {
          msg = err.error;
        } else if (err.error && typeof err.error === 'object') {
          msg = JSON.stringify(err.error);
        } else {
          msg = err.message || 'Server did not respond';
        }
        alert('Failed to update: ' + msg);
      }
    });
  }

  cancelEdit() {
    this.editingProductId = null;
    this.editedProduct = { product_id: 0, name: '', price: 0, stock_quantity: 0, description: '', imageUrl: '' };
    this.saving = false;
  }

  deleteProduct(id: number) {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // Remove locally immediately
          this.products = this.products.filter(p => p.product_id !== id);

          // Force Repaint
          this.products = [...this.products];
          this.cdr.detectChanges();
        },
        error: (err) => alert('Failed to delete product: ' + err.message)
      });
    }
  }

  toggleAdd() { this.adding = !this.adding; }

  saveNewProduct() {
    // Basic Validation
    if (!this.newProduct.name || !this.newProduct.price) {
      alert("Name and Price are required!");
      return;
    }

    this.productService.addProduct(this.newProduct).subscribe({
      next: (savedProduct) => {
        // 1. Immediate UI Update (Optimistic-ish, using returned data)
        this.products = [...this.products, savedProduct];

        // 2. Close Form IMMEDIATELLY
        this.adding = false;
        this.newProduct = { product_id: 0, name: '', price: 0, stock_quantity: 0, description: '', imageUrl: '' };

        // 3. Force Repaint (List updates AND Form closes)
        this.cdr.detectChanges();

        // 4. Background Refresh (Just in case)
        this.loadProducts();

        setTimeout(() => {
          alert("Product Added Successfully!");
        }, 300);
      },
      error: (err) => {
        console.error(err);
        let msg = 'Unknown Error';
        if (typeof err.error === 'string') {
          msg = err.error;
        } else if (err.error && typeof err.error === 'object') {
          msg = JSON.stringify(err.error);
        } else {
          msg = err.message;
        }
        alert('Failed to add product: ' + msg);
      }
    });
  }

  // Order Status Management
  updateOrderStatus(order: any, status: string) {
    if (confirm(`Change status to ${status}?`)) {
      this.orderService.updateOrderStatus(order.order_id, status, undefined).subscribe({
        next: () => {
          // 1. Immutable Update (Replace Object in Array)
          const index = this.allOrders.findIndex(o => o.order_id === order.order_id);
          if (index !== -1) {
            this.allOrders[index] = { ...this.allOrders[index], status: status };
            // 2. Force Array Reference Change
            this.allOrders = [...this.allOrders];
          }

          // 3. Force Angular to check & repaint NOW
          this.cdr.detectChanges();

          // 4. Alert (Small delay to ensure paint finishes)
          setTimeout(() => {
            alert('Order Status Updated!');
            // 5. Background Refresh
            this.loadOrders();
          }, 200);
        },
        error: (err) => alert('Failed to update status: ' + err.message)
      });
    }
  }

  updatePaymentStatus(order: any, status: string) {
    if (confirm(`Change payment status to ${status}?`)) {
      this.orderService.updateOrderStatus(order.order_id, undefined, status).subscribe({
        next: () => {
          // 1. Immutable Update (Replace Object in Array)
          const index = this.allOrders.findIndex(o => o.order_id === order.order_id);
          if (index !== -1) {
            this.allOrders[index] = { ...this.allOrders[index], payment_status: status };
            // 2. Force Array Reference Change
            this.allOrders = [...this.allOrders];
          }

          // 3. Force Angular to check & repaint NOW
          this.cdr.detectChanges();

          // 4. Alert (Small delay)
          setTimeout(() => {
            alert('Payment Status Updated!');
            this.loadOrders();
          }, 200);
        },
        error: (err) => alert('Failed to update status: ' + err.message)
      });
    }
  }

  logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
