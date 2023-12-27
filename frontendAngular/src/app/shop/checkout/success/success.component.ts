import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})

export class SuccessComponent implements OnInit, AfterViewInit {

  public orderDetails: Order = { orderDate: new Date() };
  orderId: string;
  totalAmount: number;
  selectedAddress: any;
  selectedCargo: any;
  
  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.orderId = this.route.snapshot.params['orderId'];
  }

  ngOnInit(): void { }

  ngAfterViewInit() { }

}