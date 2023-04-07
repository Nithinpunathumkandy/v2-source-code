import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImprovementLansService } from 'src/app/core/services/kpi-management/improvement-plans/improvement-lans.service';
import { KpisService } from 'src/app/core/services/kpi-management/kpi/kpis.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ImprovementPlansStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-improvement-plan',
  templateUrl: './improvement-plan.component.html',
  styleUrls: ['./improvement-plan.component.scss']
})
export class ImprovementPlanComponent implements OnInit, OnDestroy {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  KpisStore = KpisStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ImprovementPlansStore = ImprovementPlansStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

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

  crubPath:any;
  selectedKpi:any=null;

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _kpisService: KpisService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _humanCapitalService:HumanCapitalService,
    private _eventEmitterService: EventEmitterService,
    private _improvementLansService: ImprovementLansService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:this._helperService.translateToUserLanguage('kpis'),
      path:`/kpi-management/kpis`
    });

    this.subMenu(true);
    this.noDataItem(true);

    this.reactionDisposer = autorun(() => {
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addImprovementPlan();
            break; 
          case "export_to_excel":
              this._improvementLansService.exportToExcel(`?kpi_management_kpi_ids=${KpisStore.kpiId}`);
            break;
          case "search":
              ImprovementPlansStore.searchText   = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            ImprovementPlansStore.searchText = '';
            ImprovementPlansStore.loaded = false;
            this.getKpiDetials();
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
      console.log('kpi inside '+res);
      
      if(typeof res=="number" ||res=="cancel"){
        this.closeFormModal();          
      }else{
        this.closeFormModal();          
        this.getKpiDetials();
        this.pageChange(1); //it empty list add new date fix
      }
    });

    this.getKpiDetials();
  }

  getKpiDetials(){
    this._kpisService.getItem(KpisStore.kpiId).subscribe(res=>{
      if(KpisStore.individualKpiDetails.kpi_management_status?.type=='approved'){
        KpisStore.showKpiScoreUpdateTab=true;
        setTimeout(() => {
          this.noDataItem(true);
          this.subMenu(true);
        }, 50);
      }else{
        KpisStore.showKpiScoreUpdateTab=false;
        setTimeout(() => {
          this.noDataItem(false);
          this.subMenu(false);  
        }, 50);
      }
      this.pageChange(1);//list api
      this._utilityService.detectChanges(this._cdr);
    });
  }

  pageChange(newPage: number = null) {
    if (newPage) ImprovementPlansStore.setCurrentPage(newPage);
    this._improvementLansService.getItems(false,`&kpi_management_kpi_ids=${KpisStore.kpiId}`).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  noDataItem(flag){
    if(flag)
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_improvement_plans'});
    else
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
  }

  subMenu(flag){
  
    let subMenuItems=[];
    if(flag){
      subMenuItems = [
        {activityName: 'KM_KPI_IMPROVEMENT_PLAN_LIST', submenuItem: {type: 'search'}},
        {activityName: 'KM_KPI_IMPROVEMENT_PLAN_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_KM_KPI_IMPROVEMENT_PLAN', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_KM_KPI_IMPROVEMENT_PLAN', submenuItem: {type: 'export_to_excel'}},
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];
    }else{
      subMenuItems = [
        {activityName: 'KM_KPI_IMPROVEMENT_PLAN_LIST', submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];
    }
    this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
  }

  getDetails(id){
    ImprovementPlansStore.setImprovementPlansId(id);
    this._router.navigateByUrl('kpi-management/improvement-plans/' + id);
    ImprovementPlansStore.setPath(`/kpi-management/kpis/${KpisStore.kpiId}/improvement-plans`);
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:this._helperService.translateToUserLanguage('improvement_plans'),
      path:`/kpi-management/kpis/${KpisStore.kpiId}/improvement-plans`
    });
  }

  //edit start
  edit(id) {
    event.stopPropagation();

    this._improvementLansService.getItem(id).subscribe(res => {

      if(res){
        this.crubPath ={
          name:this._helperService.translateToUserLanguage('improvement_plans'),
          path:`/kpi-management/kpis/${KpisStore.kpiId}/improvement-plans`
        };
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

    this.selectedKpi={
      id: KpisStore.individualKpiDetails?.id,
      title: KpisStore.individualKpiDetails?.kpi?.title,
    }

    ImprovementPlansStore.unsetIndividualImprovementPlansDetails();
    this.improvementPlanObject.type = 'Add';
    this.improvementPlanObject.values=null;
    this.crubPath ={
      name:this._helperService.translateToUserLanguage('improvement_plans'),
      path:`/kpi-management/kpis/${KpisStore.kpiId}/improvement-plans`
    };
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
    this.crubPath=null;
  }

  sortTitle(type: string) {
    this._improvementLansService.sortList(type, null);
    this.pageChange();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }


  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.modalEventSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    KpisStore.unsetIndividualKpiDetails();//kpi detials
    ImprovementPlansStore.unSetImprovementPlans();//improvement plan list
    ImprovementPlansStore.searchText =null;
    SubMenuItemStore.searchText = '';
    this.popupControlEventSubscription.unsubscribe();
  }
}