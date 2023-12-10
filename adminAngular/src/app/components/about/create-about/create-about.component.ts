import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AboutService } from 'src/app/shared/service/about.service';
import { AuthService } from 'src/app/shared/service/auth.service';


@Component({
  selector: 'app-create-about',
  templateUrl: './create-about.component.html',
  styleUrls: ['./create-about.component.scss']
})
export class CreateAboutComponent implements OnInit {
  public Editor = ClassicEditor;
  public aboutForm: UntypedFormGroup;
  buttonText: string = 'Add';

  constructor(
    private fb: UntypedFormBuilder,
    private aboutService: AboutService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.aboutForm = this.fb.group({
      title: [''],
      description: [''],
      // images: [''],
      status: true,
    })
  }

  ngOnInit() {
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files: FileList = event.target.files;
      const uploadedFiles = [];

      for (let j = 0; j < files.length; j++) {
        const file = files[j];
        uploadedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageUrls = this.aboutForm.get('images').value || [];
          imageUrls.push({ name: file.name, content: e.target.result });
          this.aboutForm.get('images').setValue(imageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  submitForm() {
    if (this.aboutForm.valid) {
      console.log('Form is valid:', this.aboutForm.value)
      const formData = this.aboutForm.value;
      const shop = this.authService.getShop();

      formData.shopId = shop.seller._id;
      formData.shop = shop;

      this.aboutService.createAbout(formData).subscribe(
        (response) => {
          this.router.navigate(['/about/about-list']);
          console.log('Ürün başarıyla oluşturuldu:', response);
        },
        (error) => {
          console.error('Ürün oluşturulurken hata oluştu:', error);
        }
      );
    }
  }

  performAction() {
    if (this.buttonText === 'Add') {
      this.submitForm();
    } else if (this.buttonText === 'Edit') {
      console.log("else")
    }
  }

}
