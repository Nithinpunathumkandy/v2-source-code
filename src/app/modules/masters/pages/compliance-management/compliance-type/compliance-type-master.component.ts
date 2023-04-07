import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { ComplianceTypeService } from 'src/app/core/services/masters/compliance-management/compliance-type/compliance-type.service';
import { IReactionDisposer, autorun } from 'mobx';
import { ComplianceTypeMasterStore } from 'src/app/stores/masters/compliance-management/compliance-type-master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ComplianceType } from 'src/app/core/models/masters/compliance-management/compliance-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-compliance-type-master',
  templateUrl: './compliance-type-master.component.html',
  styleUrls: ['./compliance-type-master.component.scss']
})
export class ComplianceTypeMasterComponent implements OnInit, OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  ComplianceTypeMasterStore = ComplianceTypeMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_compliance_type_message';

  complainceTypeObject = {
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


  controlComplianceTypeSubscriptionEvent: any = null;
  popupControlOrganizationTypeEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _complianceTypeService: ComplianceTypeService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_compliance_type'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'COMPLIANCE_DOCUMENT_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_COMPLIANCE_DOCUMENT_TYPE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_COMPLIANCE_DOCUMENT_TYPE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_COMPLIANCE_DOCUMENT_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_COMPLIANCE_DOCUMENT_TYPE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_COMPLIANCE_DOCUMENT_TYPE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'compliance-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_COMPLIANCE_DOCUMENT_TYPE')){
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
            this._complianceTypeService.generateTemplate();
            break;
          case "export_to_excel":
            this._complianceTypeService.exportToExcel();
            break;
            case "search":
              ComplianceTypeMasterStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
              // this.searchComplainceType(SubMenuItemStore.searchText);
               break;
            case "share":
              ShareItemStore.setTitle('share_compliance_type_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_compliance_type');
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
        this._complianceTypeService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._complianceTypeService .importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
      this.popupControlOrganizationTypeEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
  
      // for closing the modal
      this.controlComplianceTypeSubscriptionEvent = this._eventEmitterService.organizationComplianceType.subscribe(res => {
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
    this.complainceTypeObject.type = 'Add';
    this.complainceTypeObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) ComplianceTypeMasterStore.setCurrentPage(newPage);
    this._complianceTypeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.complainceTypeObject.type = null;
  }

  /**
   * Get particular competency group item
   * @param id  id of compliance type
   */

  getComplianceType(id: number) {
    const complianceType: ComplianceType = ComplianceTypeMasterStore.getComplianceById(id);
    //set form value
  this.complainceTypeObject.values = {
    id: complianceType.id,
    title: complianceType.title,
    description: complianceType.description
  }
  this.complainceTypeObject.type = 'Edit';
  this.openFormModal();
  }

  
  // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteComplainceType(status)
      break;

    case 'Activate': this.activateComplainceType(status)
      break;

    case 'Deactivate': this.deactivateComplainceType(status)
      break;

  }

}



  // delete function call
  deleteComplainceType(status: boolean) {
    if (status && this.popupObject.id) {
      this._complianceTypeService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && ComplianceTypeMasterStore.getComplianceById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

activateComplainceType(status: boolean) {
  if (status && this.popupObject.id) {

    this._complianceTypeService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateComplainceType(status: boolean) {
  if (status && this.popupObject.id) {

    this._complianceTypeService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate Compliance Type?';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Compliance Type?';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Compliance Type?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}


// for sorting
sortTitle(type: string) {
  // ComplianceTypeMasterStore.setCurrentPage(1);
  this._complianceTypeService.sortComplaniceTypelList(type, null);
  this.pageChange();
}
 // Sub-Menu Search 
 searchComplainceType(term: string) {
  this._complianceTypeService.getItems(false, `&q=${term}`).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlComplianceTypeSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationTypeEventSubscription.unsubscribe();
    ComplianceTypeMasterStore.searchText = '';
    ComplianceTypeMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

  

  
}
