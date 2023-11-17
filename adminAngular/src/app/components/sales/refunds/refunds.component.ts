import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SortEvent } from 'src/app/shared/directives/shorting.directive';
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from 'src/app/shared/service/table.service';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { OrderDB, ORDERDB } from 'src/app/shared/tables/order-list';
import { AuthService } from 'src/app/shared/service/auth.service';
import { RefundService } from 'src/app/shared/service/refund.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss'],
  providers: [TableService, DecimalPipe],
})

export class RefundsComponent implements OnInit {

  myForm:FormGroup;
  public shop: any;
  public refunds: any[] = [];
  public searchText: string = '';
  public filteredRefunds: any[] = [];
  public selectedRefund: any;
  public selectedRefundStatus: string = '';

  public closeResult: string;
  public tableItem$: Observable<OrderDB[]>;
  total$: Observable<number>;

  constructor(
    public service: TableService, 
    private modalService: NgbModal,
    private authService: AuthService,
    private refundService: RefundService,
    private fb: FormBuilder,
    ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    this.service.setUserData(ORDERDB)
    this.myForm = this.fb.group({
      status: ['Processing Refund'] 
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
    this.selectedRefund = item; 
    console.log(this.selectedRefund)
  }

  updateRefundStatus(refundId: string) {
    // const newStatus = this.myForm.get('status').value;

    const formData = this.myForm.value;

    console.log(refundId, formData);

    this.refundService.updateRefundStatus(refundId, formData).subscribe(
      (res) => {
        this.getShopRefunds();
        this.modalService.dismissAll();
        console.log(res)
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
        this.getShopRefunds();
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }
  
  getShopRefunds() {
    this.refundService.getShopOrders(this.shop._id).subscribe(
      (res) => {

         console.log(res.orders)
        this.refunds = res.orders.filter(order => {
          return order.status === "Processing Refund" || order.status === "Refund Success" || order.status === "Processing";
        });
        this.search();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  search() {
    if (!this.searchText) {
      this.filteredRefunds = this.refunds;
    } else {
      this.filteredRefunds = this.refunds.filter(refund => {
        return refund._id.toLowerCase().includes(this.searchText.toLowerCase());
      });
    }
  }

}
