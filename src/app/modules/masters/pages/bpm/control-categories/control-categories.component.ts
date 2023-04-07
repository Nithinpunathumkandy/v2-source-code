import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { ControlCategoryService } from 'src/app/core/services/masters/bpm/control-category/control-category.service'
import { IReactionDisposer, autorun } from 'mobx';
import { ControlCategoryMasterStore } from 'src/app/stores/masters/bpm/control-category.master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ControlCategory } from 'src/app/core/models/masters/bpm/conrol-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
 
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-control-categories',
  templateUrl: './control-categories.component.html',
  styleUrls: ['./control-categories.component.scss']
})
export class ControlCategoriesComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  
  reactionDisposer: IReactionDisposer;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_control_category_message';

  controlCategObject = {
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


  controlCategSubscriptionEvent: any = null;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _controlCategService: ControlCategoryService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_controlcategory_button'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'CONTROL_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_CONTROL_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_CONTROL_CATEGORY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_CONTROL_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_CONTROL_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_CONTROL_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'bpm'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_CONTROL_CATEGORY')){
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
            this._controlCategService.generateTemplate();
            break;
          case "export_to_excel":
            this._controlCategService.exportToExcel();
            break;
          case "search":
            ControlCategoryMasterStore.searchText  = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_control_category_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_control_category');
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
        this._controlCategService.shareData(ShareItemStore.shareData).subscribe(res=>{
            ShareItemStore.unsetShareData();
            ShareItemStore.setTitle('');
            ShareItemStore.unsetData();
            $('.modal-backdrop').remove();
            document.body.classList.remove('modal-open');
            setTimeout(() => {
              $(this.mailConfirmationPopup.nativeElement).modal('show');              
            }, 200);
        },(error)=>{
          if (error.status == 422){
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
        this._controlCategService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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



    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    
    this.controlCategSubscriptionEvent = this._eventEmitterService.controlCategory.subscribe(res=>{
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
      this.controlCategObject.type = 'Add';
      this.controlCategObject.values = null; // for clearing the value
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }

  pageChange(newPage: number = null) {
    if (newPage) ControlCategoryMasterStore.setCurrentPage(newPage);
    this._controlCategService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteControlCategory(status)
        break;

      case 'Activate': this.activateControlCategory(status)
        break;

      case 'Deactivate': this.deactivateControlCategory(status)
        break;

    }

  }


  // delete function call
  deleteControlCategory(status: boolean) {
    if (status && this.popupObject.id) {
      this._controlCategService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && ControlCategoryMasterStore.getControlCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateControlCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._controlCategService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateControlCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._controlCategService.deactivate(this.popupObject.id).subscribe(resp => {
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
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Control Category?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Control Category?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Control Category?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.controlCategObject.type = null;
  }
  

  getControlCategory(id: number) {
    const controlCategory: ControlCategory = ControlCategoryMasterStore.getControlCategoryById(id);
    //set form value
    this.controlCategObject.values = {
      id: controlCategory.id,
      title: controlCategory.title,
      reference_code:controlCategory.reference_code
    }
    this.controlCategObject.type = 'Edit';
    this.openFormModal();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.controlCategSubscriptionEvent.unsubscribe();
    ControlCategoryMasterStore.searchText = '';
    ControlCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

 

 // for sorting
 sortTitle(type: string) {
  // ControlCategoryMasterStore.setCurrentPage(1);
  this._controlCategService.sortControlCategoryList(type, SubMenuItemStore.searchText);
  this.pageChange();
}


}
