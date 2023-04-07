import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { SelfAssessmentStatus } from 'src/app/core/models/masters/audit-management/am-audit-control-self-assessment-update-status';

import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmAuditControlSelfAssessmentUpdateStatusService } from 'src/app/core/services/masters/audit-management/am-audit-control-self-assessment-update-status/am-audit-control-self-assessment-update-status.service';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SelfAssessmentStatusMasterStore } from 'src/app/stores/masters/audit-management/am-audit-control-self-assessment-update-status-store';


declare var $: any;
@Component({
  selector: 'app-am-audit-control-self-assessment-update-status',
  templateUrl: './am-audit-control-self-assessment-update-status.component.html',
  styleUrls: ['./am-audit-control-self-assessment-update-status.component.scss']
})
export class AmAuditControlSelfAssessmentUpdateStatusComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;  
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  SelfAssessmentStatusMasterStore = SelfAssessmentStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  auditSelfAsssessmentUpdateObject = {
    component: 'Master',
    type: null,
    values: null,
    id: null
  }
  popupSelfAssessmentStatusEventSubscription: any;
  auditControlSelfAssessmentSubscriptionEvent: any = null;
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _amAuditControlselfAssessmentUpdateStatusService: AmAuditControlSelfAssessmentUpdateStatusService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'AM_AUDIT_CONTROL_SELF_ASSESSMENT_UPDATE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_AM_AUDIT_CONTROL_SELF_ASSESSMENT_UPDATE_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'audit-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._amAuditControlselfAssessmentUpdateStatusService.exportToExcel();
                break;
                case "search":
                  SelfAssessmentStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
      this.popupSelfAssessmentStatusEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
    this.auditControlSelfAssessmentSubscriptionEvent = this._eventEmitterService.auditControlSelfAssessmentUpdateStatus.subscribe(res => {
      this.closeFormModal();
    })
  }

  pageChange(newPage: number = null) {
    if (newPage) SelfAssessmentStatusMasterStore.setCurrentPage(newPage);
    this._amAuditControlselfAssessmentUpdateStatusService.getItems(false,null,true).subscribe(() => 
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
      case 'Activate': this.activateSelfAssessmentStatus(status)
        break;
      case 'Deactivate': this.deactivateSelfAssessmentStatus(status)
        break;
    }
  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
  }

  //activate
    activateSelfAssessmentStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._amAuditControlselfAssessmentUpdateStatusService.activate(this.popupObject.id)
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
    deactivateSelfAssessmentStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._amAuditControlselfAssessmentUpdateStatusService.deactivate(this.popupObject.id)
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
      this._amAuditControlselfAssessmentUpdateStatusService.sortSelfAssessmentStatusList(type, null);
      this.pageChange();
    }

    getSelfAssessmentStatus(id: number) {
      const SelfAssessmentStatus: SelfAssessmentStatus = SelfAssessmentStatusMasterStore.getSelfAssessmentStatusById(id);
    }
    getAuditSelfAssessmentUpdateStatus(id: number)  {
      this.auditSelfAsssessmentUpdateObject.id = id;
      this._amAuditControlselfAssessmentUpdateStatusService.getItem(id).subscribe(res=>{
        if(res){
        this.auditSelfAsssessmentUpdateObject.values = {
          label: res.label,
          color_code: res.color_code,  
        }
      }
        
  
        this.auditSelfAsssessmentUpdateObject.type = 'Edit';
        this.openFormModal();
          this._utilityService.detectChanges(this._cdr);
        })
    }
    openFormModal() {
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 50);
    }
    closeFormModal() {
      $(this.formModal.nativeElement).modal('hide');
      this.auditSelfAsssessmentUpdateObject.type = null;
    }
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupSelfAssessmentStatusEventSubscription.unsubscribe();
      SelfAssessmentStatusMasterStore.searchText = '';
      SelfAssessmentStatusMasterStore.currentPage = 1 ;
      this.auditControlSelfAssessmentSubscriptionEvent.unsubscribe();
    }
    
}
