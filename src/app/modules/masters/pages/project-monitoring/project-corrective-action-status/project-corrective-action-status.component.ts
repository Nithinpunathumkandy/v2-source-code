import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ProjectCorrectiveActionStatus } from 'src/app/core/models/masters/project-monitoring/project-corrective-action-status';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectCorrectiveActionStatusService } from 'src/app/core/services/masters/project-monitoring/project-corrective-action-status/project-corrective-action-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectCorrectiveActionStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-corrective-action-status-store';

declare var $: any;

@Component({
  selector: 'app-project-corrective-action-status',
  templateUrl: './project-corrective-action-status.component.html',
  styleUrls: ['./project-corrective-action-status.component.scss']
})
export class ProjectCorrectiveActionStatusComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;  

  reactionDisposer: IReactionDisposer;
  ProjectCorrectiveActionStatusMasterStore = ProjectCorrectiveActionStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  popupProjectCorrectiveActionStatusEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _projectCorrectiveActionStatusService: ProjectCorrectiveActionStatusService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'PROJECT_ISSUE_CORRECTIVE_ACTION_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_PROJECT_ISSUE_CORRECTIVE_ACTION_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'project-monitoring'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._projectCorrectiveActionStatusService.exportToExcel();
                break;
                case "search":
                  ProjectCorrectiveActionStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
      this.popupProjectCorrectiveActionStatusEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectCorrectiveActionStatusMasterStore.setCurrentPage(newPage);
    this._projectCorrectiveActionStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_project_monitor_corrective_action_status';
    this.popupObject.subtitle = 'are_you_sure_activate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_project_monitor_corrective_action_status';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  

  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateProjectCorrectiveActionStatus(status)
        break;
      case 'Deactivate': this.deactivateProjectCorrectiveActionStatus(status)
        break;
    }
  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
  }

  //activate
    activateProjectCorrectiveActionStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._projectCorrectiveActionStatusService.activate(this.popupObject.id)
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

  //deactivate
    deactivateProjectCorrectiveActionStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectCorrectiveActionStatusService.deactivate(this.popupObject.id)
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
      this._projectCorrectiveActionStatusService.sortProjectCorrectiveActionStatusList(type, null);
      this.pageChange();
    }

    getProjectCorrectiveActionStatus(id: number) {
      const ProjectCorrectiveActionStatus: ProjectCorrectiveActionStatus = ProjectCorrectiveActionStatusMasterStore.getProjectCorrectiveActionStatusById(id);
    }
  
  
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupProjectCorrectiveActionStatusEventSubscription.unsubscribe();
      ProjectCorrectiveActionStatusMasterStore.searchText = '';
      ProjectCorrectiveActionStatusMasterStore.currentPage = 1 ;
    }
    
}
