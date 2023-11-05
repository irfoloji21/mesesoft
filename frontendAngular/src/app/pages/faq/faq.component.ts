import { Component, OnInit } from '@angular/core';
import { FaqService } from 'src/app/shared/services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faqData: any[];

  constructor(private faqService: FaqService) { }

  ngOnInit(): void {
    this.faqService.getFaqData().subscribe(data => {
      this.faqData = data;
    });
  }
}
