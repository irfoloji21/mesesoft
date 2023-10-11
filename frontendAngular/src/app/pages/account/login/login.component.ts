import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpHeaders } from '@angular/common/http'; 



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const formData = this.loginForm.value;

       const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const requestOptions = {
        headers,
        withCredentials: true, 
      };


    this.authService.login(formData.email, formData.password)
      .subscribe(response => {
        if (response.success) {
          console.log("success", response);
          this.authService.setUserId(response.user._id)
          this.router.navigate(['/home/fashion'], { state: formData });
        } else {
          console.error("error");
        }
      });
  }
}
