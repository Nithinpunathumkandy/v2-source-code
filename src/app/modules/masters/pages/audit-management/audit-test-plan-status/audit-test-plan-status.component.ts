import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditTestPalnStatusService } from 'src/app/core/services/masters/audit-management/audit-test-plan-status/audit-test-paln-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditTestPlanStatusMasterStore } from 'src/app/stores/masters/audit-management/audit-test-plan-status-store';

declare var $: any;

@Component({
  selector: 'app-audit-test-plan-status',
  templateUrl: './audit-test-plan-status.component.html',
  styleUrls: ['./audit-test-plan-status.component.scss']
})
export class AuditTestPlanStatusComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  AuditTestPlanStatusMasterStore = AuditTestPlanStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'audit_test_plan_status_message';


  
  deleteAuditTestSubscription: any;
  auditTestPlanStatusSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  auditTestPlanStatusObject = {
    component: 'Master',
    type: null,
    values: null
  }

   popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  constructor(
    private _auditTestPalnStatusService: AuditTestPalnStatusService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'AM_AUDIT_TEST_PLAN_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_AM_AUDIT_TEST_PLAN_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'audit-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //   setTimeout(() => {
          //     this.addNewItem();
          //   }, 1000);
          //   break;
          case "export_to_excel":
            this._auditTestPalnStatusService.exportToExcel();
            break;
          case "search":
            AuditTestPlanStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_audit_test_plan_status');
            ShareItemStore.formErrors = {};
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      // if(NoDataItemStore.clikedNoDataItem){
      //   this.addNewItem();
      //   NoDataItemStore.unSetClickedNoDataItem();
      // }
      if(ShareItemStore.shareData){
        this._auditTestPalnStatusService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
          console.log(error);
        });
      }
    })
    // for deleting/activating/deactivating using delete modal
    this.deleteAuditTestSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.auditTestPlanStatusSubscriptionEvent = this._eventEmitterService.auditTestPlanStatus.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })
    this.pageChange(1);
  }

  // addNewItem(){
  //   this.auditTestPlanStatusObject.type = 'Add';
  //   this.auditTestPlanStatusObject.values = null; // for clearing the value
  //   this._utilityService.detectChanges(this._cdr);
  //   this.openFormModal();
  // }
  pageChange(newPage: number = null) {
    if (newPage) AuditTestPlanStatusMasterStore.setCurrentPage(newPage);
    this._auditTestPalnStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.auditTestPlanStatusObject.type = null;
  }

    /**
   * Get particular user document type item
   * @param id  id of user document type 
   */
         
     getAuditTestPlanStatus(id: number)  {

      this._auditTestPalnStatusService.getItem(id).subscribe(res=>{
        if(res){
        this.auditTestPlanStatusObject.values = {
          id: res.id,
          languages: res.languages,      
        }
      }
        
  
        this.auditTestPlanStatusObject.type = 'Edit';
        this.openFormModal();
          this._utilityService.detectChanges(this._cdr);
        })
    }
  


  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteTestPlanStatus(status)
        break;

      case 'Activate': this.activateTestPlanStatus(status)
        break;

      case 'Deactivate': this.deactivateTestPlanStatus(status)
        break;
    }
  }
    // delete function call
    deleteTestPlanStatus(status: boolean) {
      if (status && this.popupObject.id) {
        this._auditTestPalnStatusService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        },(error=>{
          if(error.status == 405 && AuditTestPlanStatusMasterStore.getAuditTestPlanStatesById(this.popupObject.id).status_id == AppStore.activeStatusId){
            let id = this.popupObject.id;
            this.closeConfirmationPopUp();
            this.clearPopupObject();
            setTimeout(() => {
              this.deactivate(id);
              this._utilityService.detectChanges(this._cdr);
            }, 500);
          }
          else{
            this.closeConfirmationPopUp();
            this.clearPopupObject();
          }
  
        })
        );
      }
      else {
        this.closeConfirmationPopUp();
        this.clearPopupObject();
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
    activateTestPlanStatus(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._auditTestPalnStatusService.activate(this.popupObject.id).subscribe(resp => {
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
    deactivateTestPlanStatus(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._auditTestPalnStatusService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate Audit Test Plan Status?';
      this.popupObject.subtitle = 'are_you_sure_activate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      // event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Audit Test Plan Status?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for delete
    delete(id: number) {
      // event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'Delete Audit Test Plan Status?';
      this.popupObject.subtitle = 'are_you_sure_delete';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

    
   // for sorting
   sortTitle(type: string) {
   this._auditTestPalnStatusService.sortAuditStatusesList(type, null);
   this.pageChange();
  }



      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteAuditTestSubscription.unsubscribe();
    this.auditTestPlanStatusSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AuditTestPlanStatusMasterStore.searchText = '';
    AuditTestPlanStatusMasterStore.currentPage = 1 ;
  }

}
