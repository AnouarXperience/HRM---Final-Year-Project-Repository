import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile, UserService } from 'src/app/sevices/user.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profile: UserProfile | null = null;
  error: string | null = null;
  imageUrl: string = '';

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.imageUrl = profile.image ? `http://localhost:8086/employee/files/${profile.image}` : '';
      },
      error: (err) => this.error = 'Failed to load user profile'
    });
  }
  isOpen: boolean = false;

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    const token = localStorage.getItem('jwtToken'); // Retrieve the authentication token from localStorage
    this.userService.signout(token).subscribe(() => { // Call the signout method of the UserService with the token
    this.userAuthService.clear(); // Clear user authentication
    this.router.navigate(['/login']); // Navigate to the login page
    });
  }


}
