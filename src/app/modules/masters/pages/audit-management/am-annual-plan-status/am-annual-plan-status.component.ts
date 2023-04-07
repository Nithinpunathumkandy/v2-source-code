import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAnnualPlanStatus } from 'src/app/core/models/masters/audit-management/am-annual-plan-status';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmAnnualPlanStatusService } from 'src/app/core/services/masters/audit-management/am-annual-plan-status/am-annual-plan-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AmAnnualPlanStatusMasterStore } from 'src/app/stores/masters/audit-management/am-annual-plan-status-store';

declare var $: any;
@Component({
  selector: 'app-am-annual-plan-status',
  templateUrl: './am-annual-plan-status.component.html',
  styleUrls: ['./am-annual-plan-status.component.scss']
})
export class AmAnnualPlanStatusComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;  

  reactionDisposer: IReactionDisposer;
  AmAnnualPlanStatusMasterStore = AmAnnualPlanStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  popupAmAnnualPlanStatusEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _amAnnualPlanStatusService: AmAnnualPlanStatusService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'AM_ANNUAL_PLAN_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_AM_ANNUAL_PLAN_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'audit-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._amAnnualPlanStatusService.exportToExcel();
                break;
                case "search":
                  AmAnnualPlanStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
      this.popupAmAnnualPlanStatusEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) AmAnnualPlanStatusMasterStore.setCurrentPage(newPage);
    this._amAnnualPlanStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_am_annual_plan_status';
    this.popupObject.subtitle = 'are_you_sure_activate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_am_annual_plan_status';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  

  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateAmAnnualPlanStatus(status)
        break;
      case 'Deactivate': this.deactivateAmAnnualPlanStatus(status)
        break;
    }
  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
  }

  //activate
    activateAmAnnualPlanStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._amAnnualPlanStatusService.activate(this.popupObject.id)
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
    deactivateAmAnnualPlanStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._amAnnualPlanStatusService.deactivate(this.popupObject.id)
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
      this._amAnnualPlanStatusService.sortAmAnnualPlanStatusList(type, null);
      this.pageChange();
    }

    getAmAnnualPlanStatus(id: number) {
      const AmAnnualPlanStatus: AmAnnualPlanStatus = AmAnnualPlanStatusMasterStore.getAmAnnualPlanStatusById(id);
    }
  
  
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupAmAnnualPlanStatusEventSubscription.unsubscribe();
      AmAnnualPlanStatusMasterStore.searchText = '';
      AmAnnualPlanStatusMasterStore.currentPage = 1 ;
    }
    
}
