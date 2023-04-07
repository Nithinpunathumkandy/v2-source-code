import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { BcmRiskAssessmentService } from 'src/app/core/services/bcm/risk-assessment/bcm-risk-assessment.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-risk-assessment-list',
  templateUrl: './risk-assessment-list.component.html',
  styleUrls: ['./risk-assessment-list.component.scss']
})
export class RiskAssessmentListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  BcmRiskAssessmentStore = BcmRiskAssessmentStore
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  popupControlSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  riskAssessmentObject = {
    component: 'BCP',
    values: null,
    type: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  riskAssessmentModalSubscription: any;
  filterSubscription: Subscription = null;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _router: Router,
    private _helperService: HelperServiceService, private _bcmRiskAssessmentService: BcmRiskAssessmentService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      BcmRiskAssessmentStore.loaded = false
			this.pageChange(1);
		})
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_bcm_risk'});
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BCM_RISK_LIST', submenuItem: {type: 'search'}},
        {activityName: 'BCM_RISK_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_BCM_RISK', submenuItem: {type: 'new_modal'}},
        // {activityName: null, submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_BCM_RISK', submenuItem: {type: 'export_to_excel'}},
      ]
      this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._router.navigateByUrl('bcm/risk-assessment/add');
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "search":
            BcmRiskAssessmentStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            BcmRiskAssessmentStore.unsetBcmRiskDetails();
            this.pageChange(1);
            break;
          case "template":
            this._bcmRiskAssessmentService.generateTemplate();
            break;
          case "export_to_excel":
            this._bcmRiskAssessmentService.exportToExcel();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this._router.navigateByUrl('bcm/risk-assessment/add');
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteAssessment(item);
    })

    this.riskAssessmentModalSubscription = this._eventEmitterService.bcmRiskAssessmentModal.subscribe(item => {
      this.closeFormModal()
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })
    BcmRiskAssessmentStore.selectedId = null
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    RightSidebarLayoutStore.filterPageTag = 'bcm_risk';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
			'organization_ids',
			'division_ids',
			'department_ids',
			'section_ids',
			'sub_section_ids',
			'risk_type_ids',
			'risk_status_ids',
			'risk_owner_ids',
			'inherent_risk_score',
			'residual_risk_score',
			'inherent_risk_rating_ids',
			'residual_risk_rating_ids',
      'is_analysis_performed',
      'is_residual_analysis_performed',
      'is_functional',
      'is_corporate',
      'is_inherent',
      'is_residual',
      'is_registered',
      'process_ids',
      'risk_responsible_user_ids',
      'bia_tire_ids'
		]);
    this.pageChange(1);
  }

  pageChange(newPage: number = null){
    if (newPage) BcmRiskAssessmentStore.setCurrentPage(newPage);
    this._bcmRiskAssessmentService.getItems(false,null,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  editAssessment(id,processId){
    BcmRiskAssessmentStore.setAssessmentId(id);
    BcmRiskAssessmentStore.setProcessId(processId)
    BcmRiskAssessmentStore.selectedProcessId = parseFloat(processId)
    BcmRiskAssessmentStore.is_edit = true
    BcmRiskAssessmentStore.is_from_info = false
    this._bcmRiskAssessmentService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('bcm/risk-assessment/edit');
      this._utilityService.detectChanges(this._cdr);
    })
  }

  deleteAssessment(status){
    if (status && this.popupObject.id){
      this._bcmRiskAssessmentService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  deleteConfirm(id: number){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  setSort(type){
    this._bcmRiskAssessmentService.sortBcpList(type);
    this.pageChange();
  }

  assessmentPerform(id:number){
    this._bcmRiskAssessmentService.getItem(id).subscribe()
    BcmRiskAssessmentStore.selectedId = id;
    this.riskAssessmentObject.type = 'Add';
    this.riskAssessmentObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    setTimeout(() => {
      this.riskAssessmentObject.type = null;
      this.riskAssessmentObject.values = null;
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  gotoAssessment(id){
    BcmRiskAssessmentStore.selectedId = id
    this._router.navigateByUrl('bcm/risk-assessment/'+id);
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
    SubMenuItemStore.makeEmpty();
    // this.bcpModalSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
