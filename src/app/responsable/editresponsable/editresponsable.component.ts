import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsableService } from 'src/app/sevices/responsable.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editresponsable',
  templateUrl: './editresponsable.component.html',
  styleUrls: ['./editresponsable.component.css']
})
export class EditresponsableComponent implements OnInit {

  oneRes:any;
  form:FormGroup //tsconfig strict=false
  id=this.activerouter.snapshot.params["id"]
  imageUrl: string | ArrayBuffer = '';
  selectedFile: File = null;
  isEditMode: boolean = false;


  constructor(private responsableservice: ResponsableService,
    private activerouter:ActivatedRoute,
    private formbuilder:FormBuilder, private router:Router
   ) { }

  ngOnInit(): void {
    this.Responsableone();
    this.form = this.formbuilder.group({
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


modifierResponsable() {
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

      this.responsableservice.modfierRes(this.id, this.form.value, this.selectedFile).subscribe({
        next: (res: any) => {
          console.log("Manager modified:", res);
          Swal.fire({
            title: 'Success!',
            text: 'Manager updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/home/listresponsable']);
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



  Responsableone() {
    this.responsableservice.getResponsable(this.id).subscribe((res: any) => {
      this.oneRes = res;
      this.imageUrl = `http://localhost:8086/responsable/files/${this.oneRes.image}`;

      const hiringDateInCorrectFormat = this.convertDateToDatetimeLocalFormat(this.oneRes.hire_date);
      this.form.patchValue({
        username: this.oneRes.username,
        email: this.oneRes.email,
        firstname: this.oneRes.firstname,
        lastname: this.oneRes.lastname,
        password: this.oneRes.password,
        address: this.oneRes.address,
        department: this.oneRes.department,
        date_birth: this.oneRes.date_birth,
        job: this.oneRes.job,
        hire_date: hiringDateInCorrectFormat,
        salary: this.oneRes.salary,
        id_card: this.oneRes.id_card,
        phone: this.oneRes.phone,


      });



      console.log("Responsable details:", this.oneRes);
    });
  }

  onFileSelected(event: any) {
    // Reset file input value
    event.target.value = ''; // This line resets the input element
    const file: File = event.target.files[0];
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
    this.imageUrl = `http://localhost:8086/responsable/files/${this.oneRes.image}`; // Reset to default image
    this.selectedFile = null; // Reset the file
  }


}
