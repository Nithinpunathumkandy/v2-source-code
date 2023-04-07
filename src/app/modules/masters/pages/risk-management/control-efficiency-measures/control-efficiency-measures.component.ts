import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import{ControlEfficiencyMeasuresMasterStore} from 'src/app/stores/masters/risk-management/control-efficiency-measures-store';
import { ControlEfficiencyMeasuresSingle } from 'src/app/core/models/masters/risk-management/control-efficiency-measures';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ControlEfficiencyMeasuresService } from 'src/app/core/services/masters/risk-management/control-efficiency-measures/control-efficiency-measures.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-control-efficiency-measures',
  templateUrl: './control-efficiency-measures.component.html',
  styleUrls: ['./control-efficiency-measures.component.scss']
})
export class ControlEfficiencyMeasuresComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  ControlEfficiencyMeasuresMasterStore = ControlEfficiencyMeasuresMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_control_efficiency_measure_message';

  controlEfficiencyMeasuresObject = {
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

  controlEfficiencyMeasuresSubscriptionEvent: any = null;
  popupControlEfficiencyMeasuresEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _controlEfficiencyMeasuresService: ControlEfficiencyMeasuresService){}

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_control_efficiency_measures'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CONTROL_EFFICIENCY_MEASURE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_CONTROL_EFFICIENCY_MEASURE', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_CONTROL_EFFICIENCY_MEASURE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_CONTROL_EFFICIENCY_MEASURE', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_CONTROL_EFFICIENCY_MEASURE')){
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
                this._controlEfficiencyMeasuresService.exportToExcel();
                break;
              case "search":
                ControlEfficiencyMeasuresMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_control_efficiency_measure_title');
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
            this._controlEfficiencyMeasuresService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
      this.popupControlEfficiencyMeasuresEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })

      this.controlEfficiencyMeasuresSubscriptionEvent = this._eventEmitterService.controlEfficienyMeasures.subscribe(res => {
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
  addNewItem(){
    this.controlEfficiencyMeasuresObject.type = 'Add';
    this.controlEfficiencyMeasuresObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) ControlEfficiencyMeasuresMasterStore.setCurrentPage(newPage);
    this._controlEfficiencyMeasuresService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.controlEfficiencyMeasuresObject.type = null;
  }

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Control Efficiency Measures?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Control Efficiency Measures?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteControlEfficiencyMeasures(status)
      break;
      
      case 'Activate': this.activateControlEfficiencyMeasures(status)
        break;
  
      case 'Deactivate': this.deactivateControlEfficiencyMeasures(status)
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
  deleteControlEfficiencyMeasures(status: boolean) {
    if (status && this.popupObject.id) {
      this._controlEfficiencyMeasuresService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && ControlEfficiencyMeasuresMasterStore.getControlEfficiencyMeasuresById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
 
  // get perticuller control efficiency measures
  getControlEfficiencyMeasures(id: number) {
    this._controlEfficiencyMeasuresService.getItem(id).subscribe(res=>{

        this.loadPopup();
        this._utilityService.detectChanges(this._cdr);
      })
      
  
  }


  loadPopup()
  {
   
    const controlEfficiencyMeasures: ControlEfficiencyMeasuresSingle = ControlEfficiencyMeasuresMasterStore.individualControlEfficiencyMeasuresId;
      
    this.controlEfficiencyMeasuresObject.values = {
      id: controlEfficiencyMeasures.id,
      score: controlEfficiencyMeasures.score,
      is_not_applicable:controlEfficiencyMeasures.is_not_applicable,
      languages: controlEfficiencyMeasures.languages,
            
    }
   
    this.controlEfficiencyMeasuresObject.type = 'Edit';
    this.openFormModal();
  }

   // for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Control Efficiency Measures?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  
  // calling activcate function
  
  activateControlEfficiencyMeasures(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._controlEfficiencyMeasuresService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateControlEfficiencyMeasures(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._controlEfficiencyMeasuresService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this._controlEfficiencyMeasuresService.sortControlEfficiencyMeasuresList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.controlEfficiencyMeasuresSubscriptionEvent.unsubscribe();
      this.popupControlEfficiencyMeasuresEventSubscription.unsubscribe();
      ControlEfficiencyMeasuresMasterStore.searchText = '';
      ControlEfficiencyMeasuresMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
  



}
