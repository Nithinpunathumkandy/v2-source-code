import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MaturityMatrixPlanStatusService } from 'src/app/core/services/masters/event-monitoring/maturity-matrix-paln-status/maturity-matrix-plan-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';
import { MaturityMatrixPlanStatusMasterStore } from 'src/app/stores/masters/event-monitoring/maturity-matrix-plan-status-store';

declare var $: any;

@Component({
  selector: 'app-maturity-matrix-plan-statuses',
  templateUrl: './maturity-matrix-plan-statuses.component.html',
  styleUrls: ['./maturity-matrix-plan-statuses.component.scss']
})
export class MaturityMatrixPlanStatusesComponent implements OnInit {
  
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  MaturityMatrixPlanStatusMasterStore = MaturityMatrixPlanStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_maturity_matrix_plan_statuses_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  deleteEventSubscription: any;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _maturityMatrixPlanStatusService: MaturityMatrixPlanStatusService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,

  ) { }

  ngOnInit(): void {
        // This will run whenever the store observable or computed which are used in this function changes.
        NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
        this.reactionDisposer = autorun(() => {

          var subMenuItems = [
            {activityName: 'EVENT_MATURITY_MATRIX_PLAN_STATUS_LIST', submenuItem: { type: 'search' }},
            {activityName: 'EXPORT_EVENT_MATURITY_MATRIX_PLAN_STATUS', submenuItem: {type: 'export_to_excel'}},
            {activityName: null, submenuItem: {type: 'close', path: 'event-monitoring'}},
          ]
          this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._maturityMatrixPlanStatusService.exportToExcel();
                break;
                case "search":
                  MaturityMatrixPlanStatusMasterStore.searchText  = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          
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



  pageChange(newPage: number = null) {
    if (newPage) MaturityMatrixPlanStatusMasterStore.setCurrentPage(newPage);
    this._maturityMatrixPlanStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

 // modal Control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case 'Activate': this.activateMaturityMatrixPlanStatus(status)
      break;

    case 'Deactivate': this.deactivateMaturityMatrixPlanStatus(status)
      break;

  }
}

activateMaturityMatrixPlanStatus(status: boolean) {
  if (status && this.popupObject.id) {

    this._maturityMatrixPlanStatusService.activate(this.popupObject.id).subscribe(resp => {
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
deactivateMaturityMatrixPlanStatus(status: boolean) {
  if (status && this.popupObject.id) {
    this._maturityMatrixPlanStatusService.deactivate(this.popupObject.id).subscribe(resp => {
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

closeConfirmationPopUp(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

// for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;
}


// for activate 
activate(id: number) {
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'activate_maturity_matrix_plan_statuses';
  this.popupObject.subtitle = 'common_activate_subtitle';
  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_maturity_matrix_plan_statuses';
  this.popupObject.subtitle = 'common_deactivate_subtitle';
  $(this.confirmationPopUp.nativeElement).modal('show');
}

sortTitle(type: string) {
  this._maturityMatrixPlanStatusService.sortMaturityMatrixPlanStatusList(type, SubMenuItemStore.searchText);
  this.pageChange();
}

ngOnDestroy() {
  // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  this.deleteEventSubscription.unsubscribe();
  MaturityMatrixPlanStatusMasterStore.searchText = '';
  MasterListDocumentStore.currentPage = 1 ;
  this.idleTimeoutSubscription.unsubscribe();
  this.networkFailureSubscription.unsubscribe();
}
}