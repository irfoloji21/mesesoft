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

  public orderDetails: Order = { orderDate: new Date()  };
  selectedAddress: any 
  orderId;
  selectedShipping: any;
  
  constructor(
    public productService: ProductService, 
    private route: ActivatedRoute,
    private orderService: OrderService,
    private shippingService: ShippingService
  ) { 
      this.orderId = this.route.snapshot.params['orderId'];
    }

  ngOnInit(): void {
    this.orderService.checkoutItems.subscribe(response => {
      console.log(response , "order")
      this.orderDetails = response;
      console.log( "image")
      this.orderDetails.orderDate = new Date(); 
      console.log(this.orderDetails.shippingDetails.address)
      console.log('Order ID:', this.orderDetails.orderId);
    });
    this.selectedAddress = this.orderService.getSelectedAddress();
    this.selectedShipping = this.shippingService.getSelectedShipping();

    // ActivatedRoute'in paramMap'ını kullanarak 'orderId' parametresini dinle
    this.route.paramMap.subscribe(params => {
      // 'orderId' parametresini URL'den al ve decode et
      this.orderId = decodeURIComponent(params.get('orderId'));
      
      // Şimdi 'orderId' değerini kullanabilirsiniz.
      console.log('Decoded Order ID:', this.orderId);
  })

  }}
