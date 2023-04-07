import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AuditableItemTypeService } from 'src/app/core/services/masters/internal-audit/auditable-item-type/auditable-item-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditItemTypeMasterStore } from 'src/app/stores/masters/internal-audit/auditable-item-type';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auditable-item-type',
  templateUrl: './auditable-item-type.component.html',
  styleUrls: ['./auditable-item-type.component.scss']
})
export class AuditableItemTypeComponent implements OnInit ,  OnDestroy {
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;


  AuditItemtypeStore = AuditItemTypeMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_auditable_item_type_message';

  
  popupObject = {
    type: 'Activate',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlAuditEventSubscription: any;

  constructor(private _auditableItemTypesService: AuditableItemTypeService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'AUDITABLE_ITEM_TYPE_LIST', submenuItem: { type: 'search' }},
        // {activityName: 'GENERATE_AUDITABLE_ITEM_TYPE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDITABLE_ITEM_TYPE', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_AUDITABLE_ITEM_TYPE', submenuItem: {type: 'share'}},
        // {activityName: 'IMPORT_AUDITABLE_ITEM_TYPE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'internal-audit'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
        
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "template":
            this._auditableItemTypesService.generateTemplate();
            break;
          case "export_to_excel":
            this._auditableItemTypesService.exportToExcel();
            break;
          case "search":
            AuditItemTypeMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_auditable_item_type_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_auditable_item_type');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
   
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._auditableItemTypesService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._auditableItemTypesService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    // for activating/deactivating using delete modal
    this.popupControlAuditEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);
  }
  // page change event
  pageChange(newPage: number = null) {
    if (newPage) AuditItemTypeMasterStore.setCurrentPage(newPage);
    this._auditableItemTypesService.getAllItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // modal control event
  modalControl(status:boolean) {
    switch (this.popupObject.type) {
      case 'Activate':  this.activateAuditItemType(status)
        break;

      case 'Deactivate': this.deactivateAuditItemType(status)
        break;

    }

  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }


  // calling activcate function

  activateAuditItemType(status:boolean) {
    if (status && this.popupObject.id) {

      this._auditableItemTypesService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateAuditItemType(status:boolean) {
    if (status && this.popupObject.id) {

      this._auditableItemTypesService.deactivate(this.popupObject.id).subscribe(resp => {
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
  activate(id:number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Audit Item Type?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id:number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Audit Item Type?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  

  // for sorting
  sortTitle(type:string) {
    // AuditItemTypeMasterStore.setCurrentPage(1);
    this._auditableItemTypesService.sortAuditTypelList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlAuditEventSubscription.unsubscribe();
    AuditItemTypeMasterStore.searchText = '';
    AuditItemTypeMasterStore.currentPage = 1 ;
  }


}

