import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonProductService {
  createProduct(formData: any): Observable<any> {
    const mockProductResponse = {
      success: true,
      product: {
        stockStatus: { stockStatusValue: formData.stockStatus.stockStatusValue },
      },
    };
    return of(mockProductResponse);
  }
}
