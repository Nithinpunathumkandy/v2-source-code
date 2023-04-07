import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer , autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditPlanScheduleService } from 'src/app/core/services/internal-audit/audit-plan-schedule/audit-plan-schedule.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditPlanScheduleMasterStore } from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-audit-plan-schedule-list',
  templateUrl: './audit-plan-schedule-list.component.html',
  styleUrls: ['./audit-plan-schedule-list.component.scss']
})
export class AuditPlanScheduleListComponent implements OnInit , OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuditPlanScheduleMasterStore = AuditPlanScheduleMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuditPlanStore = AuditPlanStore;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  AuthStore = AuthStore;

  popupControlAuditableEventSubscription: any;
  constructor(  private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _auditPlanScheduleService: AuditPlanScheduleService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _renderer2: Renderer2,) { }

  ngOnInit(): void { 
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: 'CREATE_AUDIT_PLAN_SCHEDULE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_AUDIT_PLAN_SCHEDULE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDIT_PLAN_SCHEDULE', submenuItem: {type: 'export_to_excel'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AUDIT_PLAN_SCHEDULE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.AuditPlanStore.auditPlan_id = null;
            this.AuditPlanScheduleMasterStore.clearDocumentDetails();
            this.AuditPlanScheduleMasterStore.unSelectAuditableItem();
            this.AuditPlanScheduleMasterStore.unSelectChecklist();
            this.gotoAddPage();
            break;
          case "template":
          this._auditPlanScheduleService.generateTemplate();
            break;
          case "export_to_excel":
          this._auditPlanScheduleService.exportToExcel();
            break;
          case "search":
            AuditPlanScheduleMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;

          
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.gotoAddPage();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_audit_plan_schedule'});

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'search' },
      {type:'new_modal'},
      { type: 'template' },
      { type: 'export_to_excel' ,path:'internal-audit' }

    ]);

    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) AuditPlanScheduleMasterStore.setCurrentPage(newPage);
    this._auditPlanScheduleService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  gotoAddPage(){
    this._router.navigateByUrl('/internal-audit/audit-plan-schedules/add-audit-plan-schedule');
  }

  getAuditPlanSchedule(id: number){
    this._router.navigateByUrl('/internal-audit/audit-plan-schedules/'+id);
  }

  editAuditPlanSchedule(id:number){
    event.stopPropagation();
    this._auditPlanScheduleService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('/internal-audit/audit-plan-schedules/edit-audit-plan-schedule');
      this._utilityService.detectChanges(this._cdr)
    });
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditProgram(status)
        break;
    }

  }


  // delete function call
  deleteAuditProgram(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditPlanScheduleService.delete(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Audit Program?';
    this.popupObject.subtitle = 'delete_plan_schedule'; 

    $(this.confirmationPopUp.nativeElement).modal('show');

  }



   // for sorting
   sortTitle(type: string) {
    // AuditPlanScheduleMasterStore.setCurrentPage(1);
    this._auditPlanScheduleService.sortAuditPlanSCheduleList(type, SubMenuItemStore.searchText);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditPlanScheduleMasterStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlAuditableEventSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    AuditPlanStore.searchText = '';
  }



}
