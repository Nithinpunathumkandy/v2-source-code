import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { FindingsService } from 'src/app/core/services/external-audit/findings/findings.service';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
@Component({
  selector: 'app-quick-correction-modal',
  templateUrl: './quick-correction-modal.component.html',
  styleUrls: ['./quick-correction-modal.component.scss']
})
export class QuickCorrectionModalComponent implements OnInit {
  @Input('source') QuickSource: any;

  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  AuditFindingsStore = AuditFindingsStore;
  FindingMasterStore = FindingMasterStore;
  AuditNonConfirmityStore=AuditNonConfirmityStore;
  constructor(private _auditFindingService: AuditFindingsService,
    private _formBuilder: FormBuilder, 
    private _cdr: ChangeDetectorRef,
    private _findingService: FindingsService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _auditNonConfirmityService : AuditNonConfirmityService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {

      // Form Object to add Control Category

  this.form = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['']
  });

  this.resetForm();


  // setting form values from source
  if(this.QuickSource.type=='Edit'){
    this.setFormValues();
  }
  }

  ngDoCheck(){
    if (this.QuickSource && this.QuickSource.hasOwnProperty('values') && this.QuickSource.values && !this.form.value.id)
      this.setFormValues();
  }


  setFormValues(){

    if (this.QuickSource.hasOwnProperty('values') && this.QuickSource.values) {
      this.form.setValue({
        id: this.QuickSource.values.id,
        title: this.QuickSource.values.title,
        description: this.QuickSource.values.description,
      })
    }
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
    this._eventEmitterService.dismissQuickCorrectionModal();
  }
  
  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if(this.QuickSource?.module=='ms-audit' && this.QuickSource?.module)
      {
        if(this.QuickSource.type=='Add'){
          save = this._auditNonConfirmityService.addQuickCorrectionMsAudit(this.form.value,AuditNonConfirmityStore?.msAuditNonConfirmityId,);
        }
        else
        {
          save = this._auditNonConfirmityService.updateQuickCorrectionMsAudit(this.form.value,this.form.value.id);
        }
      }
      else
      {
        if(this.QuickSource.type=='Add' && AuditFindingsStore.auditFindingId){
          save = this._auditFindingService.addQuickCorrection(AuditFindingsStore.auditFindingId,this.form.value);
        } else if(this.form.value.id && AuditFindingsStore.auditFindingId) {
          save = this._auditFindingService.updateQuickCorrection(AuditFindingsStore.auditFindingId, this.form.value.id,this.form.value);
        } else if(this.QuickSource.type=='Add' && FindingMasterStore.auditFindingId){
          save = this._findingService.addQuickCorrection(FindingMasterStore.auditFindingId,this.form.value);
        } else {
          save = this._findingService.updateQuickCorrection(FindingMasterStore.auditFindingId, this.form.value.id,this.form.value);
        }
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
            this.cancel();
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

