import { Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

@Component({
  selector: 'app-event-details-validation-check',
  templateUrl: './event-details-validation-check.component.html',
  styleUrls: ['./event-details-validation-check.component.scss']
})
export class EventDetailsValidationCheckComponent implements OnInit {
  @Input('source') validationSource: any;
  EventsStore = EventsStore;
  validationCheckEventSubscription: any;
  scopeValidation: boolean = false;
  exclusionScopeValidation: boolean = false;
  assumptionScopeValidation: boolean =false;
  constructor(private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.scopeOfWorkValiation()
  }

  cancel(){
    this._eventEmitterService.dismissEventMonitoringValidationModal()
  }

  scopeOfWorkValiation(){
    if(EventsStore.eventDetails?.event_scopes.length > 0){
      for(let data of EventsStore.eventDetails?.event_scopes){
        if(data.type == 'scope'){
          this.scopeValidation = true
        }
        if(data.type == 'exclusion'){
          this.exclusionScopeValidation = true
        }
        if(data.type == 'assumption'){
          this.assumptionScopeValidation = true
        }
      }
      
    }
  }

}
