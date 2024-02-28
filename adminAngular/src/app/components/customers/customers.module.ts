import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomersComponent } from './customers.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist';
import { NgChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { AddCustomerComponent } from './add-customer/add-customer/add-customer.component';

@NgModule({
  declarations: [CustomersComponent, AddCustomerComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    NgChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    TranslateModule,
    ReactiveFormsModule 
  ]
})
export class CustomersModule { }
