import { Router } from '@angular/router';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DIGITALCATEGORY, DigitalCategoryDB } from 'src/app/shared/tables/digital-category';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SortEvent } from 'src/app/shared/directives/shorting.directive';
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from 'src/app/shared/service/table.service';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { CategoryService } from 'src/app/shared/service/category.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/shared/tables/category';

@Component({
  selector: 'app-digital-category',
  templateUrl: './digital-category.component.html',
  styleUrls: ['./digital-category.component.scss'],
  providers: [TableService, DecimalPipe],
})

export class DigitalCategoryComponent implements OnInit {
  myForm: FormGroup;
  myFormEdit: FormGroup;
  id: string;
  selectedItems: any;
  dropdownSettings = {};
  public closeResult: string;
  tableItem$: Observable<DigitalCategoryDB[]>;
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  public subcategories = []
  public isModalOpen: boolean = false
  selectedCategoryId: any;
  editMainCategory: any[] = [];
  isEditing: boolean = false;
  private modalRef: NgbModalRef | undefined;
  public searchText: string = '';

  constructor(
    private router: Router,
    public service: TableService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.tableItem$ = service.tableItem$;
    this.service.setUserData(DIGITALCATEGORY)
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      subcategories: [[]],
      isShow: [false]
    });

    // Kategorileri al
    this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = [response.categories[0]];
        this.getMainCategoryList();
      },
      (error) => {
        console.error('Kategoriler alınamadı:', error);
      }
    );
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  ngOnInit() {
    this.initEditForm();
    this.getMainCategoryList();

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

  closeModal() {
    this.isModalOpen = false;
  }

  openModal() {
    this.isModalOpen = true;
  }

  initEditForm(): void {
    const user = this.categories
    this.myFormEdit = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      isShow: [false],
      userId: user
    });
  }

  editCategoryMain(selectedCategory: any) {
    console.log('Düzenlenecek id bilgileri Enver:', selectedCategory);
    this.selectedCategoryId = selectedCategory
    this.myFormEdit.patchValue({
      name: selectedCategory.name,
      description: selectedCategory.description,
      isShow: selectedCategory.isShow,
    });
    this.isEditing = true;
  }

  updateMainCategory() {
    const formValues = this.myFormEdit.value;
    const categoryId = this.selectedCategoryId._id;

    this.categoryService.updateCategory(categoryId, formValues).subscribe(
      (response) => {
        console.log('Kategori güncelendi:', response);
        this.isEditing = false;
        this.closeModal();
        this.getMainCategoryList();
      },
      (error) => {
        console.error('Kategori güncelleme hatası:', error);
      }
    );
  }

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

  open(content: any) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalRef.result.then(
      (result) => {
        // Modal kapatıldığında yapılacak işlemler
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        // Modal reddedildiğinde yapılacak işlemler
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      }
    );
  }

  closeModalForAdd() {
    console.log('Modal will be closed.');
    if (this.modalRef) {
      this.modalRef.close(); // Modal kapatma işlemi
    }
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
          this.getMainCategoryList();
          this.closeModalForAdd();
          this.myForm.reset();

        },
        (error) => {
          console.error('Kategori oluşturulurken hata oluştu:', error);
        }
      );
    }
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  files: File[] = [];

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
        this.router.navigate(['/products/digital/digital-category']);
        this.getMainCategoryList();
      },
      (error) => {
        console.error('Kategori silinirken hata oluştu:', error);
      }
    );
  }

  getMainCategoryList() {
    this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response.categories.filter(category => category.isShow === true);
        this.filteredCategories = response.categories.filter(category => category.isShow === true);
        this.search();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  search() {
    if (!this.searchText) {
      this.categories = this.filteredCategories;
    } else {
      this.categories = this.categories.filter((categorie: any) => { // Add type assertion 'any'
        console.log(categorie);
        
        return (categorie.name as string).toLowerCase().includes(this.searchText.toLowerCase()); // Add type assertion 'as string'
      });
    }
  }

}
