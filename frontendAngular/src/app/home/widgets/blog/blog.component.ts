import { Component, OnInit, Input } from '@angular/core';
import { BlogSlider } from '../../../shared/data/slider';
import { BlogService } from 'src/app/shared/services/blog.service';
import Blog from 'src/app/shared/classes/blog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  
  @Input() blogs: any[] = [];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((res) => {
      this.blogs = res.blogs;
    });
  }


  onBlogClick(blog: any) {
    this.router.navigate(['/pages/blog/details', blog.slug]);
  }

  public BlogSliderConfig: any = BlogSlider;

}
