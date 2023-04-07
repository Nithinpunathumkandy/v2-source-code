import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CyberIncidentCorrectiveActionStatusService } from 'src/app/core/services/masters/cyber-incident/cyber-incident-corrective-action-status/cyber-incident-corrective-action-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CyberIncidentCorrectiveActionStatusMasterStore } from 'src/app/stores/masters/cyber-incident/cyber-incident-corrective-action-status-store';

declare var $: any;
@Component({
  selector: 'app-cyber-incident-corrective-action-statuses',
  templateUrl: './cyber-incident-corrective-action-statuses.component.html',
  styleUrls: ['./cyber-incident-corrective-action-statuses.component.scss']
})
export class CyberIncidentCorrectiveActionStatusesComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  CyberIncidentCorrectiveActionStatusMasterStore = CyberIncidentCorrectiveActionStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription:any


  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _cyberIncidentCorrectiveActionStatusService: CyberIncidentCorrectiveActionStatusService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CYBER_INCIDENT_CORRECTIVE_ACTION_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_CYBER_INCIDENT_CORRECTIVE_ACTION_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'cyber-incident'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._cyberIncidentCorrectiveActionStatusService.exportToExcel();
                break;
                case "search":
                  CyberIncidentCorrectiveActionStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) CyberIncidentCorrectiveActionStatusMasterStore.setCurrentPage(newPage);
    this._cyberIncidentCorrectiveActionStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

    sortTitle(type: string) {
      this._cyberIncidentCorrectiveActionStatusService.sortCyberIncidentCorrectiveActionStatusesList(type, null);
      this.pageChange();
    }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Activate': this.activateCyberIncidentCorrectiveActionStatus(status)
        break;

      case 'Deactivate': this.deactivateCyberIncidentCorrectiveActionStatus(status)
        break;

    }

  }

  closeConfirmationPopUp(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }
 
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

  // calling activcate function

  activateCyberIncidentCorrectiveActionStatus(status: boolean) {
    if (status && this.popupObject.id) {

      this._cyberIncidentCorrectiveActionStatusService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateCyberIncidentCorrectiveActionStatus(status: boolean) {
    if (status && this.popupObject.id) {

      this._cyberIncidentCorrectiveActionStatusService.deactivate(this.popupObject.id).subscribe(resp => {
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

  // for activate 
  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Cyber Incident Status?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Cyber Incident Status?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      CyberIncidentCorrectiveActionStatusMasterStore.searchText = '';
      CyberIncidentCorrectiveActionStatusMasterStore.currentPage = 1 ;
      this.popupControlEventSubscription.unsubscribe();
    }

}
