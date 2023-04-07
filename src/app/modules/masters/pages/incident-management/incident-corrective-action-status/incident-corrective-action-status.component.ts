import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { IncidentCorrectiveActionStatusMasterStore } from 'src/app/stores/masters/incident-management/incident-corrective-action-status-store';
import { IncidentCorrectiveActionStatusService } from 'src/app/core/services/masters/incident-management/incident-corrective-action-status/incident-corrective-action-status.service';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-incident-corrective-action-status',
  templateUrl: './incident-corrective-action-status.component.html',
  styleUrls: ['./incident-corrective-action-status.component.scss']
})
export class IncidentCorrectiveActionStatusComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  

  reactionDisposer: IReactionDisposer;
  IncidentCorrectiveActionStatusMasterStore = IncidentCorrectiveActionStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_incident_corrective_action_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  popupIncidentCorrectiveActionStatusEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _incidentCorrectiveActionStatusService: IncidentCorrectiveActionStatusService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof IncidentCorrectiveActionStatusComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'INCIDENT_CORRECTIVE_ACTION_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_INCIDENT_CORRECTIVE_ACTION_STATUS', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_INCIDENT_CORRECTIVE_ACTION_STATUS', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'incident-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._incidentCorrectiveActionStatusService.exportToExcel();
                break;
                case "search":
                  IncidentCorrectiveActionStatusMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
                case "share":
                  ShareItemStore.setTitle('share_incident_corrective_action_status_title');
                  ShareItemStore.formErrors = {};
                  break;
              default:
                break;
            }
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
          if(ShareItemStore.shareData){
            this._incidentCorrectiveActionStatusService.shareData(ShareItemStore.shareData)
            .subscribe(res=>{
                ShareItemStore.unsetShareData();
                ShareItemStore.setTitle('');
                ShareItemStore.unsetData();
                $('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                  $(this.mailConfirmationPopup.nativeElement).modal('show');              
                }, 200);
            },(error)=>{
              if(error.status == 422){
                ShareItemStore.processFormErrors(error.error.errors);
              }
              ShareItemStore.unsetShareData();
              this._utilityService.detectChanges(this._cdr);
              $('.modal-backdrop').remove();
            });
          }
        })
         // for deleting/activating/deactivating using delete modal
      this.popupIncidentCorrectiveActionStatusEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) IncidentCorrectiveActionStatusMasterStore.setCurrentPage(newPage);
    this._incidentCorrectiveActionStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Incident Corrective Action Status?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Incident Corrective Action Status?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
    /**
   * @description
   * this method is used for modal control event
   *
   * @param {*} [event]
   * @memberof IncidentCorrectiveActionStatusComponent
   */
  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateIcidentCorrectiveActionStatus(status)
        break;
      case 'Deactivate': this.deactivateIcidentCorrectiveActionStatus(status)
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
   * @memberof IncidentCorrectiveActionStatusComponent
   */
  activateIcidentCorrectiveActionStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._incidentCorrectiveActionStatusService.activate(this.popupObject.id)
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
   * @memberof IncidentCorrectiveActionStatusComponent
   */
  deactivateIcidentCorrectiveActionStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._incidentCorrectiveActionStatusService.deactivate(this.popupObject.id)
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
      this._incidentCorrectiveActionStatusService.sortIncidentCorrectiveActionStatusList(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof IncidentCorrectiveActionStatusComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupIncidentCorrectiveActionStatusEventSubscription.unsubscribe();
      IncidentCorrectiveActionStatusMasterStore.searchText = '';
      IncidentCorrectiveActionStatusMasterStore.currentPage = 1 ;
    }
    
}
