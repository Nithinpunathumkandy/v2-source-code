import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { StrategyManagementReportList } from 'src/app/core/models/strategy-management/report.model';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { StrategyReportStore } from 'src/app/stores/strategy-management/strategy-report.store';

@Component({
  selector: 'app-strategy-report',
  templateUrl: './strategy-report.component.html',
  styleUrls: ['./strategy-report.component.scss']
})
export class StrategyReportComponent implements OnInit {
  initializeProfileList: any;
  StrategyReportStore = StrategyReportStore;
  reactionDisposer: IReactionDisposer;
  initializeFocusAreaList: any;
  initializeObjectiveList: StrategyManagementReportList[];
  initializeKpiList: StrategyManagementReportList[];
  initializeInitiativeList: StrategyManagementReportList[];
  initializeMilestoneList: StrategyManagementReportList[];
  initializeActionPlanList: StrategyManagementReportList[];



  constructor(private _router: Router,
		private _helperService: HelperServiceService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef, private _renderer2: Renderer2
    ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
			if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
				this.profileList();
        this.focusAreaList();
        this.objectiveList();
        this.kpiList();
        this.initiativeList();
        this.milestoneList();
        this.actionPlanList();
				this._utilityService.detectChanges(this._cdr);
			}
		})
  }

  profileList(): void {
		this.initializeProfileList = StrategyReportStore.StrategyManagementReportListArray.filter(function (i) {
			return i.reportType == 'profile';
		});

	}

  focusAreaList(): void {
		this.initializeFocusAreaList = StrategyReportStore.StrategyManagementReportListArray.filter(function (i) {
			return i.reportType == 'focus_area';
		});
	}

  objectiveList(): void {
    this.initializeObjectiveList = StrategyReportStore.StrategyManagementReportListArray.filter(function (i) {
      return i.reportType == 'objective';
    });
  }

  kpiList(): void {
    this.initializeKpiList = StrategyReportStore.StrategyManagementReportListArray.filter(function (i) {
      return i.reportType == 'kpi';
    });
  }

  initiativeList(): void {
    this.initializeInitiativeList = StrategyReportStore.StrategyManagementReportListArray.filter(function (i) {
      return i.reportType == 'initiative';
    });
  }

  milestoneList(): void {
    this.initializeMilestoneList = StrategyReportStore.StrategyManagementReportListArray.filter(function (i) {
      return i.reportType == 'milestone';
    });
  }

  actionPlanList():void {
    this.initializeActionPlanList = StrategyReportStore.StrategyManagementReportListArray.filter(function (i) {
      return i.reportType == 'action_plan';
    });
  }

  getReport(obj) {
		StrategyReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('strategy-management/report/' + obj.type);
	}

  

	ngOnDestroy(){
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
	}
}
