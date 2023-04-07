import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MsAuditService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $ : any;
@Component({
  selector: 'app-ms-audit-list',
  templateUrl: './ms-audit-list.component.html',
  styleUrls: ['./ms-audit-list.component.scss']
})
export class MsAuditListComponent implements OnInit {
  @ViewChild ('confirmationPopUp') confirmationPopUp :ElementRef;
  @ViewChild ('formModal') formModal : ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  MsAuditStore = MsAuditStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  popupControlEventSubscription: any;
  modalEventSubscription : any;
  reactionDisposer: IReactionDisposer;
  selectedMsAudit:any=null;

  popupObject ={
    type: '',
    title: '',
    id: null,
    subtitle: ''
  }

  MsAuditObject = {
    type: '',
    values: ''
  }
  filterSubscription: Subscription = null;

  constructor(
    private _msAuditService: MsAuditService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MsAuditStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    RightSidebarLayoutStore.filterPageTag = 'ms_audits';
    this._rightSidebarFilterService.setFiltersForCurrentPage([   
      //'department_ids',
      'ms_lead_auditor_ids',
      'ms_auditor_ids',
      'ms_audit_plan_ids',
      'ms_audit_status_ids',
      //'ms_audit_category_ids',
    ]);

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_AUDIT_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_LIST', submenuItem: {type: 'refresh'}},
        //{activityName: 'CREATE_MS_AUDIT', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_MS_AUDIT', submenuItem: {type: 'export_to_excel'}},
        { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/dashboard' } },
      ]
      
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      // NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addMsAudit();
            break; 
          case "export_to_excel":
              this._msAuditService.exportToExcel();
            break;
          // case "template":
          //   this._msAuditService.generateTemplate();
          //   break;
          case "search":
              MsAuditStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            MsAuditStore.searchText = '';
            MsAuditStore.loaded = false;
            this.pageChange(1);
            break;	  
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addMsAudit();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

     // for delete/activate/deactivate using delete modal
     this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    this.pageChange(1);
    
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditStore.setCurrentPage(newPage);
    this._msAuditService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  
  isAuditLeader(row){
    return row?.lead_auditor_id==AuthStore.user?.id;
  }

  isAuditorUsers(auditorUserIds){
    let array=[];
    if(auditorUserIds){
      array=auditorUserIds.split(',');
      return array.find(element=>element==AuthStore.user?.id);
    }else{
      return false;
    }
  }


  getDetails(id){
    MsAuditStore.setMsAuditId(id);
    this._router.navigateByUrl('ms-audit-management/ms-audits/' + id);
  }

  addMsAudit(){
    MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();
    // MsAuditStore.unsetIndividualMsAuditDetails();
    this.MsAuditObject.type = 'Add';
    this.MsAuditObject.values=null;
    MsAuditStore.editFlag=false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  //  //edit start

  edit(id) {
    event.stopPropagation();

    this._msAuditService.getItem(id).subscribe(res => {

      if(res){
        this.MsAuditObject.type = 'Edit';
        MsAuditStore.editFlag=true;
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
      
    });
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
    // this.getMsAuditDetials();
    this.MsAuditObject.type = null;
    this.pageChange(1);
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.MsAuditObject.type = null;
  }

  // getMsAuditDetials(){
  //   this._msAuditService.getItem(MsAuditPlansStore.msAuditPlansId).subscribe(res=>{
  //     this.pageChange(1);//list api
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  // }

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
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // delete function call
  deleteItem(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._msAuditService.delete(this.popupObject.id).subscribe(resp => {
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

  
  createImageUrl(token) { 
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  sortTitle(type: string) {
    this._msAuditService.sortList(type, null);
    this.pageChange();
  }

  ngOnDestroy(){
    this.popupControlEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    MsAuditStore.unSetMsAudit();
    MsAuditStore.searchText =null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    MsAuditStore.scheduleRedirect=false;
  }

}
