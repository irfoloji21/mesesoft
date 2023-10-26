import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KoleksiyonService {
  private apiUrl = 'http://localhost:8000/api/v2';

  constructor(private http: HttpClient) { }


  // getCategory(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/category/get-all-categories`);
  // }

  createKoleksiyon(koleksiyonData): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/koleksiyon/create-koleksiyon`, koleksiyonData, { headers, withCredentials: true });
  }

  // deleteCategory(id): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/category/delete-category/${id}`);
  // }
  

}
