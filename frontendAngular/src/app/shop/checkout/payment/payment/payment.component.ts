import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Product } from "src/app/shared/classes/product";
import { OrderService } from "src/app/shared/services/order.service";
import { ProductService } from "src/app/shared/services/product.service";
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
  totalAmount;
  constructor(
    private fb: UntypedFormBuilder,
    public productService: ProductService,
    private orderService: OrderService,
    private toasts: ToastrService
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
    this.getTotal.subscribe((total) => {
      console.log(total, "totalAmount");
      this.amount = total; // Assign the correct total amount to 'this.amount'
    });
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

 
  stripeCheckout() {
    if (this.checkoutForm.valid) {
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
          const result = await stripe.tokens.create({ card: cardDetails });
          console.log("Stripe API isteği ve Yanıt:", cardDetails, result);
          this.toasts.success("Stripe API isteği başarılı");
          this.processPayment(result.id, this.totalAmount);
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

  processPayment(token: string, amount: any) {
    const paymentData = {
      product: this.products,
      amount: amount,

    };

    this.orderService.createOrder(paymentData).subscribe(
      (response) => {
        console.log("Ödeme başarılı:", response);
      },
      (error) => {
        console.error("Ödeme işlemi sırasında hata oluştu:", error);

        if (error.error) {
          console.error("Sunucu Hata Mesajı:", error.error);
        }
      }
    );
  }

  currentStep: string = "adres";

  proceedToNextStep() {
    if (this.currentStep === "adres") {
      this.currentStep = "odeme";
    } else if (this.currentStep === "odeme") {
      this.currentStep = "onay";
    } else if (this.currentStep === "onay") {
      this.currentStep = "confirmation";
    }
  }
}
