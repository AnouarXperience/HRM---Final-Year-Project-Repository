import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { UserService } from 'src/app/sevices/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor() {}

  public setRoles(roles: string[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles'));
  }

  public setToken(jwtToken: string): void {
    localStorage.setItem('jwtToken', jwtToken);
    this.loggedIn.next(true);
  }

  public getToken(): string {
    return localStorage.getItem('jwtToken');
  }


  public clear(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public getLoggedInObservable() {
    return this.loggedIn.asObservable();
  }

  public isAdmin(): boolean {
    const roles = this.getRoles();
    return roles.includes('Administrateur');
  }
}
