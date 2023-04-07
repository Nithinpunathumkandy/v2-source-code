import { Component, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer,autorun } from 'mobx';
import { ControlAssessmentDashboardService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-dashboard/control-assessment-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ControlAssessmentDashboardStore } from 'src/app/stores/business-assessments/control-assessment-dashboard/control-assessment-dashboard';
import { ControlAssessmentDetailsStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-details-store';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';

@Component({
  selector: 'app-control-assessment-count',
  templateUrl: './control-assessment-count.component.html',
  styleUrls: ['./control-assessment-count.component.scss']
})
export class ControlAssessmentCountComponent implements OnInit, OnDestroy {
  reactionDisposer: IReactionDisposer;
  ControlAssessmentDashboardStore=ControlAssessmentDashboardStore;
  ControlAssessmentDetailsStore=ControlAssessmentDetailsStore;
  ControlAssessmentStore=ControlAssessmentStore;
  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _controlAssessmentDashboardService:ControlAssessmentDashboardService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    ControlAssessmentDetailsStore.unSetControlAssessmentId();
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: '', submenuItem: { type: 'close',path:'/business-assessments/control-assessments' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

    })
    this.getControlCount();
  }

  getControlCount()
  {
    ControlAssessmentDashboardStore.loaded=false
    this._controlAssessmentDashboardService.getControlCount(ControlAssessmentStore?.docversionId).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }
  goToAssessment()
  {
    ControlAssessmentDetailsStore.setControlAssessmentId(ControlAssessmentDashboardStore?.controlAssessmentCount?.control_assessment
      .id);
    ControlAssessmentDetailsStore.setControlAssessmentDocumentversionId(ControlAssessmentStore.docversionId);
    //ControlAssessmentDetailsStore.setControlAssessmentDocumentversionData(item);
    this._router.navigateByUrl('/business-assessments/control-assessments/'+ControlAssessmentStore.docversionId
    +'/assessments/'+ControlAssessmentDashboardStore?.controlAssessmentCount?.control_assessment.id);
  }
  ngOnDestroy()
  {
    if (this.reactionDisposer) this.reactionDisposer();
    ControlAssessmentDashboardStore.loaded=false
  }

}
