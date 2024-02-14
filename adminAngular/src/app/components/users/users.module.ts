import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ListUserComponent, CreateUserComponent],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    TranslateModule
  ]
})
export class UsersModule { }
