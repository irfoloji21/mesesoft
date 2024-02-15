import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService, 
    private toasts: ToastrService
  ) { }

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
          this.authService.setUserId(response.user._id)
          this.toasts.success('Giriş başarılı', '',
            {
              positionClass: 'toast-top-right',
              timeOut: 2500,
              closeButton: true,
              newestOnTop: false,
              progressBar: true,
            })
          this.router.navigate(['/home/fashion'], { state: formData });
        } else {
          console.error("error");
          this.toasts.error('Giriş başarısız', '',
            {
              positionClass: 'toast-top-right',
              timeOut: 2500,
              closeButton: true,
              newestOnTop: false,
              progressBar: true,
            })
        }
      });
  }
}
