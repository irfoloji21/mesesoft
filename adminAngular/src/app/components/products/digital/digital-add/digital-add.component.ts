import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CategoryService } from 'src/app/shared/service/category.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-digital-add',
  templateUrl: './digital-add.component.html',
  styleUrls: ['./digital-add.component.scss']
})

export class DigitalAddComponent implements OnInit {
  myForm: FormGroup;
  id: string;
  categories: any[] = [];
  public Editor = ClassicEditor;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
  ) {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      subcategories: [[]],
      isShow: [false]
    });
  }

  files: File[] = [];

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files: FileList = event.target.files;
      const imageUrls = [];
      for (let j = 0; j < files.length; j++) {
        const file = files[j];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          imageUrls.push(e.target.result);
          this.myForm.get('images').setValue(imageUrls);
          console.log('imageUrls:', imageUrls);
          console.log(this.myForm.value.images);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit() {
    console.log("form submitted");
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      console.log(this.myForm.value);
      console.log('formData:', formData);
      this.categoryService.createCategory(formData).subscribe(
        (response) => {
          console.log('Kategori başarıyla oluşturuldu:', response);
          this.router.navigate(['/products/digital/digital-category']);
        },
        (error) => {
          console.error('Kategori oluşturulurken hata oluştu:', error);
        }
      );
    }
  }

  editCategory() {
    console.log("editform submitted")
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      console.log(this.id, "id")
      this.categoryService.updateCategory(this.id, formData).subscribe(
        (response) => {
          console.log('kategori başarıyla güncellendi:', response);
        },
        (error) => {
          console.error('kategori güncellenirken hata oluştu:', error);
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

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.categoryService.getCategoryById(this.id).subscribe(
        (response) => {
          console.log('Kategori', response);
          this.myForm.patchValue(response.category);
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

}
