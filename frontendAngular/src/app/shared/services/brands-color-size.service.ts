import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../classes/product';

@Injectable({
  providedIn: 'root'
})

export class BrandsColorSizeService {

  private filterUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getFilterData(): Observable<Product> {
    return this.http.get<Product>(this.filterUrl);
  }

  getColors(): Observable<any[]> {
    return this.getFilterData().pipe(map(data => data.colors));
  }

  getSizes(): Observable<any[]> {
    return this.getFilterData().pipe(map(data => data.sizes));
  }

  getBrands(): Observable<any[]> {
    return this.getFilterData().pipe(map(data => data.brands));
  }
}
