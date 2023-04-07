import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { BcmStrategiesService } from 'src/app/core/services/bcm/bcm-strategies/bcm-strategies.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BCMDashboardStore } from 'src/app/stores/bcm/bcm-dashboard/bcm-dashboard-store';
import { BcmStrategyStore } from 'src/app/stores/bcm/strategy/bcm-strategy-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
declare var $: any;
@Component({
  selector: 'app-bc-strategy-list',
  templateUrl: './bc-strategy-list.component.html',
  styleUrls: ['./bc-strategy-list.component.scss']
})
export class BcStrategyListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  BcmStrategyStore = BcmStrategyStore;
  AuthStore = AuthStore;
  popupControlSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  filterSubscription: Subscription = null;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _bcmStrategiesService: BcmStrategiesService,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,

  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.BcmStrategyStore.loaded = false;
      this.pageChange(1);
    })

    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BUSINESS_CONTINUITY_STRATEGY_LIST', submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_BUSINESS_CONTINUITY_STRATEGY', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_BUSINESS_CONTINUITY_STRATEGY', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_BUSINESS_CONTINUITY_STRATEGY', submenuItem: { type: 'export_to_excel' } }
      ]
      // if(!AuthStore.getActivityPermission(100,'CREATE_PROCESS_STAKEHOLDER')){
      //   NoDataItemStore.deleteObject('subtitle');
      //   NoDataItemStore.deleteObject('buttonText');
      // }
      this._helperService.checkSubMenuItemPermissions(4200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            BcmStrategyStore.new_strategy_id = null;
            BcmStrategyStore.unsetDetails();
            setTimeout(() => {
              this._router.navigateByUrl('bcm/business-continuity-strategies/add');
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "search":
            BcmStrategyStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            BcmStrategyStore.unsetBcs();
            this.pageChange(1);
            break;
          // case "template":
          //   this._bcmStrategiesService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._bcmStrategiesService.exportToExcel();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this._router.navigateByUrl('bcm/business-continuity-strategies/add');
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteItems(item);
    })
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'CREATE_BUSINESS_CONTINUITY_STRATEGY' });
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);

    RightSidebarLayoutStore.filterPageTag = 'bcm_strategy';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
    'organization_ids',
    'division_ids',
    'department_ids',
    'section_ids',
    'sub_section_ids',
    'bcs_status_ids',
    'business_continuity_strategy_type_ids',
    'solution_scores'
    ]);

    this.pageChange(1)
  }

  pageChange(newPage: number = null) {
    if (newPage) BcmStrategyStore.setCurrentPage(newPage);
    var additionalParams=''
    if (BCMDashboardStore.dashboardParameter) {
      additionalParams = BCMDashboardStore.dashboardParameter
    }
    this._bcmStrategiesService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  editBcStrategy(id){
    event.stopPropagation();
    BcmStrategyStore.new_strategy_id = id;
    this._bcmStrategiesService.getStrategy(BcmStrategyStore.new_strategy_id).subscribe(res=>{
      this._router.navigateByUrl('/bcm/business-continuity-strategies/edit');
      this._utilityService.detectChanges(this._cdr)
    })
  }

  deleteItems(status) {
    if (status && this.popupObject.id) {
      this._bcmStrategiesService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    } else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  deleteConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  gotoDetails(id){
    BcmStrategyStore.single_loaded = false;
    BcmStrategyStore.unsetDetails();
    this._router.navigateByUrl('/bcm/business-continuity-strategies/'+id)
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
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

  setSort(type) {
    this._bcmStrategiesService.sortBcsList(type);
    this.pageChange();
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
