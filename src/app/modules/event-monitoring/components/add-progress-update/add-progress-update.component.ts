import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventMilestoneService } from 'src/app/core/services/event-monitoring/event-milestone/event-milestone.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventMilestoneStore } from 'src/app/stores/event-monitoring/event-milestone-store'
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';

@Component({
  selector: 'app-add-progress-update',
  templateUrl: './add-progress-update.component.html',
  styleUrls: ['./add-progress-update.component.scss']
})
export class AddProgressUpdateComponent implements OnInit {
  @Input('source') milestoneProgressSource: any;

  AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
  EventMilestoneStore = EventMilestoneStore;
  EventMonitoringStore = EventMonitoringStore;

  constructor(
    private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
    private _eventMilestoneService : EventMilestoneService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      event_id : [''],
      title: [''],
      description: [''],
      due_date: [''],
			completion : [null,[Validators.required,Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
    });
      if(this.milestoneProgressSource.type =="Edit"){
        this.editData()
      }
    }
  
    editData(){
      this.form.patchValue({
       event_id : EventMonitoringStore.selectedEventId ,
       title : this.milestoneProgressSource.value.title ? this.milestoneProgressSource.value.title : '',
       description : this.milestoneProgressSource.value.description ? this.milestoneProgressSource.value.description : '',
       due_date : this.milestoneProgressSource.value.due_date ? this._helperService.processDate(this.milestoneProgressSource.value.due_date,'split') : null,
       completion: this.milestoneProgressSource.value.completion ? this.milestoneProgressSource.value.completion : null,
     })
    }

    processSaveData() {
      let saveData = {
      event_id : EventMonitoringStore.selectedEventId ,
      title  : this.form.value.title ? this.form.value.title : '',
      description : this.form.value.description ? this.form.value.description : '',
      due_date : this.form.value.due_date ? this._helperService.processDate(this.form.value.due_date,'join') : null,
        completion : this.form.value.completion ? this.form.value.completion : null,
      }
      
      return saveData;
    }

    save(close: boolean = false) {
      this.formErrors = null;
      if (this.form.valid) {
        let save;
        AppStore.enableLoading();
        if (this.milestoneProgressSource.type == "Edit") {
          save = this._eventMilestoneService.updateMileston(this.processSaveData(), this.milestoneProgressSource.value.id);
        } else {
          save = this._eventMilestoneService.saveMileston(this.processSaveData());
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
      this._eventEmitterService.dissmissEventProgressModal();
    }

    getButtonText(text) {
      return this._helperService.translateToUserLanguage(text);
    }
  

}
