import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { BlogService } from 'src/app/shared/service/blog.service';
import { Blog } from './blog';

@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.scss']
})

export class ListBlogComponent implements OnInit {

  public blog_list = [];
  public selectedBlogList: Blog | null = null;
  isModalOpen: boolean = false;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
  ) { }

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
    this.blogService.updateBlog(id, {}).subscribe(
      (response) => {
        this.ngOnInit()
      },
      (error) => {
        console.error(error);
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event']) 
  handleEscape(event: KeyboardEvent) {
    this.closeModal();
  }

  detailBlog(id: any) {
    this.isModalOpen = true;
    this.blogService.getBlogById(id).subscribe(
      (response) => {
        if (response.success) {
          this.selectedBlogList = response.blog
        } else {
          console.error(response.message);
        }
      },
      (error) => {
        // HTTP hatası, ağ hatası vb.
        console.error(error);
      }
    );
  }

  truncateProductName(name: string, maxLength: number): string {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
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
