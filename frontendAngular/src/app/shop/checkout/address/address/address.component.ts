import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/shared/classes/order';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
  })
  
export class AddressComponent implements OnInit {
  public orderDetails: Order = { orderDate: new Date() };
  form: FormGroup;
  isAddingNew: boolean = false; 
  userAddresses: any[] = [];

  isEditing: boolean = false;
  editedAddresses: any[] = [];
  buttonText: string = 'Save Setting';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService, 
    private orderService :OrderService
  ) {}

  ngOnInit(): void {

     this.loadUserAddresses();


     this.orderService.checkoutItems.subscribe(response => {
      this.orderDetails = response;
      this.orderDetails.orderDate = new Date(); 
    });
  }
  

  toggleAddingNew() {
    this.isAddingNew = !this.isAddingNew; 
  }

  loadUserAddresses() {
    this.authService.loadUser().subscribe(
      (res) => {
        this.userAddresses = res.user.addresses;
        console.log(res.user , "res.user")
        console.log(this.userAddresses , "resddreses")
      },
      (error) => {
        console.error(error);
      }
    );
  }

  initForm(): void {
    const user =  this.authService.getUser();
    this.form = this.fb.group({
      flatPlot: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      regionState: ['', Validators.required],
      addressType: ['' , Validators.required],
      userId: user.user._id
    });
  }

  addressSubmit() {
    // if (this.form.valid) {
    //   const formData = this.form.value;
    //   this.authService.updateUserAddress(formData).subscribe(
    //     (response) => {
    //       this.toastr.success('Address added successfully', 'Success');
    //       this.loadUserAddresses();
    //       this.isAddingNew = false; 
    //       this.form.reset();
    //       this.userAddresses = response.user.addresses;
    //     },
    //     (error) => {
    //       console.error(error);
    //       this.toastr.error('An error occurred', 'Error');
    //       this.form.reset();
    //     }
    //   );
    // }
  }

  
  editAddress(address: any) {
    this.form.patchValue({
      addressType: address.addressType,
      flatPlot: address.flatPlot,
      address: address.address,
      zipCode: address.zipCode,
      country: address.country,
      city: address.city,
      regionState: address.regionState,
      userId: address._id
    });

    this.isAddingNew = true; 
    this.buttonText = 'Edit Setting'; 
}

  

  deleteAddress(addressId: string) {
      this.authService.deleteUserAddress(addressId).subscribe(
        (response) => {
          console.log(response, "delete")
          this.toastr.success('Address deleted successfully', 'Success');
          this.loadUserAddresses();
        },
        (error) => {
          console.error(error);
          this.toastr.error('An error occurred while deleting the address', 'Error');
        }
      );

  }

  isModalOpen: boolean = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  selectAddress(selectedAddress: any) {
    this.orderService.setSelectedAddress(selectedAddress);
    console.log('Seçilen adres:', selectedAddress);
  }
  
 
}

