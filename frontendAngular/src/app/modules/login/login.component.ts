import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService, 
    private toasts: ToastrService
  ) { }

  loginForm: FormGroup;
  private loginSubscription: Subscription;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
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

    this.loginSubscription = this.authService.login(formData.email, formData.password)
      .subscribe(response => {
        if (response.success) {
          this.authService.setUserId(response.user._id)
          this.toasts.success('Login successful', '',
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
          this.toasts.error('Login failed', '',
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
