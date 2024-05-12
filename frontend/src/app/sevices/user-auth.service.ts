import { Injectable } from '@angular/core';
// import { UserService } from 'src/app/sevices/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor()
  {}
  public setRoles(roles: string[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles'));
  }

  public setToken(jwtToken: string): void {
    localStorage.setItem('jwtToken', jwtToken);
  }

  public getToken(): string {
    return localStorage.getItem('jwtToken');
  }

  public clear() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('roles');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  
}
