import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Swal from 'sweetalert2';
import { UserProfile, UserService } from '../sevices/user.service';
import { EmployeeService } from '../sevices/employee.service';
import { UserAuthService } from '../sevices/user-auth.service';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit {

  listemployee: any[] = [];
  e: number = 1;
  search: string = '';
  isInputFocused = false;
  imageUrl: string | ArrayBuffer = '';
  currentUser: UserProfile;

  constructor(
    private service: EmployeeService,
    private userService: UserService,
    private userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (profile: UserProfile) => {
        this.currentUser = profile;
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Failed to load current user profile', err);
      }
    });
  }

  loadEmployees(): void {
    this.service.getallemployee().subscribe((res: any) => {
      if (this.isRoleAllowed(['Responsable']) && this.currentUser) {
        // Filter out users with the "Responsable" role including the current user
        this.listemployee = res.filter(emp => emp.username !== this.currentUser.username && !this.hasRole(emp, 'Responsable'));
      } else {
        this.listemployee = res;
      }
      // Sort employees by hire_date in descending order
      this.listemployee.sort((a, b) => new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime());
    });
  }
  hasRole(employee: any, role: string): boolean {
    return  employee.roles && employee.roles.some((r: any) => r.name === role);
  }

  deleteemployee(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.removeEmployee(id).subscribe({
          next: (res: any) => {
            console.log("Employee deleted", res);
            this.loadEmployees();
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          },
          error: (err) => {
            console.error("Error during deletion", err);
            Swal.fire(
              'Failed!',
              'There was a problem deleting your file. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }

  updateSearch(): void {
    // This method is triggered on each input event
    // It can contain logic to filter data or simply trigger Angular's change detection
  }

  clearSearch(): void {
    this.search = '';  // Clears the search input
    this.updateSearch();  // Optionally update list or icons
  }

  toggleStatus(employee: any): void {
    employee.status = !employee.status;
    this.service.updateUserStatus(employee.id, employee.status)
      .subscribe(response => {
        console.log('Status updated', response);
      }, error => {
        console.error('Error updating status', error);
      });
  }

  isRoleAllowed(allowedRoles: string[]): boolean {
    const userRoles = this.userAuth.getRoles();
    return allowedRoles.some(role => userRoles.includes(role));
  }

  downloadCSV() {
    const filteredData = this.listemployee.map(e => {
      return {
        id: e.id,
        username: e.username,
        email: e.email,
        firstname: e.firstname,
        lastname: e.lastname,
        address: e.address,
        department: e.department,
        date_birth: e.date_birth,
        job: e.job,
        hire_date: e.hire_date,
        salary: e.salary,
        id_card: e.id_card,
        phone: e.phone,
        gender: e.gender,
        contract_type: e.contract_type
      };
    });

    const csvData = this.convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'employees.csv');
  }

  convertToCSV(objArray: any[]): string {
    const header = Object.keys(objArray[0]);
    const csvRows = objArray.map(row => {
      return header.map(fieldName => {
        return JSON.stringify(row[fieldName], (key, value) => (value === null ? '' : value));
      }).join(',');
    });

    return [header.join(','), ...csvRows].join('\r\n');
  }

  downloadPDF() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [440, 180]
    });

    // Add a header
    doc.setFontSize(18);
    doc.text('Digital Identity', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Employee Data Report', 14, 32);
    const currentDate = new Date();
    doc.text(`Generated on: ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`, 14, 40);



    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage('assets/img/Picture1.png', 'PNG', pageWidth - 50, 10, 20, 20);

    const filteredData = this.listemployee.map(e => [
      e.id,
      e.username,
      e.email,
      e.firstname,
      e.lastname,
      e.address,
      e.department,
      e.date_birth,
      e.job,
      e.hire_date,
      e.salary,
      e.id_card,
      e.phone,
      e.gender,
      e.contract_type
    ]);

    // Define the columns
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Username', dataKey: 'username' },
      { header: 'Email', dataKey: 'email' },
      { header: 'First Name', dataKey: 'firstname' },
      { header: 'Last Name', dataKey: 'lastname' },
      { header: 'Address', dataKey: 'address' },
      { header: 'Department', dataKey: 'department' },
      { header: 'Date of Birth', dataKey: 'date_birth' },
      { header: 'Job', dataKey: 'job' },
      { header: 'Hire Date', dataKey: 'hire_date' },
      { header: 'Salary', dataKey: 'salary' },
      { header: 'ID Card', dataKey: 'id_card' },
      { header: 'Phone', dataKey: 'phone' },
      { header: 'Gender', dataKey: 'gender' },
      { header: 'Contract Type', dataKey: 'contract_type' }
    ];

    // Auto-table configuration
    (doc as any).autoTable({
      head: [columns.map(col => col.header)],
      body: filteredData,
      startY: 50,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        halign: 'center',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [0, 57, 107], // Custom header color
        textColor: [255, 255, 255], // White text color
        fontStyle: 'bold'
      },
      footStyles: {
        fillColor: [0, 57, 107], // Custom footer color
        textColor: [255, 255, 255], // White text color
        fontStyle: 'bold'
      },
      didDrawPage: function (data) {
        // Footer
        var str = 'Page ' + data.pageNumber;
        doc.setFontSize(10);
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      }
    });

    doc.save('employees.pdf');
  }
}
