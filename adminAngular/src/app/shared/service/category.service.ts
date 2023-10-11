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

}
