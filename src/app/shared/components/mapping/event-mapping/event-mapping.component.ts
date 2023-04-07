import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Events } from 'src/app/core/models/event-monitoring/events/events';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StatusService } from "src/app/core/services/masters/event-monitoring/status.service";

@Component({
  selector: 'app-event-mapping',
  templateUrl: './event-mapping.component.html',
  styleUrls: ['./event-mapping.component.scss']
})
export class EventMappingComponent implements OnInit {

  @Input('eventModalTitle') eventModalTitle: any;
  @Input('title') title: boolean = false;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  EventsStore = EventsStore;
  searchText
  selectedEvents: Events[] = []
  emptyEventsMessage = "no_events";
  eventParams: string = '';
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventsService: EventsService,
    private _imageService: ImageServiceService,
    private _eventStatusService: StatusService) { }

  ngOnInit(): void {
    this.selectedEvents = JSON.parse(JSON.stringify(EventsStore.selectedEvents));
    this.getEventStatus();
    // this.pageChange(1);
  }

  getEventStatus() {
    this._eventStatusService.getItems().subscribe(res => {
      let approvedId: any = res.data.find(e => e.type == 'approved');
      if (approvedId) this.eventParams = '&event_status_ids=' + approvedId.id;
      this.pageChange(1)
    })
  }

  pageChange(newPage: number = null) {
    if (newPage) EventsStore.setCurrentPage(newPage);
    let params = this.eventParams;
    this._eventsService.getItems((params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._eventsService.sorteventsList(type);
    this.pageChange()
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  cancel() {
    if (EventsStore.saveSelected) {
      //  console.log("success");
      this._eventEmitterService.dismissEventMappingModal();
      this.searchText = null;
    }
    else {
      this.selectedEvents = [];
      EventsStore.saveSelected = false
      this._eventEmitterService.dismissEventMappingModal()
      this.searchText = null;
    }
  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    EventsStore.saveSelected = true;
    this._eventsService.setSelectedEvents(this.selectedEvents);
    AppStore.disableLoading();
    let title = this.eventModalTitle?.component ? this.eventModalTitle?.component : 'item'
    if (this.selectedEvents.length > 0) this._utilityService.showSuccessMessage('events_selected', 'Selected events are mapped with the ' + this._helperService.translateToUserLanguage(title) + ' successfully!');
    if (close) this.cancel();

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  selectAllEvents(e) {
    if (e.target.checked) {
      for (let i of EventsStore.eventsList) {
        var pos = this.selectedEvents.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedEvents.push(i);
        }
      }
    } else {
      for (let i of EventsStore.eventsList) {
        var pos = this.selectedEvents.findIndex(e => e.id == i.id);
        if (pos != -1) {
          this.selectedEvents.splice(pos, 1);
        }
      }
    }
  }

  eventSelected(events) {
    var pos = this.selectedEvents.findIndex(e => e.id == events.id);
    if (pos != -1)
      this.selectedEvents.splice(pos, 1);
    else
      this.selectedEvents.push(events);
  }


  eventPresent(id) {
    const index = this.selectedEvents.findIndex(e => e.id == id);
    if (index != -1)
      return true;
    else
      return false;
  }


}
