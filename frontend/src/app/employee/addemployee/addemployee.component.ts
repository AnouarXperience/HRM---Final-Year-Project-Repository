import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, first } from 'rxjs';
import { EmployeeService } from 'src/app/sevices/employee.service';
import Swal from 'sweetalert2';

export class Role {
  id: number;
  name: string;
}


@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {
  form: FormGroup;
  selectedFile: File = null; // Initialize to null for clarity
  isLoading: boolean = false; // Add isLoading property
  imageUrl: string | ArrayBuffer = 'assets/img/userimg.png'; // Default image
  roles: Role[] = []; // Pour stocker les rôles récupérés

  constructor(private employeeService: EmployeeService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: [],
      email: ['', [Validators.required, Validators.email]],
      // Add validators as necessary for other fields
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
      date_birth: ['',Validators.required],
      job: ['', Validators.required],
      hire_date: ['',Validators.required],
      salary: ['', Validators.required],
      id_card: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['Employee', Validators.required],
    });
    this.form.get('firstname').valueChanges.subscribe(() => this.updateUsername());
    this.form.get('lastname').valueChanges.subscribe(() => this.updateUsername());
    this.form.get('id_card').valueChanges.subscribe(() => this.updateUsername());
    this.loadRoles();
  }
  updateUsername() {
    const firstname = this.form.get('firstname').value;
    const lastname = this.form.get('lastname').value;
    const id_card = this.form.get('id_card').value;
    // console.log('Firstname:', firstname); // Debugging
    // console.log('Lastname:', lastname); // Debugging
    // console.log('ID Card:', id_card); // Debugging

    if (firstname && lastname && id_card) {
        const username = `DIGID${firstname.substr(0, 2).toUpperCase()}${lastname.substr(0, 2).toUpperCase()}${id_card.substr(id_card.length - 3).toUpperCase()}`;
        this.form.get('username').setValue(username);
        // console.log('Username set to:', username);
    } else {
        // console.log('One or more required fields are empty.');
    }
}

isUsernameDisabled: boolean = true;




  resetForm() {
    // Si vous avez initialisé votre formulaire avec des valeurs par défaut spécifiques
    this.form.reset({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      job: '',
      department: '',
      date_birth: '',
      phone: '',
      salary: '',
      id_card: '',
      hire_date: '',
      address: '',
      // Ajoutez d'autres champs ici si nécessaire
    });

    // Ou, pour simplement réinitialiser le formulaire à un état vide sans valeurs par défaut
    // this.form.reset();
  }

  loadRoles() {
    this.employeeService.getAllroles().subscribe({
      next: (roles) => {
        this.roles = roles.filter(role => role.name !== 'Administrateur');
      },
      error: (error) => console.error('Failed to load roles:', error)
    });
  }



  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // Reset file input value
    event.target.value = ''; // This line resets the input element
    if (file && this.isValidFile(file)) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageUrl = e.target.result;
      reader.readAsDataURL(file);
    } else {
      // Handle invalid file
      Swal.fire("Invalid File", "Please select a valid image file.", "error");
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
          // console.log('Form data:', this.form.value);
          // console.log('Selected file:', this.selectedFile);

          // First check the username
          this.employeeService.checkUsernameExists(this.form.value.username).subscribe(usernameExists => {
            if (usernameExists) {
              this.isLoading = false;
              Swal.fire('Error', 'Username already exists! Please choose another one.', 'error');
            } else {
              // Then check the email
              this.employeeService.checkEmailExists(this.form.value.email).subscribe(emailExists => {
                if (emailExists) {
                  this.isLoading = false;
                  Swal.fire('Error', 'Email already in use! Please use another email.', 'error');
                } else {
                  // Proceed with registration if both checks pass
                  this.employeeService.signupEmployee(this.form.value, this.selectedFile).subscribe({
                    next: (response: any) => {
                      // console.log('Server response:', response);
                      Swal.fire('Successful Registration !');
                      this.router.navigate(['/home/listemployee']);
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
      // console.log('Form is invalid or no file selected');
      Swal.fire('Attention', 'Please fill in all required fields and select a profile image.', 'warning');
    }
  }

  resetImage() {
    this.imageUrl = 'assets/img/userimg.png'; // Reset to default image
    this.selectedFile = null; // Reset the file
  }
}
