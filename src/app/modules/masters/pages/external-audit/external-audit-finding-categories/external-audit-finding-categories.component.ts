import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { AuditFindingCategoryMasterStore} from 'src/app/stores/masters/external-audit/audit-finding-categories-store';
import { AuditFindingCategory } from 'src/app/core/models/masters/external-audit/audit-finding-categories';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditFindingCategoriesService } from 'src/app/core/services/masters/external-audit/external-audit-finding-categories/audit-finding-categories.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-external-audit-finding-categories',
  templateUrl: './external-audit-finding-categories.component.html',
  styleUrls: ['./external-audit-finding-categories.component.scss']
})
export class ExternalAuditFindingCategoriesComponent implements OnInit , OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;


  AuditFindingCategoryStore = AuditFindingCategoryMasterStore;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_audit_finding_category_message';

  auditFindingCategoryObject = {
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


  auditFindingCategorySubscriptionEvent: any = null;
  popupControlAuditEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _auditFindingCategoryService: AuditFindingCategoriesService) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_finding_category'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EXTERNAL_AUDIT_FINDING_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_EXTERNAL_AUDIT_FINDING_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_EXTERNAL_AUDIT_FINDING_CATEGORY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_EXTERNAL_AUDIT_FINDING_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_EXTERNAL_AUDIT_FINDING_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_EXTERNAL_AUDIT_FINDING_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'external-audit'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_EXTERNAL_AUDIT_FINDING_CATEGORY')){
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
            this._auditFindingCategoryService.generateTemplate();
            break;
          case "export_to_excel":
            this._auditFindingCategoryService.exportToExcel();
            break;
          case "search":
            AuditFindingCategoryMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_audit_finding_category_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_audit_finding_category');
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
        this._auditFindingCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._auditFindingCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.auditFindingCategorySubscriptionEvent = this._eventEmitterService.externalFindingCategoryControl.subscribe(res => {
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
    this.auditFindingCategoryObject.type = 'Add';
    this.auditFindingCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) AuditFindingCategoryMasterStore.setCurrentPage(newPage);
    this._auditFindingCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // for opening modal
  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.auditFindingCategoryObject.type = null;
  }

  // for edit function

  getAuditFindingCategory(id: number) {
    const auditFindindCategory: AuditFindingCategory = AuditFindingCategoryMasterStore.getAuditFindingCategoryById(id);
    //set form value
    this.auditFindingCategoryObject.values = {
      id: auditFindindCategory.id,
      title: auditFindindCategory.title,
      description: auditFindindCategory.description,
      label:auditFindindCategory.label,
      color_code:auditFindindCategory.color_code,
    }
    this.auditFindingCategoryObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditFindingcategory(status)
        break;

      case 'Activate': this.activateAuditFindingcategory(status)
        break;

      case 'Deactivate': this.deactivateAuditFindingcategory(status)
        break;

    }

  }


  // delete function call
  deleteAuditFindingcategory(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditFindingCategoryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && this.AuditFindingCategoryStore.getAuditFindingCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateAuditFindingcategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditFindingCategoryService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateAuditFindingcategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditFindingCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Audit Finding Category?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Audit Finding Category?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Audit Finding Category?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for sorting
  sortTitle(type: string) {
    this._auditFindingCategoryService.sortAuditFindinglList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlAuditEventSubscription.unsubscribe();
    this.auditFindingCategorySubscriptionEvent.unsubscribe();
    AuditFindingCategoryMasterStore.searchText = '';
    AuditFindingCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
  
}

