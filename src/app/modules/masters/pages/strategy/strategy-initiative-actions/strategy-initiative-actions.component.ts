import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { StrategyInitiativeActions } from 'src/app/core/models/masters/strategy/strategy-initiative-actions';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyInitiativeActionsService } from 'src/app/core/services/masters/strategy/strategy-initiative-actions/strategy-initiative-actions.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyInitiativeActionsMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-actions.store';
declare var $: any;

@Component({
  selector: 'app-strategy-initiative-actions',
  templateUrl: './strategy-initiative-actions.component.html',
  styleUrls: ['./strategy-initiative-actions.component.scss']
})
export class StrategyInitiativeActionsComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  StrategyInitiativeActionsMasterStore = StrategyInitiativeActionsMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_strategic_initiative_action_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  strategyInitiativeActionsObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupStrategyInitiativeActionsEventSubscription: any;
  strategyInitiativeActionsSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _service:StrategyInitiativeActionsService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_strategic_initiative_action'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'STRATEGY_INITIATIVE_ACTION_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_STRATEGY_INITIATIVE_ACTION', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_STRATEGY_INITIATIVE_ACTION', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_STRATEGY_INITIATIVE_ACTION', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_STRATEGY_INITIATIVE_ACTION', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_STRATEGY_INITIATIVE_ACTION', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'strategy'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_STRATEGY_INITIATIVE_ACTION')){
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
          case "template":
            this._service.generateTemplate();
            break;
          case "export_to_excel":
            this._service.exportToExcel();
            break;
          case "search":
            StrategyInitiativeActionsMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_strategic_initiative_action_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_strategic_initiative_action_type');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._service.shareData(ShareItemStore.shareData).subscribe(res=>{
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
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._service.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })

     // for deleting/activating/deactivating using delete modal
     this.popupStrategyInitiativeActionsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.strategyInitiativeActionsSubscriptionEvent = this._eventEmitterService.strategyInitiativeAction.subscribe(res => {
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
    // StrategyInitiativeActionsMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) StrategyInitiativeActionsMasterStore.setCurrentPage(newPage);
    this._service.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Strategy Initiative Action?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Strategy Initiative Action?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {  

      case '': this.deleteStrategyInitiativeAction(status)
      break;
      case 'Activate': this.activateStrategyInitiativeAction(status)
        break;
      case 'Deactivate': this.deactivateStrategyInitiativeAction(status)
        break;
    }
  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
  }

  activateStrategyInitiativeAction(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._service.activate(this.popupObject.id)
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

  deactivateStrategyInitiativeAction(status: boolean) {
    if (status && this.popupObject.id) {
      this._service.deactivate(this.popupObject.id)
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
      this._service.sortStrategicInitiativeActionList(type, null);
      this.pageChange();
    }

    addNewItem(){
      this.strategyInitiativeActionsObject.type = 'Add';
      this.strategyInitiativeActionsObject.values = null; // for clearing the value
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }
    
  // for opening modal
  openFormModal() { 
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.strategyInitiativeActionsObject.type = null;
    this.strategyInitiativeActionsObject.values = null;
  }
  
  // for edit function

getStrategyInitiativeAction(id: number) {
  const strategyInitiativeActions: StrategyInitiativeActions = StrategyInitiativeActionsMasterStore.getStrategyInitiativeActionsById(id);
  //set form value
  this.strategyInitiativeActionsObject.values = {
    id: strategyInitiativeActions.id,
    title: strategyInitiativeActions.title,
    description: strategyInitiativeActions.description
  }
  this.strategyInitiativeActionsObject.type = 'Edit';
  this.openFormModal();
}

// delete function call
deleteStrategyInitiativeAction(status: boolean) {
  if (status && this.popupObject.id) {
    this._service.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && this.StrategyInitiativeActionsMasterStore.getStrategyInitiativeActionsById(this.popupObject.id).status_id == AppStore.activeStatusId){
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


// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Strategy Initiative Actions?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}

ngOnDestroy() {
  // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  this.strategyInitiativeActionsSubscriptionEvent.unsubscribe();
  this.popupStrategyInitiativeActionsEventSubscription.unsubscribe();
  StrategyInitiativeActionsMasterStore.searchText = '';
  StrategyInitiativeActionsMasterStore.currentPage = 1 ;
  this.idleTimeoutSubscription.unsubscribe();
  this.networkFailureSubscription.unsubscribe();
  }

}
