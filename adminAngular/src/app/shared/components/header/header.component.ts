import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { NavService } from '../../service/nav.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  public shop: any;
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;
  isLoggedIn: boolean;
  userInitials: string;
  icon: string = 'user'

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,
    private translate: TranslateService,
    public navServices: NavService,
    private authService: AuthService,
    private router: Router,
  ) { }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }

  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  getAuth() {
    this.authService.loadShop().subscribe(
      (shop) => {
        this.shop = shop.seller;
        this.userInitials = this.getInitials(this.shop.name);
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }

  getLogin() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('isLoggedIn$ değeri:', isLoggedIn);
    });
  }

  ngOnInit() {
    this.getAuth();
    this.getLogin();
    
  }

  getInitials(name: string): string {
    return (name).toUpperCase();
  }

  profile(): void {
    this.router.navigate(['/dashboard'])
  }

  logout() {
    this.authService.logout();
  }


  // language 

  public languages = [
    {
      name: 'English',
      code: 'en',
      flag: 'assets/images/languageFlag/LanguageEn.png'
    }, {
      name: 'French',
      code: 'fr',
      flag: 'assets/images/languageFlag/LanguageFr.png'
    }
    , {
      name: 'Turkish',
      code: 'tr',
      flag: 'assets/images/languageFlag/LanguageTr.png'
    }
  ];
  public selectedLanguage: any = this.languages[0]; 

  getFlagForCurrentLanguage(): string {
    return this.selectedLanguage.flag;
  }
  changeLanguage(code) {
    // SEÇİLEN DİLİ LOCAlSTORAGEYE YAZ 
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(code)
       // Flag 
       this.selectedLanguage = this.languages.find(lang => lang.code === code);
    }
  }
}
