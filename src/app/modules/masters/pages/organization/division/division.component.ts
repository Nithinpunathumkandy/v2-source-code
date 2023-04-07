import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Division } from 'src/app/core/models/masters/organization/division';
import{DivisionMasterStore} from 'src/app/stores/masters/organization/division-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";
import { Router } from '@angular/router';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  DivisionMasterStore = DivisionMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  ShareItemStore = ShareItemStore;
  mailConfirmationData = 'share_division_message';

  divisionObject = {
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


  divisionSubscriptionEvent: any = null;
  popupControlOrganizationDivisionEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  constructor(  
    private _router:Router,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _divisionService: DivisionService) { }

  ngOnInit(): void {


    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_division'});
 this.reactionDisposer = autorun(() => {

  var subMenuItems = [
    {activityName: 'DIVISION_LIST', submenuItem: { type: 'search' }},
    {activityName: 'CREATE_DIVISION', submenuItem: {type: 'new_modal'}},
    {activityName: 'GENERATE_DIVISION_TEMPLATE', submenuItem: {type: 'template'}},
    {activityName: 'EXPORT_DIVISION', submenuItem: {type: 'export_to_excel'}},
    // {activityName: 'SHARE_DIVISION', submenuItem: {type: 'share'}},
    {activityName: 'IMPORT_DIVISION', submenuItem: {type: 'import'}},
    {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
  ]

  if(!AuthStore.getActivityPermission(1100,'CREATE_DIVISION')){
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
            this._divisionService.generateTemplate();
            break;
          case "export_to_excel":
            this._divisionService.exportToExcel();
            break;
          case "search":
              DivisionMasterStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
          case "share":
              ShareItemStore.setTitle('share_division_title');
              ShareItemStore.formErrors = {};
              break;
          case "import":
            ImportItemStore.setTitle('import_division');
            ImportItemStore.setImportFlag(true);
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
        this._divisionService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._divisionService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlOrganizationDivisionEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.divisionSubscriptionEvent = this._eventEmitterService.division.subscribe(res => {
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
    this.divisionObject.type = 'Add';
    this.divisionObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) DivisionMasterStore.setCurrentPage(newPage);
    this._divisionService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  goToDetials(id){
    this._router.navigateByUrl('masters/divisions/'+id);
  }
  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.divisionObject.type = null;
  }

  /**
   * Get particular competency group item
   * @param id  id of division
   */

  getDivision(id: number) {
    event.stopPropagation();
    this._divisionService.getItem(id).subscribe(res=>{
      if(DivisionMasterStore.individualLoaded){
        // DivisionMasterStore.individualDivisionId
        const division: Division = DivisionMasterStore.individualDivisionId;
        this.divisionObject.values = {
          id: division.id,
          title: division.title,
          organization_id: division.organization,
          head_id: division.head,
        }
        this.divisionObject.type = 'Edit';
        this.openFormModal();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteDivision(status)
      break;

    case 'Activate': this.activateDivision(status)
      break;

    case 'Deactivate': this.deactivateDivision(status)
      break;

  }

}


  // delete function call
  deleteDivision(status: boolean) {
    if (status && this.popupObject.id) {
      this._divisionService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && DivisionMasterStore.getDivisionById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

activateDivision(status: boolean) {
  if (status && this.popupObject.id) {

    this._divisionService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateDivision(status: boolean) {
  if (status && this.popupObject.id) {

    this._divisionService.deactivate(this.popupObject.id).subscribe(resp => {
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
  event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'Activate Division?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  event.stopPropagation();
  event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Division?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  event.stopPropagation();
  event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Division?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}


// for sorting
sortTitle(type: string) {
  // DivisionMasterStore.setCurrentPage(1);
  this._divisionService.sortDivisionlList(type, null);
  this.pageChange();
}


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.divisionSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationDivisionEventSubscription.unsubscribe();
    DivisionMasterStore.searchText = '';
    DivisionMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    DivisionMasterStore.loaded = false;
  }

}

