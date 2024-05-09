import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../sevices/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      renewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword').value;
    const renewPassword = form.get('renewPassword').value;
    return newPassword === renewPassword ? null : { mismatch: true };
  }

  changePassword() {
    if (this.form.valid) {
      const username = this.userService.getUsername();
      const payload = {
        username,
        ...this.form.value
      };

      if (payload.newPassword !== payload.renewPassword) {
        Swal.fire('Error', 'New password and Re-entered password must match.', 'error');
        return;
      }

      this.userService.changePass(payload).subscribe({
        next: (response: any) => {
          if (response && response.message) {
            Swal.fire('Success', response.message, 'success');
            this.form.reset();  // Réinitialiser le formulaire ici après un changement réussi
          }
        },
        error: (error) => {

            Swal.fire('Error', 'New password should not match current one and make sure your current password is correct.', 'error');

        }
      });
    } else {
      Swal.fire('Error', 'Form is not valid. Please check your inputs.', 'error');
    }
  }


}
