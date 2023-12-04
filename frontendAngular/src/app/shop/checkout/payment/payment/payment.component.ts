import { HttpClient } from "@angular/common/http";
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
import { Router } from '@angular/router';

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
      console.log(response, "checkout");
      this.products = response;
    });
    const selectedAddress = this.orderService.getSelectedAddress();
    console.log("Seçilen Adres Payment:", selectedAddress);
    const selectedCargo = this.shippingService.getSelectedShipping();
    console.log("Seçilen Kargo Payment:", selectedCargo);

    this.getTotal.subscribe((total) => {
      console.log(total, "totalAmount");
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

      const cardDetails = {
        number: cardNumber,
        exp_month: expirationMonth,
        exp_year: expirationYear,
        cvc: cvv,
      };

      const stripeApiKey = environment.stripe_token;
      const stripe = new Stripe(stripeApiKey);

      const tokenizeCard = async () => {
        try {
          this.result = await stripe.tokens.create({ card: cardDetails });
          const orderId = this.result.id;
          console.log("Stripe API isteği ve Yanıt:", cardDetails, this.result)
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
        console.log("Ödeme başarılı:", response);
        this.productService.clearCart();

        console.log(paymentData.amount, "amount PaymentData")
        console.log(paymentData.product, "product PaymentData")
        console.log(selectedAddress, "selectedAddress")
        console.log(selectedCargo, "selectedCargo")
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
