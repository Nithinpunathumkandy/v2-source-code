import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImprovementLansService } from 'src/app/core/services/kpi-management/improvement-plans/improvement-lans.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KPIDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-dashbord';
import { ImprovementPlansStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-improvement-plans-list',
  templateUrl: './improvement-plans-list.component.html',
  styleUrls: ['./improvement-plans-list.component.scss']
})
export class ImprovementPlansListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ImprovementPlansStore = ImprovementPlansStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  filterSubscription: Subscription = null;
  modalEventSubscription: any;
  popupControlEventSubscription: any;

  improvementPlanObject = {
    type:null,
    values: null,
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _humanCapitalService:HumanCapitalService,
    private _eventEmitterService: EventEmitterService,
    private _improvementLansService: ImprovementLansService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ImprovementPlansStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KM_KPI_IMPROVEMENT_PLAN_LIST', submenuItem: {type: 'search'}},
        {activityName: 'KM_KPI_IMPROVEMENT_PLAN_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_KM_KPI_IMPROVEMENT_PLAN', submenuItem: {type: 'export_to_excel'}}
      ]
      
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_improvement_plans'});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addImprovementPlan();
            break; 
          case "export_to_excel":
              this._improvementLansService.exportToExcel();
            break;
          case "template":
            this._improvementLansService.generateTemplate();
            break;
          case "search":
              ImprovementPlansStore.searchText   = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            ImprovementPlansStore.searchText = '';
            ImprovementPlansStore.loaded = false;
            this.pageChange(1);
            break;	  
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addImprovementPlan();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      console.log('submenu inside '+res);
      this.closeFormModal();
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);


    this.pageChange(1);
    RightSidebarLayoutStore.filterPageTag = 'kip_management_improvement_plans';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'kpi_management_kpi_ids',
      'responsible_user_ids',
      'kpi_management_kpi_improvement_plan_status_ids',
      'start_date',
      'target_date',
    ]);
  }

  pageChange(newPage: number = null) {
    if (newPage) ImprovementPlansStore.setCurrentPage(newPage);
    var additionalParams=''
      if (KPIDashboardStore.improvementDashboardParameter) {
        additionalParams = KPIDashboardStore.improvementDashboardParameter
      }
    this._improvementLansService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getDetails(id){
    ImprovementPlansStore.setImprovementPlansId(id);
    this._router.navigateByUrl('kpi-management/improvement-plans/' + id);
  }

  //edit start
  edit(id) {
    event.stopPropagation();

    this._improvementLansService.getItem(id).subscribe(res => {

      if(res){
        this.improvementPlanObject.type = 'Edit';
        ImprovementPlansStore.editFlag=true;
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
      
    });
  }
//end edit  

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteItem(status);
        break;
    }
  }

  // for delete
  delete(id: number) {
    event.stopPropagation();

    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'improvement_plan_delete_subtitle';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  // delete function call
  deleteItem(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._improvementLansService.delete(this.popupObject.id).subscribe(resp => {
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

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  addImprovementPlan(){
    ImprovementPlansStore.unsetIndividualImprovementPlansDetails();
    this.improvementPlanObject.type = 'Add';
    this.improvementPlanObject.values=null;
    ImprovementPlansStore.editFlag=false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.improvementPlanObject.type = null;
  }

  sortTitle(type: string) {
    this._improvementLansService.sortList(type, null);
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
    this.modalEventSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    ImprovementPlansStore.unSetImprovementPlans();
    ImprovementPlansStore.searchText =null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlEventSubscription.unsubscribe();
    ImprovementPlansStore.setCurrentPage(1);
    KPIDashboardStore.unsetDashboardParam()
    KPIDashboardStore.unsetImprovementDashboardParam()
  }

}

