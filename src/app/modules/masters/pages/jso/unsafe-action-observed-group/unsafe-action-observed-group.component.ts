import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { JsoUnsafeActionObservedGroup } from 'src/app/core/models/masters/jso/unsafe-action-observed-group';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UnsafeActionObservedGroupService } from 'src/app/core/services/masters/jso/unsafe-action-observed-group/unsafe-action-observed-group.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { JsoUnsafeActionObservedGroupMasterStore } from 'src/app/stores/masters/jso/unsafe-action-observed-group-store';

declare var $: any;
@Component({
  selector: 'app-unsafe-action-observed-group',
  templateUrl: './unsafe-action-observed-group.component.html',
  styleUrls: ['./unsafe-action-observed-group.component.scss']
})
export class UnsafeActionObservedGroupComponent implements OnInit , OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  JsoUnsafeActionObservedGroupMasterStore = JsoUnsafeActionObservedGroupMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_unsafe_action_observed_group_message';

  jsoUnsafeActionObservedGroupObject = {
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

  jsoUnsafeActionObservedGroupSubscriptionEvent: any = null;
  popupjsoUnsafeActionObservedGroupEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(

    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _jsoUnsafeActionObservedGroupService: UnsafeActionObservedGroupService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2 ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_unsafe_action_observed_group'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'UNSAFE_ACTION_OBSERVED_GROUP_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_UNSAFE_ACTION_OBSERVED_GROUP', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_UNSAFE_ACTION_OBSERVED_GROUP', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_UNSAFE_ACTION_OBSERVED_GROUP', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_UNSAFE_ACTION_OBSERVED_GROUP', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_UNSAFE_ACTION_OBSERVED_GROUP', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'jso'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_UNSAFE_ACTION_OBSERVED_GROUP')){
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
            this._jsoUnsafeActionObservedGroupService.generateTemplate();
            break;
          case "export_to_excel":
            this._jsoUnsafeActionObservedGroupService.exportToExcel();
            break;
          case "search":
            JsoUnsafeActionObservedGroupMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_unsafe_action_observed_group_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_unsafe_action_observed_group');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._jsoUnsafeActionObservedGroupService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._jsoUnsafeActionObservedGroupService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupjsoUnsafeActionObservedGroupEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.jsoUnsafeActionObservedGroupSubscriptionEvent = this._eventEmitterService.jsoUnsafeActionObservedGroup.subscribe(res => {
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
    // JsoUnsafeActionObservedGroupMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }

  addNewItem(){
    this.jsoUnsafeActionObservedGroupObject.type = 'Add';
    this.jsoUnsafeActionObservedGroupObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
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
  this.jsoUnsafeActionObservedGroupObject.type = null;
}
// for edit function

getJsoUnsafeActionObservedGroup(id: number) {
  const jsoUnsafeActionObservedGroup: JsoUnsafeActionObservedGroup = JsoUnsafeActionObservedGroupMasterStore.getJsoUnsafeActionObservedGroupById(id);
  //set form value
  this.jsoUnsafeActionObservedGroupObject.values = {
    id: jsoUnsafeActionObservedGroup.id,
    title: jsoUnsafeActionObservedGroup.title,
    description: jsoUnsafeActionObservedGroup.description
  }
  this.jsoUnsafeActionObservedGroupObject.type = 'Edit';
  this.openFormModal();
}

// modal control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteJsoUnsafeActionObservedGroup(status)
      break;

    case 'Activate': this.activateJsoUnsafeActionObservedGroup(status)
      break;

    case 'Deactivate': this.deactivateJsoUnsafeActionObservedGroup(status)
      break;

  }

}


// delete function call
deleteJsoUnsafeActionObservedGroup(status: boolean) {
  if (status && this.popupObject.id) {
    this._jsoUnsafeActionObservedGroupService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && this.JsoUnsafeActionObservedGroupMasterStore.getJsoUnsafeActionObservedGroupById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

activateJsoUnsafeActionObservedGroup(status: boolean) {
  if (status && this.popupObject.id) {

    this._jsoUnsafeActionObservedGroupService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateJsoUnsafeActionObservedGroup(status: boolean) {
  if (status && this.popupObject.id) {

    this._jsoUnsafeActionObservedGroupService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate Unsafe Action Observed Group?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Unsafe Action Observed Group?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Unsafe Action Observed Group?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}

pageChange(newPage: number = null) {
  if (newPage) JsoUnsafeActionObservedGroupMasterStore.setCurrentPage(newPage);
  this._jsoUnsafeActionObservedGroupService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
}

sortTitle(type: string) {
  this._jsoUnsafeActionObservedGroupService.sortUnsafeActionObservedGrouplList(type, SubMenuItemStore.searchText);
  this.pageChange();
}
ngOnDestroy() {
  // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  this.jsoUnsafeActionObservedGroupSubscriptionEvent.unsubscribe();
  this.popupjsoUnsafeActionObservedGroupEventSubscription.unsubscribe();
  JsoUnsafeActionObservedGroupMasterStore.searchText = '';
  JsoUnsafeActionObservedGroupMasterStore.currentPage = 1 ;
  this.idleTimeoutSubscription.unsubscribe();
  this.networkFailureSubscription.unsubscribe();

  }
}
