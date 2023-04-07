import { Component, OnInit, ChangeDetectorRef, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { OrganizationReportList } from 'src/app/core/models/organization/organization-report/organization-report';
import { OrganizationReportStore } from "src/app/stores/organization/organization-reports/organization-reports-store";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
  OrganizationReportStore = OrganizationReportStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  initializeOrganizationReportList: OrganizationReportList[] = [];
  report_loader: boolean = false;
  reactionDisposer: IReactionDisposer;
  constructor(
    private _router: Router, private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.report_loader = true;
      this._utilityService.detectChanges(this._cdr);
    }, 500);
    this.reactionDisposer = autorun(() => {
			if (OrganizationGeneralSettingsStore.organizationSettings) {
				this.initializeReport()
				this._utilityService.detectChanges(this._cdr);
			}
		})
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  getReport(obj) {
    OrganizationReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('organization/reports/' + obj.type);
  }

  initializeReport(){
    this.initializeOrganizationReportList = OrganizationReportStore.organizationReportListArray;
    for (var i = 0; i < this.initializeOrganizationReportList.length; i++) {
			if (this.initializeOrganizationReportList[i].hasOwnProperty('checkLevel')) {
				if (this.initializeOrganizationReportList[i].checkLevel == 'is_ms_type' && (!this.OrganizationGeneralSettingsStore.organizationSettings[this.initializeOrganizationReportList[i].checkLevel])) {
					this.initializeOrganizationReportList.splice(i, 1);
					i--;
				}
			}
		}
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

}
