import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder, 
    private toasts: ToastrService, 
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), this.customPasswordValidator()]],
      confirmPassword: ['', Validators.required],
    });
  }

  isUppercaseMissing(password: string): boolean {
    return !/[A-Z]/.test(password);
  }

  isSpecialCharacterMissing(password: string): boolean {
    return !/[!@#$%^&*()_+[\]{};':"\|,.<>/?-]/.test(password);
  }

  customPasswordValidator() {
    return (control: FormGroup) => {
      const newPassword = control.value;
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasSpecialCharacter = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(newPassword);

      if (hasUppercase && hasSpecialCharacter) {
        return null; // Şifre gereksinimlerini karşılıyor.
      } else {
        return { passwordInvalid: true }; // Şifre gereksinimlerini karşılamıyor.
      }
    };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.get('oldPassword').value;
      const newPassword = this.passwordForm.get('newPassword').value;
      const confirmPassword = this.passwordForm.get('confirmPassword').value;

      if (newPassword === confirmPassword) {
        this.authService.updateUserPassword(oldPassword, newPassword, confirmPassword)
          .subscribe(
            (response) => {
              this.toasts.success('Şifreniz başarıyla değiştirildi.', '',
                {
                  positionClass: 'toast-top-right',
                  timeOut: 2500,
                  closeButton: true,
                  newestOnTop: false,
                  progressBar: true,
                })
            },
            (error) => {
              this.toasts.error('Şifreniz değiştirilemedi.', '',
                {
                  positionClass: 'toast-top-left',
                  timeOut: 2500,
                  closeButton: true,
                  newestOnTop: false,
                  progressBar: true,
                }
              )
            }
          );
        this.router.navigate(['/pages/dashboard']);
      } else {
        this.passwordForm.setErrors({ passwordMismatch: true });
      }
    }
  }

  ngOnInit(): void {
  }

}
