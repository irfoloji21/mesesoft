import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/shared/classes/order';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ShippingService } from 'src/app/shared/services/shipping.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
  })
  
export class AddressComponent implements OnInit {
  public orderDetails = [] 
  addForm: FormGroup;
  editForm: FormGroup;
  isAddingNew: boolean = false; 
  userAddresses: any[] = [];
  userInfo: any[] = [];
  isEditing: boolean = false;
  editedAddresses: any[] = [];
  buttonText: string = 'Save Setting';
  isBillingAddressSame: boolean = true;
  currentAddress: any;
  isModalOpen: boolean = false;
  isCreateFormOpen: boolean = false;
  isEditFormOpen: boolean = false;
  shippingData: any[];
  selectedShippingIndex: number;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService, 
    private orderService :OrderService,
    private productService: ProductService,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    this.initAddForm();
    this.initEditForm();
     this.loadUserAddresses();

     this.productService.cartItems.subscribe(res => {
      this.orderDetails = res;
     })
     this.orderService.checkoutItems.subscribe(response => {
      console.log(response)
    });
    this.shippingService.getShipData().subscribe(data => {
      this.shippingData = data;
      console.log("shippingData", this.shippingData)
    });
    
  }
  

  toggleAddingNew() {
    this.isAddingNew = !this.isAddingNew; 
  }

  loadUserAddresses() {
    this.authService.loadUser().subscribe(
      (res) => {
        this.userInfo = res.user.phoneNumber;
        this.userAddresses = res.user.addresses;
        console.log(this.userAddresses);
        
      },
      (error) => {
        console.error(error);
      }
    );
  }


  initEditForm(): void {
    const user = this.authService.getUser();
    this.editForm = this.fb.group({
      flatPlot: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      regionState: ['', Validators.required],
      addressType: ['', Validators.required],
      userId: user.user._id
    });
  }
  initAddForm(): void {
    const user = this.authService.getUser();
    this.addForm = this.fb.group({
      flatPlot: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      regionState: ['', Validators.required],
      addressType: ['', Validators.required],
      userId: user.user._id
    });
  }
  addressSubmit() {
    if (this.addForm.valid) {
      const formData = this.addForm.value;
      const user = this.authService.getUser();
      
      if (user) {
        const userId = user._id;
        this.authService.updateUserAddress(userId, formData).subscribe(
          (response) => {
            this.toastr.success('Address added successfully', 'Success');
            this.loadUserAddresses();
            this.isAddingNew= false;
            this.closeCreateForm();
          },
          (error) => {
            console.error('Address add error', error);
            this.toastr.error('An error occurred', 'Error');
            this.addForm.reset();
          }
        );
      } else {
        console.error('Kullanıcı bilgileri alınamadı.');
      }
    }
  }
  editAddress(address: any) {
    console.log('Düzenlenecek adres bilgileri:', address);
    this.editedAddresses.push(address);
    const user = this.authService.getUser();
    this.editForm.patchValue({
      addressType: address.addressType,
      flatPlot: address.flatPlot,
      address: address.address,
      zipCode: address.zipCode,
      country: address.country,
      city: address.city,
      regionState: address.regionState,
      userId: user.user._id
    });
    this.isEditing = true;
  }
  updateAddress() {
    if (this.editedAddresses.length > 0) {
      const addressIdToUpdate = this.editedAddresses[0]._id;
      const user = this.authService.getUser();
  
      if (user) {
        const userId = user.user._id;
        console.log('Kullanıcı kimliği:', userId);
  
        const addressData = this.editForm.value;
        addressData._id = addressIdToUpdate;
  
        this.authService.updateUserAddress(userId, addressData).subscribe(
          (response) => {
            this.toastr.success('Address update successfully', 'Success');
            this.loadUserAddresses();
            this.editForm.reset();
            this.closeEditForm();
            console.log('Adres güncellendi', response);
            this.isEditing = false; 
          },
          (error) => {
            console.error('Adres güncelleme hatası', error);
            this.toastr.error('An error occurred', 'Error');
          });
      } else {
        console.error('Kullanıcı bilgileri alınamadı.');
      }
    } else {
      console.error('Düzenlenen adres bilgisi bulunamadı.');
    }
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


openCreateForm() {
  this.isCreateFormOpen = true;
}

closeCreateForm() {
  this.isCreateFormOpen = false;
}

openEditForm() {
  this.isEditFormOpen = true;
}

closeEditForm() {
  this.isEditFormOpen = false;
}

  selectAddress(selectedAddress: any) {
    this.orderService.setSelectedAddress(selectedAddress);
    console.log('Seçilen adres:', selectedAddress);
  }

  selectShipping(selectedShipping: any, index: number) {
    this.shippingService.setSelectedShipping(selectedShipping);
    this.selectedShippingIndex = index;
    console.log('Seçilen kargo:', selectedShipping);
  }
  
 
}

