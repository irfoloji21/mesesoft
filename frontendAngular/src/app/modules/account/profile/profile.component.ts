import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {
  isAddingNew:boolean=false;
  public userInf;
  userInitials: string;
  updateForm: FormGroup;
  private userSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private serviceAuth: AuthService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.serviceAuth.loadUser().subscribe(res => {
      this.userInf = res.user;
      this.userInitials = this.getInitials(this.userInf.firstName, this.userInf.lastName, this.userInf.email, this.userInf.phoneNumber);
    });
    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleAddingNew() {
    this.isAddingNew = !this.isAddingNew;
  }

  getInitials(firstName: string, lastName: string, email: string, phoneNumber: number): string {
    return `${firstName} ${lastName} ${email} ${phoneNumber}`;
  }

  onSubmit() {
    const formData = this.updateForm.value;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const requestOptions = {
      headers,
      withCredentials: true,
    };

    this.serviceAuth.updateUser(formData).subscribe(
      (user) => {
        if (user.success) {

        }
        else {
          console.error("error");
        }
      }
    );
  }

}
