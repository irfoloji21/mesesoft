import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.scss']
})
export class StockInventoryComponent implements OnInit {

  @Input() stock: any;
  public product: Product = {};
  constructor(private productService : ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts.subscribe(res => {
      console.log(res, "stockDeneme");

      if (!Array.isArray(this.product)) {
        res = [this.product];
      }

      res.forEach(item => {
        if (item && typeof item === 'object' && 'stock' in item) {
         this.stock = item.stock
        }
      });
    });
  }

}
