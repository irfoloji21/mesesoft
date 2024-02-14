import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public active = 1;
  private isUserLoggedIn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toasts: ToastrService
  ) {
    this.createLoginForm();
  }

  owlcarousel = [
    {
      title: "Welcome to MeseSoft",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to MeseSoft",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to MeseSoft",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    }
  ]

  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required], 
    });
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.checkUserLoginStatus();
    this.createRegisterForm();
  }

  private checkUserLoginStatus() {
    this.authService.loadShop().subscribe(
      (response) => {
        this.isUserLoggedIn = response.success;
        if (this.isUserLoggedIn) {
          this.router.navigate(['/dashboard/default']); 
        }
      },
      (error) => {
        console.error('Backend error:', error);
      }
    );
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
          this.router.navigate(['/dashboard/default'], { state: formData });
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
