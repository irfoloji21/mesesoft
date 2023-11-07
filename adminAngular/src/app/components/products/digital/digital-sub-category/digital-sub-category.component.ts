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
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-digital-sub-category',
  templateUrl: './digital-sub-category.component.html',
  styleUrls: ['./digital-sub-category.component.scss'],
  providers: [TableService, DecimalPipe],
})

export class DigitalSubCategoryComponent implements OnInit {
  myForm:FormGroup;
  selectedItems = [];
  dropdownSettings = {};
  public closeResult: string;
  tableItem$: Observable<DigitalCategoryDB[]>;
  public categories = []
  public supercategory = []

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
      supercategory: [[]]
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
      const selectedSupercategories = formData.supercategory; // Seçilen tüm üst kategorileri alın
  
      // formData içindeki diğer verileri burada işleyebilirsiniz.
  
      // Yeni kategoriyi oluşturun
      this.categoryService.createCategory(formData).subscribe(
        (newCategory) => {
          console.log('Yeni Kategori Başarıyla Oluşturuldu:', newCategory);

          const irfan = newCategory.category 
          console.log(irfan)
  
          // Her bir üst kategori için işlem yapın
          selectedSupercategories.forEach((selectedSupercategory) => {
            const supercategoryId = selectedSupercategory._id; // Üst kategori ID'si
            console.log('Üst Kategori ID:', supercategoryId);
  
                // Subcategories'i güncelleyin
                this.categoryService.addSubCategory(supercategoryId, irfan).subscribe(
                  (response) => {
                    console.log(response)
                    console.log('Üst Kategori Subcategories Güncellendi');
                    // İşlem tamamlandığında yönlendirme yapın (bu her üst kategori için ayrı ayrı olabilir)
                    this.router.navigate(['/products/digital/digital-sub-category']);
                  },
                  (error) => {
                    console.error('Üst Kategori Subcategories Güncellenirken Hata:', error);
                  }
                );
              })
          });
        }
        (error) => {
          console.error('Yeni Kategori Oluşturulurken Hata:', error);
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
          this.myForm.get('images').setValue(imageUrls);
  
          console.log('imageUrls:', imageUrls);
          console.log(this.myForm.value.images);
        };
  
        reader.readAsDataURL(file);
      }
    }
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).subscribe(
      (response) => {
        console.log('Kategori başarıyla silindi:', response);
        this.router.navigate(['/products/digital/digital-sub-category']);
      },
      (error) => {
        console.error('Kategori silinirken hata oluştu:', error);
      }
    );
  }

  ngOnInit() {
    this.categoryService.getCategory().subscribe(
      (response) => {
        console.log('Kategoriler', response);
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
