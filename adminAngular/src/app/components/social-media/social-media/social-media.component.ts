import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialMediaService } from 'src/app/shared/service/social-media.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {

  socialMedia_list: any  = []
  constructor(private router: Router, private socialMediaService:SocialMediaService){}
  ngOnInit(): void {
    this.socialMediaService.getSocialMedia().subscribe(
      socialMedia => {
        console.log(socialMedia); 
        this.socialMedia_list= socialMedia;
      },
      error => {
        console.error('Error fetching socialMedia:', error); 
      }
    );
  }
  addSocialMedia(){
    this.router.navigate(['/social-media/add-social-media']);
  }
}
