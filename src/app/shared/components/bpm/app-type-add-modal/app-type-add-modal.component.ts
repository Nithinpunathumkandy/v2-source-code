import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessApplicationTypesService } from 'src/app/core/services/masters/bcm/business-application-types.service';
import { BusinessApplicationsService } from 'src/app/core/services/masters/bcm/business-applications/business-applications.service';
import { AprDemoStore } from 'src/app/modules/bpm/apr-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AdvancePrStore } from 'src/app/stores/bpm/process/adavanc-pr-store';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { BusinessApplicationTypesMasterStore } from 'src/app/stores/masters/bcm/business-application-types.master.store';
import { BusinessApplicationsMasterStore } from 'src/app/stores/masters/bcm/business-applications.master.store';

declare var $: any;
@Component({
  selector: 'app-app-type-add-modal',
  templateUrl: './app-type-add-modal.component.html',
  styleUrls: ['./app-type-add-modal.component.scss']
})
export class AppTypeAddModalComponent implements OnInit {

  @Input ('source') source:any;
  @ViewChild('applicationType') applicationType: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('applicationModal') applicationModal: ElementRef;

  AppStore = AppStore
  form: FormGroup;
  localAppArray = []
  BusinessApplicationsMasterStore = BusinessApplicationsMasterStore
  BusinessApplicationTypesMasterStore = BusinessApplicationTypesMasterStore
  AdvancePrStore= AdvancePrStore
  AprDemoStore = AprDemoStore
  formErrors: any;
  softwareExist: boolean=false;

  businessApplicationTypesObject = {
    component: 'Master',
    values: null,
    type: null
  };
  businessApplicationsObject = {
    component: 'Master',
    values: null,
    type: null
  };
  controlBusinessApplicationTypeSubscriptionEvent: any;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _businessApplicationService:BusinessApplicationsService,
    private _businessApplicationTypesService:BusinessApplicationTypesService,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      type:[null,[Validators.required]],
      software_name:[null,[Validators.required]],
      describe_reason:[''],
    })
    // this.getApplicationName();
    this.controlBusinessApplicationTypeSubscriptionEvent = this._eventEmitterService.businessApplicationType.subscribe(res => {
      this.closeApplicationType();
    })
    this.getApplicationType();
    if(this.source.hasOwnProperty('values') && this.source.values){
      let {software_id,type_id,reason}=this.source.values
      this.form.patchValue({
        type:type_id,
        software_name:software_id,
        describe_reason:reason
      })
    }
  }

  openApplication() {
    this.businessApplicationsObject.type="Add"
    setTimeout(() => {
      $(this.applicationModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    }, 50);
  }

  closeApplication() {
    if(BusinessApplicationsMasterStore.lastInsertedId) {
      this.setApplicationType({term: BusinessApplicationsMasterStore.lastInsertedId},true);
    }
    this.businessApplicationsObject.type = '';
    $(this.applicationModal.nativeElement).modal('hide');
    this.businessApplicationsObject.type = null;
  }

  setApplication(e,patchValue:boolean = false){
    this._businessApplicationService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { software_name:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  openApplicationType() {
    this.businessApplicationTypesObject.type="Add"
    setTimeout(() => {
      $(this.applicationType.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    }, 50);
  }

  closeApplicationType() {
    if(BusinessApplicationTypesMasterStore.lastInsertedId) {
      this.setApplicationType({term: BusinessApplicationTypesMasterStore.lastInsertedId},true);
    }
    this.businessApplicationTypesObject.type = '';
    $(this.applicationType.nativeElement).modal('hide');
    this.businessApplicationTypesObject.type = null;
  }

  setApplicationType(e,patchValue:boolean = false){
    this._businessApplicationTypesService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { type:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getApplicationName(newPage: number = null) {
    var params=''
    if(this.form.value.type){
      params='&business_application_type_ids='+this.form.value.type
      if (newPage) BusinessApplicationsMasterStore.setCurrentPage(newPage);
		  this._businessApplicationService.getItems(false, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }
	}

  applicationChange(){
    let pos = AdvanceProcessStore.applicationFormTools.findIndex(e=>e.software_id===this.form.value.software_name)
    if(pos!=-1){
      this.softwareExist=true
    }else{
      this.softwareExist = false
    }
  }

  getApplicationType(newPage: number = null) {
    this.form.patchValue({
      software_name:null
    })
    this.softwareExist=false
		if (newPage) BusinessApplicationTypesMasterStore.setCurrentPage(newPage);
		this._businessApplicationTypesService.getItems(false, null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    setTimeout(() => {
      this.getApplicationName()
    }, 100);
	}

  addApplicationType(close:boolean=false){
    if(AdvanceProcessStore.applicationFormTools.length!=0){
      let pos = AdvanceProcessStore.applicationFormTools.findIndex(e=>e.software_id===this.form.value.software_name)
      console.log("position",pos)
      if(pos==-1){
        this.softwareExist=false
        this.saveAppModal(close)
      }else{
        this.appendApplicationDetails(pos,close)
      }
    }else{
      this.saveAppModal(close)
    }
    
  }

  appendApplicationDetails(num:number,close:boolean=false){
    var qty = BusinessApplicationsMasterStore.getBusinessApplicationsById(this.form.value.software_name).quantity
    var is_amc = BusinessApplicationsMasterStore.getBusinessApplicationsById(this.form.value.software_name).is_amc
    var software_name = BusinessApplicationsMasterStore.getBusinessApplicationsById(this.form.value.software_name).title
    var type_name = BusinessApplicationTypesMasterStore.getBusinessApplicationTypesById(this.form.value.type).title
    for (let i = 0; i < AdvanceProcessStore.applicationFormTools.length; i++) {
      const element = AdvanceProcessStore.applicationFormTools[i];
      if(i==num){
        element.type_id = this.form.value.type
        element.software_id=this.form.value.software_name
        element.describe_reason=this.form.value.describe_reason,
        element.qty_in_use=qty,
        element.maintainance_contract=is_amc,
        element.type=type_name,
        element.software_name=software_name,
        element.is_accordion_active=false,
        element.pivot={
          description:this.form.value.describe_reason
        }
      }
    }
    console.log("appppp",AdvanceProcessStore.applicationFormTools)
    if(close)this.closeModal()
  }

  saveAppModal(close:boolean=false){
    var qty = BusinessApplicationsMasterStore.getBusinessApplicationsById(this.form.value.software_name).quantity
    var is_amc = BusinessApplicationsMasterStore.getBusinessApplicationsById(this.form.value.software_name).is_amc
    var software_name = BusinessApplicationsMasterStore.getBusinessApplicationsById(this.form.value.software_name).title
    var type_name = BusinessApplicationTypesMasterStore.getBusinessApplicationTypesById(this.form.value.type).title
    let appTypeObject = {
      type_id:this.form.value.type,
      software_id:this.form.value.software_name,
      describe_reason:this.form.value.describe_reason,
      qty_in_use:qty,
      maintainance_contract:is_amc,
      type:type_name,
      software_name:software_name,
      is_accordion_active:false,
      pivot:{
        description:this.form.value.describe_reason
      }
    }
    console.log("type",appTypeObject,this.form.value.type,this.form.value.software_name)
    AdvanceProcessStore.setApplicationFormTools(appTypeObject)
    AdvanceProcessStore.setApplicationTools(appTypeObject)
    this.resetForm()
    if(close)this.closeModal()
  }

  closeModal(){
    this.resetForm();
    this._eventEmitterService.dismissApplicationTypeModal()
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

}
