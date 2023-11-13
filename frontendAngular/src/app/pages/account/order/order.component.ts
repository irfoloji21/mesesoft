import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { CartModalComponent } from 'src/app/shared/components/modal/cart-modal/cart-modal.component';
import { OrderQuickViewComponent } from 'src/app/shared/components/modal/order-quick-view/order-quick-view.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    public userId: string;
    public filteredOrders: any[] = [];
    public selectedOrder: any[] = [];
    isModalOpen: boolean = false;

    @Input() product: Product;
    @Input() currency: any = this.productService.Currency;
    @ViewChild("orderQuickView") OrderQuickView: OrderQuickViewComponent;
    @ViewChild("cartModal") CartModal: CartModalComponent;
  

  constructor(    
    private authService: AuthService,
    private orderService: OrderService,
    private productService: ProductService) { }

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
            this.filteredOrders.forEach(order => {
                order.cart.forEach(item => {
                    this.selectedOrder.push(item); // Her bir cart elemanını seçili siparişlere ekle
                });
            });
            console.log("selectedOrder", this.selectedOrder);
            },
            (error) => {
            console.error(error);
            }
        );
    }

}
