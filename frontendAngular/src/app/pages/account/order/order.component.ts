import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    public shop: any;
    public userId: string;
    public searchText: string = '';
    public filteredOrders: any[] = [];
    public selectedOrder: any;
    public selectedOrderStatus: string = '';

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
            console.log("filteredOrders", this.filteredOrders);
            
            },
            (error) => {
            console.error(error);
            }
        );
    }

}
