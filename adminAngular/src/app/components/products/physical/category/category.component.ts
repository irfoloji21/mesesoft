import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Category, CATEGORY } from '../../../../shared/tables/category';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { TableService } from 'src/app/shared/service/table.service';
import { SortEvent } from 'src/app/shared/directives/shorting.directive';
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CollectionService } from 'src/app/shared/service/collection.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [TableService, DecimalPipe],
})


export class CategoryComponent implements OnInit {
  myForm:FormGroup;
  
  public closeResult: string;

  searchText;
  tableItem$: Observable<Category[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private router: Router,
    public service: TableService, 
    private modalService: NgbModal,
    public collectionService: CollectionService,
    public authService: AuthService,
    private fb: UntypedFormBuilder,
    ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    this.service.setUserData(CATEGORY)

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      saving: ['', Validators.required],
      images: ['', Validators.required],
    });
  }

  onSort({ column, direction }) {
    // resetting other headers
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

  onSubmit() {

    const shop = this.authService.getShop();

      
    console.log("form submitted");
    if (this.myForm.valid) {
      const formData = this.myForm.value;
    
      formData.shopId = shop.seller._id;
      formData.shop = shop;
     console.log(this.myForm.value);
      

      console.log('formData:', formData);
      this.collectionService.createCollection(formData).subscribe(
        (response) => {
          console.log('Koleksiyon başarıyla oluşturuldu:', response);
          this.router.navigate(['/physical/category']);
        },
        (error) => {
          console.error('Kategori oluşturulurken hata oluştu:', error);
        }
      );
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files: FileList = event.target.files;
    
      const imageUrls = [];
    
      for (let j = 0; j < files.length; j++) {
        const file = files[j];
        const reader = new FileReader();
    
        reader.onload = (e: any) => {
          imageUrls.push(e.target.result);
          // Dosyanın adı için
          const fileName = file.name;
          // imageUrls ve fileName'i kullanabilirsiniz.
          console.log('imageUrls:', imageUrls);
          console.log('Dosya Adı:', fileName);
        };
    
        reader.readAsDataURL(file);
      }
    }
  }
  
  


  ngOnInit() {
  }

}
