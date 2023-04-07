import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { AmAuditDocumentTypes, AmAuditSingle } from 'src/app/core/models/masters/audit-management/am-audit-document-types';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmAuditDocumentTypesService } from 'src/app/core/services/masters/audit-management/am-audit-document-types/am-audit-document-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AmAuditDocumentTypesMasterStore } from 'src/app/stores/masters/audit-management/am-audit-document-types-store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
declare var $: any;
@Component({
  selector: 'app-am-audit-document-types',
  templateUrl: './am-audit-document-types.component.html',
  styleUrls: ['./am-audit-document-types.component.scss']
})
export class AmAuditDocumentTypesComponent implements OnInit,OnDestroy {
 
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AmAuditDocumentTypesMasterStore = AmAuditDocumentTypesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_am_doc_type_message';

  auditDocumentObject = {
    component: 'Master',
    values: null,
    type: null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  auditDocumentSubscriptionEvent: any = null;
  popupauditDocumentEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _auditDocumentTypeService: AmAuditDocumentTypesService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }


  ngOnInit(): void {
    
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_document_type'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'AM_AUDIT_DOCUMENT_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_AM_AUDIT_DOCUMENT_TYPE', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_AM_AUDIT_DOCUMENT_TYPES', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'audit-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AM_AUDIT_DOCUMENT_TYPE')){
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
            this._auditDocumentTypeService.exportToExcel();
            break;
          case "search":
            AmAuditDocumentTypesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_document_type_title');
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
        this._auditDocumentTypeService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._auditDocumentTypeService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          //ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            //ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })
    // for deleting/activating/deactivating using delete modal
    this.popupauditDocumentEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.auditDocumentSubscriptionEvent = this._eventEmitterService.amDodumentTypeModel.subscribe(res => {
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
    this.auditDocumentObject.type = 'Add';
    this.auditDocumentObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) AmAuditDocumentTypesMasterStore.setCurrentPage(newPage);
    this._auditDocumentTypeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.auditDocumentObject.type = null;
  }

    /**
   * Get particular user document type item
   * @param id  id of user document type 
   */
         
    getAmAudit(id: number)  {

      this._auditDocumentTypeService.getItem(id).subscribe(res=>{
        if(res){
        this.auditDocumentObject.values = {
          id: res.id,
          languages: res.languages,      
        }
      }
        
  
        this.auditDocumentObject.type = 'Edit';
        this.openFormModal();
          this._utilityService.detectChanges(this._cdr);
        })
    }
  


  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteUserDocumetType(status)
        break;

      case 'Activate': this.activateUserDocumetType(status)
        break;

      case 'Deactivate': this.deactivateUserDocumetType(status)
        break;
    }
  }
    // delete function call
    deleteUserDocumetType(status: boolean) {
      if (status && this.popupObject.id) {
        this._auditDocumentTypeService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        },(error=>{
          if(error.status == 405 && AmAuditDocumentTypesMasterStore.getDocumentTypeById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
  
    }
  
    // calling activcate function
    activateUserDocumetType(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._auditDocumentTypeService.activate(this.popupObject.id).subscribe(resp => {
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
    deactivateUserDocumetType(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._auditDocumentTypeService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate Audit Document Type?';
      this.popupObject.subtitle = 'are_you_sure_activate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      // event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Audit Document Type?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for delete
    delete(id: number) {
      // event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'Delete Audit Document Type?';
      this.popupObject.subtitle = 'are_you_sure_delete';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

    
   // for sorting
   sortTitle(type: string) {
    // UserDocumentTypeMasterStore.setCurrentPage(1);
   this._auditDocumentTypeService.sortAuditDocumentList(type, null);
   this.pageChange();
  }


  //ngOnDestroy
  ngOnDestroy() {
     // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.auditDocumentSubscriptionEvent.unsubscribe();
      this.popupauditDocumentEventSubscription.unsubscribe();
      AmAuditDocumentTypesMasterStore.searchText = '';
      AmAuditDocumentTypesMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();

  }
    
}
