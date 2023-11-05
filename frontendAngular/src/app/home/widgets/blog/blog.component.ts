import { Component, OnInit, Input } from '@angular/core';
import { BlogSlider } from '../../../shared/data/slider';
import { BlogService } from 'src/app/shared/services/blog.service';
import Blog from 'src/app/shared/classes/blog';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  
  @Input() blogs: any[] = [];

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((res) => {
      console.log(res.blogs ,"blog")
      this.blogs=res.blogs
    });
  }

  public BlogSliderConfig: any = BlogSlider;

}
