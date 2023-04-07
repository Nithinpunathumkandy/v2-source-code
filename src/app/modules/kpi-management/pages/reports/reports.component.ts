import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { KpiReportList } from 'src/app/core/models/kpi-management/report/kpi-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiReportStore } from 'src/app/stores/kpi-management/report/kpi-report-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
	@ViewChild('navBar') navBar: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;

	reactionDisposer: IReactionDisposer;
	KpiReportStore = KpiReportStore;
	OrganizationModulesStore = OrganizationModulesStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeKpiList: KpiReportList[];
	initializeReportKpiScoreList: KpiReportList[];

	Report_loader: boolean = false;

	constructor(
		private _router: Router,
		private _renderer2: Renderer2,
		private _cdr: ChangeDetectorRef, 
		private _utilityService: UtilityService,
	) { }

	ngOnInit(): void {

		setTimeout(() => {
		this.Report_loader = true;
		this._utilityService.detectChanges(this._cdr);
		}, 100);

		this.reactionDisposer = autorun(() => {
			if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
				this.kpiList();
				this.kpiScoreList();
				this._utilityService.detectChanges(this._cdr);
			}
		})

		setTimeout(() => {
		this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		window.addEventListener('scroll', this.scrollEvent, true);
		this._utilityService.detectChanges(this._cdr);
		}, 250);
	}

	scrollEvent = (event: any): void => {
		const number = event.target.documentElement?.scrollTop;
		if (number > 50) {
		this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
		this._renderer2.addClass(this.navBar.nativeElement, 'affix');
		}
		else {
		this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
		}
	}
	
	// for moveing to next page
	getReport(obj) {
		KpiReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('kpi-management/reports/' + obj.type);
	}

	// for getting the list of data shows in Kii section
	kpiList(): void {
		const checkLevelKey = 'checkLevel';

		this.initializeKpiList = this.KpiReportStore.reportLists.filter(function (i) {
			return i.reportType == 'kpi';
		});
		
		for (var i = 0; i < this.initializeKpiList.length; i++) {
			if (this.initializeKpiList[i].hasOwnProperty('checkLevel')) {
				if (this.initializeKpiList[i].checkLevel != 'is_ms_type' && (!this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeKpiList[i].checkLevel])) {
					this.initializeKpiList.splice(i, 1);
					i--;
				}
				else if (this.initializeKpiList[i].checkLevel == 'is_ms_type' && (!this.OrganizationGeneralSettingsStore.organizationSettings[this.initializeKpiList[i].checkLevel])) {
					this.initializeKpiList.splice(i, 1);
					i--;
				}
			}
		}
	}

	// for getting the list of data shows in Kpi score section
	kpiScoreList(): void {
		this.initializeReportKpiScoreList = this.KpiReportStore.reportLists.filter(function (i) {
			return i.reportType == 'kpiScore';
		});
	}

	ngOnDestroy(){
		window.removeEventListener('scroll', this.scrollEvent, true);
	}

}
