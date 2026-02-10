import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (user: any) => {
        // Store user info in sessionStorage (Tab Isolated)
        sessionStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN') {
          alert('Login Successful! Welcome Admin.');
          this.router.navigate(['/admin-dashboard']);
        } else {
          alert('Login Successful! Welcome ' + user.username);
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        alert('Invalid credentials');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
