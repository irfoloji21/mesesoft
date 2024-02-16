import { Component, OnInit } from '@angular/core';
import { FaqService } from 'src/app/shared/services/faq.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faqData$: Observable<any[]>;

  constructor(private faqService: FaqService) { }

  ngOnInit(): void {
    this.faqData$ = this.faqService.getFaqData();
  }
}
