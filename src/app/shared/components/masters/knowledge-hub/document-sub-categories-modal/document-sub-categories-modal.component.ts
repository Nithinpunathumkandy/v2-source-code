import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentSubCategoriesService } from 'src/app/core/services/masters/knowledge-hub/document-sub-categories/document-sub-categories.service';
import { HttpErrorResponse } from '@angular/common/http';
import {DocumentCategoryMasterStore} from 'src/app/stores/masters/knowledge-hub/document-category-store';
import { DocumentCategoryService } from 'src/app/core/services/masters/knowledge-hub/document-category/document-category.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-document-sub-categories-modal',
  templateUrl: './document-sub-categories-modal.component.html',
  styleUrls: ['./document-sub-categories-modal.component.scss']
})
export class DocumentSubCategoriesModalComponent implements OnInit {
  @Input('source') DocumentSubCategorySource: any;
  @Input('documentCategorySelect') documentCategorySelect:any;

  AppStore = AppStore;

  DocumentCategoryMasterStore = DocumentCategoryMasterStore;
  form: FormGroup;
  formErrors: any;
  readOnlyStatus = false;
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _documentSubCategoryService: DocumentSubCategoriesService,
    private _documentCategoryService: DocumentCategoryService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

     // Form Object to add Control Category

  this.form = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    document_category_id: [null,[Validators.required]],
    description:['']
  });
    

  this.resetForm();
  

  // for document categories

  this.documentCategories();


  // Checking if Source has Values and Setting Form Value

  if (this.DocumentSubCategorySource) {
    this.setFormValues();
  }
  
  if(this.documentCategorySelect){
    this.selectDocumentCategory();
  }

}

ngDoCheck(){
  if (this.DocumentSubCategorySource && this.DocumentSubCategorySource.hasOwnProperty('values') && this.DocumentSubCategorySource.values && !this.form.value.id)
    this.setFormValues(); 

    if (this.documentCategorySelect && this.documentCategorySelect.hasOwnProperty('document_category_ids') && this.documentCategorySelect.document_category_ids && !this.form.value.id)
    this.selectDocumentCategory(); 
}

setFormValues(){
  if (this.DocumentSubCategorySource.hasOwnProperty('values') && this.DocumentSubCategorySource.values) {
    let { id, title,document_category_id,description } = this.DocumentSubCategorySource.values
    this.form.setValue({
      id: id,
      title: title,
      document_category_id:document_category_id,
      description:description
    })
  }
}
selectDocumentCategory(){
  // this.form.value.document_category_id=this.documentCategorySelect.selectedDocumentCategoryId;
  if (this.documentCategorySelect.document_category_ids ) {
    this.readOnlyStatus =this.documentCategorySelect.readOnlyStatus;
    this.form.patchValue({
      document_category_id:this.documentCategorySelect.document_category_ids,
    })
  }
}

documentCategories(){
this._documentCategoryService.getItems().subscribe(res=>{
  this._utilityService.detectChanges(this._cdr);
})

}

searchDocumentCategory(event){
  this._documentCategoryService.getItems(false,'&q='+event.term).subscribe(res=>{
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
  this._eventEmitterService.dismissKnowledgeHubDocumentSubCategoryModal();
}

// function for add & update
save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._documentSubCategoryService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._documentSubCategoryService.saveItem(this.form.value);
    }

    save.subscribe((res: any) => {
      if(!this.form.value.id){
      this.resetForm();}
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





