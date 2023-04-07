import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { RootCauseSubCategory } from 'src/app/core/models/masters/internal-audit/root-cause-sub-categories';
import{RootCauseSubCategoryMasterStore} from 'src/app/stores/masters/internal-audit/root-cause-sub-categories-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RootCauseSubCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-sub-categories/root-cause-sub-categories.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root-cause-sub-categories',
  templateUrl: './root-cause-sub-categories.component.html',
  styleUrls: ['./root-cause-sub-categories.component.scss']
})
export class RootCauseSubCategoriesComponent implements OnInit , OnDestroy {
  @ViewChild('rootCauseCategoryformModal', { static: true }) rootCauseCategoryformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  RootCauseSubCategoryStore = RootCauseSubCategoryMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_root_cause_sub_category_message';

  rootCauseSubCategoryObject = {
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


  rootCauseSubCategorySubscriptionEvent: any = null;
  popupControlAuditEventSubscription: any;
  // childModalSubscriptionEvent: any = null;
  closingModalEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,
    private _rootCauseSubCategoryService: RootCauseSubCategoriesService) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_root_cause_subcategory'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'ROOT_CAUSE_SUB_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_ROOT_CAUSE_SUB_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_ROOT_CAUSE_SUB_CATEGORY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_ROOT_CAUSE_SUB_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_ROOT_CAUSE_SUB_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_ROOT_CAUSE_SUB_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'internal-audit'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_ROOT_CAUSE_SUB_CATEGORY')){
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
            this._rootCauseSubCategoryService.generateTemplate();
            break;
          case "export_to_excel":
            this._rootCauseSubCategoryService.exportToExcel();
            break;
          case "search":
            RootCauseSubCategoryMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_root_cause_sub_category_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_root_cause_sub_category');
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
        this._rootCauseSubCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._rootCauseSubCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlAuditEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.rootCauseSubCategorySubscriptionEvent = this._eventEmitterService.rootCauseSubCategoryControl.subscribe(res => {
      this.closeFormModal();
    })

    // closing modal

    this.closingModalEvent= this._eventEmitterService.childModalCloseControl.subscribe(res=>{
      this.setModalstyle();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.rootCauseCategoryformModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.rootCauseCategoryformModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'overflow','auto');
      }
    })

    this.pageChange(1);

  }

  addNewItem(){
    this.rootCauseSubCategoryObject.type = 'Add';
    this.rootCauseSubCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }


  pageChange(newPage: number = null) {
    if (newPage) RootCauseSubCategoryMasterStore.setCurrentPage(newPage);
    this._rootCauseSubCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // for opening modal
  openFormModal() {

    setTimeout(() => {
      $(this.rootCauseCategoryformModal.nativeElement).modal('show');
    }, 50);
  }
  // for close modal
  closeFormModal() {
    $(this.rootCauseCategoryformModal.nativeElement).modal('hide');
    this.rootCauseSubCategoryObject.type = null;
  }

  setModalstyle(){
    setTimeout(() => {
    this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'z-index','999999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'overflow','auto');
    }, 50);
  }

  // for edit function

  getRootCauseSubCategory(id: number) {
    const rootCauseSubCategory: RootCauseSubCategory = RootCauseSubCategoryMasterStore.getRootCauseSubCategoryById(id);
    //set form value
    this.rootCauseSubCategoryObject.values = {
      id: rootCauseSubCategory.id,
      title: rootCauseSubCategory.title,
      root_cause_category_id: rootCauseSubCategory.root_cause_category_id
    }
    this.rootCauseSubCategoryObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteRootCauseSubCategory(status)
        break;

      case 'Activate': this.activateRootCauseSubCategory(status)
        break;

      case 'Deactivate': this.deactivateRootCauseSubCategory(status)
        break;

    }

  }


  // delete function call
  deleteRootCauseSubCategory(status: boolean) {

    if (status && this.popupObject.id) {

      this._rootCauseSubCategoryService.delete(this.popupObject.id).subscribe(resp => {
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


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

  // calling activcate function

  activateRootCauseSubCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._rootCauseSubCategoryService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateRootCauseSubCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._rootCauseSubCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Root Cause Sub Category?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Root Cause Sub Category?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Root Cause Sub Category?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    // RootCauseSubCategoryMasterStore.setCurrentPage(1);
    this._rootCauseSubCategoryService.sortRootCauseSubCategorylList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlAuditEventSubscription.unsubscribe();
    this.rootCauseSubCategorySubscriptionEvent.unsubscribe();
    this.closingModalEvent.unsubscribe();
    RootCauseSubCategoryMasterStore.searchText = '';
    RootCauseSubCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}

