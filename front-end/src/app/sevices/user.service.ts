import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // requestHeader = new HttpHeaders(
  //   {
  //     "No-Auth":"True"
  //   }
  // );
  constructor(private httpClient: HttpClient) { }

  public login(loginRequest){
    return this.httpClient.post(`${environment.baseurl}/api/auth/signin`, loginRequest)
    //   return this.httpClient.post<any>(`${environment.baseurl}/api/auth/signin`, loginData, { headers: headers });
  }

  
  // constructor(private httpClient: HttpClient) { }
  // public login(loginData) {
  //   // Retrieve token from localStorage
  //   const token = localStorage.getItem('token');

  //   // Create headers with token
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });

  //   // Make HTTP request with headers
  //   return this.httpClient.post<any>(`${environment.baseurl}/api/auth/signin`, loginData, { headers: headers });
  // }


}
