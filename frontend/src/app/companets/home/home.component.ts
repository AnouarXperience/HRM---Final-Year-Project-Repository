import { ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef,public userService: UserService) { }

  ngOnInit(): void {
  }
  showBackToTop = false;
  updateVisibility() {
    this.zone.run(() => {
      this.showBackToTop = window.pageYOffset > 100;
    });
    this.cdr.detectChanges(); // Force change detection if needed
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
      const threshold = 100;
      const yPosition = window.pageYOffset || document.documentElement.scrollTop;
      this.showBackToTop = yPosition > threshold;
      // console.log('Scroll Event Triggered', this.showBackToTop); // Vérifiez si cela s'imprime lors du défilement
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
