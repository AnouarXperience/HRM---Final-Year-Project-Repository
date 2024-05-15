import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/sevices/user.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formSubmitted: boolean = false;
  showForgotPasswordForm = false;
  showResetPasswordForm = false;
  email: string = '';
  resetPasswordForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  failedAttempts: number = 0;
  resetPasswordSuccessful: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private UserAuthService: UserAuthService,
    private formbuilder: FormBuilder,
    private passwordResetService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.initForm();
    // Check if the user is already logged in
    if (this.UserAuthService.isLoggedIn()) {
    // Redirect the user to the home page or another page
        this.router.navigate(['/']);
    }
  }

  initForm() {
    this.resetPasswordForm = this.formbuilder.group({
      verificationCode: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Login Normal Version working with third time navigate to forgot password automatically
  // login() {
  //   // console.log("Login button clicked");
  //   this.formSubmitted = true;
  //   if (this.form.valid) {
  //     this.userService.login(this.form.value).subscribe(
  //       (response: any) => {
  //         const roles = response.roles;
  //         const jwtToken = response.accessToken;

  //         if (roles && jwtToken) {
  //           this.UserAuthService.setRoles(roles);
  //           this.UserAuthService.setToken(jwtToken);

  //           const isAdmin = roles.includes('Administrateur');
  //           if (isAdmin) {
  //             this.router.navigate(['/home']);
  //             console.log('Login successful');
  //           } else {
  //             this.router.navigate(['/acceuil/login']);
  //           }
  //         } else {
  //           console.error('Invalid response format: ', response);
  //         }
  //       },
  //       (error) => {
  //         console.error('Login failed:', error);
  //         Swal.fire('Login Failed', 'Invalid email or password', 'error');
  //       }
  //     );
  //   }
  // }


  // Login Second Version eliminate the atomical navigation to forgot password but added loader every time fell free to use the first login or the second one 
  login() {
    // console.log("Login button clicked");
    this.formSubmitted = true;
  
    // Check if the login process is ongoing
    if (!this.isLoading && this.form.valid) {
      // Show the loader when the login request starts
      this.isLoading = true;
  
      this.userService.login(this.form.value).subscribe(
        (response: any) => {
          const roles = response.roles;
          const jwtToken = response.accessToken;
  
          if (roles && jwtToken) {
            this.UserAuthService.setRoles(roles);
            this.UserAuthService.setToken(jwtToken);
  
            const isAdmin = roles.includes('Administrateur');
            const isManager = roles.includes('Responsable');
            const Employee = roles.includes('Employee');
            if (isAdmin || isManager || Employee) {
              this.router.navigate(['/home']);
              // console.log('Login successful');
            } else {
              this.router.navigate(['/acceuil/login']);
            }
          } else {
            // console.error('Invalid response format: ', response);
          }
          // Hide the loader after login request is completed
          this.isLoading = false;
        },
        (error) => {
          // console.error('Login failed:', error);
          Swal.fire('Login Failed', 'Invalid email or password', 'error');
          // Increment the failedAttempts counter
          this.failedAttempts++;
          // Check if the number of failed attempts is equal to 3
          if (this.failedAttempts === 3) {
            // If so, do not show the forgot password form
            // or anything else
            this.isLoading = false;
            return;
          }
          // Hide the loader after login request is completed
          this.isLoading = false;
        }
      );
    }
  }
  
  

  forgotPass() {
    this.showForgotPasswordForm = true;
  }

  // forgotPassword version old version compatible with Login Normal Version
  // forgotPassword() {
  //   if (!this.email) {
  //     Swal.fire('Error', 'Please enter your email.', 'error');
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.userService.forgotPass(this.email).subscribe({
  //     next: (response: any) => {
  //       if (response.user === 'user not found') {
  //         Swal.fire('Error', 'User not found. Please check your email and try again.', 'error');
  //       } else {
  //         Swal.fire('Success', 'Please check your email to reset your password.', 'success').then((result) => {
  //           if (result.isConfirmed || result.isDismissed) {
  //             this.showForgotPasswordForm = false;
  //             this.showResetPasswordForm = true;
  //           }
  //         });
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error occurred:', error);
  //       Swal.fire('Error', 'Failed to send reset link. Please try again later.', 'error');
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }


  // The New Version of forgotPassword 
  forgotPassword() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter your email.', 'error');
      return;
    }
  
    // Show the loader when the forgot password request starts
    // console.log("Forgot password request initiated...");
    this.isLoading = true;
  
    this.userService.forgotPass(this.email).subscribe({
      next: (response: any) => {
        // console.log("Forgot password request successful:", response);
        if (response.user === 'user not found') {
          Swal.fire('Error', 'User not found. Please check your email and try again.', 'error');
        } else {
          Swal.fire('Success', 'Please check your email to reset your password.', 'success').then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.showForgotPasswordForm = false;
              this.showResetPasswordForm = true;
            }
          });
        }
      },
      error: (error) => {
        // console.error('Error occurred:', error);
        Swal.fire('Error', 'Failed to send reset link. Please try again later.', 'error');
      },
      complete: () => {
        // Hide the loader after the forgot password request is completed
        // console.log("Forgot password request completed.");
        this.isLoading = false;
      }
    });
  }
  
  
  

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const verificationCode = this.resetPasswordForm.get('verificationCode').value;
      const newPassword = this.resetPasswordForm.get('newPassword').value;

      this.passwordResetService.resetPass(verificationCode, newPassword).subscribe({
        next: (response) => {
          Swal.fire('Success!', 'Your password has been successfully reset. Please login with your new password.', 'success').then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.resetPasswordForm.reset();
              this.showResetPasswordForm = false;
              this.showForgotPasswordForm = false;
              this.resetPasswordSuccessful = true;
            }
          });
        },
        error: (error) => {
          console.error('Failed to reset password:', error);
          Swal.fire('Error!', error.message || 'Failed to reset password. Please try again later.', 'error');
        }
      });
    } else {
      Swal.fire('Attention!', 'Please check the form for errors.', 'info');
    }
  }
}