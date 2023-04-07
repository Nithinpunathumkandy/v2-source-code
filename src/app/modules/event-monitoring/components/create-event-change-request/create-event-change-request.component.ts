import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventChangeRequestStore } from "src/app/stores/event-monitoring/events/event-change-request-store";
import { Router } from "@angular/router";
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { ChangeRequestItemsService } from 'src/app/core/services/masters/event-monitoring/change-request-items/change-request-items.service';
import { EventChangeRequestItemsStore } from 'src/app/stores/masters/event-monitoring/event-change-request-items.store';
import { EventChangeRequestService } from 'src/app/core/services/event-monitoring/event-change-request/event-change-request.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { BcpChangeRequestTypesService } from "src/app/core/services/masters/bcm/bcp-change-request-types/bcp-change-request-types.service";
import { BCPChangeRequestTypeMasterStore } from "src/app/stores/masters/bcm/bcp-change-request-type.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-event-change-request',
  templateUrl: './create-event-change-request.component.html',
  styleUrls: ['./create-event-change-request.component.scss']
})
export class CreateEventChangeRequestComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  @Input('source') eventChangeRequestSource: any;
  EventChangeRequestItemsStore = EventChangeRequestItemsStore;
  EventChangeRequestStore = EventChangeRequestStore;
  BCPChangeRequestTypeMasterStore=BCPChangeRequestTypeMasterStore;
  EventsStore = EventsStore;
  AppStore = AppStore;
  selectedItems: number[] = [];
  constructor(
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,
    private _bcpChangeRequestTypeService: BcpChangeRequestTypesService,
    private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,private _formBuilder: FormBuilder,
    private _router: Router, private _eventChangeRequestService: EventChangeRequestService) { }

  ngOnInit(): void {
    // console.log(this.eventChangeRequestSource);
    this.getBcPChangeRequestTypes();
    this.form = this._formBuilder.group({
      title: ['',[Validators.required]],
      event_change_request_type_id : [null,[Validators.required]],
      reason : [''],
      id:['']
      
    });
    if(this.eventChangeRequestSource.type == "Edit"){
      this.setEditData()
     }
    //this.getChangeRequestItems();
    this._utilityService.detectChanges(this._cdr);
  }

  getBcPChangeRequestTypes(){
    this._bcpChangeRequestTypeService.getItems().subscribe(res=>{
      if(this.eventChangeRequestSource.type == "Add"){
        this.form.patchValue({
          event_change_request_type_id : BCPChangeRequestTypeMasterStore.allItems[0].id,
        });
      }
     
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setChangeRequestType(type){
    this.form.patchValue({event_change_request_type_id: type});
  }
  checkChangeRequestType(id){
    if(this.form.value.event_change_request_type_id && this.form.value.event_change_request_type_id == id)
      return true;
    else
      return false;
  }
  
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  setEditData()
  {
    this.form.patchValue({
      title: this.eventChangeRequestSource.value.title,
      event_change_request_type_id : this.eventChangeRequestSource?.value?.eventChangeRequestType?.id,
      reason : this.eventChangeRequestSource.value.reason,
      id:this.eventChangeRequestSource.value.id
      
    });
  }


  save(close: boolean = false){
    let save: any;
    this.formErrors = null;
    AppStore.enableLoading();
    if(this.eventChangeRequestSource.type == "Edit")
    {
      save = this._eventChangeRequestService.updateChangeRequestItems(this.form.value,this.form.value.id);
    }
    else
    {
      save = this._eventChangeRequestService.createChangeRequest(this.form.value);
    }
    save.subscribe(res=>{
      AppStore.disableLoading();
      if(this.eventChangeRequestSource.type == "Add")
      {
        this.form.reset();
      }
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if(close) this.closeModal();
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  
  }
  closeModal(){
    this.resetForm();
    this._eventEmitterService.dismissEventChangeReqModal();
  }
  resetForm()
  {
    this.form.reset();
  }

}
