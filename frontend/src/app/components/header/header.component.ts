import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [MatToolbar, RouterModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  icon = 'cancel'; // Icon name for the toolbar

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('isAuthenticated:', isAuthenticated); // Log authentication status
      this.icon = isAuthenticated ? 'check_circle' : 'cancel'; // Update icon based on authentication status
    });
  }

  checkVerification(): void {
    this.authService.verifyToken(); // Verify token on click
  }
}
