import { Component, OnInit, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { DocumentSubCategoryMasterStore } from 'src/app/stores/masters/knowledge-hub/document-sub-categories-store';
import { DocumentSubCategoriesService } from 'src/app/core/services/masters/knowledge-hub/document-sub-categories/document-sub-categories.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentSubSubCategoriesService } from 'src/app/core/services/masters/knowledge-hub/document-sub-sub-categories/document-sub-sub-categories.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Component({
  selector: 'app-document-sub-sub-categories-modal',
  templateUrl: './document-sub-sub-categories-modal.component.html',
  styleUrls: ['./document-sub-sub-categories-modal.component.scss']
})
export class DocumentSubSubCategoriesModalComponent implements OnInit {
  @Input('source') DocumentSubSubCategorySource: any;
  @Input('documentCategorySelect') documentCategorySelect:any;

  DocumentSubCategoryMasterStore = DocumentSubCategoryMasterStore;
  AppStore = AppStore;
  readOnlyStatus = false;
  form: FormGroup;
  formErrors: any;
  constructor(private _documentSubCategoryService: DocumentSubCategoriesService,
    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _documentSubSubCategoryService: DocumentSubSubCategoriesService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService, ) { }

  ngOnInit(): void {

    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      document_sub_category_id: ['', [Validators.required]],
      description: ['']
    });



    this.resetForm();

    // for document categories

    this.documentSubCategories();


    // Checking if Source has Values and Setting Form Value

    if (this.DocumentSubSubCategorySource) {
      this.setFormValues();
    }

    if(this.documentCategorySelect){
      this.selectDocumentSubCategory();
    }

  }

  ngDoCheck(){
    if (this.DocumentSubSubCategorySource && this.DocumentSubSubCategorySource.hasOwnProperty('values') && this.DocumentSubSubCategorySource.values && !this.form.value.id)
      this.setFormValues();

      if (this.documentCategorySelect && this.documentCategorySelect.hasOwnProperty('document_sub_category_ids') && this.documentCategorySelect.document_sub_category_ids && !this.form.value.id)
      this.selectDocumentSubCategory(); 
  }

  setFormValues(){
    if (this.DocumentSubSubCategorySource.hasOwnProperty('values') && this.DocumentSubSubCategorySource.values) {
      let { id, title, document_sub_category_id, description } = this.DocumentSubSubCategorySource.values
      this.form.setValue({
        id: id,
        title: title,
        document_sub_category_id: document_sub_category_id,
        description: description
      })
    }
  }

  selectDocumentSubCategory(){
    // this.form.value.document_category_id=this.documentCategorySelect.selectedDocumentCategoryId;
    if (this.documentCategorySelect.document_sub_category_ids ) {
      this.readOnlyStatus =this.documentCategorySelect.readOnlyStatus;
      this.form.patchValue({
        document_sub_category_id:this.documentCategorySelect.document_sub_category_ids,
      })
    }
  }

  documentSubCategories() {
    this._documentSubCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchDocumentSubCategory(event) {
    this._documentSubCategoryService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissKnowledgeHubDocumentSubSubCategoryModal();
  }

  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._documentSubSubCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._documentSubSubCategoryService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
          else if(err.status == 500 || err.status == 403){
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }


//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

}




