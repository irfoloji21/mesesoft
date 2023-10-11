import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss']
})
export class HeaderOneComponent implements OnInit {
  
  @Input() class: string;
  @Input() themeLogo: string = 'assets/images/icon/logo.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false
  isLoggedIn : boolean;
  public stick: boolean = false;
  public userInf ;

  constructor(private serviceAuth: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.serviceAuth.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      console.log('Oturum Durumu Değişti', loggedIn);
    });

    this.serviceAuth.loadUser().subscribe(res => {
      console.log(res , "res")
     this.userInf  =res.user ; 
    })
  }
  
  logout(): void {
    this.serviceAuth.logout();
    this.router.navigate(['/pages/login']);
  }
  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  	if (number >= 150 && window.innerWidth > 400) { 
  	  this.stick = true;
  	} else {
  	  this.stick = false;
  	}
  }

}
