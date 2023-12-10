import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { AboutService } from 'src/app/shared/service/about.service';
import { TableService } from 'src/app/shared/service/table.service';
import { ListPagesDB } from 'src/app/shared/tables/list-pages';
import { MENUDB } from 'src/app/shared/tables/menu';

@Component({
  selector: 'app-list-about',
  templateUrl: './list-about.component.html',
  styleUrls: ['./list-about.component.scss'],
  providers: [TableService, DecimalPipe]
})
export class ListAboutComponent implements OnInit {

  public about_list = []
  public selected = [];
  public tableItem$: Observable<ListPagesDB[]>;
  public searchText;
  total$: Observable<number>;

  constructor(
    public service: TableService,
    private aboutService: AboutService,
  ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    this.service.setUserData(MENUDB)
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

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  ngOnInit() {
    this.aboutService.getAbout().subscribe(
      (response) => {
        this.about_list = response.abouts
      },
      (error) => {
        console.error(error);
      }
    );


  }

}
