import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAuthService } from './user-auth.service';

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


  public login(loginRequest): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/api/auth/signin`, loginRequest).pipe(
      tap((response: any) => {
        // Check the structure of your response and adapt accordingly
        if (response && response.username) {
          sessionStorage.setItem('username', response.username); // Store username in sessionStorage
        }
        // Additionally, handle token storage here if your application uses JWT or another token system
        if (response && response.token) {
          sessionStorage.setItem('token', response.token); // Store the token
        }
      })
    );
  }
  getUsername(): string | null {
    return sessionStorage.getItem('username'); // Method to fetch username from session
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
  changePass(payload: any){
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
}



