import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SortEvent } from 'src/app/shared/directives/shorting.directive';
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from 'src/app/shared/service/table.service';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { OrderDB, ORDERDB } from 'src/app/shared/tables/order-list';
import { AuthService } from 'src/app/shared/service/auth.service';
import { OrderService } from 'src/app/shared/service/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [TableService, DecimalPipe],
})

export class OrdersComponent implements OnInit {

  public shop: any;
  public orders: any[] = [];
  public searchText: string = '';
  public filteredOrders: any[] = [];
  public selectedOrder: any;
  public selectedOrderStatus: string = '';

  public closeResult: string;
  public tableItem$: Observable<OrderDB[]>;
  total$: Observable<number>;

  constructor(
    public service: TableService, 
    private modalService: NgbModal,
    private authService: AuthService,
    private orderService: OrderService,
    ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    this.service.setUserData(ORDERDB)
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  open(item: any) {
    this.modalService.open(item, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  irfan(item: any) {
    this.selectedOrder = item; 
    console.log(this.selectedOrder)
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    console.log(orderId, newStatus)
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(
      (res) => {
        this.getShopOrders();
        this.modalService.dismissAll();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
        this.shop = shop.seller;
        this.getShopOrders();
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }
  
  getShopOrders() {
    this.orderService.getShopOrders(this.shop._id).subscribe(
      (res) => {
        this.orders = res.orders;
        this.search();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  search() {
    if (!this.searchText) {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => {
        return order._id.toLowerCase().includes(this.searchText.toLowerCase());
      });
    }
  }

}
