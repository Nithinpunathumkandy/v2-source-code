import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { AuditableItem, AuditableItemPaginationResponse } from 'src/app/core/models/masters/internal-audit/auditable-item';
import { AuditableItemMasterStore } from 'src/app/stores/masters/internal-audit/auditable-item-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditableItemService } from 'src/app/core/services/masters/internal-audit/auditable-item/auditable-item.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auditable-item',
  templateUrl: './auditable-item.component.html',
  styleUrls: ['./auditable-item.component.scss']
})
export class AuditableItemComponent implements OnInit , OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  AuditableItemMasterStore = AuditableItemMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  mailConfirmationData = 'share_auditable_item_message';

  auditableItemObject = {
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


  auditableItemSubscriptionEvent: any = null;
  popupControlAuditableEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor( private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _renderer2: Renderer2,
    private _internalAuditFileService: InternalAuditFileService,
    private _helperService: HelperServiceService,
    private _auditableItemService: AuditableItemService) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_controlcategory_button'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_AUDITABLE_ITEM', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_AUDITABLE_ITEM_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_AUDITABLE_ITEM', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_AUDITABLE_ITEM', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'internal-audit'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_AUDITABLE_ITEM')){
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
            this._auditableItemService.generateTemplate();
            break;
          case "export_to_excel":
            this._auditableItemService.exportToExcel();
            break;
          case "search":
            AuditableItemMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange();
            break;
          case "share":
            ShareItemStore.setTitle('share_auditable_item_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_auditable_item');
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
        this._auditableItemService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._auditableItemService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.auditableItemSubscriptionEvent = this._eventEmitterService.auditableItemControl.subscribe(res => {
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
    this.auditableItemObject.type = 'Add';
    this.auditableItemObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditableItemMasterStore.setCurrentPage(newPage);
    this._auditableItemService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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
    this.auditableItemObject.type = null;
  }

  getValues(arrayObject:any[]){
   var returnArrayObject = [];
    for(let i of arrayObject){
      returnArrayObject.push(i.id);
    }
    return returnArrayObject;
    
  }

  // for edit function

  getAuditableItem(id:number){
    this.AuditableItemMasterStore.clearDocumentDetails();
    this._auditableItemService.getItem(id).subscribe(res=>{
     
      if(AuditableItemMasterStore.individualLoaded){

        const auditableItem: AuditableItem = AuditableItemMasterStore.individualAuditItem;

      //set form value
      if (auditableItem.documents && auditableItem.documents.length > 0) {
        for (let i of auditableItem.documents) {
          let docurl = this._internalAuditFileService.getThumbnailPreview('auditable-item', i.token);
          let docDetails = {
            created_at: i.created_at,
            created_by: i.created_by,
            updated_at: i.updated_at,
            updated_by: i.updated_by,
            name: i.title,
            ext: i.ext,
            size: i.size,
            url: i.url,
            thumbnail_url: i.url,
            token: i.token,
            preview: docurl,
            id: i.id

          };
          this._auditableItemService.setDocumentDetails(docDetails,docurl);
        }

      }
      
        //set form value
    this.auditableItemObject.values = {
      id: auditableItem.id,
      auditable_item_category_id: auditableItem.auditable_item_category.id,
      description: auditableItem.description,
      title: auditableItem.title,
      auditable_item_type_id:auditableItem.auditable_item_type.id,
      risk_rating_id:auditableItem.risk_rating.id,

      control_ids:this.getValues(auditableItem.auditable_item_controls),

      checklist_ids: this.getValues(auditableItem.auditable_item_checklists),

      department_ids: this.getValues(auditableItem.auditable_item_departments),

      division_ids: this.getValues(auditableItem.auditable_item_divisions),

      ms_type_organization_ids: this.getValues(auditableItem.auditable_item_ms_type_organizations),


      organization_ids: this.getValues(auditableItem.auditable_item_organizations),


      section_ids: this.getValues(auditableItem.auditable_item_sections),


      sub_section_ids: this.getValues(auditableItem.auditable_item_sub_sections),
      documents: ''
  }
    this.auditableItemObject.type = 'Edit';
    this.openFormModal();
    }
    this._utilityService.detectChanges(this._cdr);
  })
  
}

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditableItem(status)
        break;

      case 'Activate': this.activateAuditableItem(status)
        break;

      case 'Deactivate': this.deactivateAuditableItem(status)
        break;

    }

  }


  // delete function call
  deleteAuditableItem(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditableItemService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
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

  activateAuditableItem(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditableItemService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateAuditableItem(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditableItemService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Auditable Item?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Auditable Item?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Auditable Item?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    AuditableItemMasterStore.setCurrentPage(1);
    this._auditableItemService.sortAuditableItemlList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlAuditableEventSubscription.unsubscribe();
    this.auditableItemSubscriptionEvent.unsubscribe();
    AuditableItemMasterStore.searchText = '';
    AuditableItemMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();

  }

}

