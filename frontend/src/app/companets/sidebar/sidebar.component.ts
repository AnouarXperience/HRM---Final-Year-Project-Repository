import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isSidebarExpanded = true;

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

}
