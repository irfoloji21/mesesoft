import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/shared/service/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit  {
  searchText;
  isFilterCustomer:boolean;
  searchForm: FormGroup;
  customer_list = [];
  isButtonClicked: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customerService: CustomerService
  ){
    this.searchForm = this.fb.group({
      searchText: ['']
    });

    this.searchForm.get('searchText').valueChanges.subscribe(value => {
      if (this.isButtonClicked) {
        this.search();
      }
    });

  }
  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(
      customers => {
        console.log(customers); 
        this.customer_list= customers;
      },
      error => {
        console.error('Error fetching customers:', error); 
      }
    );
  }
  addCustomer() {
    this.router.navigate(['/customers/add-customer']);
  }
  editCustomer(customerId: number) {
    this.router.navigate(['/customers/edit-customer', customerId]);
  }
  clearAll() {}
  buttonSearch(){}
  onActionChange(event: any): void { }
  toggleSelection(product: any): void {}
  detailProduct(product: any): void {}
  search() {};
}
