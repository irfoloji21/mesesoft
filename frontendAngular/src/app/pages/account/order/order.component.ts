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
    this.orderService.getOrders(userId).subscribe(
      (res) => {
        this.filteredOrders = res.orders;
        console.log(this.filteredOrders, "filteredOrders");

      },
      (error) => {
        console.error(error);
      }
    );
  }

  refundOrder(orderId: string) {
    this.orderService.refundOrder(orderId).subscribe(
      (res) => {
        console.log(res);
        // İade işlemi başarılı olduğunda, isteğe bağlı olarak kullanıcıya bildirim veya başka bir geri bildirim sağlayabilirsiniz.
        // Ardından siparişleri güncellemek için:
        this.loadUserOrders(this.userId);
      },
      (error) => {
        console.error(error);
        // İade işlemi başarısız olduğunda kullanıcıya hata bildirimi veya başka bir geri bildirim sağlayabilirsiniz.
      }
    );
  }

  openModal(order: any): void {
    this.orderDetails = order[0];
    console.log(this.orderDetails, "orderDetails");

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
