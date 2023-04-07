import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KHReportList } from 'src/app/core/models/knowledge-hub/kh-report/kh-report';
import { KHReportStore } from 'src/app/stores/knowledge-hub/kh-report/kh-report-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

@Component({
  selector: 'app-kh-reports',
  templateUrl: './kh-reports.component.html',
  styleUrls: ['./kh-reports.component.scss']
})
export class KhReportsComponent implements OnInit {

  KHReportStore = KHReportStore;
  reactionDisposer: IReactionDisposer;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  initializekhList: KHReportList[];
  Report_loader: boolean = false;

  constructor(
    private _router: Router,
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
        this.khReportList();
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  // for moveing to next page
  getReport(obj) {
    KHReportStore.selectedReportObject = obj;
    SubMenuItemStore.datefilterValue = 'year';
    this._router.navigateByUrl('knowledge-hub/reports/' + obj.type);
  }
  // for getting the list of data shows in audit section
  khReportList(): void {
    this.initializekhList = this.KHReportStore.KHReportListArray.filter(function (i) {
      return i.reportType == 'documentkh';
    });
    for (var i = 0; i < this.initializekhList.length; i++) {
      if (this.initializekhList[i].hasOwnProperty('checkLevel')) {
        if (this.initializekhList[i].checkLevel != 'is_ms_type' && (!this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializekhList[i].checkLevel])) {
          this.initializekhList.splice(i, 1);
          i--;
        }
        else if (this.initializekhList[i].checkLevel == 'is_ms_type' && (!this.OrganizationGeneralSettingsStore.organizationSettings[this.initializekhList[i].checkLevel])) {
          this.initializekhList.splice(i, 1);
          i--;
        }
      }
    }

  }

}
