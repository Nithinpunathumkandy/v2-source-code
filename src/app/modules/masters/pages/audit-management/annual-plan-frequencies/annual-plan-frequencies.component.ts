import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AnnualPlanFrequencyService } from 'src/app/core/services/masters/audit-management/annual-plan-frequency/annual-plan-frequency.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AnnualPlanFrequencyMasterStore } from 'src/app/stores/masters/audit-management/annual-plan-frequency-store';

declare var $: any;

@Component({
  selector: 'app-annual-plan-frequencies',
  templateUrl: './annual-plan-frequencies.component.html',
  styleUrls: ['./annual-plan-frequencies.component.scss']
})
export class AnnualPlanFrequenciesComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  AnnualPlanFrequencyMasterStore = AnnualPlanFrequencyMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription:any

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _annualPlanFrequencyService: AnnualPlanFrequencyService,
    private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'AM_ANNUAL_PLAN_FREQUENCY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_AM_ANNUAL_PLAN_FREQUENCY', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'audit-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._annualPlanFrequencyService.exportToExcel();
                break;
              case "search":
                AnnualPlanFrequencyMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
          
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })  
        
        // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) AnnualPlanFrequencyMasterStore.setCurrentPage(newPage);
    this._annualPlanFrequencyService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  } 

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'Activate': this.activateAnnualPlanFrequency(status)
          break;
  
        case 'Deactivate': this.deactivateAnnualPlanFrequency(status)
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
      // this.popupObject.title = '';
      // this.popupObject.subtitle = '';
      // this.popupObject.type = '';
  
    }
  
    // calling activcate function
  
    activateAnnualPlanFrequency(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._annualPlanFrequencyService.activate(this.popupObject.id).subscribe(resp => {
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
  
    deactivateAnnualPlanFrequency(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._annualPlanFrequencyService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate Annual Plan Frequency?';
      this.popupObject.subtitle = 'are_you_sure_activate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      // event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Annual Plan Frequency?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

  sortTitle(type: string) {
    this._annualPlanFrequencyService.sortAnnualPlanFrequencyList(type, null);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AnnualPlanFrequencyMasterStore.searchText = '';
    AnnualPlanFrequencyMasterStore.currentPage = 1 ;
    this.popupControlEventSubscription.unsubscribe();
  }

}
