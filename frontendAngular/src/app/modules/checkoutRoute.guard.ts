import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {
    constructor(
        private productService: ProductService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.productService.getCartItems()) {
            return true;
        }
        this.router.navigate(['/home/fashion']);
        return false;
        

    }
}