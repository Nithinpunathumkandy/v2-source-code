import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SoaService } from 'src/app/core/services/isms/soa/soa.service';
import { SoaImplementationStatusesService } from 'src/app/core/services/masters/isms/soa-implementation-statuses/soa-implementation-statuses.service';
import { SoaStatusService } from 'src/app/core/services/masters/isms/soa-statuses/soa-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { SOAStore } from 'src/app/stores/isms/isms-risks/soa.store';
import { SoaImplementationStatusesMasterStore } from 'src/app/stores/masters/isms/soa-implementation-statuses-store';
import { SoaStatusMasterStore } from 'src/app/stores/masters/isms/soa-statuses-store';

@Component({
  selector: 'app-add-soa',
  templateUrl: './add-soa.component.html',
  styleUrls: ['./add-soa.component.scss']
})
export class AddSoaComponent implements OnInit {
  @Input('source') updateObject: any;
  soaForm:FormGroup;
  formErrors = null;
  ControlStore = ControlStore;
  AppStore = AppStore;
  SoaStatusStore = SoaStatusMasterStore;
  SoaImplementationStatusStore=SoaImplementationStatusesMasterStore;


  constructor(private _eventEmitterService:EventEmitterService,
    private _formBuilder:FormBuilder,
    private _soaService:SoaService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _controlService:ControlsService,
    private _soaStatusService:SoaStatusService,
    private _soaImplementationStatusService:SoaImplementationStatusesService,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.soaForm = this._formBuilder.group({
      soa_status_id: [null, Validators.required],
      soa_implementation_status_id: [null, Validators.required],
      justify: [''],
      method:[''],
      comment: [''],
      control_id:[null, Validators.required]
      
    })

    if(this.updateObject.type=='edit'){
      this.setFormValues();
    }

  }

  setFormValues(){
    this.soaForm.patchValue({
      soa_status_id:this.updateObject.values.soa_status,
      soa_implementation_status_id:this.updateObject.values?.soa_implementation_status,
      justify:this.updateObject.values?.justify,
      method:this.updateObject.values?.method,
      comment:this.updateObject.values?.comment,
      control_id:this.updateObject.values?.control
    })
  }


  setSaveData(){
    let saveData={
      soa_status_id:this.soaForm.value.soa_status_id?this.soaForm.value.soa_status_id?.id:null,
      soa_implementation_status_id:this.soaForm.value.soa_implementation_status_id?this.soaForm.value.soa_implementation_status_id?.id:null,
      justify:this.soaForm.value.justify?this.soaForm.value.justify:'',
      method:this.soaForm.value.method?this.soaForm.value.method:'',
      comment:this.soaForm.value.comment?this.soaForm.value.comment:'',
      control_id:this.soaForm.value.control_id?this.soaForm.value.control_id?.id:null
    }
    return saveData;
  }

  updateSoa(close:boolean=false){
  
    let save;
    this.formErrors=null;
    AppStore.enableLoading();

    if(this.updateObject.type=='edit'){
      save=this._soaService.updateItem(this.soaForm.value.control_id?.id,this.setSaveData());
    }
    else{
      save = this._soaService.saveItem(this.setSaveData());
    }

    save.subscribe(res=>{
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if(close){
        SOAStore.setLastInsertedId(res.id);
        this.closeUpdateModal();
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if(err.status == 500 || err.status==404){
        this.closeUpdateModal();
        AppStore.disableLoading();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getControls(){
    this._controlService.getAllItems(false,'&is_soa=false').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchControls(e){
    this._controlService.getAllItems(false,'&q='+e.term+'&is_soa=false').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getStatuses(){
    this._soaStatusService.getItems(false).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchStatuses(e){
    this._soaStatusService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getMaintenanceStatuses(){
    this._soaImplementationStatusService.getItems(false).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchMaintenanceStatuses(e){
    this._soaImplementationStatusService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

	getButtonText(text) {

		return this._helperService.translateToUserLanguage(text);
	}
  
  closeUpdateModal(){
    this.soaForm.reset();
    this._eventEmitterService.dismissIsmsSOAModal();
  }

}
