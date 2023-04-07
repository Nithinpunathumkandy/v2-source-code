import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { RiskRegisterService } from 'src/app/core/services/event-monitoring/risk-register/risk-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-risk-register-list',
  templateUrl: './risk-register-list.component.html',
  styleUrls: ['./risk-register-list.component.scss']
})
export class RiskRegisterListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  RiskRegisterStore = RiskRegisterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;

  filterSubscription: Subscription = null;
  modalEventSubscription: any;
  popupControlEventSubscription: any;
  // popupControlEventSubscription: any;

  riskRegisterObject = {
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
    private _eventEmitterService: EventEmitterService,
    private _riskRegisterService: RiskRegisterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.RiskRegisterStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EVENT_RISK_LIST', submenuItem: {type: 'search'}},
        {activityName: 'EVENT_RISK_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_EVENT_RISK', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_KM_KPI_IMPROVEMENT_PLAN_TEMPLATE', submenuItem: {type: 'template'}},
        // {activityName:  null, submenuItem: {type: 'export_to_excel'}}
      ]
      
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_risk_resgister'});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addNewRisk();
            break; 
          case "export_to_excel":
              // this._riskRegisterService.exportToExcel();
            break;
          case "template":
            // this._riskRegisterService.generateTemplate();
            break;
          case "search":
              RiskRegisterStore.searchText   = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            RiskRegisterStore.searchText = '';
            RiskRegisterStore.loaded = false;
            this.pageChange(1);
            break;	  
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addNewRisk();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);


    this.pageChange(1);
    RightSidebarLayoutStore.filterPageTag = 'eventt_monitoring_risk_register';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'event_risk_register_status_ids',
      'event_ids',
      'risk_ids'
    ]);
  }

  pageChange(newPage: number = null) {
    if (newPage) RiskRegisterStore.setCurrentPage(newPage);
    this._riskRegisterService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // getDetails(id){
  //   //may be this path set is tempery
  //   RisksStore.setPath('/event-monitoring/event-risks');
  //   RisksStore.set_Disable_Mapping_For_Event_Monitoring_Risk_Register();
  //   this._router.navigateByUrl('risk-management/risks/' + id);
  // }
  getDetails(id){
    this._router.navigateByUrl('event-monitoring/event-risks/'+id);
  }

  addNewRisk(){
    // RiskRegisterStore.unsetIndividualRiskRegisterDetails();
    this.riskRegisterObject.type = 'Add';
    this.riskRegisterObject.values = null;
    // RiskRegisterStore.editFlag=false;
    // this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    setTimeout(() => {
      this.riskRegisterObject.type = null;
      this.riskRegisterObject.values = null;
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  sortTitle(type: string) {
    this._riskRegisterService.sortList(type, null);
    this.pageChange();
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

  editRisk(data){
    event.stopPropagation();
    this.riskRegisterObject.type = 'Edit';
    this.riskRegisterObject.values = {
      id: data?.id,
      event_id: data?.event_id,
      risk_title: data?.risk_title,
      description: data?.description,
      risk_types: data?.risk_types

    };
    this.openFormModal()
    this._utilityService.detectChanges(this._cdr);
    
  }

  modalControl(status: boolean) {
    switch (this.popupObject.title) {
      case 'delete_risk': this.deleteEventRisk(status)
        break;
    }

  }


  deleteEventRisk(status: boolean) {
    if (status && this.popupObject.id) {
      this._riskRegisterService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        // this.pageChange(1)
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
  deleteRisk(id){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_risk';
    this.popupObject.subtitle = 'event_risk_delete_message';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.modalEventSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    RiskRegisterStore.unRiskRegisters();
    RiskRegisterStore.searchText =null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    RiskRegisterStore.setCurrentPage(1);
  }

}

