import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {


  constructor(private router: Router){}
  ngOnInit(): void {

  }
  addSocialMedia(){
    this.router.navigate(['/social-media/add-social-media']);
  }
}
