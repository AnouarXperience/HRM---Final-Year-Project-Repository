import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductService } from 'src/app/sevices/product.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  oneproduct:any
  form:FormGroup //tsconfig strict=false
  id=this.activerouter.snapshot.params["id"]
  constructor(private service:ProductService,
    private activerouter:ActivatedRoute,
    private formbuilder:FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.productone(),
    this.form=this.formbuilder.group({
    name:['',Validators.required],
    description:['',Validators.required],
    price:['',Validators.required],
    qte:['',Validators.required],
  })
}
productone(){
  this.service.getproduct(this.id).subscribe((res:any)=>{
    this.oneproduct= res
    this.form.patchValue({
      name:this.oneproduct.name,
      description:this.oneproduct.description,
      price:this.oneproduct.price,
      qte:this.oneproduct.qte

    })
    console.log("Product details :",this.oneproduct);
  })
}




}
