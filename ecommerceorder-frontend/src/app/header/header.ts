import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
