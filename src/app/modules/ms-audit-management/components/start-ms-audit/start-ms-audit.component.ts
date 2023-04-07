import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-start-ms-audit',
  templateUrl: './start-ms-audit.component.html',
  styleUrls: ['./start-ms-audit.component.scss']
})
export class StartMsAuditComponent implements OnInit,OnDestroy {
  @Input('source') source: any;
  @ViewChild("auditeesAdd") auditeesAdd: ElementRef;
  @ViewChild("auditorAdd") auditorAdd: ElementRef;
  form: FormGroup;
  formErrors: any;
  todayDate: any = new Date();
  minDate: any = new Date();
  maxDate: any = new Date();
  UsersStore = UsersStore;
  selctedField:number=1;
  popupSubscriptionAddMsAuditee:any;
  MsAuditSchedulesStore=MsAuditSchedulesStore;
  MsAuditPlansStore=MsAuditPlansStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  AppStore=AppStore;
  auditees=[];
  auditors=[];
  popupSubscriptionAddMsAuditor:any;
  compareAuditorAndAuditee=true;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _msAuditPlansService: MsAuditPlansService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _humanCapitalService: HumanCapitalService,
    private _msAuditSchedulesService: MsAuditSchedulesService,
    private _helperService: HelperServiceService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    
    this.form = this._formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      
    });
    this.popupSubscriptionAddMsAuditee = this._eventEmitterService.msAuditeesAdd.subscribe(res => {
      this.setAuditees(res);
      //console.log(res)
      this.closeModelAuditee();
    })

    this.popupSubscriptionAddMsAuditor = this._eventEmitterService.msAuditAdd.subscribe(res => {
      this.setAuditor(res);
      this.closeModelAuditor();
    })

    this.getPlanDetails();
  
  }

  minEndDateTimeValidator(){
    return this.form.value.start_date?this.form.value.start_date:this.minDate;
  }

  getPlanDetails(){
    this._msAuditPlansService.getItem(MsAuditPlansStore.msAuditPlansId).subscribe(res => {
      this.minDate=MsAuditPlansStore.individualMsAuditPlansDetails?.start_date; 
      this.maxDate=MsAuditPlansStore.individualMsAuditPlansDetails?.end_date;
      this.auditors=MsAuditSchedulesStore?.individualMsAuditSchedulesDetails?.auditors;
      this.auditees=MsAuditSchedulesStore?.individualMsAuditSchedulesDetails?.auditees;
      this.setDetails()
    this._utilityService.detectChanges(this._cdr);
    });
  }

  addModelAuditor(){
    $(this.auditorAdd.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModelAuditor(){
    $(this.auditorAdd.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  setDetails()
  {
    this.form.patchValue({
      start_date: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.start_date ? new Date( MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.start_date) : '',
      end_date: MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.end_date ? new Date( MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.end_date) : '',
    })
  }

  createImageUrl(type,token) {// user-defined
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  next()
  {
    this.selctedField=this.selctedField+1;
  }
  previous()
  {
    this.selctedField=this.selctedField-1;
  }

  addModelAuditee(){
    $(this.auditeesAdd.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModelAuditee(){
    $(this.auditeesAdd.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }


  cancel()
  {
    this.selctedField=1;
    this._eventEmitterService.dismissMsAuditStartModal();
  }

  setAuditees(data)
  {
    if(data)
    {
      for(let i of data)
      {
        this.auditees.push({user_id:i.id,is_present:true,user:i,is_new:true});
      }
    }
   
  }

  setAuditor(data)
  {
    if(data)
    {
      for(let i of data)
      {
        this.auditors.push({user_id:i.id,is_present:true,user:i,is_new:true});
      }
    }
   
  }

  onChangeAuditors(e,user)
  {
    let pos = this.auditors.findIndex(e=>e.user.id == user.user_id);
    this.auditors[pos].is_present = e.target.checked;
    //console.log(this.auditors)
  }

  onChangeAuditees(e,user)
  {
    
    let pos = this.auditees.findIndex(e=>e.user.id == user.user_id);
    this.auditees[pos].is_present = e.target.checked;
    
  }

  getSavedata()
  {
    let payload;
    payload={
      start_date:this.form.value.start_date ? this._helperService.passSaveFormatDate(this.form.value.start_date) : '',
      end_date:this.form.value.end_date ? this._helperService.passSaveFormatDate(this.form.value.end_date) : '',
      auditees:this.getAllAuditees(),
      auditors:this.getAllAuditors(),
      ms_audit_schedule_status_id:MsAuditSchedulesStore?.individualMsAuditSchedulesDetails?.schedule_status?.id
    }
    return payload
  }

  getAllAuditors()
  {
    let item=[];
    for(let i of this.auditors)
    {
      item.push({user_id:i.user_id,is_present:i.is_present})
    }
    return item;
  }

  getAllAuditees()
  {
    let item=[];
    for(let i of this.auditees)
    {
      item.push({user_id:i.user_id,is_present:i.is_present,is_new:i.is_new?true:false})
    }
    return item;
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save()
  {
    let save;
    AppStore.enableLoading();
    if(this.checkAuditeeorAuditors(this.getSavedata()))
    {

        save = this._msAuditSchedulesService.saveAudit(this.getSavedata(),MsAuditSchedulesStore?.individualMsAuditSchedulesDetails?.id);
          save.subscribe(
            (res: any) => {
              AppStore.disableLoading();
              this._utilityService.detectChanges(this._cdr);
              this.cancel();
              this._router.navigateByUrl('/ms-audit-management/ms-audit-schedules/'+MsAuditSchedulesStore?.individualMsAuditSchedulesDetails?.id+'/checklist');
            },
            (err: HttpErrorResponse) => {
              AppStore.disableLoading();
              if (err.status == 422) {
                this.formErrors = err.error.errors;
              } else {
                this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
              }
              this._utilityService.detectChanges(this._cdr);
            }
          );
    }
    else
    {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    }
  }

  checkAuditeeorAuditors(data)
  {
    //console.log(data)
    let item=true;
    this.compareAuditorAndAuditee=true;
     if(data.auditees.length&&data.auditors.length)
     {
      for(let i of data.auditors)
      {
        const index=data.auditees.findIndex(e=>e.user_id==i.user_id && (e?.is_present && i?.is_present));
        if(index>-1)
        {
          item=false;
          this.compareAuditorAndAuditee=false;
          break;
        }
      }
     } 
     return item;
  }

ngOnDestroy(): void {
  this.popupSubscriptionAddMsAuditee.unsubscribe();
 
}

}
