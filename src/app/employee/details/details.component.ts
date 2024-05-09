import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { EmployeeService } from 'src/app/sevices/employee.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  oneemployee:any;
  id=this.activerouter.snapshot.params["id"]
  imageUrl: string | ArrayBuffer = '';


  constructor(private employeeService: EmployeeService,
    private activerouter:ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.loadEmployeeDetails();
  }

  loadEmployeeDetails() {
    this.employeeService.getemployee(this.id).subscribe((res: any) => {
      this.oneemployee = res;
      this.imageUrl = `http://localhost:8086/employee/files/${this.oneemployee.image}`;
      // Autres opérations nécessaires
      console.log("Employee details:", this.oneemployee);
    });
  }

}
