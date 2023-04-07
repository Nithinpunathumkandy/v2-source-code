import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { JsoSubCategory } from 'src/app/core/models/masters/jso/jso-sub-category';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { JsoSubCategoryService } from 'src/app/core/services/masters/jso/jso-sub-category/jso-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { JsoSubCategoryMasterStore } from 'src/app/stores/masters/jso/jso-sub-category-master-store';

declare var $: any;
@Component({
  selector: 'app-jso-sub-category',
  templateUrl: './jso-sub-category.component.html',
  styleUrls: ['./jso-sub-category.component.scss']
})
export class JsoSubCategoryComponent implements OnInit , OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  JsoSubCategoryMasterStore = JsoSubCategoryMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_jso_sub_category_message';

  jsoSubCategoryObject = {
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


  jsoSubCategorySubscriptionEvent: any = null;
  popupjsoSubCategoryEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(

    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _jsoSubCategoryService: JsoSubCategoryService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2 ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_sub_jso_category'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'JSO_SUB_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_JSO_SUB_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_JSO_SUB_CATEGORY', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_JSO_SUB_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_JSO_SUB_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_JSO_SUB_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'jso'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_JSO_SUB_CATEGORY')){
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
            this._jsoSubCategoryService.generateTemplate();
            break;
          case "export_to_excel":
            this._jsoSubCategoryService.exportToExcel();
            break;
          case "search":
            JsoSubCategoryMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_jso_sub_category_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_jso_sub_category');
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
        this._jsoSubCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._jsoSubCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupjsoSubCategoryEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.jsoSubCategorySubscriptionEvent = this._eventEmitterService.jsoSubCategory.subscribe(res => {
      this.closeFormModal();
    })
    
    // JsoSubCategoryMasterStore.setOrderBy('asc');

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
    this.jsoSubCategoryObject.type = 'Add';
    this.jsoSubCategoryObject.values = null; // for clearing the value
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
    this.jsoSubCategoryObject.type = null;
  }

  // for edit function

  getJsoSubCategory(id: number) {
    const jsoSubCategory: JsoSubCategory = JsoSubCategoryMasterStore.getJsoSubCategoryById(id);
    //set form value
    this.jsoSubCategoryObject.values = {
      id: jsoSubCategory.id,
      title: jsoSubCategory.title,
      description: jsoSubCategory.description,
      jso_category_id:jsoSubCategory.jso_category_id
    }
    this.jsoSubCategoryObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteJsoSubCategory(status)
        break;

      case 'Activate': this.activateJsoSubCategory(status)
        break;

      case 'Deactivate': this.deactivateJsoSubCategory(status)
        break;

    }

  }


  // delete function call
  deleteJsoSubCategory(status: boolean) {
    if (status && this.popupObject.id) {
      this._jsoSubCategoryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && this.JsoSubCategoryMasterStore.getJsoSubCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateJsoSubCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._jsoSubCategoryService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateJsoSubCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._jsoSubCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Jso Category?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Jso Category?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Jso Category?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  pageChange(newPage: number = null) {
    if (newPage) JsoSubCategoryMasterStore.setCurrentPage(newPage);
    this._jsoSubCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    // ExternalAuditTypesMasterStore.setCurrentPage(1);
    this._jsoSubCategoryService.sortJsoSubCategorylList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.jsoSubCategorySubscriptionEvent.unsubscribe();
    this.popupjsoSubCategoryEventSubscription.unsubscribe();
    JsoSubCategoryMasterStore.searchText = '';
    JsoSubCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();

  }


}
