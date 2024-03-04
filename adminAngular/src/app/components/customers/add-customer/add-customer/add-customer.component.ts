import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/shared/service/customer.service';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  buttonText: string = ''; 
  addCustomerForm: FormGroup;
  selectedOptionGender: string = ''; 
  selectedOptionEmailForm: string = ''; 
  selectedOptionAssociateToWebsite: string = ''; 
  selectedGroup: string = '';
  
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.CustomerForm();
  }

  CustomerForm(): void { 
    this.addCustomerForm = this.fb.group({
      AssociateToWebsite: ['Main Website'],
      Group: ['General'],
      NamePrefix: [''],
      FirstName: [''],
      MiddleName: [''],
      LastName: [''],
      NameSuffix: [''],
      Email: [''],
      Date: [''],
      TaxVatNumber: [''],
      Gender: ['Not Specified'],
      EmailForm: ['Default Store View'], 
      VertexCustomer: [''],
    });
  }

  saveForm(): void {
    const formData = this.addCustomerForm.value;
    console.log(formData);
    this.customerService.addCustomer(formData).subscribe(
      response => {
        console.log('Success', response);
      },
      error => {
        console.error('Error', error); 
      }
    );
  }

  updateSelectedAssociateToWebsite(option: string): void {
    this.selectedOptionAssociateToWebsite = option;
    this.addCustomerForm.controls['AssociateToWebsite'].setValue(option);
  }

  updateSelectedGender(option: string): void {
    this.selectedOptionGender = option;
    this.addCustomerForm.controls['Gender'].setValue(option); 
  }

  updateSelectedEmailForm(option: string): void {
    this.selectedOptionEmailForm = option;
    this.addCustomerForm.controls['EmailForm'].setValue(option); 
  }

  updateSelectedGroup(option: string): void {
    this.selectedGroup = option;
    this.addCustomerForm.controls['Group'].setValue(option);
  }
  
  goBack(): void {} 
}
