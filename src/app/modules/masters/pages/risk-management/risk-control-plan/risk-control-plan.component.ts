import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import{RiskControlPlanMasterStore} from 'src/app/stores/masters/risk-management/risk-control-plan-store';
import { RiskControlPlanSingle } from 'src/app/core/models/masters/risk-management/risk-control-plan';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskControlPlanService } from 'src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';


declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-risk-control-plan',
  templateUrl: './risk-control-plan.component.html',
  styleUrls: ['./risk-control-plan.component.scss']
})
export class RiskControlPlanComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  RiskControlPlanMasterStore = RiskControlPlanMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_control_plan_message';

  riskControlPlanObject = {
    component: 'Master',
    values: null,
    type: null
  };


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  riskControlPlanSubscriptionEvent: any = null;
  popupControlRiskControlPlanEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _riskControlPlanService: RiskControlPlanService){}

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_risk_control_plan'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_CONTROL_PLAN_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_RISK_CONTROL_PLAN', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_RISK_CONTROL_PLAN', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_CONTROL_PLAN', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_RISK_CONTROL_PLAN')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "new_modal":
                setTimeout(() => {
                this.addNewItem();
                }, 1000);
                break;
              case "export_to_excel":
                this._riskControlPlanService.exportToExcel();
                break;
              case "search":
                RiskControlPlanMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_control_plan_title');
                ShareItemStore.formErrors = {};
                  break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            this.addNewItem();
            NoDataItemStore.unSetClickedNoDataItem();
          }
          if(ShareItemStore.shareData){
            this._riskControlPlanService.shareData(ShareItemStore.shareData).subscribe(res=>{
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


         // for deleting/activating/deactivating using delete modal
      this.popupControlRiskControlPlanEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })

      this.riskControlPlanSubscriptionEvent = this._eventEmitterService.riskControlPlan.subscribe(res => {
        this.closeFormModal();
      })

    this.pageChange(1);
  }
  addNewItem(){
    this.riskControlPlanObject.type = 'Add';
    this.riskControlPlanObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) RiskControlPlanMasterStore.setCurrentPage(newPage);
    this._riskControlPlanService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.riskControlPlanObject.type = null;
  }

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Risk Control Plan?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Risk Control Plan?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteRiskControlPlan(status)
      break;
      
      case 'Activate': this.activateRiskControlPlan(status)
        break;
  
      case 'Deactivate': this.deactivateRiskControlPlan(status)
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

   // delete function call
   deleteRiskControlPlan(status: boolean) {
    if (status && this.popupObject.id) {
      this._riskControlPlanService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && RiskControlPlanMasterStore.getRiskControlPlanById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
 

  // get perticuller risk control plan
  getRiskControlPlan(id: number) {
    this._riskControlPlanService.getItem(id).subscribe(res=>{

        this.loadPopup();
        this._utilityService.detectChanges(this._cdr);
      })
      
  
  }


  loadPopup()
  {
   
    const riskControlPlan: RiskControlPlanSingle = RiskControlPlanMasterStore.individualRiskControlPlanId;
      
    this.riskControlPlanObject.values = {
      id: riskControlPlan.id,
      languages: riskControlPlan.languages,
      is_treatment:riskControlPlan.is_treatment
            
    }
    this.riskControlPlanObject.type = 'Edit';
    this.openFormModal();
  }

   // for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Risk Area?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  
  // calling activcate function
  
  activateRiskControlPlan(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskControlPlanService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateRiskControlPlan(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskControlPlanService.deactivate(this.popupObject.id).subscribe(resp => {
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
      //RiskControlPlanMasterStore.setCurrentPage(1);
      this._riskControlPlanService.sortRiskControlPlanList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.riskControlPlanSubscriptionEvent.unsubscribe();
      this.popupControlRiskControlPlanEventSubscription.unsubscribe();
      RiskControlPlanMasterStore.searchText = '';
      RiskControlPlanMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
  

}
