import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8000/api/v2/blog';

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all-blogs`);
  }

  getBlogDetails(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${slug}`);
  }

  createBlog(blogData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-blog`, blogData);
  }

  getAllShopBlogs(shopId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all-blogs-shop/${shopId}`);
  }

  deleteBlog(blogId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-shop-blog/${blogId}`);
  }

  createReview(reviewData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/create-new-review`, reviewData);
  }

  getAdminBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin-all-blogs`);
  }

  likeBlog(blogId: string, user: any): Observable<any> {
    const url = `${this.apiUrl}/like-blog/${blogId}`;
    return this.http.put<any>(url, { user });
  }

  unlikeBlog(blogId: string, user: any): Observable<any> {
    const url = `${this.apiUrl}/unlike-blog/${blogId}`;
    return this.http.put<any>(url, { user });
  }
  
}
