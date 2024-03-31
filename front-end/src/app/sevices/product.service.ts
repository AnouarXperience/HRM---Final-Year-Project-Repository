import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  getallproduct(){
    return this.http.get(`${environment.baseurl}/products/All`)
   }
   removeproduct(id:any){
    return this.http.delete(`${environment.baseurl}/products/delet/${id}`)
 }
 editproduct(id:any,products:any){
  return this.http.put(`${environment.baseurl}/products/updatep/${id}`,products)
 }
  getproduct(id:any){
  return this.http.get(`${environment.baseurl}/products/getone/${id}`)
  }
}
