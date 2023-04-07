import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { CustomDate} from 'src/app/core/models/risk-management/reports/report-details';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-custom-date-popup',
  templateUrl: './custom-date-popup.component.html',
  styleUrls: ['./custom-date-popup.component.scss']
})
export class CustomDatePopupComponent implements OnInit {

  @Output() dateEvent = new EventEmitter<CustomDate>();
  customDate: CustomDate = {} as CustomDate;
  startDate: Date;
  endDate: Date;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {

    
  }
  passDates(): void {
    this.customDate.startDate = this._helperService.processDate(this.startDate, 'join');
    this.customDate.endDate = this._helperService.processDate(this.endDate, 'join');
    this.dateEvent.emit(this.customDate);
  }

}
