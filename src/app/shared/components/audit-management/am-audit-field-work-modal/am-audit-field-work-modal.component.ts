import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AmAuditFieldWorkService } from 'src/app/core/services/audit-management/am-audit-field-work/am-audit-field-work.service';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-am-audit-field-work-modal',
  templateUrl: './am-audit-field-work-modal.component.html',
  styleUrls: ['./am-audit-field-work-modal.component.scss']
})
export class AmAuditFieldWorkModalComponent implements OnInit {
  @Input('source') auditPlanSource: any;

  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  form:FormGroup;
  cancelEventSubscription:any;
  formErrors = null;
  AppStore = AppStore;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'Are you sure you want to cancel?',
    type: 'Cancel'
  };
  AmAuditFieldWorkStore = AmAuditFieldWorkStore;
  AmAuditsStore = AmAuditsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _formBuilder:FormBuilder,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _router:Router,
    private _amAuditFieldWorkService:AmAuditFieldWorkService,
    private _amAuditService:AmAuditService){

    }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      field_work_start_date: [null, [Validators.required]],
    });
    if (this.auditPlanSource) {
      this.setFormValues();
    }

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.cancel(item);
		})
  }

  cancel(status) {
		if (status) {
    this.closeFormModal();
		}
		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('hide');
		}, 250);
	}

  confirmCancel() {

		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('show');
		}, 100);

	}
  

  ngDoCheck(){
    if (this.auditPlanSource && this.auditPlanSource.hasOwnProperty('values') && this.auditPlanSource.values && !this.form.value.id)
      this.setFormValues();
  }

  closeFormModal() {
    this.clearItems();
   this._eventEmitterService.dismissAmAuditFieldWorkModal();
  }

  clearItems(){
    this.form.reset();
   this.formErrors = null;
  }

  
  setFormValues(){
    if (this.auditPlanSource.hasOwnProperty('values') && this.auditPlanSource.values) {
      let { id,field_work_start_date} = this.auditPlanSource.values
      this.form.patchValue({
        id: id,
        field_work_start_date:field_work_start_date,
      })
      this.getAuditDetails();
    }
  }


  clear(type) {
   
      this.form.patchValue({
        field_work_start_date: null
      })
    
  }

     //getting button name by language
     getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }


    save(close:boolean=false){
 
      this.formErrors = null;
      AppStore.enableLoading();
      let start_date={
        field_work_start_date:this._helperService.processDate(this.form.value.field_work_start_date, 'join'),
      }
      
      this._amAuditFieldWorkService.updateItem(this.form.value.id,start_date).subscribe((res:any)=>{
        AppStore.disableLoading();

        // this.closeFormModal();
        this._utilityService.detectChanges(this._cdr)
        if (close){
          this.closeFormModal();
          this._router.navigateByUrl('/audit-management/am-audit-field-works/'+res['id'])
        } 
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          // this.processFormErrors();
        }
          else if(err.status == 500 || err.status == 403){
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }

    getAudit(){
      if(this.auditPlanSource.type=='Add'){
        this._amAuditService.getItems(false,'is_field_work_start_date=false').subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else{
        this._amAuditService.getItems().subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        })
      }
     
    }

    searchAudit(e){
      if(this.auditPlanSource.type=='Add'){
      this._amAuditService.getItems(false,'q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      this._amAuditService.getItems(false,'q='+e.term+'&is_field_work_start_date=false').subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    }

    getAuditDetails(){
      if(this.form.value.id){
        this._amAuditService.getItem(this.form.value.id).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        })
      }
    
    }

    

  getManagerPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }

  getArrayFormattedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  getStatusColor(color){
    if(color){
      let colorClass = color.split('-');
      if(colorClass.length > 0) return colorClass[0];
      else return '';
    }
  }



    ngOnDestroy(){
      this.cancelEventSubscription.unsubscribe();
      AmAuditsStore.unsetIndiviudalAuditDetails();
    }



}
