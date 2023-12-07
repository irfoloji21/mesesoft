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

@Component({
  selector: 'app-list-coupon',
  templateUrl: './list-coupon.component.html',
  styleUrls: ['./list-coupon.component.scss'],
  providers: [TableService, DecimalPipe]
})

export class ListCouponComponent implements OnInit {

  coupons: any[] = [];
  selectedItems: string[] = [];
  public tableItem$: Observable<ListCouponsDB[]>;
  public searchText;
  total$: any;

  constructor(
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

  onSelect(itemId: string) {
    if (this.selectedItems.includes(itemId)) {
      // Öğe zaten seçili, bu nedenle kaldırın
      this.selectedItems = this.selectedItems.filter(id => id !== itemId);
    } else {
      // Öğe seçilmedi, bu nedenle ekleyin
      this.selectedItems.push(itemId);
    }
  }

  deleteSelectedItems() {
    forkJoin(
      this.selectedItems.map(itemId => this.couponService.deleteCoupoun(itemId))
    ).pipe(
      concatMap((results: any[]) => {
        console.log('Tüm öğeler silindi:', results);
        this.selectedItems = [];
        // Sayfayı yenilemek için bir Observable döndürmek yerine "of" kullanabiliriz
        return of(undefined);
      })
    ).subscribe(() => {
      // İşlem tamamlandığında sayfa yeniden yüklenir
      location.reload();
    });
  }

  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
        const irfo = shop.seller._id;
        if (shop) {
          this.couponService.getCoupoun(irfo).subscribe(
            (res) => {
              this.coupons = res.couponCodes;
            },
            (error) => {
              console.log(error);
            }
          );
        }
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }
}
