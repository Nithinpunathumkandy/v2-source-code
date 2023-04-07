import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Currency } from 'src/app/core/models/masters/general/currency';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CurrencyService } from 'src/app/core/services/masters/general/currency/currency.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CurrencyMasterStore } from 'src/app/stores/masters/general/currency-store';

declare var $: any;
@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  CurrencyMasterStore = CurrencyMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  
  currencyObject = {
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

  currencySubscriptionEvent: any = null;
  popupControlCurrencyEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _currencyService:CurrencyService,
    private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_currency'});

this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'CURRENCY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_CURRENCY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_CURRENCY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_CURRENCY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_CURRENCY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_CURRENCY')){
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
            this._currencyService.generateTemplate();
            break;
          case "export_to_excel":
            this._currencyService.exportToExcel();
            break;
          case "search":
            CurrencyMasterStore.searchText =SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_currency');
            ImportItemStore.setImportFlag(true);
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
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._currencyService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlCurrencyEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.currencySubscriptionEvent = this._eventEmitterService.currencyControl.subscribe(res => {
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

    CurrencyMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }
  addNewItem(){
    this.currencyObject.type = 'Add';
    this.currencyObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) CurrencyMasterStore.setCurrentPage(newPage);
    this._currencyService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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
    this.currencyObject.type = null;
  }
  getCurrency(id: number) {
    const currency: Currency = CurrencyMasterStore.getCurrencyById(id);
    //set form value
    this.currencyObject.values = {
      id: currency.id,
      title: currency.title,
      code: currency.code,
      icon: currency.icon,
    }
    this.currencyObject.type = 'Edit';
    this.openFormModal();
  }
  
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCurrency(status)
        break;

      case 'Activate': this.activateCurrency(status)
        break;

      case 'Deactivate': this.deactivateCurrency(status)
        break;

    }

  }
  // delete function call
  deleteCurrency(status: boolean) {
    if (status && this.popupObject.id) {
      this._currencyService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && CurrencyMasterStore.getCurrencyById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

 activateCurrency(status: boolean) {
  if (status && this.popupObject.id) {

    this._currencyService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateCurrency(status: boolean) {
  if (status && this.popupObject.id) {

    this._currencyService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate Currency?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Currency?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Currency?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  sortTitle(type: string) {
    //RiskAreaMasterStore.setCurrentPage(1);
    this._currencyService.sortCurrencyList(type, null);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.currencySubscriptionEvent.unsubscribe();
    this.popupControlCurrencyEventSubscription.unsubscribe();
    CurrencyMasterStore.searchText = '';
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
