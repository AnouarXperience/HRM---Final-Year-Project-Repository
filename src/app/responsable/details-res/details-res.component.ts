import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponsableService } from 'src/app/sevices/responsable.service';

@Component({
  selector: 'app-details-res',
  templateUrl: './details-res.component.html',
  styleUrls: ['./details-res.component.css']
})
export class DetailsResComponent implements OnInit {
  oneRes:any;
  id=this.activerouter.snapshot.params["id"]
  imageUrl: string | ArrayBuffer = '';


  constructor(private employeeService: ResponsableService,
    private activerouter:ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.loadResDetails();
  }

  loadResDetails() {
    this.employeeService.getResponsable(this.id).subscribe((res: any) => {
      this.oneRes = res;
      this.imageUrl = `http://localhost:8086/responsable/files/${this.oneRes.image}`;
      // Autres opérations nécessaires
      console.log("Responsable details:", this.oneRes);
    });
  }


}
