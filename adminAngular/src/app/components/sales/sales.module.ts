import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RefundsComponent } from './refunds/refunds.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({

  declarations: [OrdersComponent, TransactionsComponent, RefundsComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class SalesModule { }
