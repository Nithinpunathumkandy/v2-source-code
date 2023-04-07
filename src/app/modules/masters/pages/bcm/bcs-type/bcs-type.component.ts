import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { BcsTypes } from 'src/app/core/models/masters/bcm/bcs-type';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BcsTypeService } from 'src/app/core/services/masters/bcm/bcs-type/bcs-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BcsTypesMasterStore } from 'src/app/stores/masters/bcm/bcs-type-store';

declare var $:any;
@Component({
  selector: 'app-bcs-type',
  templateUrl: './bcs-type.component.html',
  styleUrls: ['./bcs-type.component.scss']
})
export class BcsTypeComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BcsTypesMasterStore = BcsTypesMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_bcs_type_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  bcsTypesObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupControlBcsTypesEventSubscription: any;
  bcsTypeSubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _bcsTypes: BcsTypeService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,

  ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_bcs_type'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BUSINESS_CONTINUITY_STRATEGY_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_BUSINESS_CONTINUITY_STRATEGY_TYPE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_BUSINESS_CONTINUITY_STRATEGY_TYPE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_BUSINESS_CONTINUITY_STRATEGY_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_BUSINESS_CONTINUITY_STRATEGY_TYPE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_BUSINESS_CONTINUITY_STRATEGY_TYPE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'bcm'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_BUSINESS_CONTINUITY_STRATEGY_TYPE')){
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
            this._bcsTypes.generateTemplate();
            break;
          case "export_to_excel":
            this._bcsTypes.exportToExcel();
            break;
          case "search":
            BcsTypesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_bcs_types_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_bcs_types');
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

      if(ShareItemStore.shareData){
        this._bcsTypes.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._bcsTypes.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlBcsTypesEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.bcsTypeSubscriptionEvent = this._eventEmitterService.bcsTypeModalControl.subscribe(res => {
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

    // BcsTypesMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) BcsTypesMasterStore.setCurrentPage(newPage);
    this._bcsTypes.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addNewItem(){
    this.bcsTypesObject.type = 'Add';
    this.bcsTypesObject.values = null; // for clearing the value
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
  this.bcsTypesObject.type = null;
}
getBcsTypes(id: number) {
  const bcsTypes: BcsTypes = BcsTypesMasterStore.getBcsTypesById(id);
  //set form value
  this.bcsTypesObject.values = {
    id: bcsTypes.id,
    title: bcsTypes.title,
    description: bcsTypes.description,
  }
  this.bcsTypesObject.type = 'Edit';
  this.openFormModal();
}

    // for sorting
    sortTitle(type: string) {
      this._bcsTypes.sortBcsTypesList(type, SubMenuItemStore.searchText);
      this.pageChange();
    }

    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case '': this.deleteBcsTypes(status)
          break;
  
        case 'Activate': this.activateBcsTypes(status)
          break;
  
        case 'Deactivate': this.deactivateBcsTypes(status)
          break;
  
      }
  
    }
    // delete function call
    deleteBcsTypes(status: boolean) {
      if (status && this.popupObject.id) {
        this._bcsTypes.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        },(error=>{
          if(error.status == 405 && BcsTypesMasterStore.getBcsTypesById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
  
   activateBcsTypes(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._bcsTypes.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateBcsTypes(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._bcsTypes.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Bcs Type?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Bcs Type?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Bcs Type?';
    this.popupObject.subtitle = 'common_delete_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  
  }

    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      BcsTypesMasterStore.searchText = '';
      BcsTypesMasterStore.currentPage = 1 ;
      this.popupControlBcsTypesEventSubscription.unsubscribe();
      this.bcsTypeSubscriptionEvent.unsubscribe();
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
      }
}
