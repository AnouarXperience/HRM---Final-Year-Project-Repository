import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/sevices/product.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  oneproduct:any
  id=this.activaterouter.snapshot.params["id"]
  constructor(private service:ProductService,
  private activaterouter:ActivatedRoute) { }

  ngOnInit(): void {
    this.getproductone();
  }
  getproductone(){
    this.service.getproduct(this.id).subscribe((res:any)=>{
      this.oneproduct= res
      console.log("Product details :",this.oneproduct);
    })
  }

}
