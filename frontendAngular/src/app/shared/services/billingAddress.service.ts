import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BillingAddressService {
  private apiUrl = "assets/data/billingAdress.json"; // URL for billing address data

  constructor(private http: HttpClient) {}

  // Method to fetch billing address data from the API
  getBillingAddressData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Method to set the selected billing address in local storage
  setSelectedBillingAddress(billingAddress: any): void {
    if (billingAddress && Object.keys(billingAddress).length !== 0) {
      localStorage.setItem(
        "selectedBillingAddress",
        JSON.stringify(billingAddress)
      );
    } else {
      localStorage.removeItem("selectedBillingAddress");
    }
  }
}
