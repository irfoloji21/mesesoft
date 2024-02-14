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
  catalogForm: FormGroup;
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
    this.catalogForm = this.fb.group({
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
          this.catalogForm.get('images').setValue(imageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit() {
    if (this.catalogForm.valid) {
      const formData = this.catalogForm.value;
      this.categoryService.createCategory(formData).subscribe(
        (response) => {
          this.router.navigate(['/products/category/main-category']);
        },
        (error) => {
        }
      );
    }
  }

  editCategory() {
    if (this.catalogForm.valid) {
      const formData = this.catalogForm.value;
      this.categoryService.updateCategory(this.id, formData).subscribe(
        (response) => {
        },
        (error) => {
        }
      );
    }
  }

  ngOnInit() {
    this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response.categories;
      },
      (error) => {
      }
    );

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.categoryService.getCategoryById(this.id).subscribe(
        (response) => {
          this.catalogForm.patchValue(response.category);
        },
        (error) => {
        }
      );
    });
  }

}
