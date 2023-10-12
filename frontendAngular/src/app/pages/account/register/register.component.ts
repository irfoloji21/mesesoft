import { HttpHeaders } from '@angular/common/http';
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
      const formData = this.registerForm.value;
       console.log(formData , "formData")
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const requestOptions = {
        headers,
        withCredentials: true, 
      };

      
      this.authService.register(formData.firstName, formData.lastName, formData.email, formData.password).subscribe(
        (user) => {
          if(user.success) {
            console.log("register success", user);
            this.authService.setUserId(user.user._id);
            this.router.navigate(['/login'], { state: formData });
          }
          else {
            console.error("error");
          }
        }
      );

  }


}
