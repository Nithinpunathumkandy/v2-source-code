import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';

@Component({
  selector: 'app-event-cr-scope',
  templateUrl: './event-cr-scope.component.html',
  styleUrls: ['./event-cr-scope.component.scss']
})
export class EventCrScopeComponent implements OnInit {

  @Input('source') scopeOfWorkSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore
  subtitle = ''
  body: string;
  placeHolder: string;

  constructor(private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,    
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      event_id : null,
      title: ['', [Validators.required, Validators.maxLength(255)]],
      type: null,
    });
    if(this.scopeOfWorkSource.type =="Edit"){
      this.editData()
    }
    if(this.scopeOfWorkSource.scopeType =="scope"){
     this.subtitle = "In Scope"
     this.placeHolder = "Enter the in scope of the event"
     this.body = 'Activities that fall within the boundaries of the scope statement are considered in scope and are accounted for in the schedule and budget'
    }else if(this.scopeOfWorkSource.scopeType =="exclusion"){
      this.subtitle = "exclusion"
      this.placeHolder = "Enter the exclusion of the event"
      this.body = ''

    }else if(this.scopeOfWorkSource.scopeType =="assumption"){
      this.subtitle = "Assumptions"
      this.placeHolder = "Enter the assumptions of the event"
      this.body = 'An assumption is any event factor that is considered to be true, real, or certain without empirical proof or demonstration'

    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  processSaveData() {
    let saveData = {
      title : this.form.value.title ? this.form.value.title : null,
      scope_type : this.scopeOfWorkSource.scopeType,
      type:'new',
      is_deleted:0
    }
    return saveData;
  }

  editData(){
    this.form.patchValue({
      title: this.scopeOfWorkSource.value.title
    })
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.scopeOfWorkSource.type == "Edit") {
        // save = this._eventService.updateScope(this.processSaveData(), this.scopeOfWorkSource.value.id,this.scopeOfWorkSource.scopeType);
      } else {
        EventChangeRequestStore.scopeOfWorks.push(this.processSaveData())
        this.resetForm()
        AppStore.disableLoading();
      }
      if(close)this.cancel()
    }
  }
  resetForm() {
    this.form.reset();
    this.formErrors = null;
  }

  cancel(){
   this._eventEmitterService.dismissEventCRScopeModal();
   this.subtitle = ''
   this.body = ''
   this.placeHolder = ''
  }

}
