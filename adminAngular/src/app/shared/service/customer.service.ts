import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<any[]> { 
    return this.http.get<any[]>(this.customersUrl);
  }

  addCustomer(customer: any): Observable<any[]> {
    return this.http.post<any[]>(this.customersUrl, customer).pipe(
      switchMap(() => this.getCustomers())
    );
  }
  
  
}
