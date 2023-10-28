import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/classes/order';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit, AfterViewInit{

  public orderDetails: Order = { orderDate: new Date() };

  constructor(public productService: ProductService,
    private orderService: OrderService) { }

  ngOnInit(): void {	
    this.orderService.checkoutItems.subscribe(response => {
      console.log(response, "orderDetails")
      this.orderDetails = response;
      this.orderDetails.orderDate = new Date(); 
    });
  }

  ngAfterViewInit() {
    
  }
}
