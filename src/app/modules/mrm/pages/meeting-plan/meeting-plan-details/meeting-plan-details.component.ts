import { Component, OnInit, Renderer2, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { ReportStore } from 'src/app/stores/mrm/meeting-report/meeting-report.store';

@Component({
  selector: 'app-meeting-plan-details',
  templateUrl: './meeting-plan-details.component.html',
  styleUrls: ['./meeting-plan-details.component.scss']
})
export class MeetingPlanDetailsComponent implements OnInit,OnDestroy {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;

  AppStore = AppStore;
  ReportStore=ReportStore;
  MappingStore=MappingStore;
  MeetingsStore=MeetingsStore;
  MeetingPlanStore = MeetingPlanStore;
  OrganizationModulesStore = OrganizationModulesStore;

  constructor(
    private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _meetingPlanService: MeetingPlanService,
    ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      this._meetingPlanService.saveMeetingPlanId(id);
    })
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }
  }

  ngOnDestroy(){

    // Dont Unset MeetingPlan ID as we are using the same id to select the meeting plan when adding new meeting.
    ReportStore.unsetReportDetails();
    ReportStore.unsetMeetingReportsList();
    MappingStore.unsetMappingDetails();
    ActionPlansStore.unSetActionPlans();
    MeetingsStore.unsetIndividualMeetingsDetails();
    MeetingPlanStore.unsetIndividualMeetingPlanDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

  }

}
