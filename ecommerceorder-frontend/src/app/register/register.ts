import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register.html',
    styleUrls: ['./register.css']
})
export class Register {
    username: string = '';
    password: string = '';
    email: string = '';
    error: string = '';
    success: string = '';

    // Real-time validation errors
    emailError: string = '';
    passwordError: string = '';

    constructor(private authService: AuthService, private router: Router) { }

    validateEmail() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (this.email && !emailRegex.test(this.email)) {
            this.emailError = 'Invalid email format';
        } else {
            this.emailError = '';
        }
    }

    validatePassword() {
        if (this.password && this.password.length < 8) {
            this.passwordError = 'Password must be at least 8 characters long';
        } else {
            this.passwordError = '';
        }
    }

    register() {
        this.error = '';
        this.success = '';

        if (this.username.toLowerCase().includes('admin') || this.email.toLowerCase().includes('admin')) {
            this.error = 'Username or Email cannot contain "admin"';
            return;
        }

        // Email Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.email)) {
            this.error = 'Invalid email format';
            return;
        }

        // Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(this.password)) {
            this.error = 'Password must be at least 8 characters long and contain both uppercase and lowercase letters';
            return;
        }

        const user = {
            username: this.username,
            password: this.password,
            email: this.email
        };

        console.log('Registering user:', user); // Debug log

        this.authService.register(user).subscribe({
            next: (response) => {
                console.log('Registration Response:', response);
                this.success = 'Registration successful! Redirecting to login...';
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 2000);
            },
            error: (err) => {
                console.error('Registration Error:', err);
                this.error = 'Registration failed: ' + (err.error || err.message || 'Unknown Error');
            }
        });
    }

    goToLogin() {
        this.router.navigate(['/']);
    }
}
