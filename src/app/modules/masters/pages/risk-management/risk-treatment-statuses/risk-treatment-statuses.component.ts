import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {RiskTreatmentStatusesMasterStore} from 'src/app/stores/masters/risk-management/risk-treatment-statuses-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskTreatmentStatusesService } from 'src/app/core/services/masters/risk-management/risk-treatment-statuses/risk-treatment-statuses.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';


declare var $: any;

@Component({
  selector: 'app-risk-treatment-statuses',
  templateUrl: './risk-treatment-statuses.component.html',
  styleUrls: ['./risk-treatment-statuses.component.scss']
})
export class RiskTreatmentStatusesComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  RiskTreatmentStatusesMasterStore = RiskTreatmentStatusesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore=AppStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _riskTreatmentStatusesService: RiskTreatmentStatusesService
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_TREATMENT_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

    if (SubMenuItemStore.clikedSubMenuItem) {
    
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "search":
          RiskTreatmentStatusesMasterStore.searchText = SubMenuItemStore.searchText;
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

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {

    if (newPage) RiskTreatmentStatusesMasterStore.setCurrentPage(newPage);
    this._riskTreatmentStatusesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    //RiskTypeMasterStore.setCurrentPage(1);
    this._riskTreatmentStatusesService.sortRiskTreatmentStatusesList(type, null);
    this.pageChange();
  } 

}
