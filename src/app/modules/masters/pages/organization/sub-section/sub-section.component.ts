import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { SubSection } from 'src/app/core/models/masters/organization/sub-section';
import{SubSectionMasterStore} from 'src/app/stores/masters/organization/sub-section-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from "src/app/stores/general/no-data-item.store";
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sub-section',
  templateUrl: './sub-section.component.html',
  styleUrls: ['./sub-section.component.scss']
})
export class SubSectionComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubSectionMasterStore = SubSectionMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  NoDataItemStore = NoDataItemStore;
  mailConfirmationData = 'share_sub_section_message';

  subSectionObject = {
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


  subSectionSubscriptionEvent: any = null;
  popupControlOrganizationSubSectionEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _subSectionService: SubSectionService) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_sub_section'});
this.reactionDisposer = autorun(() => {

  var subMenuItems = [
    {activityName: 'SUB_SECTION_LIST', submenuItem: { type: 'search' }},
    {activityName: 'CREATE_SUB_SECTION', submenuItem: {type: 'new_modal'}},
    {activityName: 'GENERATE_SUB_SECTION_TEMPLATE', submenuItem: {type: 'template'}},
    {activityName: 'EXPORT_SUB_SECTION', submenuItem: {type: 'export_to_excel'}},
    // {activityName: 'SHARE_SUB_SECTION', submenuItem: {type: 'share'}},
    {activityName: 'IMPORT_STAKEHOLDER_TYPE', submenuItem: {type: 'import'}},
    {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
  ]
  if(!AuthStore.getActivityPermission(1100,'CREATE_SUB_SECTION')){
    NoDataItemStore.deleteObject('subtitle');
    NoDataItemStore.deleteObject('buttonText');
  }
  this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewSubSection();
            }, 1000);
            break;
          case "template":
            this._subSectionService.generateTemplate();
            break;
          case "export_to_excel":
            this._subSectionService.exportToExcel();
            break;
            case "search":
              SubSectionMasterStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
               break;
            case "share":
              ShareItemStore.setTitle('share_sub_section_title');
              ShareItemStore.formErrors = {};
              break; 
            case "import":
              ImportItemStore.setTitle('import_sub_section');
              ImportItemStore.setImportFlag(true);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewSubSection();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._subSectionService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._subSectionService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
      this.popupControlOrganizationSubSectionEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
  
      // for closing the modal
      this.subSectionSubscriptionEvent = this._eventEmitterService.subSectionControl.subscribe(res => {
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

  pageChange(newPage: number = null) {
    if (newPage) SubSectionMasterStore.setCurrentPage(newPage);
    this._subSectionService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addNewSubSection(){
    this.subSectionObject.type = 'Add';
    this.subSectionObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.subSectionObject.type = null;
  }

  /**
   * Get particular competency group item
   * @param id  id of department
   */

  getSubSection(id: number) {
    const subSection: SubSection = SubSectionMasterStore.getSubSectionById(id);
    //set form value
  this.subSectionObject.values = {
    id: subSection.id,
    title: subSection.title,
    organization_id: subSection.organization_id,
    section_id: subSection.section_id,
    division_id: subSection.division_id,
    department_id: subSection.department_id
  }
  this.subSectionObject.type = 'Edit';
  this.openFormModal();
  }

  
  // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteSubSection(status)
      break;

    case 'Activate': this.activateSubSection(status)
      break;

    case 'Deactivate': this.deactivateSubSection(status)
      break;

  }

}

// delete function call
deleteSubSection(status: boolean) {
  if (status && this.popupObject.id) {
    this._subSectionService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && SubSectionMasterStore.getSubSectionById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

activateSubSection(status: boolean) {
  if (status && this.popupObject.id) {

    this._subSectionService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateSubSection(status: boolean) {
  if (status && this.popupObject.id) {

    this._subSectionService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate Sub Section?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Sub Section?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Sub Section?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}


// for sorting by title
sortTitle(type: string) {
  // SubSectionMasterStore.setCurrentPage(1);
  this._subSectionService.sortSubSectionlList(type, null);
  this.pageChange();
}


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.subSectionSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationSubSectionEventSubscription.unsubscribe();
    SubSectionMasterStore.searchText = '';
    SubSectionMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}


