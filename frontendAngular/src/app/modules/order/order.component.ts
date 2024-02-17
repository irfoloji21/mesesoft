import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit, OnDestroy {

  public userId: string;
  public orderId: string;
  public filteredOrders$: Observable<any[]>; 
  public orderDetails: any;
  public ImageSrc: string;
  isModalOpen: boolean = false;
  public loading: boolean = false;
  private ordersSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userId = user.user._id;
    this.loadUserOrders(this.userId);
  }

  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  loadUserOrders(userId: string) {
    this.loading = true;
    this.ordersSubscription = this.orderService.getOrders(userId).subscribe(
      (res) => {
        this.filteredOrders$ = res.orders;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  refundOrder(orderId: string) {
    this.orderService.refundOrder(orderId).subscribe(() => {
      this.loadUserOrders(this.userId);
    }, (error) => {
      console.error(error);
    });
  }

  openModal(order: any): void {
    this.orderDetails = order[0];
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
