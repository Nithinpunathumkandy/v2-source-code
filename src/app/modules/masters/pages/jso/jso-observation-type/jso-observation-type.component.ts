import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { JsoObservationType } from 'src/app/core/models/masters/jso/jso-observation-type';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { JsoObservationTypeService } from 'src/app/core/services/masters/jso/jso-observation-type/jso-observation-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { JsoObservationTypeMasterStore } from 'src/app/stores/masters/jso/jso-observation-type-store';

declare var $: any;
@Component({
  selector: 'app-jso-observation-type',
  templateUrl: './jso-observation-type.component.html',
  styleUrls: ['./jso-observation-type.component.scss']
})
export class JsoObservationTypeComponent implements OnInit , OnDestroy{

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  JsoObservationTypeMasterStore = JsoObservationTypeMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_jso_observation_type_message';

  jsoObservationTypeObject = {
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


  jsoObservationTypeSubscriptionEvent: any = null;
  popupjsoObservationTypeEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor(

    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _jsoObservationTypeService: JsoObservationTypeService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2 ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_jso_observation_type'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'JSO_OBSERVATION_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_JSO_OBSERVATION_TYPE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_JSO_OBSERVATION_TYPE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_JSO_OBSERVATION_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_JSO_OBSERVATION_TYPE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_JSO_OBSERVATION_TYPE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'jso'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_JSO_OBSERVATION_TYPE')){
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
            this._jsoObservationTypeService.generateTemplate();
            break;
          case "export_to_excel":
            this._jsoObservationTypeService.exportToExcel();
            break;
          case "search":
            JsoObservationTypeMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_jso_observation_type_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_jso_observation_type');
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
        this._jsoObservationTypeService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._jsoObservationTypeService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupjsoObservationTypeEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.jsoObservationTypeSubscriptionEvent = this._eventEmitterService.jsoObservationType.subscribe(res => {
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
    // JsoObservationTypeMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }
  addNewItem(){
    this.jsoObservationTypeObject.type = 'Add';
    this.jsoObservationTypeObject.values = null; // for clearing the value
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
  this.jsoObservationTypeObject.type = null;
}

// for edit function

getJsoObservationType(id: number) {
  const jsoObservationType: JsoObservationType = JsoObservationTypeMasterStore.getJsoObservationTypeById(id);
  //set form value
  this.jsoObservationTypeObject.values = {
    id: jsoObservationType.id,
    title: jsoObservationType.title,
    description: jsoObservationType.description
  }
  this.jsoObservationTypeObject.type = 'Edit';
  this.openFormModal();
}

// modal control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteJsoObservationType(status)
      break;

    case 'Activate': this.activateJsoObservationType(status)
      break;

    case 'Deactivate': this.deactivateJsoObservationType(status)
      break;

  }

}


// delete function call
deleteJsoObservationType(status: boolean) {
  if (status && this.popupObject.id) {
    this._jsoObservationTypeService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && this.JsoObservationTypeMasterStore.getJsoObservationTypeById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

activateJsoObservationType(status: boolean) {
  if (status && this.popupObject.id) {

    this._jsoObservationTypeService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateJsoObservationType(status: boolean) {
  if (status && this.popupObject.id) {

    this._jsoObservationTypeService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate Jso Observation Type?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Jso Observation Type?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Jso Observation Type?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}

  pageChange(newPage: number = null) {
    if (newPage) JsoObservationTypeMasterStore.setCurrentPage(newPage);
    this._jsoObservationTypeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  
  sortTitle(type: string) {
    this._jsoObservationTypeService.sortJsoObservationTypeList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.jsoObservationTypeSubscriptionEvent.unsubscribe();
    this.popupjsoObservationTypeEventSubscription.unsubscribe();
    JsoObservationTypeMasterStore.searchText = '';
    JsoObservationTypeMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  
    }
}
