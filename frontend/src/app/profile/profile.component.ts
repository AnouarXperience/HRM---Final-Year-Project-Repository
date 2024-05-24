import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile, UserService } from '../sevices/user.service';
import { EmployeeService } from '../sevices/employee.service';
import { UserAuthService } from '../sevices/user-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  userId: number;
  form: FormGroup;
  profile: UserProfile | null = null;
  error: string | null = null;
  activeTab: string = 'overview';
  imageUrl: string = '';
  isAdmin: boolean = false;
  adminForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private employeeService: EmployeeService,
    private authService: UserAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      renewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['',Validators.required],
      address: ['', Validators.required],
      id_card: ['', Validators.required],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      job: ['', Validators.required],
      salary: ['', Validators.required],
      date_birth: ['', Validators.required],
      hire_date: ['', Validators.required],
      image: ['', Validators.required],
    });

    this.userId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.imageUrl = profile.image ? `http://localhost:8086/employee/files/${profile.image}` : '';
        this.patchFormValues();
      },
      error: (err) => {
        this.error = 'Failed to load user profile';
        console.error('Failed to load user profile', err);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'overview';
    });
    this.isAdmin = this.authService.isAdmin();
    this.loadUserProfile();
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const renewPassword = form.get('renewPassword')?.value;
    return newPassword === renewPassword ? null : { mismatch: true };
  }

  changePassword(): void {
    if (this.form.valid) {
        this.userService.getUserProfile().subscribe({
            next: (userProfile: UserProfile) => {
                const payload = { username: userProfile.username, ...this.form.value };

                if (payload.newPassword !== payload.renewPassword) {
                    Swal.fire('Error', 'New password and Re-entered password must match.', 'error');
                    return;
                }

                this.userService.changePass(payload).subscribe({
                    next: (response: any) => {
                        if (response?.message) {
                            Swal.fire('Success', response.message, 'success');
                            this.form.reset();
                        }
                    },
                    error: (error) => {
                        let errorMessage = 'New password should not match current one and make sure your current password is correct.';
                        if (error?.error?.message) {
                            errorMessage = error.error.message;
                        }
                        Swal.fire('Error', errorMessage, 'error');
                    }
                });
            },
            error: () => {
                Swal.fire('Error', 'Failed to get user profile.', 'error');
            }
        });
    } else {
        Swal.fire('Error', 'Form is not valid. Please check your inputs.', 'error');
    }
}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.router.navigate([], { queryParams: { tab } });
  }

  loadUserProfile(): void {
    this.userService.getoneusers(this.userId).subscribe({
      next: (profile: UserProfile) => {
        this.adminForm.patchValue(profile);
        if (profile.image) {
          this.imageUrl = `http://localhost:8086/administrateur/files/${profile.image}`;
        }
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        Swal.fire('Error', 'Failed to load profile.', 'error');
      }
    });
  }

  patchFormValues(): void {
    if (this.profile) {
      this.adminForm.patchValue({
        username: this.profile.username,
        firstname: this.profile.firstname,
        lastname: this.profile.lastname,
        email: this.profile.email,
        address: this.profile.address,
        id_card: this.profile.id_card,
        phone: this.profile.phone,
        department: this.profile.department,
        job: this.profile.job,
        salary: this.profile.salary,
        date_birth: this.profile.date_birth,
        hire_date: this.convertDateToDatetimeLocalFormat(this.profile.hire_date),
      });
    }
  }

  convertDateToDatetimeLocalFormat(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageUrl = e.target.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  resetImage() {
    this.imageUrl = `http://localhost:8086/employee/files/${this.profile.image}`; // Reset to default image
    this.selectedFile = null; // Reset the file
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      const formData = new FormData();
      Object.keys(this.adminForm.controls).forEach(key => {
        formData.append(key, this.adminForm.get(key)?.value);
      });
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }

      this.userService.updateadmin(this.userId, formData).subscribe({
        next: (response) => {
          Swal.fire('Success', 'Profile updated successfully.', 'success');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          Swal.fire('Error', 'Failed to update profile.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Form is not valid. Please check your inputs.', 'error');
    }
  }
}
