import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { KpiImprovementPlansStatus } from 'src/app/core/models/masters/kpi-management/kpi-improvrement-plan-status';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiImprovementPlanStatuesService } from 'src/app/core/services/masters/kpi-management/kpi-improvement-plan-statues/kpi-improvement-plan-statues.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiImprovementPlanStatusMasterStore } from 'src/app/stores/masters/kpi-management/kpi-improvement-plan-status';
declare var $: any;
@Component({
  selector: 'app-kpi-improvement-plan-statuses',
  templateUrl: './kpi-improvement-plan-statuses.component.html',
  styleUrls: ['./kpi-improvement-plan-statuses.component.scss']
})
export class KpiImprovementPlanStatusesComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  KpiImprovementPlanStatusMasterStore = KpiImprovementPlanStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_kpi_improvement_plan_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  popupEventSubscription: any;

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _kpiImprovementPlanStatuesService: KpiImprovementPlanStatuesService,
    ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof KpiManagementStatusComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KPI_MANAGEMENT_KPI_IMPROVEMENT_PLAN_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_KPI_MANAGEMENT_KPI_IMPROVEMENT_PLAN_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'kpi-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._kpiImprovementPlanStatuesService.exportToExcel();
                break;
                case "search":
                  KpiImprovementPlanStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
      this.popupEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) KpiImprovementPlanStatusMasterStore.setCurrentPage(newPage);
    this._kpiImprovementPlanStatuesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_kpi_improvement_plan_status';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_kpi_improvement_plan_status';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
    /**
   * @description
   * this method is used for modal control event
   *
   * @param {*} [event]
   * @memberof KpiManagementStatusComponent
   */
  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateKpiImprovementPlanStatus(status)
        break;
      case 'Deactivate': this.deactivateKpiImprovementPlansStatus(status)
        break;
    }
  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
  }

   /**
   * @description
   * this method is used for activcate
   * @param {*} 
   * @memberof KpiManagementStatusComponent
   */
    activateKpiImprovementPlanStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._kpiImprovementPlanStatuesService.activate(this.popupObject.id)
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

   /**
   * @description
   * this method is used for deactivate
   * @param {*} 
   * @memberof KpiManagementStatusComponent
   */
    deactivateKpiImprovementPlansStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._kpiImprovementPlanStatuesService.deactivate(this.popupObject.id)
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
      this._kpiImprovementPlanStatuesService.sortList(type, null);
      this.pageChange();
    }

    getStatus(id: number) {
      const KpiManagementStatus: KpiImprovementPlansStatus = KpiImprovementPlanStatusMasterStore.getKpiImprovementPlansStatusById(id);
    }
  
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupEventSubscription.unsubscribe();
      KpiImprovementPlanStatusMasterStore.searchText = '';
      KpiImprovementPlanStatusMasterStore.currentPage = 1 ;
    }
    
}
