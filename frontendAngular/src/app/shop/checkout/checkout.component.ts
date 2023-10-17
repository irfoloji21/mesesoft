import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public checkoutForm:  UntypedFormGroup;
  public products: Product[] = [];
   public payPalConfig ? : any;
  public payment: string = 'Stripe';
  public amount:  any;

  constructor(private fb: UntypedFormBuilder,
    public productService: ProductService,
    private orderService: OrderService , private toasts : ToastrService) { 
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required],
      amount: [''],
    })
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(response => {
        console.log(response , "checkout")
      this.products = response});
    this.getTotal.subscribe(amount => this.amount = amount);
    this.initConfig();
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Stripe Payment Gateway
stripeCheckout() {
  var handler = (<any>window).StripeCheckout.configure({
    key: environment.stripe_token, 
    locale: 'auto', 

    token: (token: any) => {
      var stripeToken = token.id;


      var order = {
        firstname: this.checkoutForm.get('firstname')?.value,
        lastname: this.checkoutForm.get('lastname')?.value,
        phone: this.checkoutForm.get('phone')?.value,
        email: this.checkoutForm.get('email')?.value,
        address: this.checkoutForm.get('address')?.value,
        country: this.checkoutForm.get('country')?.value,
        town: this.checkoutForm.get('town')?.value,
        state: this.checkoutForm.get('state')?.value,
        postalcode: this.checkoutForm.get('postalcode')?.value,
        amount: this.checkoutForm.get('amount')?.value,
      };


      this.orderService.createOrder(this.products, order, token.id, this.amount);
      this.toasts.success('The payoff is successful')
    }
  });

  // Ödeme penceresini aç
  handler.open({
    name: 'Mese soft', 
    description: 'Mese Store', 
    amount: this.amount  
  });
}

  // Paypal Payment Gateway
  private initConfig(): void {
    this.payPalConfig = {
        currency: this.productService.Currency.currency,
        clientId: environment.paypal_token,
        createOrderOnClient: (data) => < Product > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                currency_code: this.productService.Currency.currency,
                value: this.amount,
                breakdown: {
                    item_total: {
                        currency_code: this.productService.Currency.currency,
                        value: this.amount
                    }
                }
              }
          }]
      },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            size:  'small', // small | medium | large | responsive
            shape: 'rect', // pill | rect
        },
        onApprove: (data, actions) => {
            this.orderService.createOrder(this.products, this.checkoutForm.value, data.orderID, this.getTotal);
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
  }

}
