import { OnDestroy, Renderer2 } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { ReportStore } from 'src/app/stores/mrm/meeting-report/meeting-report.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';

@Component({
  selector: 'app-meetings-details',
  templateUrl: './meetings-details.component.html',
  styleUrls: ['./meetings-details.component.scss']
})
export class MeetingsDetailsComponent implements OnInit,OnDestroy {

  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  MeetingsStore = MeetingsStore;
  ActionPlansStore = ActionPlansStore;
  ReportStore = ReportStore;
  MeetingPlanStore=MeetingPlanStore;
  constructor(private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _meetingsService:MeetingsService) { }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // this.getMeetingDetails();
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._meetingsService.saveMeetingId(id);
      this._meetingsService.getItem(id).subscribe(res=>{
        if(res?.meeting_plan?.id){
          MeetingPlanStore.setMeetingPlanId(res?.meeting_plan?.id);
        }
         // In a real app: dispatch action to load the details here.
      this._utilityService.detectChanges(this._cdr);
      })
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
    MeetingsStore.unsetIndividualMeetingsDetails();
    ReportStore.unsetReportDetails();
    ActionPlansStore.unSetActionPlans();
    ReportStore.unsetReportDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    // MeetingPlanStore.unsetMeetingPlanId();
    // MeetingsStore.meetingsId = null;
  }

}
