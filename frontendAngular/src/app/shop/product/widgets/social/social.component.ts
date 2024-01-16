import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})

export class SocialComponent implements OnInit {

  @Output() shareClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void { }

  onShareClick(platform: string) {
    
    const productUrl = encodeURIComponent(window.location.href);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`;
        break;
      case 'google-plus':
        shareUrl = `https://plus.google.com/share?url=${productUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${productUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${productUrl}`;
        break;
      default:
        break;
    }
    

    this.shareClicked.emit(shareUrl);

  }
}
