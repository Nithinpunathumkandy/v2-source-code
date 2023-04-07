import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { ProcessCategoryMasterStore } from "src/app/stores/masters/bpm/prcoess-category.master.store";
import { ProcessCategoriesService } from "src/app/core/services/masters/bpm/process-categories/process-categories.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-process-category-modal',
  templateUrl: './process-category-modal.component.html',
  styleUrls: ['./process-category-modal.component.scss']
})
export class ProcessCategoryModalComponent implements OnInit {

  @Input ('source') ProcessGroupSource:any;
  processCategoryForm:FormGroup;
  processCatFormErros:any;
  AppStore = AppStore;
  ProcessCategoryMasterStore = ProcessCategoryMasterStore;

  constructor(private _utilityService: UtilityService,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _processCategoryService: ProcessCategoriesService,
    private _eventEmitterService: EventEmitterService) { }


    ngOnInit(): void {

      // Form Object to add Control Category
  
      this.processCategoryForm=this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required, Validators.maxLength(255)]],
        description: ['']
      })

      this.resetForm();
  
      // Checking if Source has Values and Setting Form Value
      if (this.ProcessGroupSource) {
        if(this.ProcessGroupSource.hasOwnProperty('values') && this.ProcessGroupSource.values){
  
          let {id,title,description}=this.ProcessGroupSource.values
    
          this.processCategoryForm.setValue({
            id: id,
            title: title,
            description:description
          })
        }
      }
  
  
  
  
    }
  
    saveProcessCategory(close:boolean=false){
      this.processCatFormErros=null;
      if(this.processCategoryForm.value){
        let save
        AppStore.enableLoading();
  
        if (this.processCategoryForm.value.id) {
          save = this._processCategoryService.updateItem(this.processCategoryForm.value.id, this.processCategoryForm.value);
        } else {
          // Deleting ID before POST
          delete this.processCategoryForm.value.id
          save = this._processCategoryService.saveItem(this.processCategoryForm.value);
        }
        save.subscribe((res: any) => {
          if(!this.processCategoryForm.value.id){
            this.resetForm();}
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.processCatFormErros = err.error.errors;}
            else if(err.status == 500 || err.status == 403){
              this.closeFormModal();
            }
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
          
        });
      }
    }
    
  
    cancel(){
      this.closeFormModal();
    }
  
  
    resetForm(){
      this.processCategoryForm.reset();
      this.processCategoryForm.pristine;
      this.processCatFormErros = null;
      AppStore.disableLoading();
    }
  
    closeFormModal() {
      this.resetForm();
      this._eventEmitterService.dismissProcessCategoryModal();
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
