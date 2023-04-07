import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ProjectMonitoringStatus } from 'src/app/core/models/masters/project-monitoring/project-monitoring-status';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMonitoringStatusService } from 'src/app/core/services/masters/project-monitoring/project-monitoring-status/project-monitoring-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectMonitoringStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-monitoring-status-store';

declare var $: any;

@Component({
  selector: 'app-project-monitoring-status',
  templateUrl: './project-monitoring-status.component.html',
  styleUrls: ['./project-monitoring-status.component.scss']
})
export class ProjectMonitoringStatusComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  

  reactionDisposer: IReactionDisposer;
  ProjectMonitoringStatusMasterStore = ProjectMonitoringStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_project_monitoring_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  popupProjectMonitoringStatusEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _projectMonitoringStatusService: ProjectMonitoringStatusService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectMonitoringStatusComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'PROJECT_MONITORING_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_PROJECT_MONITORING_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'project-monitoring'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._projectMonitoringStatusService.exportToExcel();
                break;
                case "search":
                  ProjectMonitoringStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
      this.popupProjectMonitoringStatusEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectMonitoringStatusMasterStore.setCurrentPage(newPage);
    this._projectMonitoringStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_project_monitoring_status';
    this.popupObject.subtitle = 'are_you_sure_activate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_project_monitoring_status';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
    /**
   * @description
   * this method is used for modal control event
   *
   * @param {*} [event]
   * @memberof ProjectMonitoringStatusComponent
   */
  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateProjectMonitoringStatus(status)
        break;
      case 'Deactivate': this.deactivateProjectMonitoringStatus(status)
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
   * @memberof ProjectMonitoringStatusComponent
   */
    activateProjectMonitoringStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._projectMonitoringStatusService.activate(this.popupObject.id)
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
   * @memberof ProjectMonitoringStatusComponent
   */
    deactivateProjectMonitoringStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectMonitoringStatusService.deactivate(this.popupObject.id)
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
      this._projectMonitoringStatusService.sortProjectMonitoringStatusList(type, null);
      this.pageChange();
    }

    getProjectMonitoringStatus(id: number) {
      const ProjectMonitoringStatus: ProjectMonitoringStatus = ProjectMonitoringStatusMasterStore.getProjectMonitoringStatusById(id);
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProjectMonitoringStatusComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupProjectMonitoringStatusEventSubscription.unsubscribe();
      ProjectMonitoringStatusMasterStore.searchText = '';
      ProjectMonitoringStatusMasterStore.currentPage = 1 ;
    }
    
}