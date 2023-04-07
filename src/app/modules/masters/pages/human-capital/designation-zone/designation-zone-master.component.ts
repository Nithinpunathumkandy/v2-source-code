import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { DesignationZoneService } from 'src/app/core/services/masters/human-capital/designation-zone/designation-zone.service';
import { DesignationZone } from 'src/app/core/models/masters/human-capital/designation-zone';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DesignationZoneMasterStore } from 'src/app/stores/masters/human-capital/designation-zone-master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-designation-zone-master',
  templateUrl: './designation-zone-master.component.html',
  styleUrls: ['./designation-zone-master.component.scss']
})
export class DesignationZoneMasterComponent implements OnInit,OnDestroy {

  
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  DesignationZoneMasterStore = DesignationZoneMasterStore;
 SubMenuItemStore = SubMenuItemStore;
 AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_designation_zone_message';

 designationZoneObject = {
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


 designationZoneSubscriptionEvent: any = null;
 popupControlDesignationZoneEventSubscription: any;
 idleTimeoutSubscription: any;
 networkFailureSubscription: any;
  
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _designationZoneService: DesignationZoneService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new-designation_zone'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'DESIGNATION_ZONE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_DESIGNATION_ZONE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_DESIGNATION_ZONE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_DESIGNATION_ZONE', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_DESIGNATION_ZONE', submenuItem: { type: 'share'}},
        {activityName: 'IMPORT_DESIGNATION_ZONE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'human-capital'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_DESIGNATION_ZONE')){
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
            this._designationZoneService.generateTemplate();
            break;
          case "export_to_excel":
            this._designationZoneService.exportToExcel();
            break;
          case "search":
            DesignationZoneMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_designation_zone_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_designation_zone');
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
        this._designationZoneService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._designationZoneService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlDesignationZoneEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.designationZoneSubscriptionEvent = this._eventEmitterService.designationZoneControl.subscribe(res => {
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
    this.designationZoneObject.type = 'Add';
    this.designationZoneObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) DesignationZoneMasterStore.setCurrentPage(newPage);
    this._designationZoneService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.designationZoneObject.type = null;
  }

  
  /**
   * Get particular designation zone item
   * @param id  id of designation zone 
   */
  getDesignationZone(id: number) {
    const designationZone: DesignationZone = DesignationZoneMasterStore.getZoneById(id);
    //set form value
  this.designationZoneObject.values = {
    id: designationZone.id,
    title: designationZone.title
  }
  this.designationZoneObject.type = 'Edit';
  this.openFormModal();
  }


  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteDesignationZone(status)
        break;

      case 'Activate': this.activateDesignationZone(status)
        break;

      case 'Deactivate': this.deactivateDesignationZone(status)
        break;

    }

  }

   // delete function call
   deleteDesignationZone(status: boolean) {
    if (status && this.popupObject.id) {
      this._designationZoneService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && DesignationZoneMasterStore.getZoneById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
  
    activateDesignationZone(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._designationZoneService.activate(this.popupObject.id).subscribe(resp => {
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
  
    deactivateDesignationZone(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._designationZoneService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate  Designation Zone?';
      this.popupObject.subtitle = 'are_you_sure_activate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate  Designation Zone?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for delete
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'Delete  Designation Zone?';
      this.popupObject.subtitle = 'are_you_sure_delete';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

   // for sorting
   sortTitle(type: string) {
    // DesignationZoneMasterStore.setCurrentPage(1);
    this._designationZoneService.sortDesignationZoneList(type, null);
    this.pageChange();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.designationZoneSubscriptionEvent.unsubscribe();
    this.popupControlDesignationZoneEventSubscription.unsubscribe();
    DesignationZoneMasterStore.searchText = '';
    DesignationZoneMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

 


}
