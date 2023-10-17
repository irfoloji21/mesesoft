import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  
  constructor(private authService: AuthService) { }

  onSubmit() {
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.get('oldPassword').value;
      const newPassword = this.passwordForm.get('newPassword').value;
      const confirmPassword = this.passwordForm.get('confirmPassword').value;

      this.authService.updateUserPassword(oldPassword, newPassword, confirmPassword)
        .subscribe(
          (response) => {
            console.log(response + "response");
            
          },
          (error) => {
            // Hata durumunda burada gerekli işlemleri gerçekleştirin.
            console.log(error + "error");
            
          }
        );
    }
  }

  ngOnInit(): void {
  }

}
