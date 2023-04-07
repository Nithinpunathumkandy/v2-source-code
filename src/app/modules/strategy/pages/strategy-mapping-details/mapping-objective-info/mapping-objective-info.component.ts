import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;

@Component({
  selector: 'app-mapping-objective-info',
  templateUrl: './mapping-objective-info.component.html',
  styleUrls: ['./mapping-objective-info.component.scss']
})
export class MappingObjectiveInfoComponent implements OnInit {

  @ViewChild('strategyKpiDetailsModal') strategyKpiDetailsModal: ElementRef;

  AuthStore = AuthStore;
  AppStore = AppStore;
  StrategyMappingStore = StrategyMappingStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  kpiDetailsObject = {
    type: null,
    value: null
  };

  strategyEmptyList: string = 'strategy_mapping_nodata_title';
  strategyKpiDetailsModalEventSubscription: any;
  constructor(private _service: StrategyService,private _renderer2: Renderer2,
    private _utilityService: UtilityService,private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: '/strategy-management/strategy-mappings/'+StrategyStore._strategyProfileId}
    ]);
    this.strategyKpiDetailsModalEventSubscription = this._eventEmitterService.strategyKpiDetailsModal.subscribe(item => {
      this.closeStrategyKpiDetailsModal();
    })
  }

  getPopupDetails(user, created_at?) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.created_by_first_name ? user.created_by_first_name : '';
      userDetailObject['last_name'] = user.last_name ? user.last_name : user.created_by_last_name ? user.created_by_last_name : '';
      userDetailObject['designation'] = user.designation_title ? user.designation_title : user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      userDetailObject['created_at'] = created_at;
      return userDetailObject;
    }
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
    // this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);
    // $(this.strategyKpiDetailsModal.nativeElement).modal('show');
  }

  closeStrategyKpiDetailsModal() {
    this.kpiDetailsObject.type = null;
    // $(this.strategyKpiDetailsModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.strategyKpiDetailsModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }
  getNoDataSource(type,message){
    let noDataSource = {
      noData:message, border: false, imageAlign: type
    }
    return noDataSource;
  }
}
