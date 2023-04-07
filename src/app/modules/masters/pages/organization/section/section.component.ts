import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Section, SectionDetails } from 'src/app/core/models/masters/organization/section';
import{SectionMasterStore} from 'src/app/stores/masters/organization/section-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SectionMasterStore = SectionMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_section_message';

  sectionObject = {
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


  sectionSubscriptionEvent: any = null;
  popupControlOrganizationSectionEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _sectionService: SectionService) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_section'});
    
    this.reactionDisposer = autorun(() => {

  var subMenuItems = [
    {activityName: 'SECTION_LIST', submenuItem: { type: 'search' }},
    {activityName: 'CREATE_SECTION', submenuItem: {type: 'new_modal'}},
    {activityName: 'GENERATE_SECTION_TEMPLATE', submenuItem: {type: 'template'}},
    {activityName: 'EXPORT_SECTION', submenuItem: {type: 'export_to_excel'}},
    // {activityName: 'SHARE_SECTION', submenuItem: {type: 'share'}},
    {activityName: 'IMPORT_Section', submenuItem: {type: 'import'}},
    {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
  ]
  if(!AuthStore.getActivityPermission(1100,'CREATE_SECTION')){
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
            this._sectionService.generateTemplate();
            break;
          case "export_to_excel":
            this._sectionService.exportToExcel();
            break;
            case "search":
              SectionMasterStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
               break;
            case "share":
              ShareItemStore.setTitle('share_section_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_section');
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
        this._sectionService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._sectionService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
      this.popupControlOrganizationSectionEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
  
      // for closing the modal
      this.sectionSubscriptionEvent = this._eventEmitterService.sectionControl.subscribe(res => {
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
    this.sectionObject.type = 'Add';
    this.sectionObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) SectionMasterStore.setCurrentPage(newPage);
    this._sectionService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.sectionObject.type = null;
  }

  /**
   * Get particular competency group item
   * @param id  id of department
   */

   getSection(id: number) {
    
    this._sectionService.getItem(id).subscribe(res=>{
      if(SectionMasterStore.individualLoaded){
        // DivisionMasterStore.individualDivisionId
        const section: SectionDetails = SectionMasterStore.individualSectionId;
        this.sectionObject.values = {
          id: section.id,
          title: section.title,
          organization_id: section.organization,
          division_id:  {id: SectionMasterStore.getSectionById(id).division_id, title: SectionMasterStore.getSectionById(id).division_title},
          department_id: section.department,
          head_id: section.head,
          code: section.code,
          color_code: section.color_code,
        }
        // let division =;
        this.sectionObject.type = 'Edit';
        this.openFormModal();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getSection(id: number) {
  //   const section: Section = SectionMasterStore.getSectionById(id);
  //   //set form value
  // this.sectionObject.values = {
  //   id: section.id,
  //   title: section.title,
  //   organization_id: section.organization_id,
  //   department_id: section.department_id,
  //   division_id: section.division_id,
  //   head_id: section.head_id,
  //   code: section.code,
  //   color_code: section.color_code
  // }
  // this.sectionObject.type = 'Edit';
  // this.openFormModal();
  // }

  
  // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteSection(status)
      break;

    case 'Activate': this.activateSection(status)
      break;

    case 'Deactivate': this.deactivateSection(status)
      break;

  }

}


  // delete function call
  deleteSection(status: boolean) {
    if (status && this.popupObject.id) {
      this._sectionService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && SectionMasterStore.getSectionById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

activateSection(status: boolean) {
  if (status && this.popupObject.id) {

    this._sectionService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateSection(status: boolean) {
  if (status && this.popupObject.id) {

    this._sectionService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate Section?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Section?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Section?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}


// for sorting
sortTitle(type: string) {
  // SectionMasterStore.setCurrentPage(1);
  this._sectionService.sortSectionlList(type, null);
  this.pageChange();
}
 

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.sectionSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationSectionEventSubscription.unsubscribe();
    SectionMasterStore.searchText = '';
    SectionMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}

