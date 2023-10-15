import { Component} from '@angular/core';
import { ProductService } from "../../services/product.service";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent   {
  
  searchTerm: string;
  products: any[]; 

  constructor(
   public productService: ProductService ,
   ) {

  }


  searchProducts() {
    this.productService.search(this.searchTerm).subscribe((data) => {
      this.products = data;
    });
  }
}

