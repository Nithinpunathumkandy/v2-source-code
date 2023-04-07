import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { MsAuditProgramsService } from 'src/app/core/services/ms-audit-management/ms-audit-programs/ms-audit-programs.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-plan',
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss']
})
export class AuditPlanComponent implements OnInit, OnDestroy {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MsAuditPlansStore = MsAuditPlansStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  modalEventSubscription: any;
  popupControlEventSubscription: any;

  MsAuditPlansObject = {
    type:null,
    values: null,
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  selectedProgram:any=null;
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
    private _msAuditPlansService: MsAuditPlansService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _msAuditProgramsService: MsAuditProgramsService,//extra
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MsAuditPlansStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });
    RightSidebarLayoutStore.filterPageTag = 'audit_mangement_ms_audit_plans';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'department_ids',
      'ms_lead_auditor_ids',
      'ms_auditor_ids',
      'ms_audit_mode_ids',
      'ms_audit_plan_status_ids',
    ]);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_programs",
        path:`/ms-audit-management/ms-audit-programs`
      });
    }
    this.setMenu();
    
    this.reactionDisposer = autorun(() => {

      this.setMenu();
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addMsAuditPlans();
            break; 
          case "export_to_excel":
              this._msAuditPlansService.exportToExcel();
            break;
          case "template":
            this._msAuditPlansService.generateTemplate();
            break;
          case "search":
              MsAuditPlansStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            MsAuditPlansStore.searchText = '';
            MsAuditPlansStore.loaded = false;
            this.pageChange(1);
            break;	  
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addMsAuditPlans();
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

    this.getProgramDetails();
    this.pageChange(1);
    
  }

  getProgramDetails(){//is this api call bring add form detial selection and refrish data missing aviding
    this._msAuditProgramsService.getItem(MsAuditProgramsStore.msAuditProgramsId).subscribe(res => {
      this.setMenu();
      this.setSubNoData();
    this._utilityService.detectChanges(this._cdr);
    });
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditPlansStore.setCurrentPage(newPage);
    this._msAuditPlansService.getItems(false,`&ms_audit_program_ids=${MsAuditProgramsStore.msAuditProgramsId}`).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getDetails(id){
    MsAuditPlansStore.setMsAuditPlansId(id);
    MsAuditPlansStore.redirectAuditProgram=true;
    this._router.navigateByUrl('ms-audit-management/ms-audit-plans/' + id);
    MsAuditPlansStore.setPath(`/ms-audit-management/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/audit-plans`);
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"ms_audit_plans",
      path:`/ms-audit-management/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/audit-plans`
    });
  }
  
  setMenu(){
    let subMenuItems=[];
     if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')){
      subMenuItems = [
        {activityName: 'MS_AUDIT_PLAN_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_PLAN_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_MS_AUDIT_PLAN', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_MS_AUDIT_PLAN', submenuItem: {type: 'export_to_excel'}}
      ]
    }else{
      subMenuItems = [
        {activityName: 'MS_AUDIT_PLAN_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_PLAN_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'EXPORT_MS_AUDIT_PLAN', submenuItem: {type: 'export_to_excel'}}
      ]
    }
    
    this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
  }

  setSubNoData(){
     if(AuthStore.isRoleChecking('lead-auditor') ||  AuthStore.isRoleChecking('super-admin')){
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_ms_audit_plan'});
     }
     else{
       NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
     }
  }

  //edit start
  edit(id) {
    event.stopPropagation();
    this.selectedProgram={
      id: MsAuditProgramsStore.individualMsAuditProgramsDetails?.id,
      ms_audit_program_title: MsAuditProgramsStore.individualMsAuditProgramsDetails?.title,
      start_date: MsAuditProgramsStore.individualMsAuditProgramsDetails?.start_date,
      end_date :MsAuditProgramsStore.individualMsAuditProgramsDetails?.end_date,
    }

    this._msAuditPlansService.getItem(id).subscribe(res => {

      if(res){
        this.MsAuditPlansObject.type = 'Edit';
        MsAuditPlansStore.editFlag=true;
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
    this.popupObject.subtitle = 'are_you_sure_you_want_to_delete_this_ms_audit_plan';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // delete function call
  deleteItem(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._msAuditPlansService.delete(this.popupObject.id, `&ms_audit_program_ids=${MsAuditProgramsStore.msAuditProgramsId}`).subscribe(resp => {
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

  addMsAuditPlans(){
    this.selectedProgram={
      id: MsAuditProgramsStore.individualMsAuditProgramsDetails?.id,
      ms_audit_program_title: MsAuditProgramsStore.individualMsAuditProgramsDetails?.title,
      start_date: MsAuditProgramsStore.individualMsAuditProgramsDetails?.start_date,
      end_date :MsAuditProgramsStore.individualMsAuditProgramsDetails?.end_date,
      ms_audit_category:MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category,
      ms_type:MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_types
    }

    MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();
    this.MsAuditPlansObject.type = 'Add';
    this.MsAuditPlansObject.values=null;
    MsAuditPlansStore.editFlag=false;
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
    
    this.brudCrubAndCloseButtonScoure={
      name:"ms_audit_plans",
      path:`/ms-audit-management/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/audit-plans`
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
    this.MsAuditPlansObject.type = null;
  }

  sortTitle(type: string) {
    this._msAuditPlansService.sortList(type, null);
    this.pageChange();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MsAuditPlansStore.unSetMsAuditPlans();
    RightSidebarLayoutStore.showFilter = false;
    this.popupControlEventSubscription.unsubscribe();
    this.modalEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    MsAuditProgramsStore.unsetIndividualMsAuditProgramsDetails();//extra
  }

}
