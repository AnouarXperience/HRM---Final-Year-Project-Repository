import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/sevices/user.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private UserAuthService: UserAuthService
  ) {}

  ngOnInit(): void {}

  login(loginForm: NgForm) {
    // Log the loginForm to inspect its structure
    // console.log('Login Form:', loginForm);

    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        const roles = response.roles; // Assuming roles is an array of role names
        const jwtToken = response.accessToken;

        if (roles && jwtToken) {
          this.UserAuthService.setRoles(roles); // You might need to map role names to role IDs here
          this.UserAuthService.setToken(jwtToken);

          const isAdmin = roles.includes('ROLE_Administrateur'); // Assuming 'ROLE_Administrateur' represents the admin role
          if (isAdmin) {
            this.router.navigate(['/home']); // Redirect admin to home
          } else {
            this.router.navigate(['/acceuil']); // Redirect regular user to acceuil
          }
        } else {
          console.error('Invalid response format: ', response);
          // Handle invalid response format gracefully, e.g., display error message to the user
        }
      },
      (error) => {
        console.error('Login failed:', error); // Handle login error
        // Handle login error gracefully, e.g., display error message to the user
      }
    );

    // console.log('Form is submitted??');
    // console.log(loginForm.value);
  }
}
