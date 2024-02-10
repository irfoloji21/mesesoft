import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'multikart-backend';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.loadShop().subscribe(
      (shop) => {
        if (shop) {
          this.authService.setShop(shop);
        }
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }
}
