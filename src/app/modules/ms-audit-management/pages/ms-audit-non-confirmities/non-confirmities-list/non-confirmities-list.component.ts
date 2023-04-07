import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { MsAuditNonConfirmitiesService } from 'src/app/core/services/ms-audit-management/ms-audit-non-confirmities/ms-audit-non-confirmities.service';
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditDashboardStore } from 'src/app/stores/ms-audit-management/dashboard/audit-dashboard.store';
import { MsAuditNonConfirmitiesStore } from 'src/app/stores/ms-audit-management/ms-audit-non-confirmities/ms-audit-non-confirmities.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $:any;

@Component({
  selector: 'app-non-confirmities-list',
  templateUrl: './non-confirmities-list.component.html',
  styleUrls: ['./non-confirmities-list.component.scss']
})
export class NonConfirmitiesListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('nonConformity') nonConformity : ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsAuditNonConfirmitiesStore=MsAuditNonConfirmitiesStore
  filterSubscription: Subscription = null;
  modalEventSubscription: any;
  popupControlEventSubscription: any;
  selectedIndex:number;
  nonConformityObject = {
    value : null,
    type : '',
    component : 'submenu'
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  controlNonConiformitySubscriptionEvent: Subscription;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _nonConfirmitiesService:MsAuditNonConfirmitiesService,
    private _router:Router,
    private _auditNonConfirmityService : AuditNonConfirmityService,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MsAuditNonConfirmitiesStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });
    RightSidebarLayoutStore.filterPageTag = 'audit_mangement_non_confirmities';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'department_ids',
      'ms_audit_finding_status_ids',
      'ms_audit_ids',
      'ms_audit_program_ids',
      'ms_audit_finding_category_ids',
      'ms_audit_plan_ids'
    ]);
    
       
      
     NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/dashboard' } },
        //{activityName: 'CREATE_MS_AUDIT_PLAN', submenuItem: {type: 'new_modal'}},
         
      ]
      // if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin') || AuthStore.isRoleChecking('auditor'))
      // {
      //   subMenuItems.push({activityName: 'CREATE_MS_AUDIT_PLAN', submenuItem: {type: 'new_modal'}});
      // }
      subMenuItems.push({activityName: 'EXPORT_MS_AUDIT_PLAN', submenuItem: {type: 'export_to_excel'}});
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addNonConfirmity();
            break; 
          case "export_to_excel":
              this._nonConfirmitiesService.exportToExcel();
            break;
          
          case "search":
              MsAuditNonConfirmitiesStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            MsAuditNonConfirmitiesStore.searchText = '';
            MsAuditNonConfirmitiesStore.loaded = false;
            this.pageChange(1);
            break;	  
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addNonConfirmity();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    })

    this.controlNonConiformitySubscriptionEvent = this._eventEmitterService.msAuditNonConformity.subscribe(res => {
      this.closeNonConfirmityModal();
      this.pageChange(1)
   });

   this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.pageChange(1);
    
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditNonConfirmitiesStore.setCurrentPage(newPage);
    this._nonConfirmitiesService.getItems(false,AuditDashboardStore.filterParams ? AuditDashboardStore.filterParams : null ).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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

  addNonConfirmity(){
    this.nonConformityObject.type = 'Add';
    this.nonConformityObject.value = null;
    this._utilityService.detectChanges(this._cdr);
    this.openNonConfirmityModal();
   }

   openNonConfirmityModal(){
    setTimeout(() => {
      $(this.nonConformity.nativeElement).modal('show');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'display','block');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);

    }, 100);
   }

   closeNonConfirmityModal(){
    $(this.nonConformity.nativeElement).modal('hide');
    this.nonConformityObject.type = null;
    this.nonConformityObject.value = null
    this._utilityService.detectChanges(this._cdr);
  }
  
  getDetails(nonConformityDetails){
    AuditNonConfirmityStore.setmsAuditNonConfirmityId(nonConformityDetails.id);
    this._router.navigateByUrl(`ms-audit-management/findings/${nonConformityDetails.id}`);
    AuditNonConfirmityStore.setPath('/ms-audit-management/findings');
    // BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
    // BreadCrumbMenuItemStore.makeEmpty();
    // BreadCrumbMenuItemStore.addBreadCrumbMenu({
    //   name:"non_conformity",
    //   path:'/ms-audit-management/non-conformities'
    // });
  }

  
  sortTitle(type: string) {
    this._nonConfirmitiesService.sortList(type, null);
    this.pageChange();
  }

  edit(id:number){
    event.stopPropagation();
    this._auditNonConfirmityService.getIndividualCheckList(id).subscribe(res=>{
      this.nonConformityObject.type = "Edit";
      this.nonConformityObject.value = res;
      AuditNonConfirmityStore.editFlag=true;
      this.openNonConfirmityModal();
      this._utilityService.detectChanges(this._cdr);

    })
  }


  // delete 
  deleteNonConfirmity(id:number){
    event.stopPropagation();
          this.popupObject.type = 'are_you_sure';
          this.popupObject.id = id;
          this.popupObject.title = 'are_you_sure';
          this.popupObject.subtitle = 'it_will_remove_the_non_conformity_from_the_audit';
          this._utilityService.detectChanges(this._cdr);
          $(this.confirmationPopUp.nativeElement).modal('show');
      
  }

  readMore(index,type,event)
  {
    event.stopPropagation();
    if(type=="more")
    {
      this.selectedIndex=index
    }
    else{
      this.selectedIndex=null;
    }
    
  }

      // modal control event
      modalControl(status: boolean) {
        switch (this.popupObject.type) {
          case 'are_you_sure': this.deleteNonConfirmityItem(status)
            break;
        }
    
      }
    
        // delete function call
        deleteNonConfirmityItem(status: boolean) {
          if (status && this.popupObject.id) {
            this._auditNonConfirmityService.deleteNonConfirmity(this.popupObject.id).subscribe(resp => {
              setTimeout(() => {
                this._utilityService.detectChanges(this._cdr);
              }, 500);
              this.pageChange(1)
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


  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.controlNonConiformitySubscriptionEvent.unsubscribe();
    // this.modalEventSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    MsAuditNonConfirmitiesStore.unSetMsAuditNonConfirmities();
    MsAuditNonConfirmitiesStore.searchText =null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
     this.popupControlEventSubscription.unsubscribe();
    MsAuditNonConfirmitiesStore.setCurrentPage(1);
    AuditDashboardStore._filterParams = null
  }

}

