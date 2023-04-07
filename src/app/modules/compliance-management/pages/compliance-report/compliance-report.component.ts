import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ComplianceReportList } from 'src/app/core/models/compliance-management/compliance-report/compliance-report';
import { ComplianceReportStore } from 'src/app/stores/compliance-management/compliance-report/compliance-report-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";

@Component({
  selector: 'app-compliance-report',
  templateUrl: './compliance-report.component.html',
  styleUrls: ['./compliance-report.component.scss']
})
export class ComplianceReportComponent implements OnInit {

	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
	ComplianceReportStore = ComplianceReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeComplianceList: ComplianceReportList[];
	initializeSlaList: ComplianceReportList[];
	Report_loader: boolean = false;
	OrganizationModulesStore = OrganizationModulesStore;
  constructor(
	private _router: Router,
	private _helperService: HelperServiceService,
	private _utilityService: UtilityService,
	private _cdr: ChangeDetectorRef, private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
	setTimeout(() => {
		this.Report_loader = true;
		this._utilityService.detectChanges(this._cdr);
	  }, 100);

	this.reactionDisposer = autorun(() => {
		if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
			this.complianceList();
			this.slaList();
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
		ComplianceReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('compliance-management/reports/' + obj.type);
	}
	// for getting the list of data shows in audit section
	complianceList(): void {
		this.initializeComplianceList = this.ComplianceReportStore.ComplianceReportListArray.filter(function (i) {
			return i.reportType == 'compliance';
		});
		for (var i = 0; i < this.initializeComplianceList.length; i++) {
			if (this.initializeComplianceList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeComplianceList[i].checkLevel]) {
				this.initializeComplianceList.splice(i, 1);
				i--;
			}
		}

	}
	slaList(): void {
		this.initializeSlaList = this.ComplianceReportStore.ComplianceReportListArray.filter(function (i) {
			return i.reportType == 'sla';
		});
		for (var i = 0; i < this.initializeSlaList.length; i++) {
			if (this.initializeSlaList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeSlaList[i].checkLevel]) {
				this.initializeSlaList.splice(i, 1);
				i--;
			}
		}
	}

	ngOnDestroy(){
		window.removeEventListener('scroll', this.scrollEvent, true);
	}

}
