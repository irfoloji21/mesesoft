import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-box',
  templateUrl: './layout-box.component.html',
  styleUrls: ['./layout-box.component.scss']
})
export class LayoutBoxComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }

  // Set Theme color
  customizeThemeColor(event) {
    document.documentElement.style.setProperty('--theme-deafult', event.target.value);
  }
  customizeLayoutDark() {
    document.body.classList.toggle('dark')
  }

}
