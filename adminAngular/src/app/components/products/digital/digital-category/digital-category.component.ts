import { Router } from '@angular/router';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DIGITALCATEGORY, DigitalCategoryDB } from 'src/app/shared/tables/digital-category';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SortEvent } from 'src/app/shared/directives/shorting.directive';
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from 'src/app/shared/service/table.service';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { CategoryService } from 'src/app/shared/service/category.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-digital-category',
  templateUrl: './digital-category.component.html',
  styleUrls: ['./digital-category.component.scss'],
  providers: [TableService, DecimalPipe],
})
export class DigitalCategoryComponent implements OnInit {
  myForm:FormGroup;
  myForm2:FormGroup;
  selectedItems = [];
  dropdownSettings = {};
  public closeResult: string;
  tableItem$: Observable<DigitalCategoryDB[]>;
  public categories = []
  public subcategories = []

  constructor(
    private router: Router,
    public service: TableService, 
    private modalService: NgbModal, 
    private categoryService: CategoryService,
    private fb: UntypedFormBuilder,
    ) {
    this.tableItem$ = service.tableItem$;
    this.service.setUserData(DIGITALCATEGORY)
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      subcategories: [[]],
      isShow:[false]
    });

    this.myForm2 = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      subcategories: [[]],
      isShow:[false]
    });
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
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
    console.log("form submitted");
    if (this.myForm.valid) {
      const formData = this.myForm.value;
    //  console.log(this.myForm.value);
      formData.subcategories = this.subcategories;

      console.log('formData:', formData);
      this.categoryService.createCategory(formData).subscribe(
        (response) => {
          console.log('Kategori başarıyla oluşturuldu:', response);
          this.router.navigate(['/products/digital/digital-category']);
        },
        (error) => {
          console.error('Kategori oluşturulurken hata oluştu:', error);
        }
      );
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

          this.myForm.get('images').setValue(imageUrls);
  
          // console.log('imageUrls:', imageUrls);
          // console.log(this.myForm.value.images);
        };
  
        reader.readAsDataURL(file);
      }
    }
  }

  editCategory(_id){
    this.router.navigate(['digital/edit-category', _id]);
  }


  

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).subscribe(
      (response) => {
        console.log('Kategori başarıyla silindi:', response);
        this.router.navigate(['/products/digital/digital-category']);
      },
      (error) => {
        console.error('Kategori silinirken hata oluştu:', error);
      }
    );
  }

  ngOnInit() {
    this.categoryService.getCategory().subscribe(
      (response) => {
        // console.log('Kategoriler', response);
        this.categories = response.categories;
      },
      (error) => {
        console.error(error);
      }
    );

    const dropdownSettings: IDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    
    // Şimdi nesneyi kullanabilirsiniz
    this.dropdownSettings = dropdownSettings;

   
  }

}
