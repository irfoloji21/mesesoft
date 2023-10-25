import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8000/api/v2';

  constructor(private http: HttpClient) { }


  getCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/get-all-categories`);
  }

  getCategoryById(id): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/get-category/${id}`);
  }

  addSubCategory(id, subCategories): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/category/add-subcategories/${id}`, subCategories);
  }

  createCategory(categoryData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/category/create-category`, categoryData);
  }

  deleteCategory(id): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/category/delete-category/${id}`);
  }

  updateCategory(id, categoryData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/category/update-category/${id}`, categoryData);
  }
  

}
