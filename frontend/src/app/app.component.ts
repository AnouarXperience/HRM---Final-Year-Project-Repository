import { Component, OnInit } from '@angular/core';
import { TokenExpirationService } from './sevices/token-expiration.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  constructor(private tokenExpirationService: TokenExpirationService) {}
  ngOnInit(): void {
    this.tokenExpirationService.startTokenExpiryCheck();
  }

  title = 'dashbord';


}
