import { Component, OnInit, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';

import { AppStore } from 'src/app/stores/app.store';

import { ControlCategoryService } from "src/app/core/services/masters/bpm/control-category/control-category.service";
import { ControlSubcategoryService } from "src/app/core/services/masters/bpm/control-subcategory/control-subcategory.service"
import { ControlCategoryMasterStore } from "src/app/stores/masters/bpm/control-category.master.store";
import { ControlSubcategoryMasterStore } from "src/app/stores/masters/bpm/control-subcategory.master.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-control-subcategory-modal',
  templateUrl: './control-subcategory-modal.component.html',
  styleUrls: ['./control-subcategory-modal.component.scss']
})
export class ControlSubcategoryModalComponent implements OnInit {

  @Input ('source') controlSubCateSource: any;
  controlSubCategform: FormGroup;
  controlSubCategformErrors: any;
  isReadOnly: boolean = false;

  AppStore = AppStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  ControlSubcategoryMasterStore = ControlSubcategoryMasterStore;

  constructor(private _utilityService: UtilityService,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _controlCategService: ControlCategoryService,
    private _controlSubCatService: ControlSubcategoryService, private _eventEmitterService: EventEmitterService) { }

    ngOnInit(): void {

      this.getControlCategories();


   
      this.controlSubCategform = this._formBuilder.group({
        id: [''],
        reference_code:[''],
        // reference_code:[null, [Validators.pattern(/^[0-9]\d*$/)]],
        control_category_id: [null, [Validators.required]],
        title: ['', [Validators.required, Validators.maxLength(255)]],
      });
  
      this.resetForm();

      if (ControlSubcategoryMasterStore.selectedCategoryId) {
        this.controlSubCategform.patchValue({
          control_category_id:ControlSubcategoryMasterStore.selectedCategoryId
        })
        this.isReadOnly = true;
      }
      
      if (this.controlSubCateSource) {
      if (this.controlSubCateSource.hasOwnProperty('values') && this.controlSubCateSource.values) { 
        let ev = { term: this.controlSubCateSource.values.control_category_id };
        this.searchControlCategory(ev);
        this.controlSubCategform.patchValue({
          id: this.controlSubCateSource.values.id,
          reference_code: this.controlSubCateSource.values.reference_code,
          control_category_id: this.controlSubCateSource.values.control_category_id,
          title: this.controlSubCateSource.values.title,
        });
        }
      }
        
    }

    getControlCategories(){
      this._controlCategService.getItems().subscribe();
    }
  
    // Save Control Subcategory
    saveControlSubcategory(close:boolean=false){
      this.controlSubCategformErrors = null;
      if (this.controlSubCategform.valid) {
        let save;
        AppStore.enableLoading();
        if (this.controlSubCategform.value.id) {
          save = this._controlSubCatService.updateItem(this.controlSubCategform.value.id, this.controlSubCategform.value);
        } else {
          delete this.controlSubCategform.value.id
          console.log(this.controlSubCategform.value)
          save = this._controlSubCatService.saveItem(this.controlSubCategform.value);
        }
        save.subscribe((res: any) => {
          if(!this.controlSubCategform.value.id){
            this.resetForm();}
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeControlSubcateModal();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.controlSubCategformErrors = err.error.errors;}
            else if(err.status == 500 || err.status == 403){
              this.closeControlSubcateModal();
            }
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
          
        });
      }
    }
  
    // Search All Control Category
    searchControlCategory(event){
      this._controlCategService.getItems(false,'&q='+event.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  
  closeControlSubcateModal() {
     // Emitting Event To set the Style in Parent Component(MODAL)
      this._eventEmitterService.setModalStyle();
      this._eventEmitterService.dismissControlSubcategoryModal(this.controlSubCategform.value.control_category_id);
      // this.resetForm();
    }
  
  cancelControlSubcateModal() {
      // Emitting Event To set the Style in Parent Component(MODAL)
      this._eventEmitterService.setModalStyle();
      this._eventEmitterService.dismissControlSubcategoryModal(this.controlSubCategform.value.control_category_id);
      this.resetForm();
    }
  
    resetForm(){
     //  this.controlSubCategform.controls['title'].reset()
      this.controlSubCategform.reset()
      this.controlSubCategform.pristine;
      this.controlSubCategformErrors = null;
      AppStore.disableLoading();
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

      if(event.key == 'Escape' || event.code == 'Escape'){     
  
          this.cancelControlSubcateModal();
  
      }
  
    }


   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
