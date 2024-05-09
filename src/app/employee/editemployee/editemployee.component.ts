import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/sevices/employee.service';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { last } from 'rxjs';

@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.css']
})
export class EditemployeeComponent implements OnInit {
  oneemployee:any;
  form:FormGroup //tsconfig strict=false
  id=this.activerouter.snapshot.params["id"]
  imageUrl: string | ArrayBuffer = '';
  selectedFile: File = null;
  isEditMode: boolean = false;


  constructor(private employeeService: EmployeeService,
    private activerouter:ActivatedRoute,
    private formbuilder:FormBuilder, private router:Router
   ) { }

  ngOnInit(): void {
    this.employeeone();
    this.form = this.formbuilder.group({
     email: ['', [Validators.required, Validators.email]],
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
      image: [''], // Assurez-vous que ce champ est traité correctement dans votre backend
    });

  }



  convertDateToDatetimeLocalFormat(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear().toString();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed, add 1
    const day = d.getDate().toString().padStart(2, '0');
    const hour = d.getHours().toString().padStart(2, '0');
    const minute = d.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}`;
  }
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
}


modifierEmployee() {
  if (this.form.invalid) {
    // Notify the user that the form contains errors
    Swal.fire({
      title: 'Invalid Form!',
      text: 'Please fill in all required fields.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return; // Stop the function execution if the form is invalid
  }

  // Confirmation alert for valid forms
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to update the manager details?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, update it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed to proceed with modification
      console.log("Data sent for modification:", this.form.value);

      this.employeeService.modfieremployee(this.id, this.form.value, this.selectedFile).subscribe({
        next: (res: any) => {
          console.log("Manager modified:", res);
          Swal.fire({
            title: 'Success!',
            text: 'Employee updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/home/listemployee']);
        },
        error: (error) => {
          console.error("Error updating Responsable:", error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update Responsable.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  });
}





  employeeone() {
    this.employeeService.getemployee(this.id).subscribe((res: any) => {
      this.oneemployee = res;
      this.imageUrl = `http://localhost:8086/employee/files/${this.oneemployee.image}`;

      const hiringDateInCorrectFormat = this.convertDateToDatetimeLocalFormat(this.oneemployee.hire_date);
      this.form.patchValue({
        username: this.oneemployee.username,
        email: this.oneemployee.email,
        firstname: this.oneemployee.firstname,
        lastname: this.oneemployee.lastname,
        password: this.oneemployee.password,
        address: this.oneemployee.address,
        department: this.oneemployee.department,
        date_birth: this.oneemployee.date_birth,
        job: this.oneemployee.job,
        hire_date: hiringDateInCorrectFormat,
        salary: this.oneemployee.salary,
        id_card: this.oneemployee.id_card,
        phone: this.oneemployee.phone,


      });



      console.log("Employee details:", this.oneemployee);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // Reset file input value
    event.target.value = ''; // This line resets the input element
    if (file && this.isValidFile(file)) { // Add file validation
      this.selectedFile= file;
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
  resetImage() {
    this.imageUrl = `http://localhost:8086/employee/files/${this.oneemployee.image}`; // Reset to default image
    this.selectedFile = null; // Reset the file
  }


}
