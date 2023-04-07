import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentInvestigationStatusService } from 'src/app/core/services/masters/incident-management/incident-investigation-status/incident-investigation-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentInvestigationStatusMasterStore } from 'src/app/stores/masters/incident-management/incident-investigation-status-store';

@Component({
  selector: 'app-incident-investigation-status',
  templateUrl: './incident-investigation-status.component.html',
  styleUrls: ['./incident-investigation-status.component.scss']
})
export class IncidentInvestigationStatusComponent implements OnInit {

  IncidentInvestigationStatusMasterStore = IncidentInvestigationStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  // AuthStore = AuthStore;
  // AppStore = AppStore;

  constructor(private _incidentInvestigationStatusService: IncidentInvestigationStatusService,
              private _helperService: HelperServiceService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'INCIDENT_INVESTIGATION_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_INCIDENT_INVESTIGATION_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'incident-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._incidentInvestigationStatusService.exportToExcel();
                break;
                case "search":
                  IncidentInvestigationStatusMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
              default:
                break;
            }
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })
  
    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) IncidentInvestigationStatusMasterStore.setCurrentPage(newPage);
    this._incidentInvestigationStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  sortTitle(type: string) {
    this._incidentInvestigationStatusService.sortIncidentInvestigationStatusList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    IncidentInvestigationStatusMasterStore.searchText = '';
    IncidentInvestigationStatusMasterStore.currentPage = 1 ;
  }
}
