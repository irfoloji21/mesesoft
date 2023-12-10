import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  public userInf;
  userInitials: string;
  updateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private serviceAuth: AuthService
  ) { }

  ngOnInit(): void {
    this.serviceAuth.loadUser().subscribe(res => {
      this.userInf = res.user ; 
      this.userInitials = this.getInitials(this.userInf.firstName, this.userInf.lastName, this.userInf.email, this.userInf.phoneNumber);
     })
    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  getInitials(firstName: string, lastName: string, email: string, phoneNumber: number): string {
    return `${firstName} ${lastName} ${email} ${phoneNumber}`;
  }

  onSubmit() {
    const formData = this.updateForm.value;
    console.log(formData , "formData")
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const requestOptions = {
      headers,
      withCredentials: true, 
    };

    this.serviceAuth.updateUser(formData).subscribe(
      (user) => {
        if(user.success) {
          console.log("update success", user);
        }
        else {
          console.error("error");
        }
      }
    );
  }

}
