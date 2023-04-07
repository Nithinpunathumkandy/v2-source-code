import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer,autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditPlanScheduleService } from 'src/app/core/services/internal-audit/audit-plan-schedule/audit-plan-schedule.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditPlanScheduleMasterStore } from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-plan-schedule-details',
  templateUrl: './audit-plan-schedule-details.component.html',
  styleUrls: ['./audit-plan-schedule-details.component.scss']
})
export class AuditPlanScheduleDetailsComponent implements OnInit , OnDestroy {
  @ViewChild('chooseAuditors', { static: true }) chooseAuditors: ElementRef;

  auditorsObject = {
    component: 'Master',
    values: null,
    type: null,
    from:null
  };
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  AuditPlanScheduleMasterStore = AuditPlanScheduleMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  auditorAuditeeSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  exclude_ids=[];
  exclude_ids_auditee = [];
  planId: number;
  auditPlanStatusId: number;
  constructor(private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _auditPlanScheduleService: AuditPlanScheduleService,
    private _internalAuditFileService: InternalAuditFileService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.gotoEditPage();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    // caling modal

    this.auditorAuditeeSubscription = this._eventEmitterService.auditorsAuditeesAddModalControl.subscribe(res => {
      this.closeModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    // setting submenu items
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'edit_modal' },
    //   { type: 'close', path: '../' }
    // ]);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; //
      AuditPlanScheduleMasterStore.planId = this.planId = id;
      this.getAuditPlanSchedule(id);
    })
  }

  getAuditPlanSchedule(id){
    this.exclude_ids = [];
    this.exclude_ids_auditee = [];
      this._auditPlanScheduleService.getItem(id).subscribe(res => {
      
        AuditPlanScheduleMasterStore.auditPlanScheduleDetails.auditors.forEach(item=>{
          this.exclude_ids.push(item.id);
        })
  
        AuditPlanScheduleMasterStore.auditPlanScheduleDetails.auditees.forEach(element=>{
          this.exclude_ids_auditee.push(element.id);
        })
        if(res){
          this.auditPlanStatusId = AuditPlanScheduleMasterStore.auditPlanScheduleDetails?.audit_plan?.audit_plan_status?.id;
          if(AuditPlanScheduleMasterStore.auditPlanScheduleDetails?.audit_plan?.audit_plan_status?.id == 1){
            SubMenuItemStore.setSubMenuItems([
              { type: 'edit_modal' },
              { type: 'close', path: '../' }
            ]);
          }else{
            SubMenuItemStore.setSubMenuItems([
              { type: 'close', path: '../' }
            ]);
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
      this._auditPlanScheduleService.setAuditPlanScheduleId(id);
  }

  openAuditorAdddModal() {
    setTimeout(() => {
      $(this.chooseAuditors.nativeElement).modal('show');
    }, 100);
    this.auditorsObject.values = {
      schedule_id: AuditPlanScheduleMasterStore.auditPlanScheduleDetails.id,
      audit_program_id: AuditPlanScheduleMasterStore.auditPlanScheduleDetails.audit_plan.audit_program.id,
      exclude_ids : this.exclude_ids
    }
    this.auditorsObject.type = 'auditor';
    this.auditorsObject.from = 'plan_schedule';
  }

  openAuditeeAddModal() {
    setTimeout(() => {
      $(this.chooseAuditors.nativeElement).modal('show');
    }, 100);
    this.auditorsObject.values = {
      schedule_id: AuditPlanScheduleMasterStore.auditPlanScheduleDetails.id,
      exclude_ids : this.exclude_ids_auditee
    }
    this.auditorsObject.type = 'auditee';
    this.auditorsObject.from = 'plan_schedule';
  }

  closeModal() {
    $(this.chooseAuditors.nativeElement).modal('hide');
    this.auditorsObject.type = null;
    this.auditorsObject.values = null;
    this.auditorsObject.from = null;
    this.exclude_ids = [];
    this.exclude_ids_auditee = [];
    this.getAuditPlanSchedule(this.planId);
    this._utilityService.detectChanges(this._cdr);
  }

  changeZIndex() {
    if ($(this.chooseAuditors.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.chooseAuditors.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.chooseAuditors.nativeElement, 'overflow', 'auto');
    }
  }
   // for user previrews
   assignUserValues(user) {
    if(user){
    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }

    userInfoObject.first_name = user?.first_name;
    userInfoObject.last_name = user?.last_name;
    if(!user.designation.title){
      userInfoObject.designation = user.designation;
    } else {
      userInfoObject.designation = user.designation?.title;
    }
    userInfoObject.image_token = user.image_token? user.image_token:user.image ? user.image?.token:null;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status_id
    userInfoObject.department = user?.department? user?.department: user?.department?.title ? user?.department?.title: null;
     return userInfoObject;
  }
  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  // Returns image url according to type and token
  createImageUrl(type, token) {
    return this._internalAuditFileService.getThumbnailPreview(type, token);
  }

  

  gotoEditPage(){
      this._router.navigateByUrl('/internal-audit/audit-plan-schedules/edit-audit-plan-schedule');
      this._utilityService.detectChanges(this._cdr);
    
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.auditorAuditeeSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
