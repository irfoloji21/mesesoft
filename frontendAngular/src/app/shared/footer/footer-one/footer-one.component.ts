import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';
import { SocialMediaService } from '../../services/social-media.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private categoryService: CategoryService,
    private socialMediaService: SocialMediaService,
    private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data: any) => {
      if (data.success) {
        this.categories = data.categories;

      }
    });
    this.socialMediaService.getSocialMediaLinks().subscribe(links => {
      this.socialMediaLinks = links;
    });
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
