import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { TableService } from 'src/app/shared/service/table.service';
import { UserService } from 'src/app/shared/service/user.service';
import { UserListDB, USERLISTDB } from 'src/app/shared/tables/list-users';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  providers: [TableService, DecimalPipe]
})
export class ListUserComponent implements OnInit {
  public user_list = []

  public tableItem$: Observable<UserListDB[]>;
  public searchText;
  total$: Observable<number>;

  constructor(
    public service: TableService,
    private userService: UserService
    ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    this.service.setUserData(USERLISTDB)
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

  ngOnInit() {
    this.userService.getUsers().subscribe(
      (response) => {
        this.user_list = response.users;
      },
      (error) => {
        console.error(error);
      }
    );
  }

}

