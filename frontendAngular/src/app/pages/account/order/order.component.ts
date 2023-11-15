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
    public filteredOrders: any[] = [];
    public selectedOrder: any[] = [];
    orderDetails: any; 
    public ImageSrc: string;
    isModalOpen: boolean = false; 

  constructor(    
    private authService: AuthService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userId = user.user._id;
    this.loadUserOrders(this.userId);   
  }

  loadUserOrders(userId: string) {
      this.orderService.getOrders(userId).subscribe(
          (res) => {
          this.filteredOrders = res.orders;
          this.filteredOrders.forEach(order => {
              order.cart.forEach(item => {
                  this.selectedOrder.push(item);
              });
          });
          },
          (error) => {
          console.error(error);
          }
      );
  }

  openModal(order: any): void {
    this.orderDetails = order;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
