import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('tr');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.init();
  }

  private init(): void {

    const previousLang = this.translate.getDefaultLang();
    

    this.translate.setDefaultLang('en');

    this.translate.use(previousLang);
  

    this.currentLangSubject.next(previousLang);
  }
  

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
  }
}
