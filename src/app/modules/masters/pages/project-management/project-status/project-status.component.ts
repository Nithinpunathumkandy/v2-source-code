import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import{ProjectStatusMasterStore} from 'src/app/stores/masters/project-management/project-status-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ProjectStatusService } from 'src/app/core/services/masters/project-management/project-status/project-status.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit,OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  ProjectStatusMasterStore = ProjectStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_project_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlProjectStatusEventSubscription: any;

  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _projectStatusService: ProjectStatusService){}

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
  
      var subMenuItems = [
        {activityName: 'PROJECT_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_PROJECT_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_PROJECT_STATUS', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'project-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._projectStatusService.exportToExcel();
                break;
                case "search":
                  ProjectStatusMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                   break;
                case "share":
                  ShareItemStore.setTitle('share_project_status_title');
                  ShareItemStore.formErrors = {};
                  break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
         
            NoDataItemStore.unSetClickedNoDataItem();
          }
          if(ShareItemStore.shareData){
            this._projectStatusService.shareData(ShareItemStore.shareData).subscribe(res=>{
                ShareItemStore.unsetShareData();
                ShareItemStore.setTitle('');
                ShareItemStore.unsetData();
                $('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                  $(this.mailConfirmationPopup.nativeElement).modal('show');              
                }, 200);
            },(error)=>{
              if (error.status == 422){
              ShareItemStore.processFormErrors(error.error.errors);
            }
            ShareItemStore.unsetShareData();
            this._utilityService.detectChanges(this._cdr);
            $('.modal-backdrop').remove();
            console.log(error);
            });
          }
        })

         // for deleting/activating/deactivating using delete modal
      this.popupControlProjectStatusEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })

    this.pageChange(1);
  }

  
  pageChange(newPage: number = null) {
    if (newPage) ProjectStatusMasterStore.setCurrentPage(newPage);
    this._projectStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Project Status?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Project Status?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      
      case 'Activate': this.activateProjectStatus(status)
        break;
  
      case 'Deactivate': this.deactivateProjectStatus(status)
        break;
  
    }
  
  }
  
  
  
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  
  }
  
  // calling activcate function
  
  activateProjectStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._projectStatusService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
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
  
  // calling deactivate function
  
  deactivateProjectStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._projectStatusService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
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
      //RiskTypeMasterStore.setCurrentPage(1);
      this._projectStatusService.sortProjectStatusList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupControlProjectStatusEventSubscription.unsubscribe();
      ProjectStatusMasterStore.searchText = '';
      ProjectStatusMasterStore.currentPage = 1 ;
    }

}
