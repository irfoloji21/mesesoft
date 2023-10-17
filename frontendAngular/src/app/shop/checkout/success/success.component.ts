import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, AfterViewInit{

  public orderDetails: Order = { orderDate: new Date() };

  constructor(public productService: ProductService,
    private orderService: OrderService) { }

  ngOnInit(): void {	
    this.orderService.checkoutItems.subscribe(response => {
      console.log(response , "order")
      this.orderDetails = response;
      this.orderDetails.orderDate = new Date(); 
    });
  }

  ngAfterViewInit() {
    
  }

}
