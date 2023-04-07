import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditChecklistGroupService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-cheklist-group/ms-audit-cheklist-group.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditChecklistGroupMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-checklist-group-store';




@Component({
  selector: 'app-ms-audit-checklist-group-model',
  templateUrl: './ms-audit-checklist-group-model.component.html',
  styleUrls: ['./ms-audit-checklist-group-model.component.scss']
})
export class MsAuditChecklistGroupModel implements OnInit {

  @Input('source') AuditChecklistGroup: any;
  AppStore = AppStore;
  formErrors: any;
  form: FormGroup;

  id: any;


  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _auditChecklistGroupService: AuditChecklistGroupService,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id:[''],
      title:['']
    });
    
    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.AuditChecklistGroup) {
      this.setFormValues();
    }
  }   
  setFormValues(){
    if (this.AuditChecklistGroup.hasOwnProperty('values') && this.AuditChecklistGroup.values) { 
      this.form.patchValue({
        title:this.AuditChecklistGroup.values.title,
        id:this.AuditChecklistGroup.values.id,
      })
    }
  }
  resetForm() {
    this.id=null;
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
  }
  
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._auditChecklistGroupService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._auditChecklistGroupService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AuditChecklistGroupMasterStore.lastInsertedId = res.id
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


  // cancel modal
  cancel() {
    this.closeFormModal();
  }

    // for closing the modal
    closeFormModal() {      
      this.resetForm();
      this._eventEmitterService.dissmissMsAuditCheklistGroup();
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
