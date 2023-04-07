import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { IncidentStatusMasterStore } from 'src/app/stores/masters/incident-management/incident-status-master-store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentStatusService } from 'src/app/core/services/masters/incident-management/incident-status/incident-status.service';
import { IncidentStatus } from 'src/app/core/models/masters/incident-management/incident-status';

declare var $: any;

@Component({
  selector: 'app-incident-status',
  templateUrl: './incident-status.component.html',
  styleUrls: ['./incident-status.component.scss']
})
export class IncidentStatusComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  IncidentStatusMasterStore = IncidentStatusMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };


  IncidentStatusSubscriptionEvent: any = null;
  popupIncidentStatusEventSubscription: any;

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _incidentStatusService: IncidentStatusService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'INCIDENT_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_INCIDENT_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path:'incident-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._incidentStatusService.exportToExcel();
            break;
          case "search":
            IncidentStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
           
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.pageChange(1);
  }



  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

  pageChange(newPage: number = null) {
    if (newPage) IncidentStatusMasterStore.setCurrentPage(newPage);
    this._incidentStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    // ExternalAuditTypesMasterStore.setCurrentPage(1);
    this._incidentStatusService.sortIncidentStatuslList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    IncidentStatusMasterStore.searchText = '';
    IncidentStatusMasterStore.currentPage = 1 ;
  }

}
