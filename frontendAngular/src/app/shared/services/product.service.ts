import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';

const state = {
  products: JSON.parse(localStorage['products'] || '[]'),
  wishlist: JSON.parse(localStorage['wishlistItems'] || '[]'),
  compare: JSON.parse(localStorage['compareItems'] || '[]'),
  cart: JSON.parse(localStorage['cartItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  public Currency = { name: 'Dollar', currency: 'USD', price: 1 } // Default Currency
  public OpenCart: boolean = false;
  public Products

  private wishlist: Product[] = state.wishlist;
  private wishlistSubject: BehaviorSubject<number> = new BehaviorSubject(this.wishlist.length);

  public apiUrl = "http://localhost:8000/api/v2"

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService
  ) { }

  /*
    ---------------------------------------------
    ---------------  Product  -------------------
    ---------------------------------------------
  */

  // // Product
  private get products(): Observable<Product[]> {
    this.Products = this.http.get<Product[]>(`${this.apiUrl}/product/get-all-products`).pipe(map(data => data));
    this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });
    return this.Products = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));
  }

  // Get Products
  public get getProducts(): Observable<Product[]> {
    return this.products
  }

  // Get Products By Slug
  public getProductBySlug(slug: string): Observable<Product> {
    return this.http.get(`${this.apiUrl}/product/${slug}`).pipe(map(data => data))
  }

  //creaateNewReview
  createNewReview(comment: Comment): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers, withCredentials: true };
    return this.http.put(`${this.apiUrl}/product/create-new-review`, comment, options);
  }

  /*
    ---------------------------------------------
    ---------------  Wish List  -----------------
    ---------------------------------------------
  */

  // Get Wishlist Items
  public get wishlistItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.wishlist);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Wishlist
  public addToWishlist(product: Product) {
    const wishlistItem = this.wishlist.find(item => item._id === product._id);
    if (!wishlistItem) {
      this.wishlist.push({ ...product });
      this.updateWishlistCount();
      this.updateLocalStorage();
    }
    this.toastrService.success('Product has been added in wishlist');
    return true;
  }

  // Remove Wishlist items
  public removeWishlistItem(product: Product) {
    const index = this.wishlist.indexOf(product);
    if (index !== -1) {
      this.wishlist.splice(index, 1);
      this.updateWishlistCount();
      this.updateLocalStorage();
    }
    return true;
  }

  private updateWishlistCount() {
    this.wishlistSubject.next(this.wishlist.length);
  }

  private updateLocalStorage() {
    localStorage.setItem("wishlistItems", JSON.stringify(this.wishlist));
  }

  getWishlistCountObservable() {
    return this.wishlistSubject.asObservable();
  }

  /*
    ---------------------------------------------
    -------------  Compare Product  -------------
    ---------------------------------------------
  */

  // Get Compare Items
  public get compareItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.compare);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  } _

  // Add to Compare
  public addToCompare(product): any {
    const compareItem = state.compare.find(item => item._id === product._id)
    if (!compareItem) {
      state.compare.push({
        ...product
      })
    }
    this.toastrService.success('Product has been added in compare.');
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

  // Remove Compare items
  public removeCompareItem(product: Product): any {
    const index = state.compare.indexOf(product);
    state.compare.splice(index, 1);
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

  /*
    ---------------------------------------------
    -----------------  Cart  --------------------
    ---------------------------------------------
  */

  // CartAll clear
  public clearCart(): any {
    state.cart = [];
    localStorage.removeItem("cartItems");
    return true
  }

  // Get Cart Items
  public get cartItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.cart);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Cart
  public addToCart(product): any {
    const cartItem = state.cart.find(item => item._id === product._id);
    const qty = product.quantity ? product.quantity : 1;
    const items = cartItem ? cartItem : product;
    const stock = this.calculateStockCounts(items, qty);

    if (!stock) return false

    if (cartItem) {
      cartItem.quantity += qty
    } else {
      state.cart.push({
        ...product,
        quantity: qty
      })
    }

    this.OpenCart = true; // If we use cart variation modal
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true;
  }

  // Update Cart Quantity
  public updateCartQuantity(product: Product, quantity: number): Product | boolean {
    return state.cart.find((items, index) => {
      if (items._id === product._id) {
        const qty = state.cart[index].quantity + quantity
        const stock = this.calculateStockCounts(state.cart[index], quantity)
        if (qty !== 0 && stock) {
          state.cart[index].quantity = qty
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cart));
        return true
      }
    })
  }

  // Calculate Stock Counts
  public calculateStockCounts(product, quantity) {
    const qty = product.quantity + quantity
    const stock = product.stock
    if (stock < qty || stock == 0) {
      this.toastrService.error('You can not add more items than available. In stock ' + stock + ' items.');
      return false
    }
    return true
  }

  // Remove Cart items
  public removeCartItem(product: Product): any {
    const index = state.cart.indexOf(product);
    state.cart.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true
  }

  // Total amount 
  public cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe(map((products: Product[]) => {
      return products.reduce((totalAmount, product: Product) => {
        let price = product.originalPrice;

        // if (product.discountPrice) {
        //   price = product.originalPrice - (product.originalPrice * product.discountPrice / 100);
        // }

        return (totalAmount + price * product.quantity) * this.Currency.price;
      }, 0);
    }));
  }

  // Get Cart Items Length
  getCartItems(): boolean {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    return Array.isArray(cartItems) && cartItems.length > 0;
  }

  /*
    ---------------------------------------------
    ------------  Filter Product  ---------------
    ---------------------------------------------
  */

  // Get Product Filter
  public filterProducts(filter: any): Observable<Product[]> {
    return this.products.pipe(
      map((product) => {
        // Check if product is an array, if not, convert it to an array
        const productArray = Array.isArray(product) ? product : [product];

        return productArray.filter((item: Product) => {
          if (!filter.length) return true;
          const Tags = filter.some((prev) => { // Match Tags
            if (item.tags) {
              if (item.tags.includes(prev)) {
                return prev;
              }
            }
          });
          return Tags;
        });
      })
    );
  }

  // Sorting Filter
  public sortProducts(products: Product[], payload: string): any {
    if (payload === 'ascending') {
      return products.sort((a, b) => {
        if (a._id < b._id) {
          return -1;
        } else if (a._id > b._id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'a-z') {
      return products.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'z-a') {
      return products.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        if (a.originalPrice < b.originalPrice) {
          return -1;
        } else if (a.originalPrice > b.originalPrice) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        if (a.originalPrice > b.originalPrice) {
          return -1;
        } else if (a.originalPrice < b.originalPrice) {
          return 1;
        }
        return 0;
      })
    }
  }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */

  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
    let paginateRange = 3;

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage < paginateRange - 1) {
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  search(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/search/${searchTerm}`);
  }

  irfan(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/get-products-by-category/${id}`);
  }

}
