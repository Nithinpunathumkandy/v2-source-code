import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { KpiScoreService } from 'src/app/core/services/kpi-management/kpi-score/kpi-score.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiScoreStore } from 'src/app/stores/kpi-management/kpi-score/kpi-score-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-kpi-score-list',
  templateUrl: './kpi-score-list.component.html',
  styleUrls: ['./kpi-score-list.component.scss']
})
export class KpiScoreListComponent implements OnInit,OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('updateScoreModal') updateScoreModal: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  KpiScoreStore = KpiScoreStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  filterSubscription: Subscription = null;
  updateScoreEventSubscription:any;

  popupScorueObject:any;
  scoreModal:boolean=false;

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService,
    private _kpiScoreService: KpiScoreService,
    private _helperService: HelperServiceService,
    private _humanCapitalService:HumanCapitalService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.KpiScoreStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KPI_MANAGEMENT_KPI_SCORE_LIST', submenuItem: {type: 'search'}},
        {activityName: 'KPI_MANAGEMENT_KPI_SCORE_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'EXPORT_KPI_MANAGEMENT_KPI_SCORE', submenuItem: {type: 'export_to_excel'}}
      ]
      
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "export_to_excel":
              this._kpiScoreService.exportToExcel();
            break;
          case "search":
              KpiScoreStore.searchText   = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
              SubMenuItemStore.searchText = '';
              KpiScoreStore.searchText = '';
              KpiScoreStore.loaded = false;
              this.pageChange(1);
            break;	
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        KpiScoreStore.setKpiScoreId(null);
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.updateScoreEventSubscription = this._eventEmitterService.updateScoreModal.subscribe(res => {
      this.updateCloseModal(res);
    });

    this.pageChange(1);
    RightSidebarLayoutStore.filterPageTag = 'kpi_management_kpi_score';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'kpi_management_kpi_ids',
      'updated_user_ids',
      'kpi_management_kpi_score_status_ids',
      'date',
    ]);
  }

  pageChange(newPage: number = null) {
    if (newPage) KpiScoreStore.setCurrentPage(newPage);
    this._kpiScoreService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  workFlowUpdateButtonDisable(row){
    //1. kpi stutas approved 
    //2. kpi score status not-updated and sent-back 
    //3. update button only responsible users
    
    if(row.kpi_management_kpi_status=='approved'){
      if(row.kpi_management_kpi_score_status_type=='not-updated'|| row.kpi_management_kpi_score_status_type=='updated'|| row.kpi_management_kpi_score_status_type=='send-back'){
        
        if(row.kpi_responsible_user_ids){
          for(let i= 0; i<row.kpi_responsible_user_ids?.split(',').length;i++){

            if(row.kpi_responsible_user_ids.split(',')[i]==AuthStore.user?.id ){ 
              return true;
            }
          }
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  updateScoreOpenModal(data){
    event.stopPropagation();
    
    this.scoreModal=true;
    this.popupScorueObject=data;
    setTimeout(() => {
      $(this.updateScoreModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  updateCloseModal(res){
    this.scoreModal=false;
    $(this.updateScoreModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.updateScoreModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.popupScorueObject=null;

    KpiScoreStore.loaded=false;
    this.pageChange(1);
  }
  
  getDetails(id){
    KpiScoreStore.setKpiScoreId(id);
    this._router.navigateByUrl('kpi-management/kpi-scores/'+id);
    KpiScoreStore.setPath(`../`);
  }


  sortTitle(type: string) {
    this._kpiScoreService.sortList(type, null);
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
    this.updateScoreEventSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    KpiScoreStore.unSetKpiScore();
    KpiScoreStore.searchText =null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    KpiScoreStore.setCurrentPage(1);
  }

}
