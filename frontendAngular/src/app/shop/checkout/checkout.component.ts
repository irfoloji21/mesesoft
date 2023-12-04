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

  public checkoutForm: UntypedFormGroup;
  public products: Product[] = [];
  public payPalConfig?: any;
  public payment: string = 'Stripe';
  public amount: any;

  currentStep: string = 'adres';
  buttonText: string = 'Save and Continue';
  showPaymentButton: boolean = true;
  paymentInfoVisible: boolean = false; // Başlangıçta ödeme bilgileri gizlenmiş

  paymentOptions: any[] = [  // Örnek ödeme seçenekleri
    { name: 'Kredi Kartı', price: 0 },
    { name: 'PayPal', price: 2.99 },
  ];

  cartItems: any[] = [  // Örnek sepet bilgileri
    { productName: 'Ürün 1', quantity: 2, totalPrice: 49.99 },
    { productName: 'Ürün 2', quantity: 1, totalPrice: 29.99 },
  ];
  
  constructor(
    private fb: UntypedFormBuilder,
    public productService: ProductService,
    private orderService: OrderService,
    private toasts: ToastrService
  ) {
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
      console.log(response, "checkout")
      this.products = response
    });
    this.orderService.getSelectedAddress();
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
          // firstname: this.checkoutForm.get('firstname')?.value,
          // lastname: this.checkoutForm.get('lastname')?.value,
          // phone: this.checkoutForm.get('phone')?.value,
          // email: this.checkoutForm.get('email')?.value,
          // address: this.checkoutForm.get('address')?.value,
          // country: this.checkoutForm.get('country')?.value,
          // town: this.checkoutForm.get('town')?.value,
          // state: this.checkoutForm.get('state')?.value,
          // postalcode: this.checkoutForm.get('postalcode')?.value,
          // amount: this.checkoutForm.get('amount')?.value,
        };


        this.toasts.success('The payoff is successful');
      }
    });
    // Ödeme penceresini aç
    // handler.open({
    //   name: 'Mese soft',
    //   description: 'Mese Store',
    //   amount: this.amount,
    //   email: this.checkoutForm.get('email')?.value
    // });
  }

  // Paypal Payment Gateway
  private initConfig(): void {
    this.payPalConfig = {
      currency: this.productService.Currency.currency,
      clientId: environment.paypal_token,
      createOrderOnClient: (data) => {
        return {
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
          }],
          payer: {
            email_address: this.checkoutForm.get('email')?.value
          }
        };
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        size: 'small', // small | medium | large | responsive
        shape: 'rect', // pill | rect
      },
      // onApprove: (data, actions) => {
      //   this.orderService.createOrder(this.products, this.checkoutForm.value, data.orderID, this.getTotal, this.checkoutForm.get('email')?.value);
      //   console.log('onApprove - transaction was approved, but not authorized', data, actions);
      //   actions.order.get().then(details => {
      //     console.log('onApprove - you can get full order details inside onApprove: ', details);
      //   });
      // },
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

  showPaymentInfo() {
    this.paymentInfoVisible = true; // Tab'a tıklandığında ödeme bilgilerini göster
  }

  proceedToNextStep() {
    if (this.currentStep === 'adres') {
      // Adres işlemi başarılıysa bir sonraki adıma geç
      const deliverySuccess = true;
      if (deliverySuccess) {
        if (!this.orderService.getSelectedAddress()) {
          this.toasts.error('Lütfen bir teslimat adresi seçin.');
          return; // Uyarı verip işlemi durdur
        }
        if (localStorage.getItem('selectedShipping') === null) {
          this.toasts.error('Lütfen bir teslimat yöntemi seçin.');
          return; // Uyarı verip işlemi durdur
        }
        this.currentStep = 'checkout';
        this.buttonText = 'Save and Continue';
        const addressTab = document.querySelector('.checkout-tab[data-type="checkout-address"]');
        addressTab.classList.add('completed');
      } else {
        alert('Adres kaydedilemedi! Lütfen tekrar deneyin.');
      }
    } else if (this.currentStep === 'checkout') {
      // Checkout işlemi başarılıysa bir sonraki adıma geç
      const checkoutSuccess = true;
      if (checkoutSuccess) {
        this.currentStep = 'odeme';
        this.buttonText = 'Approve';
        this.showPaymentButton = false;
        const checkoutTab = document.querySelector('.checkout-tab[data-type="checkout-payment"]');
        checkoutTab.classList.add('completed');
      } else {
        alert('Checkout başarılı olmadı! Lütfen tekrar deneyin.');
      }
    } else if (this.currentStep === 'odeme') {
      // Ödeme işlemi başarılıysa bir sonraki adıma geç
      const paymentSuccess = true;
      if (paymentSuccess) {
        alert('Ödeme başarıyla tamamlandı!');
      } else {
        alert('Ödeme yapılamadı! Lütfen tekrar deneyin.');
      }
    }
  }

  goToPreviousStep() {
    if (this.currentStep === 'checkout') {
      this.currentStep = 'adres';
      this.buttonText = 'Save and Continue';
    } else if (this.currentStep === 'odeme') {
      this.currentStep = 'checkout';
      this.buttonText = 'Save and Continue';
      this.showPaymentButton = true;
    }
    // Diğer adımlar için gerekli kontrolleri ekleyebilirsiniz.
  }

}
