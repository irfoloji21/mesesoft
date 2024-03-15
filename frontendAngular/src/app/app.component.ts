import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { map, delay, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  // For Progressbar
  loaders = this.loader.progress$.pipe(
    delay(1000),
    withLatestFrom(this.loader.progress$),
    map(v => v[1]),
  );

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,
    private loader: LoadingBarService,
    translate: TranslateService,
    private authService: AuthService,
    private toasts : ToastrService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      translate.setDefaultLang('en');
      translate.addLangs(['en', 'fr']);
    }
  }

  ngOnInit(): void {
    this.authService.loadUser().subscribe(
      (user) => {
        if (user) {
          this.authService.setUser(user);
        }
        else {
          this.toasts.error('Login failed', '',
          {
            positionClass: 'toast-top-right',
            timeOut: 2500,
            closeButton: true,
            newestOnTop: false,
            progressBar: true,
          });
        }
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }

}