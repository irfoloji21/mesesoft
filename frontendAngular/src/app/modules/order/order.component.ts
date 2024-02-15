import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {

  public userId: string;
  public orderId: string;
  public filteredOrders: any[] = [];
  public orderDetails: any;
  public ImageSrc: string;
  isModalOpen: boolean = false;
  public loading: boolean = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userId = user.user._id;
    this.loadUserOrders(this.userId);
  }

  loadUserOrders(userId: string) {
    this.loading = true;
    this.orderService.getOrders(userId).subscribe(
      (res) => {
        this.filteredOrders = res.orders;
        
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.loading = false; 
      }
    );
  }

  refundOrder(orderId: string) {
    this.orderService.refundOrder(orderId).subscribe(
      (res) => {
        this.loadUserOrders(this.userId);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  openModal(order: any): void {
    this.orderDetails = order[0];
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
