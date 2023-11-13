import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";

@Component({
  selector: 'app-order-quick-view',
  templateUrl: './order-quick-view.component.html',
  styleUrls: ['./order-quick-view.component.scss']
})
export class OrderQuickViewComponent implements OnInit, OnDestroy{

    public modalOpen: boolean = false;
    
    @Input() product: Product;
    @Input() currency: any = this.productService.Currency; 

    constructor(private modalService: NgbModal, private productService: ProductService) { }

    ngOnDestroy(): void {
        if(this.modalOpen){
            this.modalService.dismissAll();
          }
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    openModal() {
        this.modalOpen = true;
    }
}
