import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toasts: ToastrService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.customPasswordValidator()]]
    });
  }

  customPasswordValidator() {
    return (control: FormGroup) => {
      const newPassword = control.value;
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasSpecialCharacter = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(newPassword);

      if (hasUppercase && hasSpecialCharacter) {
        return null; 
      } else {
        return { passwordInvalid: true };
      }
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const requestOptions = {
        headers,
        withCredentials: true,
      };

      this.authService.register(formData.firstName, formData.lastName, formData.email, formData.password).subscribe(
        (user) => {
          if (user.success) {
            this.authService.setUserId(user._id);
            this.toasts.success(' mailinize gelen doğrulamayı yapın.', 'Kayıt başarılı',

              {
                positionClass: 'toast-top-right',
                timeOut: 4500,
                closeButton: true,
                newestOnTop: false,
                progressBar: true,
              })
            this.router.navigate(['/login'], { state: formData });
          }
          else {
            console.error("error");
            this.toasts.error('Kayıt başarısız', '',
              {
                positionClass: 'toast-top-right',
                timeOut: 2500,
                closeButton: true,
                newestOnTop: false,
                progressBar: true,
              })
          }
        }
      );
    }
  }
}
