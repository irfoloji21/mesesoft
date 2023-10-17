import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  
  public userInf;
  userInitials: string;

  constructor(private serviceAuth: AuthService, private router: Router,) { }

  ngOnInit(): void {
    this.serviceAuth.loadUser().subscribe(res => {
      this.userInf = res.user ; 
      this.userInitials = this.getInitials(this.userInf.firstName, this.userInf.lastName, this.userInf.email, this.userInf.phoneNumber);
     })
  }

  getInitials(firstName: string, lastName: string, email: string, phoneNumber: number): string {
    return `${firstName} ${lastName} ${email} ${phoneNumber}`;
  }
}
