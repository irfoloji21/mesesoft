import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthService } from 'src/app/shared/service/auth.service';
import { BlogService } from 'src/app/shared/service/blog.service';
import { CategoryService } from 'src/app/shared/service/category.service';
@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent  implements OnInit {
  myForm:FormGroup;
  id: string;
  categories: any[] = [];
  selectedCategory: string = '';
  buttonText: string = 'Add';

  public Editor = ClassicEditor;
  constructor(
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
  ) { 
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      shortDescription: ['', Validators.required],
      // images: ['', Validators.required],
      category: [''],
      tags: [''],
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

  submitForm() {
    console.log("form submitted");
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      const shop = this.authService.getShop();

      formData.shopId = shop.seller._id;
      formData.shop = shop;
      formData.category = this.selectedCategory;

      this.blogService.createBlog(formData).subscribe(
        (response) => {
          this.router.navigate(['/blog/list-blog']);
          console.log('Ürün başarıyla oluşturuldu:', response);
        },
        (error) => {
          console.error('Ürün oluşturulurken hata oluştu:', error);
        }
      );
    }
  }

  editBlog() {
    console.log("editform submitted")
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      const shop = this.authService.getShop();

      formData.shopId = shop.seller._id;
      formData.shop = shop;
      formData.category = this.selectedCategory;

      console.log(this.id, "id")
      this.blogService.updateBlog(this.id, formData).subscribe(
        (response) => {
          this.router.navigate(['/blog/list-blog']);
          console.log('Blog başarıyla güncellendi:', response);
        },
        (error) => {
          console.error('Blog güncellenirken hata oluştu:', error);
        }
      );
    }
  }

  performAction() {
    if (this.buttonText === 'Add') {
      
      this.submitForm();
    } else if (this.buttonText === 'Edit') {
      
      this.editBlog(); 
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
      // this.buttonText = 'Edit';
      this.id = params['id'];
      this.blogService.getBlogById(this.id).subscribe(
        (response) => {
          this.myForm.patchValue(response.blog);
          this.selectedCategory = response.product.category;
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

}