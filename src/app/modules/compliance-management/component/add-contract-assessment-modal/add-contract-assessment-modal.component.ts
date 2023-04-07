import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ContractAssessmentService } from 'src/app/core/services/compliance-management/contract-assessment/contract-assessment.service';
import { SlaContractService } from 'src/app/core/services/compliance-management/sla-contract/sla-contract.service';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';

@Component({
  selector: 'app-add-contract-assessment-modal',
  templateUrl: './add-contract-assessment-modal.component.html',
  styleUrls: ['./add-contract-assessment-modal.component.scss']
})
export class AddContractAssessmentModalComponent implements OnInit {

  @Input('source') contractSource: any;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  SLAContractStore=SLAContractStore;
  form: FormGroup;
  formErrors: any;
  constructor( 
    private _formBuilder: FormBuilder, 
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _contractAssessmentService:ContractAssessmentService,
    private _slaContractService:SlaContractService
    ) { }

    ngOnInit(): void {

      // Form Object to add Control Category
    
      this.form = this._formBuilder.group({
        id: [''],
        contract: [null, [Validators.required]],
      });
    
       this.resetForm();
       this.getAllContracts();
      // Checking if Source has Values and Setting Form Value
    
      if (this.contractSource) {
        this.setFormValues();
       }
    
      }
      
      ngDoCheck(){
        if (this.contractSource && this.contractSource.hasOwnProperty('values') && this.contractSource.values && !this.form.value.id)
          this.setFormValues();
      }
    
      setFormValues(){
        if (this.contractSource.hasOwnProperty('values') && this.contractSource.values) {
          this.form.setValue({
            id: this.contractSource.values.id,
            contract: this.contractSource.values.document,
  
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
      this._eventEmitterService.dismissContractAssessmentModal();
    }
    
    // processDataForSave(){
    //   let saveData = {
    //     // id: this.form.value.id?this.form.value.id:'',
    //     title: this.form.value.title?this.form.value.title:'',
    //   };
    //   return saveData
    // }

    getAllContracts(){
      this._slaContractService.getItems(false, '&sla_status_ids=' + 1 +','+3).subscribe(() => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    
    // function for add & update
    save(close: boolean = false) {
      this.formErrors = null;
      if (this.form.value) {
        let save;
        AppStore.enableLoading();
         console.log(this.form.value);
         const payload={
          document_id:this.form.value.contract.id,
          document_version_id:this.form.value.contract.document_version_id
         }
        if (this.form.value.id) {
          save = this._contractAssessmentService.updateItem(this.form.value.id, payload);
        } else {
          delete this.form.value.id
          save = this._contractAssessmentService.saveItem(payload);
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
