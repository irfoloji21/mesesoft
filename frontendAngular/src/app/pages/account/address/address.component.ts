import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})

export class AddressComponent implements OnInit {
  addForm: FormGroup;
  editForm: FormGroup;
  isAddingNew: boolean = false;
  userAddresses: any[] = [];
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  editedAddresses: any[] = [];
  public loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initAddForm();
    this.initEditForm();
    this.loadUserAddresses();
  }

  toggleAddingNew() {
    this.isAddingNew = !this.isAddingNew;
  }

  loadUserAddresses() {
    this.loading = true;
    this.authService.loadUser().subscribe(
      (res) => {
        this.userAddresses = res.user.addresses;
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.loading = false;
      }
    );
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
            this.isAddingNew = false;
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  editAddress(address: any) {
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

        const addressData = this.editForm.value;
        addressData._id = addressIdToUpdate;

        this.authService.updateUserAddress(userId, addressData).subscribe(
          (response) => {
            this.toastr.success('Address update successfully', 'Success');
            this.loadUserAddresses();
            this.editForm.reset();
            this.closeModal();
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
        this.toastr.success('Address deleted successfully', 'Success');
        this.loadUserAddresses();
      },
      (error) => {
        console.error(error);
        this.toastr.error('An error occurred while deleting the address', 'Error');
      });
  }
}
