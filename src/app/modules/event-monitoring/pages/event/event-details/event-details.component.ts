import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventsService } from "src/app/core/services/event-monitoring/events/events.service";
import { EventTeamsStore } from "src/app/stores/event-monitoring/event-team-store";
import { StrategicThemesStore } from 'src/app/stores/event-monitoring/events/event-strategic-themes-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit , OnDestroy {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  EventsStore = EventsStore;
  EventTeamsStore= EventTeamsStore;
  StrategicThemesStore=StrategicThemesStore;
  AppStore = AppStore;
  constructor(private _activatedRouter: ActivatedRoute, private _eventsService: EventsService,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,
    private _renderer2: Renderer2,) { }

  ngOnInit(): void {

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    EventsStore.selectedEventId = null;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      if(id){
        EventsStore.selectedEventId = id;
        this.getEventDetails(id);
      }
    });
  }

  getEventDetails(id){
    this._eventsService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  ngOnDestroy(){
    EventsStore.unsetEventDetails();
    EventsStore.unsetEventOutcomes();
    EventTeamsStore.unsetEventsTeamList();
    StrategicThemesStore.unsetEventObjectives();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
