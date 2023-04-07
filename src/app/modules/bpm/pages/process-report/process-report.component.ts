import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessReportList } from 'src/app/core/models/bpm/process-report/process-report';
import { ProcessReportStore } from 'src/app/stores/bpm/process-report/process-report-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";


@Component({
	selector: 'app-process-report',
	templateUrl: './process-report.component.html',
	styleUrls: ['./process-report.component.scss']
})
export class ProcessReportComponent implements OnInit {

	ProcessReportStore = ProcessReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeProcessRegisterlist: ProcessReportList[];

	Report_loader:boolean =false;

	constructor(
		private _router: Router,
		private _helperService: HelperServiceService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.Report_loader = true;
			this._utilityService.detectChanges(this._cdr);
		  }, 100);

		this.reactionDisposer = autorun(() => {
            if(OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings){
                this.processRegisterList();
                this._utilityService.detectChanges(this._cdr);
            }
        })
	}

	// for moveing to next page
	getReport(obj) {
		ProcessReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('bpm/reports/' + obj.type);
	}

	// for getting the list of data shows in Risk Register section
	processRegisterList(): void {

		this.initializeProcessRegisterlist = this.ProcessReportStore.ProcessReportListArray.filter(function (i) {
			return i.reportType == 'riskRegister';
		});

		for (var i = 0; i < this.initializeProcessRegisterlist.length; i++) {
			if (this.initializeProcessRegisterlist[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeProcessRegisterlist[i].checkLevel]) {
				this.initializeProcessRegisterlist.splice(i, 1);
				i--;
			}
		}
	}

}
