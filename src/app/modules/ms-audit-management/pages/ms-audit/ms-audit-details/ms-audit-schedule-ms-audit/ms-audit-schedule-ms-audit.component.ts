import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit.service';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
declare var $: any;
@Component({
  selector: 'app-ms-audit-schedule-ms-audit',
  templateUrl: './ms-audit-schedule-ms-audit.component.html',
  styleUrls: ['./ms-audit-schedule-ms-audit.component.scss']
})
export class MsAuditScheduleMsAuditComponent implements OnInit,OnDestroy {
  @ViewChild('startMSAudit') startMSAudit: ElementRef;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MsAuditSchedulesStore = MsAuditSchedulesStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsAuditPlansStore=MsAuditPlansStore;
  MsAuditStore=MsAuditStore;
  startAuditSubscription:any;
  startMsAuidtPopup = {
    type:null,
    values: null,
  };
  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService,
    private _msAuditSchedulesService: MsAuditSchedulesService,
    private _helperService: HelperServiceService,
    private _msAuditService: MsAuditService,
    private _eventEmitterService:EventEmitterService,
    private _humanCapitalService: HumanCapitalService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
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

    })
    this.getMsAudit();
    this.startAuditSubscription = this._eventEmitterService.startMsAuditModal.subscribe(res => {
      this.closeStartMsAuidtModal();
    
    })
  }

   isAuditLeader(){
    //console.log(MsAuditStore?.individualMsAuditDetails?.ms_audit_plan?.lead_auditor_id)
    
     return MsAuditStore?.individualMsAuditDetails?.ms_audit_plan?.lead_auditor_id==AuthStore.user?.id;
  }

  getMsAudit()
  {
    this._msAuditService.getItem(MsAuditStore.msAuditId).subscribe
      (res=>{
      //this.selectedScheduleId=res?.ms_audit_plan?.ms_auditschedules[0].id;
      // this.isAuditLeader();
      this.pageChange(1);
    });
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditSchedulesStore.setCurrentPage(newPage);
    this._msAuditSchedulesService.getItems(false,`&ms_audit_plan_ids=${MsAuditPlansStore.msAuditPlansId}`).subscribe(() => {
      if(MsAuditSchedulesStore.allItems.length==0)
      {
        NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
      }
      this.setMenu();
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);
    });
  }

  setMenu(){
    let subMenuItems=[];
  
      subMenuItems = [
        {activityName: 'MS_AUDIT_SCHEDULE_LIST', submenuItem: {type: 'search'}},
        {activityName: 'MS_AUDIT_SCHEDULE_LIST', submenuItem: {type: 'refresh'}},
      ]
    subMenuItems.push({activityName: 'EXPORT_MS_AUDIT_SCHEDULE', submenuItem: {type: 'export_to_excel'}})
    subMenuItems.push({activityName: null, submenuItem: { type: 'close',path: '/ms-audit-management/ms-audits'} })
    
    this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
  }

  getDetails(id){
    MsAuditSchedulesStore.setMsAuditSchedulesId(id);
    this._router.navigateByUrl('ms-audit-management/ms-audit-schedules/' + id);
    MsAuditSchedulesStore.setPath('/ms-audit-management/ms-audits/'+MsAuditStore?.msAuditId+'/schedules');
    MsAuditStore.scheduleRedirect=true;
   
  }

  sortTitle(type: string) {
    this._msAuditSchedulesService.sortList(type, null);
    this.pageChange();
  }

  startAudit(event,id)
  {
    event.stopPropagation;
    this._msAuditSchedulesService.getItem(id).subscribe(res => {
      //MsAuditPlansStore.setMsAuditPlansId(res?.audit_plan_details?.id);
      this.openAuditModal();
      this._utilityService.detectChanges(this._cdr);
    });
    
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  openAuditModal() {
    this.startMsAuidtPopup.values = MsAuditSchedulesStore.individualMsAuditSchedulesDetails;
    setTimeout(() => {
      $(this.startMSAudit.nativeElement).modal('show');
      this._renderer2.setStyle(this.startMSAudit.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.startMSAudit.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.startMSAudit.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeStartMsAuidtModal() {
    MsAuditSchedulesStore.individualLoaded=false;
    //this.getDetails(MsAuditSchedulesStore.msAuditSchedulesId);
    this.pageChange(1);
    $(this.startMSAudit.nativeElement).modal('hide');
    this._renderer2.setStyle(this.startMSAudit.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.startMSAudit.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.startMSAudit.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.startMsAuidtPopup.type = null;
    AppStore.showDiscussion = false;
  }

 ngOnDestroy(): void {
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  MsAuditSchedulesStore.unSetMsAuditSchedules();
  this.startAuditSubscription.unsubscribe();
 }
}
