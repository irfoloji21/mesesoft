import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ShopService } from 'src/app/shared/service/shop.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  shop: any;
  public active = 1;
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
        this.shop = shop.seller;
        this.initForm();  
        this.profileForm.patchValue(shop.seller);
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }
  

   initForm() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      description: [''],
      address: ['']
    });
  }

  onSubmit() {
    
    const formData = this.profileForm.value;
    formData._id = this.shop._id;
    console.log('Form değerleri:', formData)
  
    
    this.shopService.updateShop(formData).subscribe(
      (response) => {
        console.log('Shop güncellendi:', response);
      },
      (error) => {
        console.error('Shop güncelleme hatası:', error);
      }
    );
  }
  

}
