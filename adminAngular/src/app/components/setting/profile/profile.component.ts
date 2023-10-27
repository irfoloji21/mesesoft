import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  shop: any;
  public active = 1;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
        this.shop = shop.seller;
        console.log(this.shop);
        
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
   }

}
