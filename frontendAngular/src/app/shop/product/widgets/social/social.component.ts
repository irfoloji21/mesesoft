import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})

export class SocialComponent implements OnInit {

  @Output() shareClicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void { }

  onShareClick() {
    this.shareClicked.emit();
  }


}
