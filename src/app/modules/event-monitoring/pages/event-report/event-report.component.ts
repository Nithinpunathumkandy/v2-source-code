import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ReportList } from 'src/app/core/models/event-monitoring/event-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventReportStore } from 'src/app/stores/event-monitoring/event-report-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-event-report',
  templateUrl: './event-report.component.html',
  styleUrls: ['./event-report.component.scss']
})
export class EventReportComponent implements OnInit {

  
  @ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
	reactionDisposer: IReactionDisposer;
  EventReportStore = EventReportStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeEventList: ReportList[];
	initializeChangeRequestList: ReportList[];
  initializeEventClosureList: ReportList[];
	Report_loader: boolean = false;
	OrganizationModulesStore = OrganizationModulesStore;
  AppStore = AppStore;

  constructor(
    private _router: Router,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.Report_loader = true;
      this._utilityService.detectChanges(this._cdr);
      }, 100);
  
    this.reactionDisposer = autorun(() => {
      if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
        this.eventList();
        this.changeRequestList();
        this.eventClosureList();
        this._utilityService.detectChanges(this._cdr);
      }
    })
  
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
      this._utilityService.detectChanges(this._cdr);
    }, 250);
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
    // for moveing to next page
    getReport(obj) {
      EventReportStore.selectedReportObject = obj;
      SubMenuItemStore.datefilterValue = 'year';
      this._router.navigateByUrl('event-monitoring/reports/' + obj.type);
    }
    // for getting the list of data shows in audit section
    eventList(): void {
      this.initializeEventList = this.EventReportStore.ReportListArray.filter(function (i) {
        return i.reportType == 'eventRegister';
      });
      for (var i = 0; i < this.initializeEventList.length; i++) {
        if (this.initializeEventList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeEventList[i].checkLevel]) {
          this.initializeEventList.splice(i, 1);
          i--;
        }
      }
  
    }
    changeRequestList(): void {
      this.initializeChangeRequestList = this.EventReportStore.ReportListArray.filter(function (i) {
        return i.reportType == 'eventTreatment';
      });
      for (var i = 0; i < this.initializeChangeRequestList.length; i++) {
        if (this.initializeChangeRequestList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeChangeRequestList[i].checkLevel]) {
          this.initializeChangeRequestList.splice(i, 1);
          i--;
        }
      }
    }
    eventClosureList(): void {
      this.initializeEventClosureList = this.EventReportStore.ReportListArray.filter(function (i) {
        return i.reportType == 'eventClosure';
      });
      for (var i = 0; i < this.initializeEventClosureList.length; i++) {
        if (this.initializeEventClosureList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeEventClosureList[i].checkLevel]) {
          this.initializeEventClosureList.splice(i, 1);
          i--;
        }
      }
    }
  
    ngOnDestroy(){
      window.removeEventListener('scroll', this.scrollEvent, true);
    }
  }
