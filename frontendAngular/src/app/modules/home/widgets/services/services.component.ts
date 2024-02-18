import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})

export class ServicesComponent implements OnInit {
  private cartItemsSubscription: Subscription;
  constructor(
    private router: Router,
    private productService: ProductService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
  }

  onlinePayment() {
    this.cartItemsSubscription = this.productService.cartItems.subscribe(res => {
      if (res.length > 0) {
        this.router.navigate(['shop/checkout']);
      }
      else {
        this.toast.error('Unable to proceed with the transaction. Please add items to your cart.', 'Your cart is empty')
      }
    });
  }

}
