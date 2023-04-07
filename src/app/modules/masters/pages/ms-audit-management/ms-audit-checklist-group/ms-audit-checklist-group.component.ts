import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditChecklistGroupService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-cheklist-group/ms-audit-cheklist-group.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditChecklistGroup } from 'src/app/core/models/masters/ms-audit-management/ms-audit-checklist-group';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditChecklistGroupMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-checklist-group-store';

declare var $: any;

@Component({
  selector: 'app-ms-audit-checklist-group',
  templateUrl: './ms-audit-checklist-group.component.html',
  styleUrls: ['./ms-audit-checklist-group.component.scss']
})
export class MsAuditChecklistGroupComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  //change 'share_supplier_message' to 'share_bpm_supplier_message'
  mailConfirmationData = 'share_ms_audit-cheklist_group_message';


  AuditChecklistGroupMasterStore = AuditChecklistGroupMasterStore


  cheklistGroupObject = {
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

  controlCheklistgroupSubscriptionEvent: any = null;
  popupControlCheklistgroupEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  constructor(
    private _auditChecklistGroupService: AuditChecklistGroupService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_ms_audit_checklist_group' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'CHECKLIST_GROUP_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_CHECKLIST_GROUP', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_CHECKLIST_GROUP', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_CHECKLIST_GROUP', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_CHECKLIST_GROUP', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_CHECKLIST_GROUP', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'ms-audit-management' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_CHECKLIST_GROUP')) {
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
            this._auditChecklistGroupService.generateTemplate();
            break;
          case "export_to_excel":
            this._auditChecklistGroupService.exportToExcel();
            break;
          case "search":
            AuditChecklistGroupMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.search_business_application_type(SubMenuItemStore.searchText);
            break;
          case "share":
            ShareItemStore.setTitle('share_ms_audit_checklist_group');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_ms_audit_checklist_group');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._auditChecklistGroupService.shareData(ShareItemStore.shareData).subscribe(res => {
          ShareItemStore.unsetShareData();
          ShareItemStore.setTitle('');
          ShareItemStore.unsetData();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            $(this.mailConfirmationPopup.nativeElement).modal('show');
          }, 200);
        }, (error) => {
          if (error.status == 422) {
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();
          console.log(error);
        });
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._auditChecklistGroupService.importData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        }, (error) => {
          if (error.status == 422) {
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if (error.status == 500 || error.status == 403) {
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }

    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlCheklistgroupEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.controlCheklistgroupSubscriptionEvent = this._eventEmitterService.msAuditCheklistGroup.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })
    this.pageChange(1);
  }



  addNewItem() {
    this.cheklistGroupObject.type = 'Add';
    this.cheklistGroupObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal(){
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
    $(this.formModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }
  closeFormModal(){
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
    $('.modal-backdrop').remove();
    this.cheklistGroupObject.type = null;
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditChecklistGroupMasterStore.setCurrentPage(newPage);
    this._auditChecklistGroupService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  
    getAuditChecklistGroup(id: number)  {
      this._auditChecklistGroupService.getItem(id).subscribe(res=>{
        this.cheklistGroupObject.values=
        { 
          id:res.id,
          title:res.title,
        }      
        this.cheklistGroupObject.type = 'Edit';
        this.openFormModal();
        })
        this._utilityService.detectChanges(this._cdr);
    }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditChecklistGroup(status)
        break;

      case 'Activate': this.activateAuditChecklistGroup(status)
        break;

      case 'Deactivate': this.deactivateAuditChecklistGroup(status)
        break;
    }
  }

  // delete function call

  deleteAuditChecklistGroup(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditChecklistGroupService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && AuditChecklistGroupMasterStore.getAuditChecklistGroupById(this.popupObject.id).status_id == AppStore.activeStatusId) {
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else {
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
  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // for popup object clearing

  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function

  activateAuditChecklistGroup(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditChecklistGroupService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateAuditChecklistGroup(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditChecklistGroupService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate cheklist group?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate

  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate cheklist group?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete

  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete cheklist group?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting

  sortTitle(type: string) {
    //
    this._auditChecklistGroupService.sortSuppliersList(type, null);
    this.pageChange();
  }

  // Sub-Menu Search

  searchBusinessApplicationTypes(term: string) {
    this._auditChecklistGroupService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlCheklistgroupSubscriptionEvent.unsubscribe();
    this.popupControlCheklistgroupEventSubscription.unsubscribe();
    AuditChecklistGroupMasterStore.searchText = '';
    AuditChecklistGroupMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }


}

