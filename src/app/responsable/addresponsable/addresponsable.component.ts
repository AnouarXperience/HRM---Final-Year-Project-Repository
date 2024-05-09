import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ResponsableService } from 'src/app/sevices/responsable.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addresponsable',
  templateUrl: './addresponsable.component.html',
  styleUrls: ['./addresponsable.component.css'],
})
export class AddresponsableComponent implements OnInit {
  form: FormGroup;
  selectedFile: File = null; // Initialize to null for clarity
  isLoading: boolean = false; // Add isLoading property
  imageUrl: string | ArrayBuffer = 'assets/img/userimg.png'; // Default image

  constructor(
    private responsableservice: ResponsableService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

      // Add validators as necessary for other fields
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
      date_birth: ['', Validators.required],
      job: ['', Validators.required],
      hire_date: ['', Validators.required],
      salary: ['', Validators.required],
      id_card: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  resetForm() {
    // Si vous avez initialisé votre formulaire avec des valeurs par défaut spécifiques
    this.form.reset({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      job: '',
      department: '',
      hire_date: '',
      phone: '',
      salary: '',
      id_card: '',
      date_birth: '',
      address: '',

      // Ajoutez d'autres champs ici si nécessaire
    });

    // Ou, pour simplement réinitialiser le formulaire à un état vide sans valeurs par défaut
    // this.form.reset();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // Reset file input value
    event.target.value = ''; // This line resets the input element
    if (file && this.isValidFile(file)) {
      // Add file validation
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imageUrl = e.target.result);
      reader.readAsDataURL(file);
    } else {
      // Handle invalid file
      Swal.fire('Invalid File', 'Please select a valid image file.', 'error');
    }
  }

  isValidFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    return validTypes.includes(file.type) && file.size <= maxSizeInBytes;
  }
  onSubmit() {
    if (this.form.valid && this.selectedFile) {
      Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to add a new employee?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, add it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true; // Show loader
          console.log('Form data:', this.form.value);
          console.log('Selected file:', this.selectedFile);

          // First check the username
          this.responsableservice.checkUsernameExists(this.form.value.username).subscribe(usernameExists => {
            if (usernameExists) {
              this.isLoading = false;
              Swal.fire('Error', 'Username already exists! Please choose another one.', 'error');
            } else {
              // Then check the email
              this.responsableservice.checkEmailExists(this.form.value.email).subscribe(emailExists => {
                if (emailExists) {
                  this.isLoading = false;
                  Swal.fire('Error', 'Email already in use! Please use another email.', 'error');
                } else {
                  // Proceed with registration if both checks pass
                  this.responsableservice.signupResponsable(this.form.value, this.selectedFile).subscribe({
                    next: (response: any) => {
                      console.log('Server response:', response);
                      Swal.fire('Successful Registration !');
                      this.router.navigate(['/home/listresponsable']);
                    },
                    error: (error: HttpErrorResponse) => {
                      console.error('Error during registration:', error);
                      Swal.fire('Error', 'Registration failed. Please try again.', 'error');
                    },
                    complete: () => {
                      this.isLoading = false; // Hide loader
                    },
                  });
                }
              });
            }
          });
        }
      });
    } else {
      console.log('Form is invalid or no file selected');
      Swal.fire('Attention', 'Please fill in all required fields and select a profile image.', 'warning');
    }
  }

  resetImage() {
    this.imageUrl = 'assets/img/userimg.png'; // Reset to default image
    this.selectedFile = null; // Reset the file
  }
}
