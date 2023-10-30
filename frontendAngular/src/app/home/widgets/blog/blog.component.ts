import { Component, OnInit, Input } from '@angular/core';
import { BlogSlider } from '../../../shared/data/slider';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  
  @Input() blogs: any[] = [];

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((data) => {
      console.log(data ,"blog")
      this.blogs = data;
    });
  }

  public BlogSliderConfig: any = BlogSlider;

}
