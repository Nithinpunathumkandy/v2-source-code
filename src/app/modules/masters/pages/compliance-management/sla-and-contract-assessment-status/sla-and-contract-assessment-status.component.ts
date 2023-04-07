import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SlaAndContractAssessmentStatusService } from 'src/app/core/services/masters/compliance-management/sla-and-contract-assessment-status/sla-and-contract-assessment-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SlaAndContractAssessmentStatusMasterStore } from 'src/app/stores/masters/compliance-management/sla-and-contract-assessment-status-store';

@Component({
  selector: 'app-sla-and-contract-assessment-status',
  templateUrl: './sla-and-contract-assessment-status.component.html',
  styleUrls: ['./sla-and-contract-assessment-status.component.scss']
})
export class SlaAndContractAssessmentStatusComponent implements OnInit {
  @ViewChild('titleInput') titleInput: ElementRef;

  slaAndContractObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  SlaAndContractAssessmentStatusMasterStore = SlaAndContractAssessmentStatusMasterStore;

  constructor(private _utilityService:UtilityService,
              private _cdr:ChangeDetectorRef,
              private _slaAndContractAssessmentStatusService:SlaAndContractAssessmentStatusService,
              private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle'});

    // This will run whenever the store observable or computed which are used in this function changes.
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: '', submenuItem: { type: 'search' }},
        {activityName: '', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'compliance-management'}},
      ]
      
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

    
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
         
          case "export_to_excel":
            this._slaAndContractAssessmentStatusService.exportToExcel();
            break;
          case "search":
            SlaAndContractAssessmentStatusMasterStore.searchTerm = SubMenuItemStore.searchText;
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
    if (newPage) SlaAndContractAssessmentStatusMasterStore.setCurrentPage(newPage);
    this._slaAndContractAssessmentStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // for sorting
   sortTitle(type: string) {
    this._slaAndContractAssessmentStatusService.sortStatusList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    SlaAndContractAssessmentStatusMasterStore.currentPage = 1 ;
  }

}
