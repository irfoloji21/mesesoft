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
import { Category } from 'src/app/shared/tables/category';

@Component({
  selector: 'app-digital-sub-category',
  templateUrl: './digital-sub-category.component.html',
  styleUrls: ['./digital-sub-category.component.scss'],
  providers: [TableService, DecimalPipe],
})

export class DigitalSubCategoryComponent implements OnInit {
  catalogForm: FormGroup;
  selectedItems = [];
  dropdownSettings = {};
  public closeResult: string;
  tableItem$: Observable<DigitalCategoryDB[]>;
  categories: Category[] = []
  filteredCategories: Category[] = []
  public supercategory = []
  isModalOpen: boolean = false;
  selectedSubCategoryId: any;
  catalogFormEdit: FormGroup;
  isEditing: boolean = false;
  private modalRef: NgbModalRef | undefined;
  public searchText: string = '';

  constructor(
    public service: TableService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private fb: UntypedFormBuilder,
  ) {
    this.tableItem$ = service.tableItem$;
    this.service.setUserData(DIGITALCATEGORY)
    this.catalogForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      supercategory: [[]]
    });
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {

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
      },
      (reason) => {
      }
    );
  }

  closeModalForAddSubCat() {
    if (this.modalRef) {
      this.modalRef.close();
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
    if (this.catalogForm.valid) {
      const formData = this.catalogForm.value;
      const selectedSupercategories = formData.supercategory; 
      this.categoryService.createCategory(formData).subscribe(
        (newCategory) => {
          const irfan = newCategory.category
          selectedSupercategories.forEach((selectedSupercategory) => {
            const supercategoryId = selectedSupercategory._id; 
            this.categoryService.addSubCategory(supercategoryId, irfan).subscribe(
              (response) => {
                this.getSubCategoryList();
                this.closeModalForAddSubCat();
                this.catalogForm.reset();
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
          this.catalogForm.get('images').setValue(imageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  search() {
    if (!this.searchText) {
      this.categories = this.filteredCategories;
    } else {
      this.categories = this.filteredCategories.filter((categorie: any) => {
        const nameMatch = (categorie.name as string).toLowerCase().includes(this.searchText.toLowerCase());
        const idMatch = (categorie._id as string).toLowerCase().includes(this.searchText.toLowerCase());

        return nameMatch || idMatch;
      });
    }
  }

  onSearchTextChange() {
    if (!this.searchText) {
      this.categories = this.filteredCategories;
    } else {
      this.search();
    }
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).subscribe(
      (response) => {
        this.getSubCategoryList();
      },
      (error) => {
        console.error('Kategori silinirken hata oluştu:', error);
      }
    );
  }

  ngOnInit() {
    this.initEditForm();
    this.getSubCategoryList();
    const dropdownSettings: IDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    this.dropdownSettings = dropdownSettings;
  }

  getSubCategoryList() {
    this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response.categories;
        this.filteredCategories = response.categories;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openModal() {
    this.isModalOpen = true;
  }

  initEditForm(): void {
    const user = this.categories
    this.catalogFormEdit = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      isShow: [false],
      userId: user
    });
  }

  editSubCategory(selectedCategory: any) {
    this.selectedSubCategoryId = selectedCategory
    this.catalogFormEdit.patchValue({
      name: selectedCategory.name,
      description: selectedCategory.description,
    });
    this.isEditing = true;
  }

  updateSubCategory() {
    const formValues = this.catalogFormEdit.value;
    const categoryId = this.selectedSubCategoryId._id;

    this.categoryService.updateCategory(categoryId, formValues).subscribe(
      (response) => {
        this.isEditing = false;
        this.closeModal();
        this.getSubCategoryList();
      },
      (error) => {
        console.error('Kategori güncelleme hatası:', error);
      }
    );
  }

}
