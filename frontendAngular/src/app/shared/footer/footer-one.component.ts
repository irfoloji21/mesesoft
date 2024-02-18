import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialMediaService } from 'src/app/shared/services/social-media.service';
import { SubscribeService } from 'src/app/shared/services/subscribe.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Category } from 'src/app/shared/classes/category';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: ['./footer-one.component.scss']
})

export class FooterOneComponent implements OnInit {

  @Input() class: string = 'footer-light' // Default class 
  @Input() themeLogo: string = 'assets/images/icon/logo.png' // Default Logo
  @Input() newsletter: boolean = true; // Default True

  categories: Category[] = []
  socialMediaLinks: any;
  public today: number = Date.now();
  subscribeForm: FormGroup;

  categories$: Observable<Category[]>;
  socialMediaLinks$: Observable<any>;

  constructor(
    private categoryService: CategoryService,
    private socialMediaService: SocialMediaService,
    private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder, private subscribeService: SubscribeService
  ) {

    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
    this.socialMediaLinks$ = this.socialMediaService.getSocialMediaLinks();
  }

  subscribe() {
    if (this.subscribeForm.valid) {
      const email = this.subscribeForm.value.email;

      this.subscribeService.subscribe(email).subscribe(
        (response) => {
        },
        (error) => {
          console.error('Abonelik hatası:', error);
        }
      );
    }
  }

  toggletNavActive(item) {
    const subCategoryIds = item.subcategories.map(subcategory => subcategory._id);

    const queryParams = {
      MainMenu: subCategoryIds.join(',')
    };

    this.router.navigate(['/shop/collection'], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });

    item.active = !item.active;
  }

}