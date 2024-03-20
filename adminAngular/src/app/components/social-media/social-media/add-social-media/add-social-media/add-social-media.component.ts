import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialMediaService } from 'src/app/shared/service/social-media.service';


@Component({
  selector: 'app-add-social-media',
  templateUrl: './add-social-media.component.html',
  styleUrls: ['./add-social-media.component.scss']
})
export class AddSocialMediaComponent {
  SocialMedia: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private socialMediaService: SocialMediaService
  ) {
    this.SocialMedia = this.fb.group({
      SocialMediaName: ['', Validators.required],
      SocialMediaUrl: ['', Validators.required],
      SocialMediaIcon: ['', Validators.required]
    });
  }

  saveForm() {
    if (this.SocialMedia.valid) {
      const formData = this.SocialMedia.value;
      this.socialMediaService.AddsocialMedia(formData).subscribe(response => {
        console.log('Updated data:', response);
        this.router.navigate(['/social-media']);
      }, error => {
        console.error('Update error:', error);
      });
    } 
  }

  

  goBack() {
    this.router.navigate(['/social-media']);
  }


}