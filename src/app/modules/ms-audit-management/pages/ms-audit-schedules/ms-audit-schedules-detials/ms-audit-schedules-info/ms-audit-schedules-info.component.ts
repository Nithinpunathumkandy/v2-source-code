import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ms-audit-schedules-info',
  templateUrl: './ms-audit-schedules-info.component.html',
  styleUrls: ['./ms-audit-schedules-info.component.scss']
})
export class MsAuditSchedulesInfoComponent implements OnInit, OnDestroy {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild ('updateModal') updateModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('startMSAudit') startMSAudit: ElementRef;
  @ViewChild('activityLogsModal') activityLogsModal: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MsAuditSchedulesStore = MsAuditSchedulesStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProcessStore=ProcessStore;
  MsAuditPlansStore=MsAuditPlansStore;
  MsAuditStore=MsAuditStore;
  OrganizationModulesStore=OrganizationModulesStore;

  modalEventSubscription: any;
  updateEventSubscription: any;
  popupControlEventSubscription: any;
  startAuditSubscription:any;
  scheduleActivityLogsSubscription:any;

  MsAuditSchedulesObject = {
    type:null,
    values: null,
  };

  startMsAuidtPopup = {
    type:null,
    values: null,
  };

  popupObject = {
    type: '',
    id: null,
    position: null,
    title:'',
    subtitle:''
  };

  updateScoureObject={
    id:null,
    status_id:null,
  }
  
  constructor(  
    private _router:Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _msAuditSchedulesService: MsAuditSchedulesService,
  ) { }

