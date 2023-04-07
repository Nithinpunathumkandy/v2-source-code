import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { FocusArea } from 'src/app/core/models/masters/strategy/focus-area.model';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentTypeService } from 'src/app/core/services/masters/incident-management/incident-type/incident-type.service';
import { FocusAreaService } from 'src/app/core/services/masters/strategy/focus-area/focus-area.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FocusAreaMasterStore } from 'src/app/stores/masters/strategy/focus-area-master-store';
declare var $: any;
@Component({
  selector: 'app-focus-area',
  templateUrl: './focus-area.component.html',
  styleUrls: ['./focus-area.component.scss']
})
export class FocusAreaComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  FocusAreaMasterStore = FocusAreaMasterStore
  AuthStore = AuthStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  focusAreaSubscriptionEvent: any;
  idleTimeoutSubscription: any;
  popupControlIncidentTypesEventSubscription: any;
  networkFailureSubscription: any;

  focusAreaObject = {
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
  constructor(private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _renderer2:Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _focusAreaService:FocusAreaService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_focus_area'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'FOCUS', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_FOCUS_AREA', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_FOCUS_AREA_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_FOCUS_AREA', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_FOCUS_AREA', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_FOCUS_AREA', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'strategy-management'}},
      ]

      if(!AuthStore.getActivityPermission(1100,'CREATE_FOCUS_AREA')){
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
            this._focusAreaService.generateTemplate();
            break;
          case "export_to_excel":
            this._focusAreaService.exportToExcel();
            break;
          case "search":
            FocusAreaMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_focus_area');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_focus_area');
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
        this._focusAreaService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._focusAreaService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
      this.popupControlIncidentTypesEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
  
      // for closing the modal
      this.focusAreaSubscriptionEvent = this._eventEmitterService.focusAreaModalControl.subscribe(res => {
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
  
      // FocusAreaMasterStore.setOrderBy('asc');
      this.pageChange(1);
  }

  addNewItem(){
    this.focusAreaObject.type = 'Add';
    this.focusAreaObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) FocusAreaMasterStore.setCurrentPage(newPage);
    this._focusAreaService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.focusAreaObject.type = null;
  }
  getFocusArea(id: number) {
    
    const focusArea: FocusArea = FocusAreaMasterStore.getFocusAreasById(id);
    //set form value
    let focusAreaPreviewUrl = this._focusAreaService.getThumbnailPreview('focus_area',focusArea.image_token);

    let focusAreaDetail = {
      name: focusArea.title, 
      title : focusArea.title,
      ext: focusArea.image_ext,
      size: focusArea.image_size,
      url: focusArea.image_url,
      thumbnail_url: focusArea.image_url,
      token: focusArea.image_token,
      preview: focusAreaPreviewUrl
      // id: focusArea.id,
  };
  this._focusAreaService.setDocumentDetails(focusAreaDetail,focusAreaPreviewUrl);
    let docmetData
    this.focusAreaObject.values = {
      id: focusArea.id,
      title: focusArea.title,
      description: focusArea.description,
      
    }
    this.focusAreaObject.type = 'Edit';
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);
  }
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteIncidentTypes(status)
        break;

      case 'Activate': this.activateIncidentTypes(status)
        break;

      case 'Deactivate': this.deactivateIncidentTypes(status)
        break;

    }

  }
  // delete function call
  deleteIncidentTypes(status: boolean) {
    if (status && this.popupObject.id) {
      this._focusAreaService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && FocusAreaMasterStore.getFocusAreasById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

 activateIncidentTypes(status: boolean) {
  if (status && this.popupObject.id) {

    this._focusAreaService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateIncidentTypes(status: boolean) {
  if (status && this.popupObject.id) {

    this._focusAreaService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate IncidentType?';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate IncidentType?';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete IncidentType?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  sortTitle(type: string) {
    // IncidentTypesMasterStore.setCurrentPage(1);
    this._focusAreaService.sortFocusAreaList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.focusAreaSubscriptionEvent.unsubscribe();
    this.popupControlIncidentTypesEventSubscription.unsubscribe();
    FocusAreaMasterStore.searchText = '';
    FocusAreaMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
 



}
