import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-espace-candidat',
  templateUrl: './espace-candidat.component.html',
  styleUrls: ['./espace-candidat.component.css']
})
export class EspaceCandidatComponent implements OnInit {

  constructor(private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService) { }

  ngOnInit(): void {
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }


}
