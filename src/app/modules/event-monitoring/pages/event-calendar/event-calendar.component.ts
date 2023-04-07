import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { autorun, IReactionDisposer } from 'mobx';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { Router } from "@angular/router";
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  providers: [DatePipe],
})
export class EventCalendarComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;

  EventsStore = EventsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  filterDateObject: { startDate: string, endDate: string };

  constructor(
    private _eventService: EventsService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _router: Router
  ) { }

  ngOnInit(): void {

    if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
    this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
    var subMenuItems = [
      { activityName: null, submenuItem: { type: 'datefilter' } },
      // { activityName: null, submenuItem: { type: 'close', path: '/event-monitoring/events' } },
    ]
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
        if (SubMenuItemStore.DatefilterValue != '') {
          this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
        }
      }
      if (SubMenuItemStore.DatefilterValue != '') {
        this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
      }
    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
      this._utilityService.detectChanges(this._cdr);
    }, 250);

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) EventsStore.setCurrentPage(newPage);
    let params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
    this._eventService.getItems(params, false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  gotoEventDetails(id) {
    this._router.navigateByUrl(`/event-monitoring/events/${id}`)
  }

  scrollEvent = (event: any): void => {
    const number = event.target.documentElement?.scrollTop;
    if (number > 50) {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
      this._renderer2.addClass(this.navBar.nativeElement, 'affix');
    }
    else {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
    }
  }

  passDates(dateObject): any {
    EventsStore.eventlistmakeEmpty();
    this.filterDateObject = dateObject;
    this.pageChange();
  }

  // selecting type of date range need to apply on the filtering of the data
  processDateFilterSelected(dateType: any): void {
    if (dateType === "custom") {

      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    else {
      this.filterDateObject = this._helperService.getStartEndDate(dateType);
      EventsStore.eventlistmakeEmpty();
      this.pageChange();
    }
  }

  processDate(start_date) {
    let date1 = new Date(start_date)
    return date1;
  }

  labelDot(data) {
    let color = data + ' !important'
    return color;
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    SubMenuItemStore.searchText = '';
  }

}
