import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { CyberIncidentReportList } from 'src/app/core/models/cyber-incident/cyber-incident-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberReportStore } from 'src/app/stores/cyber-incident/cyber-incident-report';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  selector: 'app-cyber-incident-report-list',
  templateUrl: './cyber-incident-report-list.component.html',
  styleUrls: ['./cyber-incident-report-list.component.scss']
})
export class CyberIncidentReportListComponent implements OnInit {

  CyberReportStore  = CyberReportStore ;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeProcessRegisterlist: CyberIncidentReportList[];

	Report_loader:boolean =false;
  constructor(
    private _router: Router,
		// private _helperService: HelperServiceService,
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
	CyberReportStore.selectedReportObject = obj;
	SubMenuItemStore.datefilterValue = 'year';
	this._router.navigateByUrl('cyber-incident/reports/' + obj.type);
}

// for getting the list of data shows in Risk Register section
processRegisterList(): void {

	this.initializeProcessRegisterlist = CyberReportStore.CyberReportListArray.filter(function (i) {
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
