import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MsAuditProgramsService } from 'src/app/core/services/ms-audit-management/ms-audit-programs/ms-audit-programs.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditDashboardStore } from 'src/app/stores/ms-audit-management/dashboard/audit-dashboard.store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ms-audit-programs-list',
  templateUrl: './ms-audit-programs-list.component.html',
  styleUrls: ['./ms-audit-programs-list.component.scss']
})
export class MsAuditProgramsListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MsAuditProgramsStore = MsAuditProgramsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  filterSubscription: Subscription = null;
  modalEventSubscription: any;
  popupControlEventSubscription: any;

  MsAuditProgramsObject = {
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
    private _humanCapitalService: HumanCapitalService,
    private _msAuditProgramsService: MsAuditProgramsService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MsAuditProgramsStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });
    RightSidebarLayoutStore.filterPageTag = 'audit_mangement_ms_audit_porgrams';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'ms_audit_category_ids',
      'team_lead_ids',
      'team_user_ids',
      'ms_type_ids'
    ]);

    this.reactionDisposer = autorun(() => {

      this.setMenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addMsAuditPrograms();
            break; 
          case "export_to_excel":
              this._msAuditProgramsService.exportToExcel();
            break;
          case "template":
            this._msAuditProgramsService.generateTemplate();
            break;
          case "search":
              MsAuditProgramsStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            MsAuditProgramsStore.searchText = '';
            MsAuditProgramsStore.loaded = false;
            this.pageChange(1);
            break;	  
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addMsAuditPrograms();
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
   
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditProgramsStore.setCurrentPage(newPage);
    this._msAuditProgramsService.getItems(false,AuditDashboardStore.filterParams ? AuditDashboardStore.filterParams : null).subscribe(() => {
      //this.setMenu();
      this.setSubNoData();
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  setMenu(){
    let subMenuItems=[];
     if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')){
      subMenuItems = [
        {activityName: 'MS_AUDIT_PROGRAM_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_PROGRAM_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_MS_AUDIT_PROGRAM', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_MS_AUDIT_PROGRAM', submenuItem: {type: 'export_to_excel'}},
        { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/dashboard' } },
      ]
      
    }else{
      subMenuItems = [
        {activityName: 'MS_AUDIT_PROGRAM_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_PROGRAM_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'EXPORT_MS_AUDIT_PROGRAM', submenuItem: {type: 'export_to_excel'}},
        { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/dashboard' } },
      ]  
    }
    
    this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

  }

  setSubNoData(){
     if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')){
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_ms_audit_programs'});
     }else{
       NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
     }
  }


  getDetails(id){
    MsAuditProgramsStore.setMsAuditProgramsId(id);
    this._router.navigateByUrl('ms-audit-management/ms-audit-programs/' + id);
  }

  //edit start
  edit(id) {
    event.stopPropagation();

    this._msAuditProgramsService.getItem(id).subscribe(res => {

      if(res){
        this.MsAuditProgramsObject.type = 'Edit';
        MsAuditProgramsStore.editFlag=true;
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
    this.popupObject.subtitle = 'are_you_sure_you_want_to_delete_this_ms_audit_program';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // delete function call
  deleteItem(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._msAuditProgramsService.delete(this.popupObject.id).subscribe(resp => {
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

  addMsAuditPrograms(){
    MsAuditProgramsStore.unsetIndividualMsAuditProgramsDetails();
    this.MsAuditProgramsObject.type = 'Add';
    this.MsAuditProgramsObject.values=null;
    MsAuditProgramsStore.editFlag=false;
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
    this.pageChange(1); //it empty list add new date fix
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.MsAuditProgramsObject.type = null;
  }

  sortTitle(type: string) {
    this._msAuditProgramsService.sortList(type, null);
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
    MsAuditProgramsStore.unSetMsAuditPrograms();
    MsAuditProgramsStore.searchText =null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlEventSubscription.unsubscribe();
    MsAuditProgramsStore.setCurrentPage(1);
  }

}
