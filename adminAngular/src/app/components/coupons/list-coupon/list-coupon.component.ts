import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CouponService } from 'src/app/shared/service/coupon.service';
import { TableService } from 'src/app/shared/service/table.service';
import { LISTCOUPLEDB, ListCouponsDB } from 'src/app/shared/tables/list-coupon';
import { forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-list-coupon',
  templateUrl: './list-coupon.component.html',
  styleUrls: ['./list-coupon.component.scss'],
  providers: [TableService, DecimalPipe]
})

export class ListCouponComponent implements OnInit {
  coupons: any[] = [];
  originalCoupons: any[] = [];
  selectedItems: string[] = [];
  public tableItem$: Observable<ListCouponsDB[]>;
  public searchText;
  total$: any;
  public isModalOpen: boolean = false;
  public EditCouponForm: FormGroup;
  selectedCouponId: any;
  isEditing: boolean = false;
  public filteredCoupons: any = [];
  constructor(
    private fb: FormBuilder,
    public service: TableService,
    private authService: AuthService,
    private couponService: CouponService,
  ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = this.coupons.length;
    this.service.setUserData(LISTCOUPLEDB)
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

  editCouponsForm() {
    this.EditCouponForm = this.fb.group({
      name: [''],
      code: [''],
      start_date: [''],
      end_date: [''],
      free_shipping: [false],
      quantity: [''],
      discount_type: ['Fixed'],
      status: [false],
      products: [''],
      category: [''],
      min: [''],
      max: [''],
      limit: [''],
      customer: ['']
    });
  }

  editListCoupon(SelectedCoupon: any) {

    this.selectedCouponId = SelectedCoupon
    const formattedEndDate = `${SelectedCoupon.end_date.year}-${SelectedCoupon.end_date.month}`;
    this.EditCouponForm.patchValue({
      name: SelectedCoupon.name,
      code: SelectedCoupon.code,
      end_date: formattedEndDate,
      discount_type: SelectedCoupon.discount_type,
      min: SelectedCoupon.min,
      free_shipping: SelectedCoupon.free_shippings,
      quantity: SelectedCoupon.quantity,
      // discount_type: SelectedCoupon.discount_type
    });
    this.isEditing = true;
  }

  onSelect(itemId: string) {
    if (this.selectedItems.includes(itemId)) {
      this.selectedItems = this.selectedItems.filter(id => id !== itemId);
    } else {
      this.selectedItems.push(itemId);
    }
  }

  deleteSelectedItems() {
    forkJoin(
      this.selectedItems.map(itemId => this.couponService.deleteCoupoun(itemId))
    ).pipe(
      concatMap((results: any[]) => {
        this.selectedItems = [];
        return of(undefined);
      })
    ).subscribe(() => {
      location.reload();
    });
  }

  ngOnInit() {
    this.editCouponsForm();
    this.authService.loadShop().subscribe(
      (shop) => {
        if (shop) {
          const irfo = shop.seller._id;
          this.couponService.getCoupoun(irfo).subscribe(
            (res) => {
              this.originalCoupons = res.couponCodes.slice();
              this.filteredCoupons = this.originalCoupons.slice();
              this.coupons = this.filteredCoupons.slice();
            },
            (error) => {
            }
          );
        }
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }
  
  search() {
    if (!this.searchText) {
      this.filteredCoupons = this.coupons;
    } else {
      this.filteredCoupons = this.coupons.filter((res: any) => {
        return (res.code as string).toLowerCase().includes(this.searchText.toLowerCase());
      });
      this.coupons = this.filteredCoupons;
    }
  }
  
  onSearchTextChange() {
    if (!this.searchText) {
      this.coupons = this.originalCoupons.slice();
      this.filteredCoupons = this.originalCoupons.slice();
    } else {
      this.search();
    }
  }
  
  
  
  
  

  closeModal() {
    this.isModalOpen = false;
  }

  openModal() {
    this.isModalOpen = true;
  }

  
}
