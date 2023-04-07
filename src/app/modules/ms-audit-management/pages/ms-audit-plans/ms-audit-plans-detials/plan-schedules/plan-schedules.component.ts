import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-plan-schedules',
  templateUrl: './plan-schedules.component.html',
  styleUrls: ['./plan-schedules.component.scss']
})
export class PlanSchedulesComponent implements OnInit ,OnDestroy {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MsAuditSchedulesStore = MsAuditSchedulesStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  modalEventSubscription: any;
  popupControlEventSubscription: any;
  planStatus : any= [];

  MsAuditSchedulesObject = {
    type:null,
    values: null,
  };

  
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  
  selectedPlan:any=null;
  brudCrubAndCloseButtonScoure:any=null;
  filterSubscription: Subscription = null;

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _msAuditPlansService: MsAuditPlansService, //extra
    private _msAuditSchedulesService: MsAuditSchedulesService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_plans",
        path: MsAuditPlansStore.path
      });
    }

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MsAuditSchedulesStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    RightSidebarLayoutStore.filterPageTag = 'audit_mangement_ms_audit_schedules';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'department_ids',
      'ms_lead_auditor_ids',
      //'ms_audit_plan_id',
      'ms_audit_program_ids',
      'ms_audit_schedule_status_ids',
    ]);


    this.getPlanDetails();
    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addMsAuditSchedule();
            break; 
          case "export_to_excel":
              this._msAuditSchedulesService.exportToExcel('?ms_audit_plan_ids='+MsAuditPlansStore.msAuditPlansId);
            break;
          case "template":
            this._msAuditSchedulesService.generateTemplate();
            break;
          case "search":
              MsAuditSchedulesStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            MsAuditSchedulesStore.searchText = '';
            MsAuditSchedulesStore.loaded = false;
            this.pageChange(1);
            break;	  
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
       
        this.addMsAuditSchedule();
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
    this.pageChange(1);
  }

  getPlanDetails(){
    this._msAuditPlansService.getItem(MsAuditPlansStore.msAuditPlansId).subscribe(res => {
      this.setMenu(res.ms_audit_plan_review_update[res.ms_audit_plan_review_update.length-1]?.workflow_status_id);
      this.setSubNoData(res.ms_audit_plan_review_update[res.ms_audit_plan_review_update.length-1]?.workflow_status_id);    
      this.planStatus = res
      
    this._utilityService.detectChanges(this._cdr);
    });
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditSchedulesStore.setCurrentPage(newPage);
    this._msAuditSchedulesService.getItems(false,`&ms_audit_plan_ids=${MsAuditPlansStore.msAuditPlansId}`).subscribe((res) => {
      if(res.data.length==0)
      {
        this.getPlanDetails();
      }
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);
    });
  }

  setMenu(res){
    let subMenuItems=[];
    
    if(MsAuditPlansStore.individualMsAuditPlansDetails.workflow_items.length==0 ){
      subMenuItems = [
        {activityName: 'MS_AUDIT_SCHEDULE_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_SCHEDULE_LIST', submenuItem: {type: 'refresh'}},
        //{activityName: 'CREATE_MS_AUDIT_SCHEDULE', submenuItem: {type: 'new_modal'}},
        // {activityName: 'EXPORT_MS_AUDIT_SCHEDULE', submenuItem: {type: 'export_to_excel'}},
        // { activityName: null, submenuItem: { type: 'close',path: MsAuditPlansStore.path} },
      ];
      if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin') && (MsAuditPlansStore?.individualMsAuditPlansDetails?.ms_audit_plan_status?.type=='draft'))
      {
        subMenuItems.push({activityName: 'CREATE_MS_AUDIT_SCHEDULE', submenuItem: {type: 'new_modal'}})
      }
    }else{
      subMenuItems = [
        {activityName: 'MS_AUDIT_SCHEDULE_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_SCHEDULE_LIST', submenuItem: {type: 'refresh'}},
        // {activityName: 'EXPORT_MS_AUDIT_SCHEDULE', submenuItem: {type: 'export_to_excel'}},
        // { activityName: null, submenuItem: { type: 'close',path: MsAuditPlansStore.path} },
      ]
      if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin') && 
      (MsAuditPlansStore?.individualMsAuditPlansDetails?.ms_audit_plan_status?.type=='draft'))
      {
        subMenuItems.push({activityName: 'CREATE_MS_AUDIT_SCHEDULE', submenuItem: {type: 'new_modal'}})
      }
    }
    subMenuItems.push({activityName: 'EXPORT_MS_AUDIT_SCHEDULE', submenuItem: {type: 'export_to_excel'}})
    subMenuItems.push({activityName: null, submenuItem: { type: 'close',path: MsAuditPlansStore.path} })
    
    this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
  }
  setSubNoData(res){
       
    if((AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')) 
    && (MsAuditPlansStore?.individualMsAuditPlansDetails?.ms_audit_plan_status?.type=='draft')){   
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_ms_audit_schedule'});
    }else{
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
    }
  }

  isAuditees(){
    if(MsAuditPlansStore.individualMsAuditPlansDetails?.auditors?.length>0){
      return MsAuditPlansStore.individualMsAuditPlansDetails?.auditors?.find(element=>element?.id==AuthStore.user?.id)
    }else{
      return false;
    }
  }

  isAuditLeader(){
    return MsAuditPlansStore.individualMsAuditPlansDetails?.lead_auditor?.id==AuthStore.user?.id;
  }

  getDetails(id){
    MsAuditSchedulesStore.setMsAuditSchedulesId(id);
    this._router.navigateByUrl('ms-audit-management/ms-audit-schedules/' + id);
    MsAuditSchedulesStore.setPath(`/ms-audit-management/ms-audit-plans/${MsAuditPlansStore.msAuditPlansId}/ms-audit-schedules`);
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"ms_audit_schedules",
      path:`/ms-audit-management/ms-audit-plans/${MsAuditPlansStore.msAuditPlansId}/ms-audit-schedules`
    });
  }

  //edit start
  edit(id) {
    event.stopPropagation();

    this._msAuditSchedulesService.getItem(id).subscribe(res => {

      if(res){
        this.MsAuditSchedulesObject.type = 'Edit';
        MsAuditSchedulesStore.editFlag=true;
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
    this.popupObject.subtitle = 'are_you_sure_you_want_to_delete_this_ms_audit_schedule';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // delete function call
  deleteItem(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._msAuditSchedulesService.delete(this.popupObject.id, `&ms_audit_plan_ids=${MsAuditPlansStore.msAuditPlansId}`).subscribe(resp => {
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

  addMsAuditSchedule(){
   //this.getPlanDetails()
    this.selectedPlan={
      id: MsAuditPlansStore.individualMsAuditPlansDetails?.id,
      title: MsAuditPlansStore.individualMsAuditPlansDetails?.title,
    }
    console.log( this.selectedPlan)
    MsAuditSchedulesStore.unsetIndividualMsAuditSchedulesDetails();
    if(MsAuditPlansStore.individualLoaded){
      this.MsAuditSchedulesObject.type = 'Add';
      this.MsAuditSchedulesObject.values=null;
      MsAuditSchedulesStore.editFlag=false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }

  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);

    this.brudCrubAndCloseButtonScoure={
      name:'ms_audit_schedules',
      path:`/ms-audit-management/ms-audit-plans/${MsAuditPlansStore.msAuditPlansId}/ms-audit-schedules`
    }
  }

  closeFormModal() {
    this.pageChange(1); //it empty list add new date fix
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.MsAuditSchedulesObject.type = null;
  }

  sortTitle(type: string) {
    this._msAuditSchedulesService.sortList(type, null);
    this.pageChange();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MsAuditSchedulesStore.unSetMsAuditSchedules();
    RightSidebarLayoutStore.showFilter = false;
    this.popupControlEventSubscription.unsubscribe();
    this.modalEventSubscription.unsubscribe();
    MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();//extra
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}



