import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private apiUrl = "http://localhost:3000/customers"; 

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addCustomer(customer: any): Observable<any> {
    return this.http.post(this.apiUrl, customer);
  }
}
