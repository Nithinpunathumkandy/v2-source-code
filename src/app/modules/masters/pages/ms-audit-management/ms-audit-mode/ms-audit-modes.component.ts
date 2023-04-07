import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RSA_NO_PADDING } from 'constants';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditModesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-modes/ms-audit-modes.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditModesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-modes-store';
declare var $: any;

@Component({
  selector: 'app-ms-audit-modes',
  templateUrl: './ms-audit-modes.component.html',
  styleUrls: ['./ms-audit-modes.component.scss']
})
export class MsAuditModesComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  SubMenuItemStore = SubMenuItemStore;
  MsAuditModesMasterStore = MsAuditModesMasterStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_event_type_message';

  msAuditModeObject = {
    component: 'Master',
    type: null,
    values: null
  }

   popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  deleteEventSubscription: any;
  msAuditModeSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  
  constructor(
    private _msAuditModesService: MsAuditModesService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_AUDIT_MODES_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_MS_AUDIT_MODE', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'ms-audit-management'}},
      ]

      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._msAuditModesService.exportToExcel();
            break;
            case "search":
              MsAuditModesMasterStore.searchText  = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "share":
              ShareItemStore.setTitle('share_event_engagement_strategy_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_event_engagement_strategy');
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
    })

    this.msAuditModeSubscriptionEvent = this._eventEmitterService.amAuditMode.subscribe(res=>{
      this.closeFormModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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
    this.msAuditModeObject.type = 'Add';
    this.msAuditModeObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditModesMasterStore.setCurrentPage(newPage);
    this._msAuditModesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal
// modal Control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {

    case 'Activate': this.activateMsAuditCategory(status)
      break;

    case 'Deactivate': this.deactivateMsAuditCategory(status)
      break;

  }

}

closeConfirmationPopUp(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

// for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;

}

// calling activcate function
activateMsAuditCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._msAuditModesService.activate(this.popupObject.id).subscribe(resp => {
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
deactivateMsAuditCategory(status: boolean) {
  if (status && this.popupObject.id) {
    this._msAuditModesService.deactivate(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
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
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'activate_am_audit_mode';
  this.popupObject.subtitle = 'are_you_sure_activate';
  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_am_audit_mode';
  this.popupObject.subtitle = 'are_you_sure_deactivate';
  $(this.confirmationPopUp.nativeElement).modal('show');
}

//opnenModel
openFormModal(){
  this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
  $(this.formModal.nativeElement).modal('show');
  this._utilityService.detectChanges(this._cdr);
}

//CloseModel
  closeFormModal(){
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
    $('.modal-backdrop').remove();
    this.msAuditModeObject.type = null;
  }

    
  getMsAuditMode(id: number)  {
    this._msAuditModesService.getItem(id).subscribe(res=>{
      this.msAuditModeObject.values=
      { 
        id:res.id,
        color_code:res.color_code,
        label:res.label,
        type:res.type,
      }
      this.loadPopup();
      })
      this._utilityService.detectChanges(this._cdr);
  }

  loadPopup()
  {
    this.msAuditModeObject.type = 'Edit';
    this.openFormModal();
  }


  sortTitle(type: string) {
    //
    this._msAuditModesService.sortAuditModeList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.msAuditModeSubscriptionEvent.unsubscribe();
    MsAuditModesMasterStore.searchText = '';
    MsAuditModesMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
