import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Product } from "src/app/shared/classes/product";
import { OrderService } from "src/app/shared/services/order.service";
import { ProductService } from "src/app/shared/services/product.service";
import { ShippingService } from "src/app/shared/services/shipping.service";
import { environment } from "src/environments/environment";
import Stripe from "stripe";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})

export class PaymentComponent implements OnInit {
  public checkoutForm: UntypedFormGroup;
  public products: Product[] = [];
  public payPalConfig?: any;
  public payment: string = "Stripe";
  public amount: any;
  orderDetails: any;
  public result: any;

  constructor(
    private fb: UntypedFormBuilder,
    public productService: ProductService,
    private orderService: OrderService,
    private toasts: ToastrService,
    private shippingService: ShippingService
  ) {
    this.checkoutForm = this.fb.group({
      cardNumber: ["", Validators.required],
      expirationMonth: ["", Validators.required],
      expirationYear: ["", Validators.required],
      cvv: ["", Validators.required],
      termsCheckbox: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe((response) => {
      this.products = response;
    });
    const selectedAddress = this.orderService.getSelectedAddress();
    const selectedCargo = this.shippingService.getSelectedShipping();
    const savedCart = localStorage.getItem('selectedCard');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);

      this.checkoutForm.patchValue({
        cardNumber: cartData.cardNumber || '',
        expirationMonth: cartData.expirationMonth || '',
        expirationYear: cartData.expirationYear || '',
        cvv: cartData.cvv || '',
        termsCheckbox: cartData.termsCheckbox || false
      });
    } else {
      this.toasts.warning('Seçili kartınız yok!', 'Uyarı', { positionClass: 'toast-top-right' });
    }
    this.getTotal.subscribe((total) => {
      this.amount = total;
    });
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  stripeCheckout() {
    if (this.checkoutForm.valid) {
      const selectedAddress = this.orderService.getSelectedAddress();
      const selectedCargo = this.shippingService.getShipData();
      const cardNumber = this.checkoutForm.get("cardNumber")?.value;
      const expirationMonth = this.checkoutForm.get("expirationMonth")?.value;
      const expirationYear = this.checkoutForm.get("expirationYear")?.value;
      const cvv = this.checkoutForm.get("cvv")?.value;
      const stripeApiKey = environment.stripe_token;
      const stripe = new Stripe(stripeApiKey);

      const cardDetails = {
        number: cardNumber,
        exp_month: expirationMonth,
        exp_year: expirationYear,
        cvc: cvv,
      };

      const tokenizeCard = async () => {
        try {
          this.result = await stripe.tokens.create({ card: cardDetails });
          const orderId = this.result.id;
          this.toasts.success("Ödeme başarılı");

          this.processPayment(orderId, this.amount, selectedAddress, selectedCargo);
        } catch (error) {
          console.error("Token oluşturulurken hata oluştu", error);
          console.error("Stripe hata detayları:", error.message);
        }
      };

      tokenizeCard();

    } else {
      console.error("Form geçerli değil, ödeme işlemi yapılamaz.");
    }
  }

  processPayment(
    token: string,
    amount: any,
    selectedAddress: any,
    selectedCargo: any
  ) {
    const paymentData = {
      product: this.products,
      amount: this.amount,
      selectedAddress: {},
      selectedCargo: {},
    };

    paymentData.selectedAddress = selectedAddress;
    paymentData.selectedCargo = selectedCargo;

    this.orderService.createOrder(
      paymentData.product,
      paymentData.selectedAddress,
      paymentData.selectedCargo,
      paymentData.amount,
      selectedAddress,
      selectedCargo
    ).subscribe(
      (response) => {
        this.productService.clearCart();
      },
      (error) => {
        console.error("Ödeme işlemi sırasında hata oluştu:", error);

        if (error.error) {
          console.error("Sunucu Hata Mesajı:", error.error);
        }
      }
    );
  }
}
