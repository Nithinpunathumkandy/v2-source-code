import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyMappingService } from 'src/app/core/services/strategy-management/mapping/strategy-mapping.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyProfileMappingStore } from 'src/app/stores/strategy-management/strategy-profile-mapping-store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';

@Component({
  selector: 'app-strategy-mapping-popup',
  templateUrl: './strategy-mapping-popup.component.html',
  styleUrls: ['./strategy-mapping-popup.component.scss']
})
export class StrategyMappingPopupComponent implements OnInit {
  // @Input('source') strategyMappingSource: any;
  strategyEmptyList : string = 'common_nodata_title';
   selectedSection = 'process';
   chooseButtonTitle = 'Map ' +this.selectedSection +' with strategy';

   StrategyStore = StrategyStore;
  ProcessStore = ProcessStore;
  MappingStore = MappingStore;
  StrategyProfileMappingStore = StrategyProfileMappingStore;
  OrganizationModulesStore = OrganizationModulesStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  NoDataItemStore = NoDataItemStore;
  AppStore = AppStore;
  BusinessProductsStore = BusinessProductsStore;
  BusinessProjectsStore = BusinessProjectsStore;
  BusinessServiceStore = BusinessServiceStore;
  IssueListStore = IssueListStore;
  AssetRegisterStore = AssetRegisterStore;
  TrainingsStore = TrainingsStore;
  AuditFindingsStore = AuditFindingsStore;

  selectedFocusAreaId: any;
  selectedObjectiveIndex = null; 
  AuthStore = AuthStore;

  audit_findings = [];
  processes = [];
  documents= [];
  risks= [];
  services= [];
  issues = [];
  products= [];

  constructor(private _strategyMappingService: StrategyMappingService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService : HelperServiceService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.getStrategyProfileMapping();
    this.gotoSection(this.selectedSection);
      if (NoDataItemStore.clikedNoDataItem) {
        // this.openSelectPopup();
        NoDataItemStore.unSetClickedNoDataItem();
      }
  }

  getStrategyProfileMapping() {
    this._strategyMappingService.getItems().subscribe(res => {
      this.setValues(res);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getArrayProcessed(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }
  
  checkRiskType(department) {
    if (typeof department === 'object') {
      let e;
      e = this._helperService.getArrayProcessed(department, 'is_external').toString();
      if (e === "1") {
        return "External";
      }
      let i = this._helperService.getArrayProcessed(department, 'is_internal').toString();
      if (i === "1") {
        return "Internal"
      }
      else {
        return "External,Internal"
      }
    }
    else {
      return department;
    }
  }

  setValues(ProfileMapping) {
    IssueListStore.selectedIssuesList = [];
    ProcessStore.selectedProcessesList = [];
    BusinessProductsStore.selectedProductList = [];
    BusinessServiceStore.selectedBusinessServicesList = [];

    StrategyProfileMappingStore.assets = [];
    StrategyProfileMappingStore.products = [];
    StrategyProfileMappingStore.trainings = [];
    this.issues = [];
    this.processes = [];
    this.services = [];
    this.audit_findings = [];
    this.risks = [];
    this.documents = [];

    this.processes = ProfileMapping.processes;
    this.issues = ProfileMapping.issues;
    StrategyProfileMappingStore.assets = ProfileMapping.assets;
    StrategyProfileMappingStore.trainings = ProfileMapping.trainings;
    this.services = ProfileMapping.services;
    StrategyProfileMappingStore.products = ProfileMapping.products;
    this.documents = ProfileMapping.documents;
    this.risks = ProfileMapping.risks;
    this.audit_findings = ProfileMapping.audit_findings;

    this._utilityService.detectChanges(this._cdr);
  }

  gotoSection(type) {
    this.selectedSection = type;
    this.chooseButtonTitle = 'Map ' +this.selectedSection +' with strategy';
    switch (type) {
      case 'issue':       
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", });   
        break;

      case 'training':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", });
        break;

      case 'service':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping",  });
        break;

      case 'process':
          NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", });
        break;

      case 'asset': 
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", }); 
        break;

      case 'product':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping",  });
        break;

      case 'risk':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping" });
        break;

      case 'audit_finding': 
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping" }); 
        break;

      case 'document':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping" });
        break;
    }
  } 

  cancel(){
    this._eventEmitterService.dismissMappingPopup();
  }
}
