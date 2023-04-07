import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { RiskImpactAreaSingle } from 'src/app/core/models/masters/event-monitoring/event-risk-impact-areas';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventRiskImpactAreaService } from 'src/app/core/services/masters/event-monitoring/event-risk-impact-area/event-risk-impact-area.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RiskImpactAreaMasterStore } from 'src/app/stores/masters/event-monitoring/event-risk-impact-areas-store';

declare var $: any;

@Component({
  selector: 'app-event-risk-impact-areas',
  templateUrl: './event-risk-impact-areas.component.html',
  styleUrls: ['./event-risk-impact-areas.component.scss']
})
export class EventRiskImpactAreasComponent implements OnInit, OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  SubMenuItemStore = SubMenuItemStore;
  RiskImpactAreaMasterStore = RiskImpactAreaMasterStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_event_risk_impact_area_message';

  riskImpactAreaObject = {
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
  eventRiskImpactAreaSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _eventRiskImpactAreaService: EventRiskImpactAreaService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_risk_impact_area'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_IMPACT_AREA_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_RISK_IMPACT_AREA', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_RISK_IMPACT_AREA', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_RISK_IMPACT_AREA', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_IMPACT_AREA', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_RISK_IMPACT_AREA', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'event-monitoring'}},
      ]
      if(!AuthStore.getActivityPermission(100,'GENERATE_RISK_IMPACT_AREA')){
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
            this._eventRiskImpactAreaService.generateTemplate();
            break;
          case "export_to_excel":
            this._eventRiskImpactAreaService.exportToExcel();
            break;
            case "search":
              RiskImpactAreaMasterStore.searchText  = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "share":
              ShareItemStore.setTitle('share_checklist_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_checklist');
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
        this._eventRiskImpactAreaService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._eventRiskImpactAreaService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    this.eventRiskImpactAreaSubscriptionEvent = this._eventEmitterService.riskImpactArea.subscribe(res=>{
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
    this.riskImpactAreaObject.type = 'Add';
    this.riskImpactAreaObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) RiskImpactAreaMasterStore.setCurrentPage(newPage);
    this._eventRiskImpactAreaService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal
// modal Control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteChecklist(status)
      break;

    case 'Activate': this.activateChecklist(status)
      break;

    case 'Deactivate': this.deactivateChecklist(status)
      break;

  }

}


 // delete function call
 deleteChecklist(status: boolean) {
  if (status && this.popupObject.id) {
    this._eventRiskImpactAreaService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && RiskImpactAreaMasterStore.getRiskImpactAreaById(this.popupObject.id).status_id == AppStore.activeStatusId){
        let id = this.popupObject.id;
        this.closeConfirmationPopUp();
        this.clearPopupObject();
        setTimeout(() => {
          //this.deactivate(id);
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
}

// calling activcate function

activateChecklist(status: boolean) {
  if (status && this.popupObject.id) {

    this._eventRiskImpactAreaService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateChecklist(status: boolean) {
  if (status && this.popupObject.id) {

    this._eventRiskImpactAreaService.deactivate(this.popupObject.id).subscribe(resp => {
 
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
  this.popupObject.title = 'activate_checklist';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_checklist';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'delete_checklist';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.riskImpactAreaObject.type = null;
  }


  
  
    
  getRiskImpactArea(id: number)  {
    this._eventRiskImpactAreaService.getItem(id).subscribe(res=>{
        this.loadPopup();
        this._utilityService.detectChanges(this._cdr);
      })

  }


  loadPopup()
  {
   
    const checklistSingle: RiskImpactAreaSingle = RiskImpactAreaMasterStore.individualEventTypeId;
      
    this.riskImpactAreaObject.values = {
      id:checklistSingle.id,
      languages:checklistSingle.languages,
            
    }
   
    this.riskImpactAreaObject.type = 'Edit';
    this.openFormModal();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.eventRiskImpactAreaSubscriptionEvent.unsubscribe();
    RiskImpactAreaMasterStore.searchText = '';
    RiskImpactAreaMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

   // for sorting
 sortTitle(type: string) {
  this._eventRiskImpactAreaService.sortRiskImpactAreaList(type, SubMenuItemStore.searchText);
  this.pageChange();
}
}