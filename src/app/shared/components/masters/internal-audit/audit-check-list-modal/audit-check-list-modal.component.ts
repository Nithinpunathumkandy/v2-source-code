import { Component, OnInit, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditCheckListService } from 'src/app/core/services/masters/internal-audit/audit-check-list/audit-check-list.service';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
@Component({
  selector: 'app-audit-check-list-modal',
  templateUrl: './audit-check-list-modal.component.html',
  styleUrls: ['./audit-check-list-modal.component.scss']
})
export class AuditCheckListModalComponent implements OnInit {
  @Input('source') AuditCheckListSource: any;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsTypeStore = MsTypeStore;
  form: FormGroup;
  formErrors: any;
  constructor( private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _auditCheckListService: AuditCheckListService,
    private _msTypesService: MstypesService
    ) { }

  ngOnInit(): void {

  // Form Object to add Control Category

  this.form = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required]],
    ms_type_organization_id: ['',[Validators.required]],
  });



   this.resetForm();
   this.getMsType();


  // Checking if Source has Values and Setting Form Value

  if (this.AuditCheckListSource) {
    this.setFormValues();
   }

  }
   // serach for ms type
   searchMsType(e) {
    this._msTypesService.getItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

   // for getting ms type
  getMsType() {
    this._msTypesService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngDoCheck(){
    if (this.AuditCheckListSource && this.AuditCheckListSource.hasOwnProperty('values') && this.AuditCheckListSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.AuditCheckListSource.hasOwnProperty('values') && this.AuditCheckListSource.values) {
      let { id, title, ms_type_organization_id } = this.AuditCheckListSource.values
      this.form.setValue({
        id: id,
        title: title,
        ms_type_organization_id: ms_type_organization_id
      })
      // this.searchMsType({term:this.form.value.ms_type_organization_id});
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
  this._eventEmitterService.dismissAuditCheckListControlModal();
  this._eventEmitterService.dismissNewChecklistAddModal();
  this._eventEmitterService.setModalStyle();
}

processDataForSave(){
  let saveData = {
    // id: this.form.value.id?this.form.value.id:'',
    title: this.form.value.title?this.form.value.title:'',
    ms_type_organization_id: this.form.value.ms_type_organization_id? this.form.value.ms_type_organization_id:'',
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
      save = this._auditCheckListService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._auditCheckListService.saveItem(this.processDataForSave());
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
