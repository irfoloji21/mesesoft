import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent  {
  searchText;
  isFilterCustomer:boolean;
  searchForm: FormGroup;
  customer_list;
  isButtonClicked: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router
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
  addCustomer() {
    this.router.navigate(['/customers/add-customer']);
  }
  clearAll() {}
  buttonSearch(){}
  onActionChange(event: any): void { }
  toggleSelection(product: any): void {}
  detailProduct(product: any): void {}
  editProduct(id){}
  search() {};
}
