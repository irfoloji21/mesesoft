// category.service.ts
import { Injectable, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';
import { Category } from '../classes/category';


@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private apiUrl = 'http://localhost:8000/api/v2/category';

  constructor(private http: HttpClient) { }

  public screenWidth: any;
  public leftMenuToggle: boolean = false;
  public mainMenuToggle: boolean = false;
  private Categories: Observable<Category[]>;

  // Windows width
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

  // getCategory
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/get-all-categories`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/get-category/${id}`);
  }

  // createCategory
  createCategory(categoryData: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create-category`, categoryData);
  }

  // updateCategory
  updateCategory(id: number, updatedData: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/update-category/${id}`, updatedData);
  }

  // deleteCategory
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-category/${id}`);
  }

}
