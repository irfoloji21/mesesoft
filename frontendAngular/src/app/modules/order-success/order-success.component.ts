import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/shared/classes/order';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ShippingService } from 'src/app/shared/services/shipping.service';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {

  public orderDetails: Order = { orderDate: new Date() };
  selectedAddress: any
  orderId;
  selectedShipping: any;

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private shippingService: ShippingService
  ) {
    this.route.paramMap.subscribe(params => {
      this.orderId = decodeURIComponent(params.get('orderId'));
    })
  }

  ngOnInit(): void {
    this.orderService.checkoutItems.subscribe(response => {
      this.orderDetails = response;
      this.orderDetails.orderDate = new Date();
    });
    this.selectedAddress = this.orderService.getSelectedAddress();
    this.selectedShipping = this.shippingService.getSelectedShipping();

    this.route.paramMap.subscribe(params => {
      this.orderId = decodeURIComponent(params.get('orderId'));

    })

  }
}
