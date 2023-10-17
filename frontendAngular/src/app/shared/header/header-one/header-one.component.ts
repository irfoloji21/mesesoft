import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

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
  wishlistCount: number ;
  userInitials: string;

  constructor(private serviceAuth: AuthService, private productService: ProductService ,private router: Router) { }

  ngOnInit(): void {
    this.serviceAuth.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      console.log('Oturum Durumu Değişti', loggedIn);
    });

    this.serviceAuth.loadUser().subscribe(res => {
     this.userInf  =res.user ; 
     this.userInitials = this.getInitials(this.userInf.firstName, this.userInf.lastName);
    })

    this.productService.getWishlistCountObservable().subscribe((count) => {
      console.log(count)
      this.wishlistCount = count;
    });
    
  }

  profile(): void {
    this.router.navigate(['/pages/dashboard'])
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

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) +lastName.charAt(0)).toUpperCase();
  }
}
