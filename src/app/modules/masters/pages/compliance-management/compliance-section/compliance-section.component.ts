import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ComplianceSection } from 'src/app/core/models/masters/compliance-management/compliance-section';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ComplianceSectionService } from 'src/app/core/services/masters/compliance-management/compliance-section/compliance-section.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ComplianceSectionMasterStore } from 'src/app/stores/masters/compliance-management/compliance-section-store';

declare var $: any;
@Component({
  selector: 'app-compliance-section',
  templateUrl: './compliance-section.component.html',
  styleUrls: ['./compliance-section.component.scss']
})
export class ComplianceSectionComponent implements OnInit , OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  ComplianceSectionMasterStore = ComplianceSectionMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_compliance_section_message';

  complianceSectionObject = {
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


  complianceSectionSubscriptionEvent: any = null;
  popupControlComplianceSectionEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _complianceSectionService: ComplianceSectionService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_compliance_section'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'COMPLIANCE_SECTION_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_COMPLIANCE_SECTION', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_COMPLIANCE_SECTION', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_COMPLIANCE_SECTION', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_COMPLIANCE_SECTION', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_COMPLIANCE_SECTION', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'compliance-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_COMPLIANCE_SECTION')){
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
            this._complianceSectionService.generateTemplate();
            break;
          case "export_to_excel":
            this._complianceSectionService.exportToExcel();
            break;
          case "search":
            ComplianceSectionMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_compliance_section_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_compliance_section');
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
        this._complianceSectionService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._complianceSectionService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlComplianceSectionEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.complianceSectionSubscriptionEvent = this._eventEmitterService.complianceSectionControl.subscribe(res => {
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

  //for adding new details

  addNewItem(){
    this.complianceSectionObject.type = 'Add';
    this.complianceSectionObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) ComplianceSectionMasterStore.setCurrentPage(newPage);
    this._complianceSectionService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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
    this.complianceSectionObject.type = null;
  }

// for edit function

getComplianceSection(id: number) {
  const complianceSection: ComplianceSection = ComplianceSectionMasterStore.getComplianceSectionById(id);
  //set form value
  this.complianceSectionObject.values = {
    id: complianceSection.id,
    title: complianceSection.title,
    description: complianceSection.description
  }
  this.complianceSectionObject.type = 'Edit';
  this.openFormModal();
}

// modal control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteComplianceSection(status)
      break;

    case 'Activate': this.activateComplianceSection(status)
      break;

    case 'Deactivate': this.deactivateComplianceSection(status)
      break;

  }

}


// delete function call
deleteComplianceSection(status: boolean) {
  if (status && this.popupObject.id) {
    this._complianceSectionService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && ComplianceSectionMasterStore.getComplianceSectionById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

activateComplianceSection(status: boolean) {
  if (status && this.popupObject.id) {

    this._complianceSectionService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateComplianceSection(status: boolean) {
  if (status && this.popupObject.id) {

    this._complianceSectionService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate Compliance Section?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Compliance Section?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Compliance Section?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}

  // for sorting
  sortTitle(type: string) {
    // DocumentTypeMasterStore.setCurrentPage(1);
    this._complianceSectionService.sortComplianceSectionList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.complianceSectionSubscriptionEvent.unsubscribe();
    this.popupControlComplianceSectionEventSubscription.unsubscribe();
    ComplianceSectionMasterStore.searchText = '';
    ComplianceSectionMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
