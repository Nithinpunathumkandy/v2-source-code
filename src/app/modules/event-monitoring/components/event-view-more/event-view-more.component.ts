import { Component, OnInit,Input } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

@Component({
  selector: 'app-event-view-more',
  templateUrl: './event-view-more.component.html',
  styleUrls: ['./event-view-more.component.scss']
})
export class EventViewMoreComponent implements OnInit {

  @Input() source;

  constructor(
    private _eventEmitterService: EventEmitterService    
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {        
    this._eventEmitterService.dismissEventViewMoreModal()
  }
}