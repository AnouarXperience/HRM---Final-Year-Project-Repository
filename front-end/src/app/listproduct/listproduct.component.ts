import { Component, OnInit } from '@angular/core';
import { ProductService } from '../sevices/product.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.css']
})
export class ListproductComponent implements OnInit {
  listproduct:any
  constructor(private service:ProductService) { }

  ngOnInit(): void {
    this.allproduct();
  }
  allproduct(){
    this.service.getallproduct().subscribe((res:any)=>{
      this.listproduct= res
      console.log("list of product :",this.listproduct);
    })
  }
  deleteproduct(id:any){
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
        this.service.removeproduct(id).subscribe((res:any)=>{
            console.log("produit supprime",res);
            this.allproduct();

        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })

  }

}
