import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { BlogService } from 'src/app/shared/service/blog.service';

@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.scss']
})
export class ListBlogComponent  implements OnInit {

  public blog_list = []

  constructor(
    private blogService: BlogService,
    private authService: AuthService, 
    private router: Router
  ) {
   
  }


  deleteBlog(id) {
    this.blogService.deleteBlog(id).subscribe(
      (response) => {
        
        this.ngOnInit()
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editBlog(id) {
    console.log(id)
    this.router.navigate(['/physical/edit-product', id]);
  }

  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
      
        if (shop) {
          const id = shop.seller._id
          this.blogService.getBlog().subscribe(
            (response) => {
              this.blog_list = response.blogs
           
            },
            (error) => {
              console.error(error);
            }
          );
        }
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );



  }


}
