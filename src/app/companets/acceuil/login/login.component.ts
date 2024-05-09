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
  // username: string = '';
  // password: string = '';
  form: FormGroup;
  formSubmitted: boolean = false;
  showForgotPasswordForm = false;
  showResetPasswordForm = false;
  email: string = '';
  resetPasswordForm: FormGroup;
  isLoading: boolean = false;


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
  }
  initForm() {
    this.resetPasswordForm = this.formbuilder.group({
      verificationCode: ['', Validators.required], // make sure this name matches your form's input binding
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }



  login() {
    // Log the loginForm to inspect its structure
    // console.log('Login Form:', loginForm);
    this.formSubmitted = true;
    if (this.form.valid) {
      // Proceed with login logic
      this.userService.login(this.form.value).subscribe(
        (response: any) => {
          const roles = response.roles; // Assuming roles is an array of role names
          const jwtToken = response.accessToken;

          if (roles && jwtToken) {
            this.UserAuthService.setRoles(roles); // You might need to map role names to role IDs here
            this.UserAuthService.setToken(jwtToken);

            const isAdmin = roles.includes('ROLE_Administrateur'); // Assuming 'ROLE_Administrateur' represents the admin role
            if (isAdmin) {
              this.router.navigate(['/home']); // Redirect admin to home
              // Proceed with login logic
              console.log('Login successful');
            } else {
              this.router.navigate(['/acceuil/login']); // Redirect regular user to acceuil
            }
          } else {
            console.error('Invalid response format: ', response);
            // Handle invalid response format gracefully, e.g., display error message to the user
          }
        },
        (error) => {
          console.error('Login failed:', error); // Handle login error
          // Handle login error gracefully, e.g., display error message to the user
          Swal.fire('Login Failed', 'Invalid email or password', 'error');
        }
      );
    }
  }

  forgotPass() {
    this.showForgotPasswordForm = true;
  }

  forgotPassword() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter your email.', 'error');
      return;
    }
  
    // Affichez le loader
    this.isLoading = true;
  
    this.userService.forgotPass(this.email).subscribe({
      next: (response: any) => {
        if (response.user === 'user not found') {
          Swal.fire('Error', 'User not found. Please check your email and try again.', 'error');
        } else {
          Swal.fire('Success', 'Please check your email to reset your password.', 'success').then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              // Réinitialiser l'email et afficher le formulaire de réinitialisation du mot de passe
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
        // Masquez le loader une fois que la requête est terminée
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
              // Reset the resetPasswordForm and show the login form
              this.resetPasswordForm.reset();
              this.showResetPasswordForm = false;
              this.showForgotPasswordForm = false;
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
