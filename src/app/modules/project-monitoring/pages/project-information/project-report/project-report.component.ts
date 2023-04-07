import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ProjectReportList } from 'src/app/core/models/project-monitoring/project-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectReportStore } from 'src/app/stores/project-monitoring/project-report-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.scss']
})
export class ProjectReportComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
	ProjectReportStore = ProjectReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeProjectList: ProjectReportList[];
	initializeChangeRequestList: ProjectReportList[];
  initializeProjectClosureList: ProjectReportList[];
	Report_loader: boolean = false;
	OrganizationModulesStore = OrganizationModulesStore;

  constructor(
    private _router: Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.Report_loader = true;
      this._utilityService.detectChanges(this._cdr);
      }, 100);
  
    this.reactionDisposer = autorun(() => {
      if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
        this.projectList();
        this.changeRequestList();
        this.projectClosureList();
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
      ProjectReportStore.selectedReportObject = obj;
      SubMenuItemStore.datefilterValue = 'year';
      this._router.navigateByUrl('project-monitoring/reports/' + obj.type);
    }
    // for getting the list of data shows in audit section
    projectList(): void {
      this.initializeProjectList = this.ProjectReportStore.ProjectReportListArray.filter(function (i) {
        return i.reportType == 'project';
      });
      for (var i = 0; i < this.initializeProjectList.length; i++) {
        if (this.initializeProjectList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeProjectList[i].checkLevel]) {
          this.initializeProjectList.splice(i, 1);
          i--;
        }
      }
  
    }
    changeRequestList(): void {
      this.initializeChangeRequestList = this.ProjectReportStore.ProjectReportListArray.filter(function (i) {
        return i.reportType == 'change_request';
      });
      for (var i = 0; i < this.initializeChangeRequestList.length; i++) {
        if (this.initializeChangeRequestList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeChangeRequestList[i].checkLevel]) {
          this.initializeChangeRequestList.splice(i, 1);
          i--;
        }
      }
    }
    projectClosureList(): void {
      this.initializeProjectClosureList = this.ProjectReportStore.ProjectReportListArray.filter(function (i) {
        return i.reportType == 'project_closure';
      });
      for (var i = 0; i < this.initializeProjectClosureList.length; i++) {
        if (this.initializeProjectClosureList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeProjectClosureList[i].checkLevel]) {
          this.initializeProjectClosureList.splice(i, 1);
          i--;
        }
      }
    }
  
    ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      window.removeEventListener('scroll', this.scrollEvent, true);
    }
  
  }
