import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessAssessmentStatusService } from 'src/app/core/services/masters/business-assessment/business-assessment-status/business-assessment-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BusinessAssessmentStatusMasterStore } from 'src/app/stores/masters/business-assessment/business-assessment-status-store';

@Component({
  selector: 'app-business-assessment-status',
  templateUrl: './business-assessment-status.component.html',
  styleUrls: ['./business-assessment-status.component.scss']
})
export class BusinessAssessmentStatusComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BusinessAssessmentStatusMasterStore = BusinessAssessmentStatusMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(
    private _businessAssessmentStatusService: BusinessAssessmentStatusService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService

  ) { }

  ngOnInit(): void {

     NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'BUSINESS_ASSESSMENT_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_BUSINESS_ASSESSMENT_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'business-assessment'}},
      ]
     
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._businessAssessmentStatusService.exportToExcel();
            break;
          case "search":
            BusinessAssessmentStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) BusinessAssessmentStatusMasterStore.setCurrentPage(newPage);
    this._businessAssessmentStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // for sorting
   sortTitle(type: string) {

    this._businessAssessmentStatusService.sortBusinessAssessmentStatusList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

}
