import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService {

  constructor(private userAuthService: UserAuthService, private router: Router) { }
  startTokenExpiryCheck(): void {
  setInterval(() => {
    this.checkTokenExpiry();
  }, 100 * 10); // Check every minute
}

checkTokenExpiry(): void {
  const token = this.userAuthService.getToken();
  if (!token) {
    // Token not found, user is not logged in
    return;
  }

  const tokenPayload = this.parseJwt(token);
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  if (tokenPayload && tokenPayload.exp && tokenPayload.exp < now) {
    // Token has expired, log out the user
    this.userAuthService.clear(); // Clear user authentication
    this.router.navigate(['/login']); // Navigate to the login page
  }
}

// Helper function to parse JWT token payload
private parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}
}
