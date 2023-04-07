import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-strategy-mapping-objective-detail-popup',
  templateUrl: './strategy-mapping-objective-detail-popup.component.html',
  styleUrls: ['./strategy-mapping-objective-detail-popup.component.scss']
})
export class StrategyMappingObjectiveDetailPopupComponent implements OnInit {

  @Input('source') strategyAreaSource: any;
  @ViewChild('strategyKpiDetailsModal') strategyKpiDetailsModal: ElementRef;

  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;

  kpiDetailsObject = {
    type: null,
    value: null
  };

  strategyKpiDetailsModalEventSubscription: any;
  readonly kpiEmptyList: string = 'kpi_nodata_title'
  
  constructor(private _eventEmitterService:EventEmitterService,private _service: StrategyService,private _renderer2: Renderer2,
    private _utilityService: UtilityService,private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    StrategyMappingStore.setProfileId(this.strategyAreaSource.profileId);
    StrategyStore.setObjectiveId(this.strategyAreaSource.objectiveId);
    this.strategyKpiDetailsModalEventSubscription = this._eventEmitterService.strategyKpiDetailsModal.subscribe(item => {
      this.closeStrategyKpiDetailsModal();
    })    
  }

  cancel(){
    this._eventEmitterService.dismissStrategyMappingObjectPopup();
  }

  openStrategyKpiDetailsModal(id) {
    if (id) {
      this._service.induvalKpi(id).subscribe(res => {
        this.kpiDetailsObject.value = res;
        this.openStrategyKpiDetails()
      })
    }
  }

  openStrategyKpiDetails() {
    this.kpiDetailsObject.type = 'Add';
    this._renderer2.addClass(this.strategyKpiDetailsModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);
  }

  closeStrategyKpiDetailsModal() {
    this.kpiDetailsObject.type = null;
    this._renderer2.removeClass(this.strategyKpiDetailsModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

}
