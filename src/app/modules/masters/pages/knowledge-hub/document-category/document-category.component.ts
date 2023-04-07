import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import {DocumentCategoryMasterStore} from 'src/app/stores/masters/knowledge-hub/document-category-store';
import { DocumentCategory } from 'src/app/core/models/masters/knowledge-hub/document-category';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentCategoryService } from 'src/app/core/services/masters/knowledge-hub/document-category/document-category.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-document-category',
  templateUrl: './document-category.component.html',
  styleUrls: ['./document-category.component.scss']
})
export class DocumentCategoryComponent implements OnInit , OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  DocumentCategoryMasterStore = DocumentCategoryMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_document_category_message';

  documentCategoryObject = {
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


  documentCategorySubscriptionEvent: any = null;
  popupControlDocumentCategoryEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor( private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _documentCategoryService: DocumentCategoryService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_document_category'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'DOCUMENT_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_DOCUMENT_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_DOCUMENT_CATEGORY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_DOCUMENT_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_DOCUMENT_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_DOCUMENT_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'knowledge-hub'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_DOCUMENT_CATEGORY')){
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
            this._documentCategoryService.generateTemplate();
            break;
          case "export_to_excel":
            this._documentCategoryService.exportToExcel();
            break;
          case "search":
            DocumentCategoryMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_document_category_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_document_category');
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
        this._documentCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._documentCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlDocumentCategoryEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.documentCategorySubscriptionEvent = this._eventEmitterService.documentCategoryControl.subscribe(res => {
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
    this.documentCategoryObject.type = 'Add';
    this.documentCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) DocumentCategoryMasterStore.setCurrentPage(newPage);
    this._documentCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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
    this.documentCategoryObject.type = null;
  }
  
  // for edit function

  getDocumentCategory(id: number) {
    const documentCategory: DocumentCategory = DocumentCategoryMasterStore.getDocumentCategoriesById(id);
    //set form value
    this.documentCategoryObject.values = {
      id: documentCategory.id,
      title: documentCategory.title,
      description: documentCategory.description
    }
    this.documentCategoryObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteDocumentCategory(status)
        break;

      case 'Activate': this.activateDocumentCategory(status)
        break;

      case 'Deactivate': this.deactivateDocumentCategory(status)
        break;

    }

  }


  // delete function call
  deleteDocumentCategory(status: boolean) {
    if (status && this.popupObject.id) {
      this._documentCategoryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && DocumentCategoryMasterStore.getDocumentCategoriesById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateDocumentCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._documentCategoryService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateDocumentCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._documentCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Document Category?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Document Category?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Document Category?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    // DocumentCategoryMasterStore.setCurrentPage(1);
    this._documentCategoryService.sortDocumentCategorylList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.documentCategorySubscriptionEvent.unsubscribe();
    this.popupControlDocumentCategoryEventSubscription.unsubscribe();
    DocumentCategoryMasterStore.searchText = '';
    DocumentCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
