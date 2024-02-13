import { Component, OnInit, Input } from '@angular/core';
import { CollectionSlider } from '../../../shared/data/slider';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})

export class DiscountComponent implements OnInit {
  
  public DiscountConfig: any = CollectionSlider;
  @Input() discounts: any[] = [];

  constructor() { }

  ngOnInit(): void { }
}
