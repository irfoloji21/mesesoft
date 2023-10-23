import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/classes/product';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  public checkoutForm: FormGroup;
  public products: Product[] = [];
  public payment: string = 'Stripe';
  public amount: any;
  userAddresses: any[];
  public orderId: any;
  public customerEmail : any;

  
  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    private orderService: OrderService
  ) { 
    this.checkoutForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expirationMonth: ['', Validators.required],
      expirationYear: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      termsCheckbox: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(response => {
      console.log(response, "checkout");
      this.products = response;
    });
    this.getTotal.subscribe(amount => this.amount = amount);
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

 

  // Stripe Payment Gateway
  stripeCheckout(orderId: any, customerEmail: any) {
    const paymentData = {
      amount: this.amount,
      cardNumber: this.checkoutForm.value.cardNumber,
      expirationMonth: this.checkoutForm.value.expirationMonth,
      expirationYear: this.checkoutForm.value.expirationYear,
      cvv: this.checkoutForm.value.cvv,
      userAddresses: this.userAddresses 
    };
    
    this.orderService.createOrder(this.products, this.checkoutForm.value, orderId, this.amount, customerEmail).subscribe(
      (response) => {
        console.log('Payment successful');
        console.log(response, "responsePayment")
      },
      (error) => {
        console.error('Payment failed:', error);
      }
    );
  }

  
  

  // Paypal Payment Gateway
  private initConfig(): void {
    // this.payPalConfig = {
    //     currency: this.productService.Currency.currency,
    //     clientId: environment.paypal_token,
    //     createOrderOnClient: (data) => < ICreateOrderRequest > {
    //       intent: 'CAPTURE',
    //       purchase_units: [{
    //           amount: {
    //             currency_code: this.productService.Currency.currency,
    //             value: this.amount,
    //             breakdown: {
    //                 item_total: {
    //                     currency_code: this.productService.Currency.currency,
    //                     value: this.amount
    //                 }
    //             }
    //           }
    //       }]
    //   },
    //     advanced: {
    //         commit: 'true'
    //     },
    //     style: {
    //         label: 'paypal',
    //         size:  'small', // small | medium | large | responsive
    //         shape: 'rect', // pill | rect
    //     },
    //     onApprove: (data, actions) => {
    //         this.orderService.createOrder(this.products, this.checkoutForm.value, data.orderID, this.getTotal);
    //         console.log('onApprove - transaction was approved, but not authorized', data, actions);
    //         actions.order.get().then(details => {
    //             console.log('onApprove - you can get full order details inside onApprove: ', details);
    //         });
    //     },
    //     onClientAuthorization: (data) => {
    //         console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    //     },
    //     onCancel: (data, actions) => {
    //         console.log('OnCancel', data, actions);
    //     },
    //     onError: err => {
    //         console.log('OnError', err);
    //     },
    //     onClick: (data, actions) => {
    //         console.log('onClick', data, actions);
    //     }
    // };
  }


}
