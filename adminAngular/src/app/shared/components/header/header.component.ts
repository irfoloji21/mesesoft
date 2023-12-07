import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavService } from '../../service/nav.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  public shop: any;
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;
  isLoggedIn: boolean;
  userInitials: string;

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(
    public navServices: NavService,
    private authService: AuthService,
    private router: Router,
  ) { }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }

  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  getAuth() {
    this.authService.loadShop().subscribe(
      (shop) => {
        this.shop = shop.seller;
        this.userInitials = this.getInitials(this.shop.name);
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }

  getLogin() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('isLoggedIn$ değeri:', isLoggedIn);
    });
  }

  ngOnInit() {
    this.getAuth();
    this.getLogin();
  }

  getInitials(name: string): string {
    return (name).toUpperCase();
  }

  profile(): void {
    this.router.navigate(['/pages/dashboard'])
  }

  logout() {
    this.authService.logout();
  }

}
