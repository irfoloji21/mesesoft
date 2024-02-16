import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit, OnDestroy {

  public userInfo: any;
  userInitials: string;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.loadUser().subscribe(res => {
      this.userInfo = res.user;
      this.userInitials = this.getInitials(this.userInfo.firstName, this.userInfo.lastName, this.userInfo.email, this.userInfo.phoneNumber);
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getInitials(firstName: string, lastName: string, email: string, phoneNumber: string): string {
    return `${firstName} ${lastName} ${email} ${phoneNumber}`;
  }
}
