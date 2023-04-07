import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { MsAuditCategorySingle } from 'src/app/core/models/masters/ms-audit-management/ms-audit-category';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditCategoryService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-category/ms-audit-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-category-store';
declare var $: any;

@Component({
  selector: 'app-ms-audit-category',
  templateUrl: './ms-audit-category.component.html',
  styleUrls: ['./ms-audit-category.component.scss']
})
export class MsAuditCategoryComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  SubMenuItemStore = SubMenuItemStore;
  MsAuditCategoryMasterStore = MsAuditCategoryMasterStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_event_type_message';

  msAuditCategoryObject = {
    component: 'Master',
    type: null,
    values: null
  }

   popupObject = {
    type: '',
    title: '',
    description: '',
    id: null,
    subtitle: ''
  };

  deleteEventSubscription: any;
  msAuditCategorySubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  
  constructor(
    private _msAuditCategoryService: MsAuditCategoryService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_ms_audit_category'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_AUDIT_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_MS_AUDIT_CATEGORY', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_MS_AUDIT_CATEGORY', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_MS_AUDIT_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_MS_AUDIT_CATEGORY', submenuItem: {type: 'share'}},
        // {activityName: 'IMPORT_MS_AUDIT_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'ms-audit-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_MS_AUDIT_CATEGORY')){
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
          // case "template":
          //   this._msAuditCategoryService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._msAuditCategoryService.exportToExcel();
            break;
            case "search":
              MsAuditCategoryMasterStore.searchText  = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "share":
              ShareItemStore.setTitle('share_event_engagement_strategy_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_event_engagement_strategy');
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
        this._msAuditCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._msAuditCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    this.msAuditCategorySubscriptionEvent = this._eventEmitterService.msAuditCategory.subscribe(res=>{
      this.closeFormModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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
    this.msAuditCategoryObject.type = 'Add';
    this.msAuditCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditCategoryMasterStore.setCurrentPage(newPage);
    this._msAuditCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal
// modal Control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteMsAuditCategory(status)
      break;

    case 'Activate': this.activateMsAuditCategory(status)
      break;

    case 'Deactivate': this.deactivateMsAuditCategory(status)
      break;

  }

}


 // delete function call
 deleteMsAuditCategory(status: boolean) {
  if (status && this.popupObject.id) {
    this._msAuditCategoryService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && MsAuditCategoryMasterStore.getMsAuditCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

}

// calling activcate function
activateMsAuditCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._msAuditCategoryService.activate(this.popupObject.id).subscribe(resp => {
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
deactivateMsAuditCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._msAuditCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
 
        this._utilityService.detectChanges(this._cdr);
      
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
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'activate_event_type';
  this.popupObject.subtitle = 'are_you_sure_activate';
  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_event_type';
  this.popupObject.subtitle = 'are_you_sure_deactivate';
  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  //event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'delete_event_type';
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
    this.msAuditCategoryObject.type = null;
  }

    
  getMsAuditCategory(id: number)  {
    this._msAuditCategoryService.getItem(id).subscribe(res=>{
        this.loadPopup();
        this._utilityService.detectChanges(this._cdr);
      })
      this._utilityService.detectChanges(this._cdr);
  }

  loadPopup()
  {
    MsAuditCategoryMasterStore.individualMsAuditCategoryId;
    this.msAuditCategoryObject.values = {
      id: MsAuditCategoryMasterStore.individualMsAuditCategoryId.id,
      title:MsAuditCategoryMasterStore.individualMsAuditCategoryId.title,
      description: MsAuditCategoryMasterStore.individualMsAuditCategoryId.description,
      languages: MsAuditCategoryMasterStore.individualMsAuditCategoryId.languages,       
    }
    this.msAuditCategoryObject.type = 'Edit';
    
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);

  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.msAuditCategorySubscriptionEvent.unsubscribe();
    MsAuditCategoryMasterStore.searchText = '';
    MsAuditCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

   // for sorting
 sortTitle(type: string) {
  this._msAuditCategoryService.sortMsAuditCategoryList(type, SubMenuItemStore.searchText);
  this.pageChange();
}
}
