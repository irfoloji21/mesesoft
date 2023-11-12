import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { ProfileComponent } from '../profile/profile.component';
import { AddressComponent } from '../address/address/address.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { CouponComponent } from '../coupon/coupon.component';
import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public userInf;
  userInitials: string;
  public openDashboard: boolean = false;

  constructor(private serviceAuth: AuthService, private router: Router) { }

  menuItems = [
    { label: 'My Account', component: ProfileComponent },
    // { label: 'Account Info', component: AccountInfoComponent },
    { label: 'Address Book', component: AddressComponent },
    { label: 'My Orders', component: OrderComponent },
    { label: 'My Wishlist', component: WishlistComponent },
    { label: 'Change Passwort', component: ChangePasswordComponent },
    { label: 'Coupon' , component:CouponComponent}
  ]

  selectedMenuItem: any;

  ngOnInit(): void {
    this.serviceAuth.loadUser().subscribe(res => {
      this.userInf  =res.user ; 
      this.userInitials = this.getInitials(this.userInf.firstName, this.userInf.lastName);
     })
     this.selectedMenuItem = this.menuItems[0];
  }

  selectMenuItem(item: any): void {
    this.selectedMenuItem = item;
  }
  
  logout(): void {
    this.serviceAuth.logout();
    this.router.navigate(['/pages/login']);
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  }

}
