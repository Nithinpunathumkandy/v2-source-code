import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditReportList } from 'src/app/core/models/audit-management/am-audit-reports/am-audit-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditReportStore } from 'src/app/stores/audit-management/am-audit-report/am-audit-report-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  selector: 'app-am-audit-reports',
  templateUrl: './am-audit-reports.component.html',
  styleUrls: ['./am-audit-reports.component.scss']
})
export class AmAuditReportsComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
	AmAuditReportStore = AmAuditReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeAnnualAuditPlanList: AmAuditReportList[];
	initializeAuditList: AmAuditReportList[];
  initializeAuditFindingsList: AmAuditReportList[];
	Report_loader: boolean = false;

  constructor(
    private _router: Router,
	  private _utilityService: UtilityService,
	  private _cdr: ChangeDetectorRef, 
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.Report_loader = true;
    //   this._utilityService.detectChanges(this._cdr);
    //   }, 100);
  
    this.reactionDisposer = autorun(() => {
      if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
        this.amAuditList();
        this.amAnnualAuditPlanList();
        this.amAuditFindingsList();
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
      AmAuditReportStore.selectedReportObject = obj;
      SubMenuItemStore.datefilterValue = 'year';
      this._router.navigateByUrl('audit-management/reports/' + obj.type);
    }
    
     // for getting the list of data shows in audit section
     amAnnualAuditPlanList(): void {
      this.initializeAnnualAuditPlanList = this.AmAuditReportStore.AmAuditReportListArray.filter(function (i) {
        return i.reportType == 'am_annual_plans';
      });
      for (var i = 0; i < this.initializeAnnualAuditPlanList.length; i++) {
        if (this.initializeAnnualAuditPlanList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeAnnualAuditPlanList[i].checkLevel]) {
          this.initializeAnnualAuditPlanList.splice(i, 1);
          i--;
        }
      }
  
    }
    amAuditList(): void {
      this.initializeAuditList = this.AmAuditReportStore.AmAuditReportListArray.filter(function (i) {
        return i.reportType == 'am_audits';
      });
      for (var i = 0; i < this.initializeAuditList.length; i++) {
        if (this.initializeAuditList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeAuditList[i].checkLevel]) {
          this.initializeAuditList.splice(i, 1);
          i--;
        }
      }
    }
    amAuditFindingsList(): void {
      this.initializeAuditFindingsList = this.AmAuditReportStore.AmAuditReportListArray.filter(function (i) {
        return i.reportType == 'am_audit_findings';
      });
      for (var i = 0; i < this.initializeAuditFindingsList.length; i++) {
        if (this.initializeAuditFindingsList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeAuditFindingsList[i].checkLevel]) {
          this.initializeAuditFindingsList.splice(i, 1);
          i--;
        }
      }
    }
  
     /**
     * @description
     * Called once, before the instance is destroyed.
     * Add 'implements OnDestroy' to the class.
     *
     * @memberof TrainingReportComponent
     */
    ngOnDestroy(){
      window.removeEventListener('scroll', this.scrollEvent, true);
    }

}
