import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Category, CATEGORY } from '../../../../shared/tables/category';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { TableService } from 'src/app/shared/service/table.service';
import { SortEvent } from 'src/app/shared/directives/shorting.directive';
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { KoleksiyonService } from 'src/app/shared/service/koleksiyon.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CategoryService } from 'src/app/shared/service/category.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [TableService, DecimalPipe],
})


export class CategoryComponent implements OnInit {
  products: any[] = [];
  buttonText: string = 'Add';
  myForm1:FormGroup;
  myForm2:FormGroup;
  koleksiyons: any[] = [];
  public filteredKoleksiyons: any[] = [];
  public selectedKoleksiyon: any;
  
  public closeResult: string;

  searchText;
  tableItem$: Observable<Category[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private router: Router,
    public service: TableService, 
    private modalService: NgbModal,
    public koleksiyonService: KoleksiyonService,
    public authService: AuthService,
    private productService: ProductService, 
    private fb: UntypedFormBuilder,
    private categoryService: CategoryService,
    ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    this.service.setUserData(CATEGORY)

    this.myForm1 = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      saving: ['', Validators.required],
      images: ['', Validators.required],
      // products: [''],
      isShow: [false],
    });

     
  }

  onSort({ column, direction }) {

    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  performAction() {
    if (this.buttonText === 'Add') {
      this.onSubmit();
    } else if (this.buttonText === 'Update Collection') {
      // Koleksiyonu güncelleme işlemi
      this.updateCollection(this.selectedKoleksiyon._id);
      console.log("updateCollection")
    }
  }

  updateCollection(id: string) {
    if (this.myForm1.valid) {
      const formData = this.myForm1.value;
  
      this.koleksiyonService.updateKoleksiyon(id, formData).subscribe(
        (response) => {
          console.log('Koleksiyon başarıyla güncellendi:', response);
          this.router.navigate(['/physical/collection']);
        },
        (error) => {
          console.error('Koleksiyon güncellenirken hata oluştu:', error);
        }
      );
    }
  }
  
  
  

  onSubmit() {

    if (this.buttonText === 'Add') {
    

    const shop = this.authService.getShop();

      
    console.log("form submitted");
    if (this.myForm1.valid) {
      const formData = this.myForm1.value;
    
      console.log(shop, "shop")
      formData.shopId = shop.seller._id;
      formData.shop = shop;
      

      console.log('formData:', formData);
      this.koleksiyonService.createKoleksiyon(formData).subscribe(
        (response) => {
          console.log('Koleksiyon başarıyla oluşturuldu:', response);
          this.router.navigate(['/physical/category']);
        },
        (error) => {
          console.error('Kategori oluşturulurken hata oluştu:', error);
        }
      );
    }

  } else if (this.buttonText === 'Update Collection') {
    // Koleksiyonu güncelleme işlemi
    this.updateCollection(this.selectedKoleksiyon.koleksiyon._id);
    console.log("updateCollection")
  }
  }

  onFileChange(event: any) {
    console.log('onFileChange', event.target.files)
    if (event.target.files && event.target.files.length > 0) {
      const files: FileList = event.target.files;
  
      const imageUrls = [];
  
      for (let j = 0; j < files.length; j++) {
        const file = files[j];
        const reader = new FileReader();
  
        reader.onload = (e: any) => {

          imageUrls.push(e.target.result);
          console.log('imageUrls', imageUrls)
          this.myForm1.get('images').setValue(imageUrls);
  
          // console.log('imageUrls:', imageUrls);
          // console.log(this.myForm.value.images);
        };
  
        reader.readAsDataURL(file);
      }
    }
  }
  
  

  editCategory(id: string, content) {
    // Servis üzerinden koleksiyon bilgilerini getir
    this.koleksiyonService.getCollectionById(id).subscribe(
      (koleksiyon) => {
        this.selectedKoleksiyon = koleksiyon;
        
  
        // Formu resetle
        this.myForm1.reset();

        console.log(this.selectedKoleksiyon, "this.selectedKoleksiyon")
  
        // Formu doldur
        this.myForm1.patchValue({
          name: this.selectedKoleksiyon.koleksiyon.name,
          saving: this.selectedKoleksiyon.koleksiyon.saving,
          description: this.selectedKoleksiyon.koleksiyon.description,
          images: this.selectedKoleksiyon.koleksiyon.images,
          isShow: this.selectedKoleksiyon.koleksiyon.isShow,
        });
        console.log(this.myForm1, "this.myForm1")

  
        // Button text'i güncelle
        this.buttonText = 'Update Collection';
  
        // Modal'ı aç
        this.open(content);
      },
      (error) => {
        console.error('Koleksiyon getirme hatası:', error);
      }
    );
  }
  
  

  deleteCategory(_id){
    console.log("deleteCategory")
  }
  
  


  ngOnInit() {
    this.koleksiyonService.getKoleksiyon().subscribe(
      (response) => {
        this.koleksiyons = response.koleksiyons;
        console.log('getKoleksiyon', this.koleksiyons);

        const shop = this.authService.getShop();
        console.log(shop, "shop")
        this.productService.getShopProduct(shop.seller._id).subscribe(
          (response) => {
            this.products = response.products;
            console.log('Ürünler:', response);
          },
          (error) => {
            console.error(error);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
    


  }

}
