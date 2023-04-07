import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit,OnDestroy {
  EventsStore=EventsStore;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    EventsStore.unsetEventsList(); 
  }
  

}
