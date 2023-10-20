import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { TypographyComponent } from '../../typography/typography.component';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { ProfileComponent } from '../profile/profile.component';
import { AccountInfoComponent } from '../account-info/account-info.component';
import { AddressComponent } from '../address/address/address.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public userInf;
  userInitials: string;
  public openDashboard: boolean = false;

  constructor(private serviceAuth: AuthService, private router: Router, private route: ActivatedRoute) { }

  menuItems = [
    { label: 'Account Info', componentName: 'account-info', component: AccountInfoComponent },
    { label: 'Address Book', componentName: 'address', component: AddressComponent },
    { label: 'My Orders', componentName: 'wishlist', component: ForgetPasswordComponent },
    { label: 'My Wishlist', componentName: 'account/wishlist', component: WishlistComponent },
    { label: 'Newsletter', componentName: 'forget/password', component: ForgetPasswordComponent },
    { label: 'My Account', componentName: 'profile', component: ProfileComponent },
    { label: 'Change Passwort', componentName: 'change/password', component: ChangePasswordComponent },
  ];

  selectedMenuItem: any;

  ngOnInit(): void {
    this.serviceAuth.loadUser().subscribe(res => {
      this.userInf  =res.user ; 
      this.userInitials = this.getInitials(this.userInf.firstName, this.userInf.lastName);
     })

     this.route.params.subscribe(params => {
      const componentName = params['componentName'];

      if (componentName) {
        // Burada route parametresine göre uygun componenti seçin
        this.selectedMenuItem = this.menuItems.find(item => item.componentName === componentName);
      } else {
        this.selectedMenuItem = this.menuItems[0];
      }
    });
  }

  selectMenuItem(item: any): void {
    this.router.navigate(['/pages/dashboard', { componentName: item.componentName }]);
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
