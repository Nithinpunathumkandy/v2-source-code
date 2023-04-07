import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit ,OnDestroy {
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

  brudCrubAndCloseButtonScoure:any=null;

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _msAuditSchedulesService: MsAuditSchedulesService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_programs",
        path:`/ms-audit-management/ms-audit-programs`
      });
    }

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_AUDIT_SCHEDULE_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_SCHEDULE_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_MS_AUDIT_SCHEDULE', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_MS_AUDIT_SCHEDULE', submenuItem: {type: 'export_to_excel'}}
      ]
      
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_ms_audit_schedule'});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addMsAuditPrograms();
            break; 
          case "export_to_excel":
              this._msAuditSchedulesService.exportToExcel();
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

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditSchedulesStore.setCurrentPage(newPage);
    this._msAuditSchedulesService.getItems(false,`&ms_audit_program_id=${MsAuditProgramsStore.msAuditProgramsId}`).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getDetails(id){
    MsAuditSchedulesStore.setMsAuditSchedulesId(id);
    this._router.navigateByUrl('ms-audit-management/ms-audit-schedules/' + id);
    MsAuditSchedulesStore.setPath(`/ms-audit-management/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/ms-audit-schedules`);
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"ms_audit_schedules",
      path:`/ms-audit-management/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/ms-audit-schedules`
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
  
      this._msAuditSchedulesService.delete(this.popupObject.id, `&ms_audit_program_id=${MsAuditProgramsStore.msAuditProgramsId}`).subscribe(resp => {
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
    MsAuditSchedulesStore.unsetIndividualMsAuditSchedulesDetails();
    this.MsAuditSchedulesObject.type = 'Add';
    this.MsAuditSchedulesObject.values=null;
    MsAuditSchedulesStore.editFlag=false;
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
      name:'ms_audit_schedules',
      path:`/ms-audit-management/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/ms-audit-schedules`
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
  }

}


