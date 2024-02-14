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

  ordersForm: FormGroup;
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
    private fb: FormBuilder,
  ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    this.service.setUserData(ORDERDB)
    this.ordersForm = this.fb.group({
      status: ['Processing']
    });
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
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
  }

  updateOrderStatus(orderId: string) {
    const formData = this.ordersForm.value;
    this.orderService.updateOrderStatus(orderId, formData).subscribe(
      (res) => {
        this.getShopOrders();
        this.modalService.dismissAll();
      },
      (error) => {
  
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


    this.ordersForm.get('status').setValue('Processing');
  }

  getShopOrders() {
    this.orderService.getShopOrders(this.shop._id).subscribe(
      (res) => {
        this.orders = res.orders.filter(order => {
          return order.status !== "Processing Refund" && order.status !== "Refund Success";
        });
        this.search();
      },
      (error) => {
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
  onSearchTextChange() {
    if (!this.searchText) {
      this.filteredOrders = this.orders;
    } else {
      this.search();
    }
  }
}
