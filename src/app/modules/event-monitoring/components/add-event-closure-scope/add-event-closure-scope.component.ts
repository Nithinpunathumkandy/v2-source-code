import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventScopeService } from 'src/app/core/services/event-monitoring/events/event-scope/event-monitoring.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';

@Component({
  selector: 'app-add-event-closure-scope',
  templateUrl: './add-event-closure-scope.component.html',
  styleUrls: ['./add-event-closure-scope.component.scss']
})
export class AddEventClosureScopeComponent implements OnInit {
  @Input('source') ScopeSource: any;

  AppStore = AppStore;
  EventMonitoringStore = EventMonitoringStore;
  form: FormGroup;
  formErrors: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _eventScopeService: EventScopeService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      type: ['',[Validators.required]],
      comments: ['']
    });
    if (this.ScopeSource) {
      this.editData();
    }
  }

  editData(){
    this.form.patchValue({
      id : this.ScopeSource.value.id ? this.ScopeSource.value.id : null,
      title : this.ScopeSource.value.title ? this.ScopeSource.value.title : null,
      type : this.ScopeSource.value.type ? this.ScopeSource.value.type : null,
      comments : this.ScopeSource.value.comments ? this.ScopeSource.value.comments : null,
    })
    
  }

  processSaveData() {
    let saveData = {
      id : this.form.value.id ? this.form.value.id : null,
      title  : this.form.value.title ? this.form.value.title : null,
      type : this.form.value.type ? this.form.value.type : null,
      comments : this.form.value.comments ? this.form.value.comments : null,
    }
    
    return saveData;
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._eventScopeService.update(this.processSaveData(),this.ScopeSource.value.id);
      } else {
        delete this.form.value.id
        save = this._eventScopeService.save(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (this.ScopeSource.type=='Add') {
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
   this._eventEmitterService.dissmissEventScopeModal()
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  

}
