import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
  error: boolean = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const activation_token = params['activation_token'];

      if (activation_token) {
        this.authService.activateUser(activation_token).subscribe(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            this.error = true;
          }
        );
      }
    });
  }
}

