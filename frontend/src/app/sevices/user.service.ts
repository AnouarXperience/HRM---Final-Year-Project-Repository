import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAuthService } from './user-auth.service';

export interface UserProfile {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  job: string;
  address: string;
  phone: string;
  email:string;
  id_card :string;
  salary:string;
  date_birth:string;
  hire_date:string;
  department:string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  localStorage: any;






  // requestHeader = new HttpHeaders(
  //   {
  //     "No-Auth":"True"
  //   }
  // );
  constructor(private httpClient: HttpClient, private userAuthService : UserAuthService) { }


  public login(loginRequest: any): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/api/auth/signin`, loginRequest).pipe(
      tap((response: any) => {
        if (response) {
          if (response.username) {

            localStorage.setItem('username', response.username); // Store username in localStorage
          } else {
            console.error('Username not found in response'); // Log an error if username is not found
          }
          if (response.jwt) {
          
            localStorage.setItem('token', response.jwt); // Store the token in localStorage
          } else {
            console.error('Token not found in response'); // Log an error if token is not found
          }
        } else {
          console.error('Response is null or undefined'); // Log an error if response is null or undefined
        }
      })
    );
  }

  getUserProfile(): Observable<UserProfile> {
    const username = localStorage.getItem('username');
    if (username) {
        return this.httpClient.get<UserProfile>(`${environment.baseurl}/users/username/${username}`);
    } else {
        throw new Error('No username found in session');
    }
}
  getoneusers(id: number): Observable<any> {
    return this.httpClient.get(`${environment.baseurl}/users/getone/${id}`);
  }

  public signout(token: string): Observable<any> {
    // Inclure le token dans l'en-tête de la requête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Faire la requête de déconnexion avec l'en-tête d'autorisation
    return this.httpClient.post(`${environment.baseurl}/api/auth/signout`, {}, { headers });
  }

  public forUser() {
    return this.httpClient.get(`${environment.baseurl}` + '/api/auth/signin', {
      responseType: 'text',
    });
  }


  public forAdmin() {
    return this.httpClient.get(`${environment.baseurl}` + '/api/auth/signin', {
      responseType: 'text',
    });
  }
  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: string[] = this.userAuthService.getRoles();

    if (userRoles != null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i] === allowedRoles[j]) {
            return true;
          }
        }
      }
    }
    return false;
  }
  changePass(payload: { username: string; currentPassword: string; newPassword: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/users/changepassword`, payload);
}


  forgotPass(email: string) {
    return this.httpClient.post(`${environment.baseurl}/users/forgetpassword`, { email: email });
  }


  resetPass(verificationCode: string, newPassword: string): Observable<any> {
    const url = `${environment.baseurl}/users/resetpassword`;
    return this.httpClient.post(url, { verificationCode, newPassword }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Service error: ${error.status} ${error.statusText}`, error.error);
        return throwError(() => new Error(`Failed to reset password due to server error: ${error.message}`));
      })
    );
  }

  updateadmin(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/administrateur/updateAdmin/${id}`, formData);
  }

  resetAdminImage(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/administrateur/resetImage/${id}`, formData);
  }


}



