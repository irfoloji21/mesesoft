import { Component, OnInit } from '@angular/core';
import { Address } from 'cluster';
import { Order } from 'src/app/shared/classes/order';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {

  public orderDetails: Order = { orderDate: new Date()  };
  selectedAddress: any 

  constructor(public productService: ProductService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.checkoutItems.subscribe(response => {
      console.log(response , "order")
      this.orderDetails = response;
      console.log( "image")
      this.orderDetails.orderDate = new Date(); 
    });
    this.selectedAddress = this.orderService.getSelectedAddress();

    
  }

}
