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
  email: string;
  id_card: string;
  salary: string;
  date_birth: string;
  hire_date: string;
  department: string;
  contract_type: String;
  gender: String;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private userAuthService: UserAuthService) { }



  public login(loginRequest: any): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/api/auth/signin`, loginRequest).pipe(
      tap((response: any) => {
        if (response) {
          if (response.username) {
            this.userAuthService.setUsername(response.username); // Store encrypted username
          } else {
            console.error('Username not found in response'); // Log an error if username is not found
          }
          if (response.jwt) {
            this.userAuthService.setToken(response.jwt); // Store encrypted token
          } else {

          }
          if (response.id) {
            this.userAuthService.setUserId(response.id); // Store encrypted user ID
          } else {
            console.error('User ID not found in response'); // Log an error if user ID is not found
          }
        } else {
          console.error('Response is null or undefined'); // Log an error if response is null or undefined
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Failed to login: ' + error.message));
      })
    );
  }

  UserProfileById(): Observable<UserProfile> {
    const userId = this.userAuthService.getUserId();
    if (userId) {
      return this.httpClient.get<UserProfile>(`${environment.baseurl}/users/getone/${userId}`).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Get user profile error:', error);
          return throwError(() => new Error('Failed to get user profile: ' + error.message));
        })
      );
    } else {
      return throwError(() => new Error('User ID not found in session'));
    }
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
    return this.httpClient.get(`${environment.baseurl}/users/getone/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Get one user error:', error);
        return throwError(() => new Error('Failed to get user: ' + error.message));
      })
    );
  }

  public signout(): Observable<any> {
    const token = this.userAuthService.getToken();
    if (!token) {
      return throwError(() => new Error('No token found for signout'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post(`${environment.baseurl}/api/auth/signout`, {}, { headers }).pipe(
      tap(() => {
        this.userAuthService.clear();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Signout error:', error);
        return throwError(() => new Error('Failed to sign out: ' + error.message));
      })
    );
  }

  public forUser(): Observable<string> {
    return this.httpClient.get(`${environment.baseurl}/api/auth/signin`, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('forUser error:', error);
        return throwError(() => new Error('Failed to get user: ' + error.message));
      })
    );
  }

  public forAdmin(): Observable<string> {
    return this.httpClient.get(`${environment.baseurl}/api/auth/signin`, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('forAdmin error:', error);
        return throwError(() => new Error('Failed to get admin: ' + error.message));
      })
    );
  }

  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: string[] = this.userAuthService.getRoles();
    if (userRoles) {
      return allowedRoles.some(role => userRoles.includes(role));
    }
    return false;
  }

  changePass(payload: { userId: number; currentPassword: string; newPassword: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/users/changepassword`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Change password error:', error);
        return throwError(() => new Error('Failed to change password: ' + error.message));
      })
    );
  }

  forgotPass(email: string): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/users/forgetpassword`, { email }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Forgot password error:', error);
        return throwError(() => new Error('Failed to send forgot password request: ' + error.message));
      })
    );
  }

  resetPass(verificationCode: string, newPassword: string): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/users/resetpassword`, { verificationCode, newPassword }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Reset password error:', error);
        return throwError(() => new Error('Failed to reset password: ' + error.message));
      })
    );
  }

  updateadmin(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/administrateur/updateAdmin/${id}`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Update admin error:', error);
        return throwError(() => new Error('Failed to update admin: ' + error.message));
      })
    );
  }

  resetAdminImage(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/administrateur/resetImage/${id}`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Reset admin image error:', error);
        return throwError(() => new Error('Failed to reset admin image: ' + error.message));
      })
    );
  }

  getCurrentUserProfile(): Observable<UserProfile> {
    const username = this.userAuthService.getusername();
    return this.httpClient.get<UserProfile>(`${environment.baseurl}/users/username/${username}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Get user profile error:', error);
        return throwError(() => new Error('Failed to get user profile: ' + error.message));
      })
    );
  }
}
