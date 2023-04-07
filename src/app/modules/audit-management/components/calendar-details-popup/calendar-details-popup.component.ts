import { Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

@Component({
  selector: 'app-calendar-details-popup',
  templateUrl: './calendar-details-popup.component.html',
  styleUrls: ['./calendar-details-popup.component.scss']
})
export class CalendarDetailsPopupComponent implements OnInit {

  @Input('source') source

  constructor(
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
  }

  dismissModal(flag){
    this._eventEmitterService.dismissDeletePopup(flag);
  }

}
