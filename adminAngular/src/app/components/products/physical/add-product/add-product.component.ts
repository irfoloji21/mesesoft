import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProductService } from '../../../../shared/service/product.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CategoryService } from 'src/app/shared/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/tables/product';
import { Category } from 'src/app/shared/tables/category';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  id: string;
  categories: Category[] = [];
  selectedCategory: string = '';
  buttonText: string = 'Add';
  public productForm: UntypedFormGroup;
  public Editor = ClassicEditor;
  public counter: number = 1;
  selectedProduct: Product[] = [];
  selectedProductImage: any;
  isEditMode: boolean = false;
  public url = [
    {
      img: "assets/images/user.png",
    },
    {
      img: "assets/images/user.png",
    },
    {
      img: "assets/images/user.png",
    },
    {
      img: "assets/images/user.png",
    },
    {
      img: "assets/images/user.png",
    }
  ]

  constructor(
    private fb: UntypedFormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: [''],
      slug: [''],
      originalPrice: [''],
      discountPrice: [''],
      tags: [''],
      stock: [''],
      description: [''],
      images: [''],
      category: [''],
      gender: [''],
      stockStatus: this.fb.group({
        stockStatusValue: ['Out Of Stock'], 
      }),
      enableProduct: [true],
      sale: [true]
    })
  }

  ngOnInit() {
    this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response.categories;
      },
      (error) => {
        console.error(error);
      }
    );
  
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.isEditMode = true;
        this.productService.getProductById(this.id).subscribe(
          (response) => {
            this.productForm.patchValue(response.product);
            this.selectedCategory = response.product.category;
            this.selectedProduct = response.product;
            this.selectedProductImage = Object.keys(response.product.images).map(key => response.product.images[key]);
            this.buttonText = 'Edit';
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        this.selectedProductImage = [
          { url: "assets/images/user.png" },
          { url: "assets/images/user.png" },
          { url: "assets/images/user.png" },
          { url: "assets/images/user.png" },
          { url: "assets/images/user.png" },
        ];
        this.buttonText = 'Add';
      }
    });
  }
  
  

  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }

  //FileUpload
  readUrl(event: any, i) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url[i].img = reader.result.toString();
    }
  }

  onFileChange(event: any, i: number) {
    if (event.target.files && event.target.files.length > 0) {
      const files: FileList = event.target.files;

      // Dosya okuma işlemi
      for (let j = 0; j < files.length; j++) {
        const file = files[j];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          // Tek tek her dosyayı images dizisine ekleyin
          const imageUrls = this.productForm.get('images').value || [];
          imageUrls.push(e.target.result);

          // images alanını güncelleyin
          this.productForm.get('images').setValue(imageUrls);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  performAction() {
    if (this.buttonText == 'Add') {
      this.submitForm();
    } else if (this.buttonText == 'Edit') {
      this.editProduct();
    }
  }

  //Submit form
  submitForm() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      const shop = this.authService.getShop();
  
      formData.shopId = shop.seller._id;
      formData.shop = shop;
      formData.category = this.selectedCategory;
  
      // stockStatus'u Json start
      const jsonRequestBody = {
        ...formData,
        stockStatus: { stockStatusValue: formData.stockStatus.stockStatusValue },
      };
  
      console.log(jsonRequestBody , "JsonStockStatus")
      // stockStatus'u Json start
      this.productService.createProduct(jsonRequestBody).subscribe(
        (response) => {
          this.router.navigate(['/products/physical/productss']);
          console.log('Ürün başarıyla oluşturuldu:', response);
        },
        (error) => {
          console.error('Ürün oluşturulurken hata oluştu:', error);
        });
    }
  }
  
  
  
  
  

  goBack() { }

  editProduct() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      console.log(formData , "Content edit")
      // Diğer form değerlerini alırken olduğu gibi al
      const shop = this.authService.getShop();
      formData.shopId = shop.seller._id;
      formData.shop = shop;
      formData.category = this.selectedCategory;
  
      this.productService.updateProduct(this.id, formData).subscribe((response) => {
        this.router.navigate(['/products/physical/productss']);
        console.log('Ürün başarıyla güncellendi:', response);
      }
      )
       
  }
}
  
  

  selectImage(image: any) {
    this.selectedProductImage = image;
  }

  isDropdownVisible: { [key: number]: boolean } = {};

  toggleDropdown(index: number) {
    this.isDropdownVisible[index] = !this.isDropdownVisible[index];
  }

  // Dropdown Json

  selectedOption: any = "In Stock" ;
  selectOption(option: string): void {
    this.selectedOption = option;
    this.productForm.get('stockStatus')?.get('stockStatusValue')?.setValue(option);
  }
  
  
  // isSaleActive: boolean = true;
  // updateSaleStatus() {
  //   this.isSaleActive = !this.isSaleActive;
  // }
  
  
}
