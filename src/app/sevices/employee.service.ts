import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  getallemployee(){
    return this.http.get(`${environment.baseurl}/employee/all`);
   }

   signupEmployee(signUpRequest: any, file?: File) {
    const formData: FormData = new FormData();

    // Ajoute les données d'inscription au FormData
    Object.keys(signUpRequest).forEach(key => {
      formData.append(key, signUpRequest[key]);
    });

    // Si un fichier est fourni, l'ajoute au FormData
    if (file) {
      formData.append('file', file, file.name);
    }

    // Effectue la requête POST avec le FormData
    return this.http.post(`${environment.baseurl}/employee/signup`, formData);
  }

  removeEmployee(id:any){
    return this.http.delete(`${environment.baseurl}/employee/delete/${id}`)
  }

  getemployee(id:any){
    return this.http.get(`${environment.baseurl}/employee/getone/${id}`)
    }

    modfieremployee(id: any, employeeData: any, selectedFile?: File) {
      const formData = new FormData();

      Object.keys(employeeData).forEach(key => {
          formData.append(key, employeeData[key]);
      });

      if (selectedFile) {
          formData.append('file', selectedFile, selectedFile.name);
      } else {
          // Optionnellement, vous pouvez décider d'envoyer un drapeau indiquant de garder l'image existante
          // formData.append('keepExistingImage', 'true'); // Votre backend doit gérer ce cas
      }

      return this.http.put(`${environment.baseurl}/employee/updateEmp/${id}`, formData);
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.baseurl}/employee/exists/username/${username}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.baseurl}/employee/exists/email/${email}`);
  }







  }






