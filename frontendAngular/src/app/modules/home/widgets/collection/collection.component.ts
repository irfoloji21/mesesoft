import { Component, OnInit, Input } from '@angular/core';
import { CollectionSlider } from 'src/app/shared/data/slider';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})

export class CollectionComponent implements OnInit {

  public CollectionSliderConfig: any = CollectionSlider;
  @Input() categories: any[];
  @Input() category: string;
  @Input() class: string;

  constructor() { }

  ngOnInit(): void { }
  
}
