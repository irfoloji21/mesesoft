import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  buttonText;
  addCustomerForm: FormGroup
  selectedOptionGender: string = 'Not Specified';
  selectedOptionEmailForm: string = 'Main Website';

  constructor(
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
     this.CustomerForm();
  }

  CustomerForm(){
    this.addCustomerForm = this.fb.group({
      AssociateToWebsite:[''],
      NamePrefix:    [''],
      FirstName:     [''],
      MiddleName:    [''],
      LastName:      [''],
      NameSuffix:    [''],
      Email:         [''],
      Date:          [''],
      TaxVatNumber:  [''],
      VertexCustomer:[''],
      Gender: ['Not Specified'],
      EmailForm:['Main Website'],


    });
  }
  saveForm(): void {
    const formData = this.addCustomerForm.value;
    console.log('saveForm:', formData);
  }

  updateSelectedGender(option: string): void {
    this.selectedOptionGender = option;
    this.addCustomerForm.controls['Not Specified'].setValue(option); 
  }

  updateSelectedEmailForm(option: string): void {
    this.selectedOptionEmailForm = option;
    this.addCustomerForm.controls['Main Website'].setValue(option); 
  }
  
  
  goBack(){}
}
