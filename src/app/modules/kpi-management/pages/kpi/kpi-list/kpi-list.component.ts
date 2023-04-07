import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { KpisService } from 'src/app/core/services/kpi-management/kpi/kpis.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KPIDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-dashbord';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';


declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-kpi-list',
  templateUrl: './kpi-list.component.html',
  styleUrls: ['./kpi-list.component.scss']
})
export class KpiListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  KpisStore = KpisStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  filterSubscription: Subscription = null;
  popupControlEventSubscription: any;

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _kpisService: KpisService, //*
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _humanCapitalService:HumanCapitalService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.KpisStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KPI_MANAGEMENT_KPI_LIST', submenuItem: {type: 'search'}},
        {activityName: 'KPI_MANAGEMENT_KPI_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_KPI_MANAGEMENT_KPI', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_KPI_MANAGEMENT_KPI', submenuItem: {type: 'export_to_excel'}}
      ]
      
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_kpi'});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "new_modal":
              KpisStore.setKpiId(null);
              this.gotoAddPage();
            break;
          case "template":
              this._kpisService.generateTemplate();
            break;
          case "export_to_excel":
              this._kpisService.exportToExcel();
            break;
          case "search":
              KpisStore.searchText   = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            KpisStore.searchText = '';
            KpisStore.loaded = false;
            this.pageChange(1);
            break;	
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        KpisStore.setKpiId(null);
        this.gotoAddPage();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.pageChange(1);

    RightSidebarLayoutStore.filterPageTag = 'kip_management_kpi';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'kpi_management_status_ids',
      'kpi_category_ids',
      'kpi_type_ids',
      'review_frequency_ids',
      'is_dashboard'
    ]);

  }

  pageChange(newPage: number = null) {
    if (newPage) KpisStore.setCurrentPage(newPage);
    var additionalParams=''
      if (KPIDashboardStore.dashboardParameter) {
        additionalParams = KPIDashboardStore.dashboardParameter
      }
    this._kpisService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  gotoAddPage(){
    this._router.navigateByUrl('kpi-management/kpis/add-kpi');
  }
  
  getDetails(id){
    KpisStore.setKpiId(id);
    this._router.navigateByUrl('kpi-management/kpis/'+id);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteKpi(status);
        break;
    }
  }

  deleteKpi(status: boolean) {
    if (status && this.popupObject.id) {

      this._kpisService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'kpi_delete_subtitle';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  edit(id){
    KpisStore.setKpiId(id);
    KpisStore.editFlag=true;
    this._router.navigateByUrl('kpi-management/kpis/edit-kpi');
  }

  sortTitle(type: string) {
    this._kpisService.sortList(type, null);
    this.pageChange();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.popupControlEventSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    KpisStore.unSetKpi();
    KpisStore.searchText =null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    KpisStore.setCurrentPage(1);
    KPIDashboardStore.unsetDashboardParam()
  }

}
