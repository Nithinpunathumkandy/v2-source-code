import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { toJS } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventClosureMainStore } from 'src/app/stores/event-monitoring/event-closure-main-store';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventClosureEventDetailsService } from 'src/app/core/services/event-monitoring/event-closure-event-details/event-closure-event-details.service';
declare var $: any;
@Component({
  selector: 'app-add-event-closure-main',
  templateUrl: './add-event-closure-main.component.html',
  styleUrls: ['./add-event-closure-main.component.scss']
})
export class AddEventClosureMainComponent implements OnInit {
  @Input('source') source: any;
  AppStore = AppStore;
  EventsStore = EventsStore;
  EventClosureMainStore = EventClosureMainStore;
  form: FormGroup;
  formErrors: any;
  eventClosureId:number;
  constructor(
    private _renderer2: Renderer2,            
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventService: EventsService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,    
    private _eventClosureEventDetailsService: EventClosureEventDetailsService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      event_id: [null],
      title :['', [Validators.required]],
      planned_event_completion: ['', { disabled: true }, [Validators.required]],
      actual_event_completion_date: ['', [Validators.required]],
      event_summary: ['', []],

    });

    if (this.source) {
      if (this.source.hasOwnProperty('value') && this.source.value) {
        this.setEditValue();
        this.eventClosureId = this.source.value.id;
        
      }
      if (this.source.type == 'Edit FromSubMenu' || this.source.type == 'Add FromSubMenu') {
        this.getEventList();
        this.form.controls.event_id.setValidators([Validators.required]);
        this.form.controls.event_id.updateValueAndValidity();
      }
      if (this.source.type == 'Add') {
        this.form.patchValue({
          planned_event_completion: EventsStore.eventDetails?.start_date,
        })
      }
      
    }
  }

  getEventList() {
    this._eventService.getItemsAll().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  changeEvent(e) {
    if (e) {
      EventsStore.selectedEventId = e;
      this._eventService.getItem(e).subscribe(res => {
        this.form.patchValue({
          planned_event_completion: EventsStore.eventDetails?.start_date,
        })
      })
    }
  }

  setEditValue() {
    if (this.source.hasOwnProperty('value') && this.source.value) {
      let { actual_event_completion_date, id, title, planned_event_completion ,event_summary , event_details } = this.source.value;
      this.form.patchValue({
        actual_event_completion_date: this._helperService.processDate(actual_event_completion_date, 'split'),
        planned_event_completion: planned_event_completion,
        event_summary: event_summary ? event_summary : null,
        title : title,
        id: id,
      })
      if (this.source.type == 'Edit FromSubMenu') {
        this.form.patchValue({
          event_id: event_details.id
        })
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  createSaveData() {
    var returnData = {};

    returnData = {
      'planned_event_completion': this.form.value?.planned_event_completion ? this.form.value?.planned_event_completion : null,
      'event_summary': this.form.value?.event_summary ? this.form.value?.event_summary : null,
      'title': this.form.value?.title ? this.form.value?.title : null,
      'actual_event_completion_date': this.form.value.actual_event_completion_date ? this._helperService.processDate(this.form.value.actual_event_completion_date, 'join') : '',
    }

    return returnData;
  }

  save(close: boolean = false) {
    this.formErrors = null;
    var saveData = this.createSaveData();
    if (saveData) {
      let save;
      AppStore.enableLoading();
      if (this.eventClosureId) {
        save = this._eventClosureEventDetailsService.updateClosure(this.eventClosureId, saveData, this.source.type);
      } else {
        save = this._eventClosureEventDetailsService.saveClosure(saveData, this.source.type);
      }

      save.subscribe((res: any) => {
        if (!this.eventClosureId) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // for closing the modal
  closeFormModal() {
    this._eventEmitterService.dismissEventClosureMainModal();
    this.resetForm();
  }
  // cancel modal
  cancel() {
    this.closeFormModal();
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  // for resetting the form
  resetForm() {
    this.eventClosureId = null;
    this.formErrors = null;
    AppStore.disableLoading();
  }

}
