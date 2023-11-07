import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private route: ActivatedRoute, private blogService: BlogService,private toastr :ToastrService, private formBuilder: FormBuilder , private authService :AuthService) {
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
        this.blog = data.blog;
        this.BlogId =data.blog
        console.log(this.blog, "this.blogDetails")
      });
    });
    this.loadUser();
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
        user: user.user,
        blogId : this.blog._id
      };

      this.blogService.createReview(commentData).subscribe({
        next: (response) => {
          console.log('Backend ', response);
          this.toastr.success(' The comment was added successfully', 'Successfully');
        },
        error: (error) => {
          console.error('Backend ', error);
            this.toastr.error('Comment could not be added', 'Error');
        }
      });
      this.form.reset();
    }
  }






}