  ngOnInit(): void {
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; 
      MsAuditSchedulesStore.setMsAuditSchedulesId(id);
      
    })
    this.getDetails(MsAuditSchedulesStore?.msAuditSchedulesId);
    AppStore.showDiscussion = false;
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
    //   BreadCrumbMenuItemStore.makeEmpty();
    //   BreadCrumbMenuItemStore.addBreadCrumbMenu({
    //     name:"ms_audit_schedules",
    //     path:`/ms-audit-management/ms-audit-schedules`
    //   });
    // }

    this.reactionDisposer = autorun(() => {
      
      this.subMenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "start_audit":
              this.startAudit();
            break;
          case "edit_modal":
              this.getEdit();
            break;
          case "delete":
            this.delete(MsAuditSchedulesStore.msAuditSchedulesId);
          break;
          case 'activity_log':
            this.activityLogsOpenModal();
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });
    
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.updateEventSubscription = this._eventEmitterService.MsAuditSchedulesUpdateModal.subscribe(res => {
      this.updateCloseModal(res);
    });

    this.startAuditSubscription = this._eventEmitterService.startMsAuditModal.subscribe(res => {
      this.closeStartMsAuidtModal();
    
    })
    this.scheduleActivityLogsSubscription = this._eventEmitterService.auditScheduleActivityLogsModal.subscribe(res => {
      this.activityLogsCloseModal();
    });
  }

  getDetails(id){
    this._msAuditSchedulesService.getItem(id).subscribe(res => {
      this.setPath();
      this.subMenu();
      MsAuditPlansStore.setMsAuditPlansId(res?.audit_plan_details?.id);
      this.setProcesses(MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.processes);
    this._utilityService.detectChanges(this._cdr);
    });
  }

  // it function use brud crud and close button navigation set 
  setPath(){
   

    if(!MsAuditStore?.scheduleRedirect &&  !MsAuditSchedulesStore.redirectMain)
    {
     // MsAuditSchedulesStore.setPath(`/ms-audit-management/ms-audit-plans/${MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.id}/ms-audit-schedules`);
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_schedules",
        path:`/ms-audit-management/ms-audit-plans/${MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.id}/ms-audit-schedules`
      });
    }
    else if(MsAuditStore?.scheduleRedirect){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audits",
        path:'/ms-audit-management/ms-audits/'+MsAuditStore?.msAuditId+'/schedules'
      });
    }
    else{
      // MsAuditSchedulesStore.setPath(``);
      // MsAuditSchedulesStore.setPath(`ms-audit-management/ms-audit-schedules`);
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_schedules",
        path:`/ms-audit-management/ms-audit-schedules`
      });
    }
    
  }

  subMenu(){
    let subMenuItems= [];
    if(MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_status?.type=='accepted' && 
    
    (this.isAuditLeader() || AuthStore.isRoleChecking('super-admin'))){
      subMenuItems = [
         { activityName: '', submenuItem: { type: 'start_audit' } },
         { activityName: 'UPDATE_MS_AUDIT_SCHEDULE', submenuItem: { type: 'edit_modal' } },
         { activityName: 'DELETE_MS_AUDIT_SCHEDULE', submenuItem: { type: 'delete' } },
         { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
         { activityName: null, submenuItem: { type: 'close',path:MsAuditSchedulesStore.path} },
      ];
    }else{
       if((this.isAuditLeader() || AuthStore.isRoleChecking('super-admin')) && 
       MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.ms_audits[0]?.['ms_audit_status']?.type!='completed'
       ){
        subMenuItems = [
          { activityName: 'UPDATE_MS_AUDIT_SCHEDULE', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_MS_AUDIT_SCHEDULE', submenuItem: { type: 'delete' } },
          { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
          { activityName: null, submenuItem: { type: 'close',path:MsAuditSchedulesStore.path} },
        ];
       }
       else{
         subMenuItems = [
           { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
           { activityName: null, submenuItem: { type: 'close',path:MsAuditSchedulesStore.path} },
         ];
         if(this.isAuditLeader() || AuthStore.isRoleChecking('super-admin'))
         {
          subMenuItems.unshift({ activityName: 'DELETE_MS_AUDIT_SCHEDULE', submenuItem: { type: 'delete' } });
         }
       }
      
    }

    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  isAuditees(){
    if(MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditees?.length>0){
      return MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditees?.find(element=>element?.id==AuthStore.user?.id)
    }else{
      return false;
    }
  }

  setProcesses(items) {
    ProcessStore.selectedProcessesList = [];
    let processItem = items;
    for (let i of processItem) {
      i['process_group_title'] = i.title;
      i['department'] = i.department?.title;
      i['process_category_title'] = i.process_category?.title;
      ProcessStore.selectedProcessesList.push(i);
    }
  }


  isAuditLeader(){
    return MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.lead_auditor?.id==AuthStore.user?.id;
  }

// Edit
  getEdit() {
    if(MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.id){
      this.MsAuditSchedulesObject.type = 'Edit';
      MsAuditSchedulesStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }  
  }
//**Edit

auditeeAcceptButton(){
  return MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditees.slice().find(user=> user?.user?.id==AuthStore.user?.id); 
}

AuditorsAcceptButton(){
  return MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.auditors.slice().find(user=> user?.id==AuthStore.user?.id); 
}

 // Activity logs
 activityLogsOpenModal(){
  MsAuditPlansStore.activity_log_form_modal=true;
  setTimeout(() => {
    $(this.activityLogsModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }, 100);
}

activityLogsCloseModal(){
  MsAuditPlansStore.activity_log_form_modal=false;
  $(this.activityLogsModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'none');
  this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 9);
  this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'none');
  $('.modal-backdrop').remove();
  this._utilityService.detectChanges(this._cdr);
}

checkAuditee(){
 let updatedUserId =  MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_history.length > 0 ?  MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_history[MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_history.length  -1].created_by?.id : null
  let asAuditee = MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.auditees.find(user=> user?.user?.id==AuthStore.user?.id)
  if(asAuditee){
    return updatedUserId == asAuditee?.id ? false : true
  }else {
    return false 
  }
 
}

checkAuditor(){
  let updatedUserId =  MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_history.length > 0 ?  MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_history[MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_history.length  -1].created_by?.id : null
  let asAuditee = MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.auditors.slice().find(user=> user?.id==AuthStore.user?.id)
  let leadAuditorId = MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.lead_auditor?.id ==  AuthStore.user?.id ? MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.lead_auditor?.id : null;  
  if(asAuditee){
    return updatedUserId == asAuditee?.id ? false : true
  }else {
    return false 
  }
}



//delete
  delete(id){
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title='Delete';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // modal control event
  modalControl(status: boolean) {

    switch (this.popupObject.type) {
      case '': this.deleteItem(status);
        break;
      case 'accept': this.update(status);
        break;
    }
  }

  getArrayFormatedString(type,items,languageSupport?){
    let item=[];
    if(languageSupport){
      for(let i of items){
        for(let j of i.language){
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',',type,items);
  }

  getNoDataSource(type){
    let noDataSource = {
      noData:"no_data_found", border: false, imageAlign: type
    }
    return noDataSource;
  }

  updateAccept(){
    this.popupObject.id = MsAuditSchedulesStore.msAuditSchedulesId;
    this.popupObject.type = 'accept';
    this.popupObject.subtitle="are_you_sure_you_want_to_accept_this_ms_audit_schedule";

    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  update(status){

    if (status && this.popupObject.id) {
      MsAuditSchedulesStore.individualLoaded=false;

      this._msAuditSchedulesService.update(this.popupObject.id,{ms_audit_schedule_status_id:3}).subscribe(res=>{
        this.getDetails(MsAuditSchedulesStore.msAuditSchedulesId);
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearPopupObject();
        },(err: HttpErrorResponse)=>{
          MsAuditSchedulesStore.individualLoaded=true;
        });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  
  }

  // delete function call
  deleteItem(status: boolean) {
    
    if (status && this.popupObject.id) {

      this._msAuditSchedulesService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl(MsAuditSchedulesStore.path);
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

  clearPopupObject() {
    this.popupObject.id = null;
  }

  startAudit() {
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
    this.getDetails(MsAuditSchedulesStore.msAuditSchedulesId);
    $(this.startMSAudit.nativeElement).modal('hide');
    this._renderer2.setStyle(this.startMSAudit.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.startMSAudit.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.startMSAudit.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.startMsAuidtPopup.type = null;
    AppStore.showDiscussion = false;
  }

  //**delete


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
    MsAuditSchedulesStore.individualLoaded=false;
    this.getDetails(MsAuditSchedulesStore.msAuditSchedulesId);
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.MsAuditSchedulesObject.type = null;
    AppStore.showDiscussion = false;
  }

  updateOpenModal(){
    this.updateScoureObject={
      id:MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.id,
      status_id:MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_status?.id
    }
    $(this.updateModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  updateCloseModal(res){
    $(this.updateModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    if(res){
      MsAuditSchedulesStore.individualLoaded=false;
      this.getDetails(MsAuditSchedulesStore.msAuditSchedulesId);
    }
    this.updateScoureObject={ id:null, status_id:null};
  }

  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    // BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.updateEventSubscription.unsubscribe();
    this.scheduleActivityLogsSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.startAuditSubscription.unsubscribe();
    //MsAuditSchedulesStore.unsetIndividualMsAuditSchedulesDetails();
  }
}
