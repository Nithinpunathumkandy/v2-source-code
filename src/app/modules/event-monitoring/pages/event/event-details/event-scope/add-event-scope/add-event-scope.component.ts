import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventScopeService } from 'src/app/core/services/event-monitoring/events/event-scope/event-monitoring.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';


@Component({
  selector: 'app-add-event-scope',
  templateUrl: './add-event-scope.component.html',
  styleUrls: ['./add-event-scope.component.scss']
})
export class AddEventScopeComponent implements OnInit {
  @Input('source') scopeOfWorkSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore
  subtitle = ''
  body: string;
  placeHolder: string;
  constructor(private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,    
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _eventService : EventScopeService) { }

  ngOnInit(): void {
    console.log(this.scopeOfWorkSource)
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
      this.subtitle = "Exclusion"
      this.placeHolder = "Enter the exclusion of the event"
      this.body = 'Exclusion Event means an event or related events resulting in the exclusion of the Borrower or any Subsidiary from participation in any Medical Reimbursement Programs'

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
      event_id : EventMonitoringStore.selectedEventId ,
      title : this.form.value.title ? this.form.value.title : null,
      type : this.scopeOfWorkSource.scopeType,
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
        save = this._eventService.updateScope(this.processSaveData(), this.scopeOfWorkSource.value.id,this.scopeOfWorkSource.scopeType);
      } else {
        save = this._eventService.saveScope(this.processSaveData(),this.scopeOfWorkSource.scopeType);
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  resetForm() {
    this.form.reset();
    this.formErrors = null;
  }

  cancel(){
   this._eventEmitterService.dissmissEventScopeModal();
   this.subtitle = ''
   this.body = ''
   this.placeHolder = ''
  }
}

