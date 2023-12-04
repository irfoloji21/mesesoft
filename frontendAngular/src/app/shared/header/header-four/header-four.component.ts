import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header-four',
  templateUrl: './header-four.component.html',
  styleUrls: ['./header-four.component.scss']
})

export class HeaderFourComponent implements OnInit {

  @Input() class: string = 'header-2 header-6';
  @Input() themeLogo: string = 'assets/images/icon/logo.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false

  isLoggedIn: boolean;
  public stick: boolean = false;
  public userInf;
  wishlistCount: number;
  userInitials: string;
  form: FormGroup;

  constructor(
    private serviceAuth: AuthService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(response => {
      //  console.log(response , "headerFour")
      this.form = this.formBuilder.group({
        search: [''],
      });
    });

  }
  submitSearch() {
    const searchValue = this.form.get('search').value;
    // console.log(searchValue , "searchValue")
    const queryParams = {
      search: searchValue
    };

    this.router.navigate(['/shop/collection/left/sidebar'], {
      queryParams,
      queryParamsHandling: 'merge' // Bu, mevcut sorgu parametreleri ile birleştirir
    });
  }

  // resetForm() {
  //   this.form.reset();
  // }

  ngOnInit(): void {
    this.serviceAuth.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      console.log('Oturum Durumu Değişti', loggedIn);
    });

    this.serviceAuth.loadUser().subscribe(res => {
      this.userInf = res.user;
      this.userInitials = this.getInitials(this.userInf.firstName, this.userInf.lastName);
    })

    this.productService.getWishlistCountObservable().subscribe((count) => {
      // console.log(count)
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
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
}
