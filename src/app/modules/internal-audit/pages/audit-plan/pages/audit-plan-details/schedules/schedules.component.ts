import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer ,autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditPlanScheduleService } from 'src/app/core/services/internal-audit/audit-plan-schedule/audit-plan-schedule.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditPlanScheduleMasterStore } from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit , OnDestroy{
  @ViewChild('chooseAuditors', { static: true }) chooseAuditors: ElementRef;

  auditorsObject = {
    component: 'Master',
    values: null,
    type: null,
    from:null
  };
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuditPlanStore = AuditPlanStore;
  AuditPlanScheduleMasterStore = AuditPlanScheduleMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  AppStore = AppStore;
  AuthStore = AuthStore;
  auditorAuditeeSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  exclude_ids_auditor = [];
  exclude_ids_auditee = [];
  department_ids=[];
  constructor(private _cdr: ChangeDetectorRef,
    private _auditPlanService: AuditPlanService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _auditPlanScheduleService: AuditPlanScheduleService,
    private _imageService:ImageServiceService,
    private _router: Router,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    AuditPlanScheduleMasterStore.individualLoaded=false
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems= this.getSub();
    
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            AuditPlanScheduleMasterStore.clearDocumentDetails();
            AuditPlanScheduleMasterStore.unSelectChecklist();
            AuditPlanScheduleMasterStore.checklistToDisplay = [];
            AuditPlanScheduleMasterStore.auditableItemToDisplay = [];
            AuditPlanScheduleMasterStore.unSelectAuditableItem();
          this.gotoAddPage();
            break;
            case "go_to_audit":
						this.gotoAuditDetails()
					  break;
            case "start_audit":
						this.gotoAddAudit()
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
    //   { type: 'new_modal' },
    //   { type: 'close', path: '../' }
    // ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.getAuditPlanSchedule();

  }

  getSub(){
    let subMenuItem;    
    subMenuItem = [                        
      { activityName: null, submenuItem: { type: 'close', path: '../' } },
    ];
    if(AuditPlanStore?.auditPlanDetails?.audit_plan_status?.type !='published'){                
      subMenuItem.splice(0,0,{ activityName: null, submenuItem: { type: 'new_modal' } })    
    }  
      if(AuditPlanScheduleMasterStore?.auditPlanScheduleDetails?.is_audited==true){                
        subMenuItem.splice(0,0,{ activityName: null, submenuItem: { type: 'go_to_audit' } })    
      }
      else if(AuditPlanStore?.auditPlanDetails?.audit_plan_status?.type=='published' && (AuthStore?.user?.id==AuditPlanStore?.auditPlanDetails?.audit_leader?.id || AuthStore?.user?.roles[0]?.id==1 ) ){
        subMenuItem.splice(0,0,{ activityName: null, submenuItem: { type: 'start_audit' } })            
      }
      // subMenuItem = [          
        //   { activityName: null, submenuItem: { type: 'go_to_audit' } },
        //   { activityName: null, submenuItem: { type: 'start_audit' } },
        //   { activityName: null, submenuItem: { type: 'new_modal' }},                    
        //   { activityName: null, submenuItem: { type: 'close', path: '../' } },
        // ];   
    return subMenuItem;
  }

  gotoAddAudit(){
    this._router.navigateByUrl("/internal-audit/audits/add-planned-audit");
  }

  gotoAuditDetails(){    
		this._router.navigateByUrl("/internal-audit/audits/"+AuditPlanScheduleMasterStore?.auditPlanScheduleDetails?.audit_plan?.audit?.id)
	}

  getAuditPlanSchedule(){
    AuditPlanStore.auditSchedules = null;
    let params = `&audit_plan_ids=${AuditPlanStore.auditPlan_id}`;
    this._auditPlanScheduleService.getItems(false,params).subscribe(res=>{

      if(res.data.length>0 && AuditPlanScheduleMasterStore.new_schedule_id==null){
      // this._auditPlanService.getAuditPlanSchedule(res.audit_plan_schedules);
      this.getAuditSChedule(res.data[0].id);
    } 
    if(AuditPlanScheduleMasterStore.allItems.length>0 && AuditPlanScheduleMasterStore.new_schedule_id!=null){
      this.getAuditSChedule(AuditPlanScheduleMasterStore.new_schedule_id);
    }
      this._utilityService.detectChanges(this._cdr);
    })
   if(AuditPlanStore?.auditPlanDetails?.audit_plan_status?.id!=1){
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }
    ]);
   }
  }

  getAuditSChedule(id:number){
    this.exclude_ids_auditor = [];
    this.exclude_ids_auditee = [];
    this.department_ids=[];
    this._auditPlanScheduleService.getItem(id).subscribe(res=>{
      // AuditPlanScheduleMasterStore.auditPlanScheduleDetails.auditors.forEach(item=>{
      //   this.exclude_ids_auditor.push(item.id);
      // })
      // AuditPlanScheduleMasterStore.auditPlanScheduleDetails.auditees.forEach(element=>{
      //   this.exclude_ids_auditee.push(element.id);
      // })
      // console.log(res)
      this.exclude_ids_auditor=this.getItemIds(AuditPlanScheduleMasterStore.auditPlanScheduleDetails.auditors)
      this.exclude_ids_auditee=this.getItemIds(AuditPlanScheduleMasterStore.auditPlanScheduleDetails.auditees)
      this.department_ids=this.getItemIds(res.department)
      this._utilityService.detectChanges(this._cdr);
    })
    this._auditPlanService.setSelected(id);
  }

  getItemIds(data){
    let idArray=[];
    if(data.length > 0){
      data.forEach(element => {
        idArray.push(element.id)
      });
    }
    else
    idArray.push(data.id)
    return idArray
  }


  openAuditorAdddModal() {
    setTimeout(() => {
      $(this.chooseAuditors.nativeElement).modal('show');
    }, 100);
    this.auditorsObject.values = {
      schedule_id: AuditPlanScheduleMasterStore?.auditPlanScheduleDetails?.id,
      audit_program_id: AuditPlanScheduleMasterStore?.auditPlanScheduleDetails?.audit_plan.audit_program?.id,
      exclude_ids : this.exclude_ids_auditor,
    }
    this.auditorsObject.type = 'auditor';
    this.auditorsObject.from = 'plan_schedule';
    AuditPlanScheduleMasterStore.new_schedule_id = AuditPlanScheduleMasterStore?.auditPlanScheduleDetails?.id
  }

  openAuditeeAddModal() {
    setTimeout(() => {
      $(this.chooseAuditors.nativeElement).modal('show');
    }, 100);
    this.auditorsObject.values = {
      schedule_id: AuditPlanScheduleMasterStore?.auditPlanScheduleDetails?.id,
      exclude_ids : this.exclude_ids_auditee, 
      department_ids:this.department_ids
    }
    this.auditorsObject.type = 'auditee';
    this.auditorsObject.from = 'plan_schedule';
    AuditPlanScheduleMasterStore.new_schedule_id = AuditPlanScheduleMasterStore?.auditPlanScheduleDetails?.id
  }

  closeModal() {
    $(this.chooseAuditors.nativeElement).modal('hide');
    this.auditorsObject.type = null;
    this.auditorsObject.values = null;
    this.exclude_ids_auditor = [];
    this.exclude_ids_auditee = [];
    this.auditorsObject.from = null;
    
    this.getAuditPlanSchedule();
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
      status_id:null,
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

  gotoAddPage(){
    AuditPlanScheduleMasterStore.clearDocumentDetails();
    AuditPlanScheduleMasterStore.unSelectChecklist();
    AuditPlanScheduleMasterStore.checklistToDisplay = [];
    AuditPlanScheduleMasterStore.auditableItemToDisplay = [];
    AuditPlanScheduleMasterStore.unSelectAuditableItem();
    this._router.navigateByUrl('internal-audit/audit-plans/new-schedule');
    this._utilityService.detectChanges(this._cdr);
  }

  editPlanSchedule(){
    this._router.navigateByUrl('internal-audit/audit-plans/edit-audit-plan-schedule');
    this._utilityService.detectChanges(this._cdr);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AuditPlanScheduleMasterStore.new_schedule_id = null;
    this.auditorAuditeeSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AuditPlanScheduleMasterStore.individualLoaded = false;
  }



}
