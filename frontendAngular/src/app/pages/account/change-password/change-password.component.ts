import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  
  constructor(private authService: AuthService, private fb: FormBuilder, private toasts : ToastrService) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
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
              this.toasts.success('Şifreniz başarıyla değiştirildi.', '' ,
                { 
                  positionClass: 'toast-top-right',
                  timeOut: 2500, 
                  closeButton: true,
                  newestOnTop: false,
                  progressBar: true,
                })
            },
            (error) => {
              this.toasts.error('Şifreniz değiştirilemedi.',  '' ,
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
      } else {
        this.passwordForm.setErrors({ passwordMismatch: true });
      }
    }

    // if (this.passwordForm.valid) {
    //   const oldPassword = this.passwordForm.get('oldPassword').value;
    //   const newPassword = this.passwordForm.get('newPassword').value;
    //   const confirmPassword = this.passwordForm.get('confirmPassword').value;

    //   this.authService.updateUserPassword(oldPassword, newPassword, confirmPassword)
    //     .subscribe(
    //       (response) => {
    //         console.log(response + "response");
            
    //       },
    //       (error) => {
    //         // Hata durumunda burada gerekli işlemleri gerçekleştirin.
    //         console.log(error + "error");
            
    //       }
    //     );
    // }
  }

  ngOnInit(): void {
  }

}
