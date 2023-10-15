import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProductService } from '../../../../shared/service/product.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CategoryService } from 'src/app/shared/service/category.service';




@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  categories: any[] = [];
  selectedCategory: string = '';

  public productForm: UntypedFormGroup;
  public Editor = ClassicEditor;
  public counter: number = 1;
  public url = [{
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

  constructor(private fb: UntypedFormBuilder,  
    private productService: ProductService, 
    private authService: AuthService, 
    private categoryService: CategoryService) {


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
    })
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
  
  

  //Submit form
  submitForm() {
 
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      const shop = this.authService.getShop();

      formData.shopId = shop.seller._id;
      formData.shop = shop;
      formData.category = this.selectedCategory;

      this.productService.createProduct(formData).subscribe(
        (response) => {
          console.log('Ürün başarıyla oluşturuldu:', response);
        },
        (error) => {
          console.error('Ürün oluşturulurken hata oluştu:', error);
        }
      );
    }
  }


  ngOnInit() {
    this.categoryService.getCategory().subscribe(
      (response) => {
        console.log('Kategoriler', response);
        this.categories = response.categories;
      },
      (error) => {
        console.error(error);
      }
    );

    ;
  }

}
