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
    private userAuthService: UserAuthService,
    private formBuilder: FormBuilder,
    private passwordResetService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.initForm();
    // Check if the user is already logged in
    if (this.userAuthService.isLoggedIn()) {
      // Redirect the user to the home page or another page
      this.router.navigate(['/']);
    }
  }

  initForm() {
    this.resetPasswordForm = this.formBuilder.group({
      verificationCode: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const loginRequest = {
      username: this.form.value.usernameOrEmail.includes('@') ? null : this.form.value.usernameOrEmail,
      email: this.form.value.usernameOrEmail.includes('@') ? this.form.value.usernameOrEmail : null,
      password: this.form.value.password
    };

    

    this.userService.login(loginRequest).subscribe(
      (response: any) => {
        const roles = response.roles;
        const jwtToken = response.accessToken;

        if (roles && jwtToken) {
          this.userAuthService.setRoles(roles);
          this.userAuthService.setToken(jwtToken);

          const isAdmin = roles.includes('Administrateur');
          const isManager = roles.includes('Responsable');
          const employee = roles.includes('Employee');
          const Recruteur = roles.includes('Recruteur')
          if (isAdmin || isManager || employee || Recruteur) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/acceuil/login']);
          }
        } else {
          console.error('Invalid response format:', response);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Login failed:', error);
        Swal.fire('Login Failed', 'Invalid email or password', 'error');
        this.failedAttempts++;
        if (this.failedAttempts === 3) {
          this.isLoading = false;
          return;
        }
        this.isLoading = false;
      }
    );
  }

  forgotPass() {
    this.showForgotPasswordForm = true;
  }

  forgotPassword() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter your email.', 'error');
      return;
    }

    this.isLoading = true;

    this.userService.forgotPass(this.email).subscribe({
      next: (response: any) => {
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
        console.error('Error occurred:', error);
        Swal.fire('Error', 'Failed to send reset link. Please try again later.', 'error');
      },
      complete: () => {
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
