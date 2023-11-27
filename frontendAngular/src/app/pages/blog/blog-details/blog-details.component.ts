import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  form: FormGroup;
  blog: any = [];
  BlogId: any;
  user: any;
  likedBlogs: string[] = [];
  constructor(private route: ActivatedRoute, private router: Router, private blogService: BlogService,private toastr :ToastrService, private formBuilder: FormBuilder , private authService :AuthService) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      comment: ['', Validators.required],
    });
   
   }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      this.blogService.getBlogDetails(slug).subscribe((data) => {
        console.log("data", data.blog);
        
        this.blog = data.blog;
        this.BlogId =data.blog
        this.loadUser();
        this.user = this.authService.getUser();
        this.likedBlogs = this.user.user?.likedBlogs || [];
      });
    });
    this.loadUser();
    this.user = this.authService.getUser();
  }

  loadUser() {
    this.authService.loadUser().subscribe(
      (res) => {
        this.user = res;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const user = this.authService.getUser();
      console.log(user, "user")
      const commentData = {
        name: this.form.value.name,
        email: this.form.value.email,
        comment: this.form.value.comment,
        user: user,
        blogId: this.blog._id
      };
  
      this.blogService.createReview(commentData).subscribe({
        next: (response) => {
          console.log('Backend ', response);
          this.toastr.success('The comment was added successfully', 'Successfully');
          this.form.reset();
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.navigated = false;
          this.router.navigate([this.router.url]);
        },
        error: (error) => {
          console.error('Backend ', error);
          this.toastr.error('Comment could not be added', 'Error');
        }
      });
    }
    }

    toggleLikeBlog(blog: any) {
      if (this.likedBlogs.includes(blog._id)) {
        this.unlikeBlog(blog, this.user);
      } else {
        this.likeBlog(blog, this.user.user);
      }
    }
    
    likeBlog(blog: any, user: any) {
      this.blogService.likeBlog(blog._id, user).subscribe({
        next: (response) => {
          console.log(response, "likeBlog");
          this.toastr.success('You liked this blog', 'Successfully');
          this.likedBlogs.push(blog._id);
          blog.likes = (blog.likes || 0) + 1;
        },
        error: (error) => {
          console.error('Like Blog Error:', error);
        }
      });
    }
    
    unlikeBlog(blog: any, user: any) {
      this.blogService.unlikeBlog(blog._id, user).subscribe({
        next: (response) => {
          this.toastr.success("you've stopped liking this blog", 'Successfully');
          this.likedBlogs = this.likedBlogs.filter(id => id !== blog._id);
          blog.likes = (blog.likes || 0) - 1;
        },
        error: (error) => {
          console.error('Unlike Blog Error:', error);
        }
      });
    }
    


}