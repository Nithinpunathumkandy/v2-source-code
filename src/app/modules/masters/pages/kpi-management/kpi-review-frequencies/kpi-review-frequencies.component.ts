import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ReviewFrequencies } from 'src/app/core/models/masters/kpi-management/kpi-review-frequencies';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiReviewFrequenciesService } from 'src/app/core/services/masters/kpi-management/kpi-review-frequencies/kpi-review-frequencies.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiReviewFrequenciesStore } from 'src/app/stores/masters/kpi-management/kpi-review-frequencies-store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-kpi-review-frequencies',
  templateUrl: './kpi-review-frequencies.component.html',
  styleUrls: ['./kpi-review-frequencies.component.scss']
})
export class KpiReviewFrequenciesComponent implements OnInit, OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  KpiReviewFrequenciesStore = KpiReviewFrequenciesStore;
  
  mailConfirmationData = 'share_kpi_review_frequency_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  
  popupKpiEventSubscription: any;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _kpiReviewFrequenciesService: KpiReviewFrequenciesService,
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KPI_REVIEW_FREQUENCY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_KPI_REVIEW_FREQUENCY', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'kpi-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
        
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._kpiReviewFrequenciesService.exportToExcel();
                break;
                case "search":
                  KpiReviewFrequenciesStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
              default:
                break;
            }
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })
         // for deleting/activating/deactivating using delete modal
      this.popupKpiEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) KpiReviewFrequenciesStore.setCurrentPage(newPage);
    this._kpiReviewFrequenciesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_kpi_review_frequency';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_kpi_review_frequency';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateKpiStatus(status)
        break;
      case 'Deactivate': this.deactivateKpiStatus(status)
        break;
    }
  }

   // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  activateKpiStatus(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._kpiReviewFrequenciesService.activate(this.popupObject.id)
      .subscribe(resp => { setTimeout(() => {
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

  deactivateKpiStatus(status: boolean) {
  if (status && this.popupObject.id) {
    this._kpiReviewFrequenciesService.deactivate(this.popupObject.id)
    .subscribe(resp => { setTimeout(() => {
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

  sortTitle(type: string) {
    this._kpiReviewFrequenciesService.sortList(type, null);
    this.pageChange();
  }

  getKpiReviewFrequency(id: number) {
    const KpiReviewFrequency: ReviewFrequencies = KpiReviewFrequenciesStore.geReviewFrequenciesById(id);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupKpiEventSubscription.unsubscribe();
    KpiReviewFrequenciesStore.searchText = '';
    KpiReviewFrequenciesStore.currentPage = 1 ;
  }

}
