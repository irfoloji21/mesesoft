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
  form: FormGroup;
  isAddingNew: boolean = false; 
  userAddresses: any[] = []; 


  constructor(private fb: FormBuilder, private authService: AuthService,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initForm();
     this.loadUserAddresses();
  }

  toggleAddingNew() {
    this.isAddingNew = !this.isAddingNew; 
  }

  loadUserAddresses() {
    this.authService.loadUser().subscribe(
      (res) => {
        this.userAddresses = res.user.addresses;
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
    if (this.form.valid) {
       
        const formData = this.form.value;
        console.log(formData, "formData");
        this.authService.updateUserAddress(formData).subscribe(
          (response) => {
            console.log(response, "User");
            this.toastr.success('Address added successfully', 'Success');
          },
          (error) => {
            console.error(error);
            this.toastr.error('An error occurred', 'Error');
          }
      );
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

  
}
