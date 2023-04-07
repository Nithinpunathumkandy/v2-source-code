import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { KpiScoreStatus } from 'src/app/core/models/masters/kpi-management/kpi-score-status';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiScoreStatusesService } from 'src/app/core/services/masters/kpi-management/kpi-score-statuses/kpi-score-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiScoreStatusMasterStore } from 'src/app/stores/masters/kpi-management/kpi-score-status';

declare var $: any;

@Component({
  selector: 'app-kpi-score-statuses',
  templateUrl: './kpi-score-statuses.component.html',
  styleUrls: ['./kpi-score-statuses.component.scss']
})
export class KpiScoreStatusesComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  KpiScoreStatusMasterStore = KpiScoreStatusMasterStore;

  mailConfirmationData = 'share_kpi_management_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupStatusEventSubscription: any;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _kpiScoreStatusesService: KpiScoreStatusesService,
    ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KPI_MANAGEMENT_KPI_SCORE_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_KPI_MANAGEMENT_KPI_SCORE_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'kpi-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._kpiScoreStatusesService.exportToExcel();
                break;
                case "search":
                  KpiScoreStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
         // for deleting/activating/deactivating using delete modal
      this.popupStatusEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) KpiScoreStatusMasterStore.setCurrentPage(newPage);
    this._kpiScoreStatusesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_kpi_score_status';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_kpi_score_status';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateKpiScoreStatus(status)
        break;
      case 'Deactivate': this.deactivateKpiScoreStatus(status)
        break;
    }
  }

   // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

    activateKpiScoreStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._kpiScoreStatusesService.activate(this.popupObject.id)
      .subscribe(resp => { setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

    deactivateKpiScoreStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._kpiScoreStatusesService.deactivate(this.popupObject.id)
      .subscribe(resp => { setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }
  
    sortTitle(type: string) {
      this._kpiScoreStatusesService.sortList(type, null);
      this.pageChange();
    }

    getKpiStatus(id: number) {
      const KpiStatus: KpiScoreStatus = KpiScoreStatusMasterStore.getKpiScoreStatusesById(id);
    }

    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupStatusEventSubscription.unsubscribe();
      KpiScoreStatusMasterStore.searchText = '';
      KpiScoreStatusMasterStore.currentPage = 1 ;
    }
    

}
