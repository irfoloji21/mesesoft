import { Component, OnInit, Input } from '@angular/core';

import { BlogService } from 'src/app/shared/services/blog.service';
import { Router } from '@angular/router';
import { BlogSlider } from 'src/app/shared/data/slider';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

export class BlogComponent implements OnInit {

  public BlogSliderConfig: any = BlogSlider;
  @Input() blogs: any[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((res) => {
      this.blogs = res.blogs;
    });
  }

  onBlogClick(blog: any) {
    this.router.navigate(['/blog/details', blog.slug]);
  }
}
