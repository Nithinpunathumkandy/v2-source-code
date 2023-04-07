import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventMilestoneService } from 'src/app/core/services/event-monitoring/event-milestone/event-milestone.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventMilestoneStore } from 'src/app/stores/event-monitoring/event-milestone-store';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

@Component({
  selector: 'app-add-event-milestone',
  templateUrl: './add-event-milestone.component.html',
  styleUrls: ['./add-event-milestone.component.scss']
})
export class AddEventMilestoneComponent implements OnInit {
  @Input('source') EventMilestoneSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore
  EventMonitoringStore = EventMonitoringStore;
  EventMilestoneStore = EventMilestoneStore;
  EventsStore=EventsStore;
  selectedDate: string = '';
  is_completionExceded: boolean = false;
  selectedMaxDate: any = '';

  constructor(private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,    
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _eventMilestoneService : EventMilestoneService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      event_id : [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      due_date: [null,[Validators.required]],
      actual_completion_date: [null],
      closure_comments: [null]
    });
    if(this.EventMilestoneSource.type == "Edit" || this.EventMilestoneSource.type == "Edit from closure"){
      this.editData()
    }  
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  searchMilestone(e){
    this._eventMilestoneService.getMilestones( '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  processSaveData() {
    let saveData = {
      event_id : EventsStore.selectedEventId ,
      title  : this.form.value.title ? this.form.value.title : null,
      description : this.form.value.description ? this.form.value.description : null,
      due_date : this.form.value.due_date ? this._helperService.processDate(this.form.value.due_date,'join') : null,
      actual_completion_date : this.form.value.actual_completion_date ? this._helperService.processDate(this.form.value.actual_completion_date,'join') : null,
      closure_comments : this.form.value.closure_comments ? this.form.value.closure_comments : null,
    }
    
    return saveData;
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.EventMilestoneSource.type=='Edit' || this.EventMilestoneSource.type == "Edit from closure") {
        save = this._eventMilestoneService.updateMileston(this.processSaveData(),this.EventMilestoneSource.value.id);
      } else {
        delete this.form.value.id
        save = this._eventMilestoneService.saveMileston(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (this.EventMilestoneSource.type=='Add') {
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
    this.is_completionExceded = false
    this.selectedDate = ''
    this.selectedMaxDate = ''
  }

  cancel(){
   this._eventEmitterService.dissmissEventMilestoneModal()
   this.is_completionExceded = false
   this.selectedDate = ''
   this.selectedMaxDate = ''

  }
  setMaxDate(){

  }

  editData(){
    this.form.patchValue({
      event_id : EventMonitoringStore.selectedEventId ,
      title : this.EventMilestoneSource.value.title ? this.EventMilestoneSource.value.title : null,
      description : this.EventMilestoneSource.value.description ? this.EventMilestoneSource.value.description : null,
      due_date : this.EventMilestoneSource.value.due_date ? this._helperService.processDate(this.EventMilestoneSource.value.due_date,'split') : null,
      actual_completion_date : this.EventMilestoneSource.value.actual_completion_date ? this._helperService.processDate(this.EventMilestoneSource.value.actual_completion_date,'split') : null,
      closure_comments : this.EventMilestoneSource.value.closure_comments ? this.EventMilestoneSource.value.closure_comments : null,
    })
    
  }

}
