import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  private apiUrl = "http://localhost:8000/api/v2/blog"; // API base URL for blogs

  constructor(private http: HttpClient) {}

  // Method to fetch all blogs
  getBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all-blogs`);
  }

  // Method to fetch details of a specific blog by slug
  getBlogDetails(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${slug}`);
  }

  // Method to create a new blog
  createBlog(blogData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-blog`, blogData);
  }

  // Method to fetch all blogs for a specific shop
  getAllShopBlogs(shopId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all-blogs-shop/${shopId}`);
  }

  // Method to delete a blog by ID
  deleteBlog(blogId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-shop-blog/${blogId}`);
  }

  // Method to create a review for a blog
  createReview(reviewData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/create-new-review`, reviewData);
  }

  // Method to fetch all blogs for the admin
  getAdminBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin-all-blogs`);
  }

  // Method to like a blog
  likeBlog(blogId: string, user: any): Observable<any> {
    const url = `${this.apiUrl}/like-blog/${blogId}`;
    return this.http.put<any>(url, { user });
  }

  // Method to unlike a blog
  unlikeBlog(blogId: string, user: any): Observable<any> {
    const url = `${this.apiUrl}/unlike-blog/${blogId}`;
    return this.http.put<any>(url, { user });
  }
}
