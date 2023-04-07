import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ControlAssessmentActionPlanStatusService } from 'src/app/core/services/masters/business-assessment/control-assessment-action-plan-status/control-assessment-action-plan-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ControlAssessmentActionPlanStatusMasterStore } from 'src/app/stores/masters/business-assessment/control-assessment-action-plan-status.store';

@Component({
  selector: 'app-control-assessment-action-plan-status',
  templateUrl: './control-assessment-action-plan-status.component.html',
  styleUrls: ['./control-assessment-action-plan-status.component.scss']
})
export class ControlAssessmentActionPlanStatusComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ControlAssessmentActionPlanStatusMasterStore = ControlAssessmentActionPlanStatusMasterStore;

  constructor(
    private _controlAssessmentActionPlanStatusService: ControlAssessmentActionPlanStatusService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService

  ) { }

  ngOnInit(): void {

     NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CONTROL_ASSESSMENT_ACTION_PLAN_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_CONTROL_ASSESSMENT_ACTION_PLAN_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'business-assessment'}},
      ]
     
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._controlAssessmentActionPlanStatusService.exportToExcel();
            break;
          case "search":
            ControlAssessmentActionPlanStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    
     
    })
   
    this.pageChange(1);
    
  }
  
  pageChange(newPage: number = null) {
    if (newPage) ControlAssessmentActionPlanStatusMasterStore.setCurrentPage(newPage);
    this._controlAssessmentActionPlanStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // for sorting
   sortTitle(type: string) {

    this._controlAssessmentActionPlanStatusService.sortControlAssessmentActionPlanStatusList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

}
