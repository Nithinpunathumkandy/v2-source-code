import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ProjectChangeRequestStatus } from 'src/app/core/models/masters/project-monitoring/project-change-request-status';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectChangeRequestStatusService } from 'src/app/core/services/masters/project-monitoring/project-change-request-status/project-change-request-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectChangeRequestStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-change-request-status-store';

declare var $: any;

@Component({
  selector: 'app-project-change-request-status',
  templateUrl: './project-change-request-status.component.html',
  styleUrls: ['./project-change-request-status.component.scss']
})
export class ProjectChangeRequestStatusComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  

  reactionDisposer: IReactionDisposer;
  ProjectChangeRequestStatusMasterStore = ProjectChangeRequestStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_project_monitor_change_request_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  popupProjectChangeRequestStatusEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _projectChangeRequestStatusService: ProjectChangeRequestStatusService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectChangeRequestStatusComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'PROJECT_MONITOR_CHANGE_REQUEST_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_PROJECT_MONITOR_CHANGE_REQUEST_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'project-monitoring'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._projectChangeRequestStatusService.exportToExcel();
                break;
                case "search":
                  ProjectChangeRequestStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
      this.popupProjectChangeRequestStatusEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectChangeRequestStatusMasterStore.setCurrentPage(newPage);
    this._projectChangeRequestStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_project_monitor_change_request_status';
    this.popupObject.subtitle = 'are_you_sure_activate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_project_monitor_change_request_status';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
    /**
   * @description
   * this method is used for modal control event
   *
   * @param {*} [event]
   * @memberof ProjectChangeRequestStatusComponent
   */
  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateProjectChangeRequestStatus(status)
        break;
      case 'Deactivate': this.deactivateProjectChangeRequestStatus(status)
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
   * @memberof ProjectChangeRequestStatusComponent
   */
    activateProjectChangeRequestStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._projectChangeRequestStatusService.activate(this.popupObject.id)
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
   * @memberof ProjectChangeRequestStatusComponent
   */
    deactivateProjectChangeRequestStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectChangeRequestStatusService.deactivate(this.popupObject.id)
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
      this._projectChangeRequestStatusService.sortProjectChangeRequestStatusList(type, null);
      this.pageChange();
    }

    getProjectChangeRequestStatus(id: number) {
      const ProjectChangeRequestStatus: ProjectChangeRequestStatus = ProjectChangeRequestStatusMasterStore.getProjectChangeRequestStatusById(id);
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProjectChangeRequestStatusComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupProjectChangeRequestStatusEventSubscription.unsubscribe();
      ProjectChangeRequestStatusMasterStore.searchText = '';
      ProjectChangeRequestStatusMasterStore.currentPage = 1 ;
    }
    
}
