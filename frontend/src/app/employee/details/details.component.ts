import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'jspdf-autotable';
import { EmployeeService } from 'src/app/sevices/employee.service';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import jsPDF from 'jspdf';





@NgModule({
  imports: [CommonModule],
  schemas:  [NO_ERRORS_SCHEMA],
})

export class DetailsModule {}

interface Role {
  id: number;
  name: string;
}

interface Employee {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  job: string;
  address: string;
  department: string;
  phone: string;
  id_card: string;
  salary: number;
  date_birth: string;
  hire_date: string;
  image: string;
  roles: Role[];
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DatePipe]
})



export class DetailsComponent implements OnInit {
  oneemployee: Employee ; // Initialize as null for better null checks
  imageUrl: string | ArrayBuffer = '';

  constructor(
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe// Changed to a more standard naming convention
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadEmployeeDetails(id);
      }
    });
  }

  loadEmployeeDetails(id: string): void {
    this.employeeService.getemployee(id).subscribe({
      next: (res: Employee) => {
        this.oneemployee = res;
        this.imageUrl = `http://localhost:8086/employee/files/${this.oneemployee.image}`;
        // console.log("Employee details:", this.oneemployee);
      },
      error: (error) => {
        console.error('Failed to load employee details', error);
        // Optionally handle user feedback here
      }
    });
  }

  downloadProfile(): void {
    const doc : any= new jsPDF();
    const imgData = this.imageUrl as string; // Ensure the imageUrl is valid
    const imgWidth = 30;
    const imgHeight = imgWidth; // Simplified proportion calculation
    const imgX = doc.internal.pageSize.getWidth() - imgWidth - 10;
    const imgY = 10;
    doc.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
    const formattedHireDate = this.datePipe.transform(this.oneemployee?.hire_date, 'yyyy-MM-dd HH:mm');
    const profileDetails = [
      ['Registration Number', this.oneemployee?.username],
      ['Full Name', `${this.oneemployee?.firstname} ${this.oneemployee?.lastname}`],
      ['Email', this.oneemployee?.email],
      ['Job', this.oneemployee?.job],
      ['Address', this.oneemployee?.address],
      ['Department', this.oneemployee?.department],
      ['Phone', this.oneemployee?.phone],
      ['Identity Card', this.oneemployee?.id_card],
      ['Salary', `${this.oneemployee?.salary}`],
      ['Date of Birth', this.oneemployee?.date_birth],
      ['Hiring date', formattedHireDate],
      ['Roles', this.oneemployee?.roles.map(role => role.name).join(', ')]

    ];

    doc.autoTable({
      startY: 55,
      body: profileDetails,
      theme: 'grid',
      styles: { lineWidth: 0.2, lineColor: [176, 196, 222], cellPadding: 2, fontSize: 12 }
    });

    doc.save('profile_details.pdf');
  }


}
