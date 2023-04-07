import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ComplainceChecklistService } from 'src/app/core/services/compliance-management/complaince-checklist/complaince-checklist.service';


@Component({
  selector: 'app-add-checklist-modal',
  templateUrl: './add-checklist-modal.component.html',
  styleUrls: ['./add-checklist-modal.component.scss']
})
export class AddChecklistModalComponent implements OnInit {
  @Input('source') CheckListSource: any;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  form: FormGroup;
  formErrors: any;
  constructor( 
    private _formBuilder: FormBuilder, 
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _complainceChecklistService:ComplainceChecklistService
    ) { }

    ngOnInit(): void {

      // Form Object to add Control Category
    
      this.form = this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required]],
      });
    
       this.resetForm();
  
      // Checking if Source has Values and Setting Form Value
    
      if (this.CheckListSource) {
        this.setFormValues();
       }
    
      }
      
      ngDoCheck(){
        if (this.CheckListSource && this.CheckListSource.hasOwnProperty('values') && this.CheckListSource.values && !this.form.value.id)
          this.setFormValues();
      }
    
      setFormValues(){
        if (this.CheckListSource.hasOwnProperty('values') && this.CheckListSource.values) {
          let { id, title} = this.CheckListSource.values
          this.form.setValue({
            id: id,
            title: title,
  
          })
        }
      }
    
      getDescriptionLength(){
        var regex = /(<([^>]+)>)/ig;
        var result = this.form.value.title.replace(regex,"");
        return result.length;
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
      this._eventEmitterService.dismissComplainceChecklistModal();
    }
    
    processDataForSave(){
      let saveData = {
        // id: this.form.value.id?this.form.value.id:'',
        title: this.form.value.title?this.form.value.title:'',
      };
      return saveData
    }
    
    // function for add & update
    save(close: boolean = false) {
      this.formErrors = null;
      if (this.form.value) {
        let save;
        AppStore.enableLoading();
    
        if (this.form.value.id) {
          save = this._complainceChecklistService.updateItem(this.form.value.id, this.form.value);
        } else {
          delete this.form.value.id
          save = this._complainceChecklistService.saveItem(this.processDataForSave());
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
    
    //getting button name by language
    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }

}
