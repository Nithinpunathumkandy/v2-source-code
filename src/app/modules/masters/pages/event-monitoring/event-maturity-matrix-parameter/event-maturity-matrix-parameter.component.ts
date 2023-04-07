import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { EventMaturityMatrixParameterSingle } from 'src/app/core/models/masters/event-monitoring/event-maturity-matrix-parameter';
import { EventMaturityMatrixParameterService } from 'src/app/core/services/masters/event-monitoring/event-maturity-matrix-parameter/event-maturity-matrix-parameter.service';
import { EventMaturityMatrixParameterMasterStore }from 'src/app/stores/masters/event-monitoring/event-maturity-matrix-parameter-store'

declare var $: any;
@Component({
  selector: 'app-event-maturity-matrix-parameter',
  templateUrl: './event-maturity-matrix-parameter.component.html',
  styleUrls: ['./event-maturity-matrix-parameter.component.scss']
})
export class EventMaturityMatrixParameterComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  EventMaturityMatrixParameterMasterStore = EventMaturityMatrixParameterMasterStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_maturity_matrix_parameter_message';

  projectMatrixParameterObject = {
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
  maturityMatrixParamterSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor(
    private _eventMaturityMatrixParameterService: EventMaturityMatrixParameterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_maturity_matrix_parameter'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EVENT_MATURITY_MATRIX_PARAMETER_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_EVENT_MATURITY_MATRIX_PARAMETER', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_PROJECT_KPI', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_EVENT_MATURITY_MATRIX_PARAMETER', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_PROJECT_KPI', submenuItem: {type: 'share'}},
        // {activityName: 'IMPORT_PROJECT_KPI', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'event-monitoring'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_EVENT_MATURITY_MATRIX_PARAMETER')){
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
            this._eventMaturityMatrixParameterService.generateTemplate();
            break;
          case "export_to_excel":
            this._eventMaturityMatrixParameterService.exportToExcel();
            break;
            case "search":
              EventMaturityMatrixParameterMasterStore.searchText  = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "share":
              ShareItemStore.setTitle('share_event_maturity_matrix_parameter_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_maturity_matrix_parameter');
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
        this._eventMaturityMatrixParameterService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._eventMaturityMatrixParameterService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    this.maturityMatrixParamterSubscriptionEvent = this._eventEmitterService.eventMaturityMatrixParameter.subscribe(res=>{
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
    this.projectMatrixParameterObject.type = 'Add';
    this.projectMatrixParameterObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) EventMaturityMatrixParameterMasterStore.setCurrentPage(newPage);
    this._eventMaturityMatrixParameterService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal
// modal Control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteProjectKpi(status)
      break;

    case 'Activate': this.activateMaturityMatrix(status)
      break;

    case 'Deactivate': this.deactivateMaturityMatrix(status)
      break;

  }

}


 // delete function call
 deleteProjectKpi(status: boolean) {
  if (status && this.popupObject.id) {
    this._eventMaturityMatrixParameterService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && EventMaturityMatrixParameterMasterStore.getEventMaturityMatrixParameterById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

activateMaturityMatrix(status: boolean) {
  if (status && this.popupObject.id) {

    this._eventMaturityMatrixParameterService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateMaturityMatrix(status: boolean) {
  if (status && this.popupObject.id) {

    this._eventMaturityMatrixParameterService.deactivate(this.popupObject.id).subscribe(resp => {
 
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
 // event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'activate_maturity_matrix';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
//event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_maturity_matrix';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  //event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'delete_project_kpi';
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
    this.projectMatrixParameterObject.type = null;
  }


  
  
    
  getMaturityMatrix(id: number)  {
    this._eventMaturityMatrixParameterService.getItem(id).subscribe(res=>{

        this.loadPopup();
        this._utilityService.detectChanges(this._cdr);
      })
      
  
  }


  loadPopup()
  {
   
    const eventMaturityParamSingle: EventMaturityMatrixParameterSingle = EventMaturityMatrixParameterMasterStore.individualEventMaturityMatrixParameterId;
      
    this.projectMatrixParameterObject.values = {
      id: eventMaturityParamSingle.id,
      event_maturity_matrix_type:eventMaturityParamSingle.event_maturity_matrix_type,
      event_maturity_matrix_range:eventMaturityParamSingle.event_maturity_matrix_range,
      languages: eventMaturityParamSingle.languages,
            
    }
   
    this.projectMatrixParameterObject.type = 'Edit';
    this.openFormModal();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.maturityMatrixParamterSubscriptionEvent.unsubscribe();
    EventMaturityMatrixParameterMasterStore.searchText = '';
    EventMaturityMatrixParameterMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

   // for sorting
 sortTitle(type: string) {
  // ProjectKpiMasterStore.setCurrentPage(1);
  this._eventMaturityMatrixParameterService.sortEventMaturityMatrixParameterList(type, SubMenuItemStore.searchText);
  this.pageChange();
}
}
