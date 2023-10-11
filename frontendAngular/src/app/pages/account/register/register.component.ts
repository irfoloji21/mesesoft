import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService :AuthService , private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;
  
      this.authService.register(firstName, lastName, email, password).subscribe(
        (user) => {
          console.log("register succes", user);
          this.authService.setUserId(user._id);
  
          // Başarılı kayıt sonrası giriş sayfasına yönlendir
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error("register unsucces", error);
        }
      );
    }
  }
  
  
}
