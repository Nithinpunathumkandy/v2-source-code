import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ProcessRiskStore } from 'src/app/stores/bpm/process/process_risk.store'
import { IReactionDisposer, autorun } from "mobx";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ProcessRiskService } from 'src/app/core/services/bpm/process/process-risk/process-risk.service';
import { RightSidebarLayoutStore } from "src/app/stores/general/right-sidebar-layout.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
@Component({
  selector: 'app-risk-assessment',
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss']
})
export class RiskAssessmentComponent implements OnInit {

  // @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  ProcessRiskStore = ProcessRiskStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;

RiskEmptyList = "No Risks To Show";
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _processRiskService: ProcessRiskService,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
  ) {}

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = false;
    
    // this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
    //   this.ControlStore.control_loaded = false;
    //   this._utilityService.detectChanges(this._cdr);
    //   this.pageChange();
    // })
    // NoDataItemStore.setNoDataItems({title: "control_nodata_title", subtitle: 'control_nodata_subtitle',buttonText: 'add_new_control'});
    // if(ProcessRiskStore.totalItems == 0 ){
      
    // }
    
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title:"", subtitle:"process_no_risk_to_show"});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},     
      ]
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            ProcessRiskStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);



    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    // RightSidebarLayoutStore.filterPageTag = 'controls';
    // this._rightSidebarFilterService.setFiltersForCurrentPage([
    //   'organization_ids',
    //   'division_ids',
    //   'department_ids',
    //   'section_ids',
    //   'sub_section_ids',
    //   'control_type_ids',
    //   'control_category_ids',
    //   'control_sub_category_ids'
    // ]);
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProcessRiskStore.setCurrentPage(newPage);
    this._processRiskService
      .getAllItems()
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        // this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        // this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

    
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
    // ProcessRiskStore.unsetProcessRisks();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }


}
