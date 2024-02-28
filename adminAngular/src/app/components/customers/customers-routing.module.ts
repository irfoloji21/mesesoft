import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { AddCustomerComponent } from './add-customer/add-customer/add-customer.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    data: {
      title: "customers",
      breadcrumb: "customers"
    }
  },
  {
    path: 'add-customer',
    component: AddCustomerComponent 
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
