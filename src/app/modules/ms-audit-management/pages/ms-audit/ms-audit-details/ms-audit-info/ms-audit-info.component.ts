import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-ms-audit-info',
  templateUrl: './ms-audit-info.component.html',
  styleUrls: ['./ms-audit-info.component.scss']
})
export class MsAuditInfoComponent implements OnInit,OnDestroy {
  @ViewChild("auditorAdd") auditorAdd: ElementRef;
  @ViewChild("auditeeAdd") auditeeAdd: ElementRef;
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild ('markAuditModal') markAuditModal: ElementRef;
  @ViewChild ('openParticipantsModal') openParticipantsModal: ElementRef;
  @ViewChild('activityLogsModal') activityLogsModal: ElementRef;

  AuthStore = AuthStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  AppStore = AppStore;
  MsAuditStore = MsAuditStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  markAuditSubscription:any;

  popupSubscriptionAddMsAuditor:any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  popupSubscriptionAddMsAuditee: any;
  modalEventSubscription: any;
  popupControlEventSubscription: any;
  participantsModal:any;
  auditActivityLogsSubscription:any;

  auditorAddObject = {
    type : null
  };
  auditeeAddObject = {
    type : null
  };
  MsAuditObject = {
    type:null,
    values: null,
  };
  meetingParticpantsData = {
    type:null,
    values: null,
  };

  constructor(
    private _msAuditService: MsAuditService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
     
      this.setSubMenu();
    
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "mark_completed":
            this.openMarkAudited();
            break;
            case "edit_modal":
                this.getEdit();
              break;
            case 'delete':
              this.delete(MsAuditStore.msAuditId);
              break
            case 'activity_log':
              this.activityLogsOpenModal();
            default:
              break;
          }
          SubMenuItemStore.unSetClickedSubMenuItem();
        }
     

    })

    this.popupSubscriptionAddMsAuditor = this._eventEmitterService.msAuditAdd.subscribe(res => {
      this.closeAuditorDetails();
    })

    this.popupSubscriptionAddMsAuditee = this._eventEmitterService.msAuditeesAdd.subscribe(res => {
      this.closeAuditeeDetails();
    })

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.markAuditSubscription = this._eventEmitterService.msAuditMarkAudit.subscribe(res => {
      this.closeMarkAudited(res);
    });

    this.participantsModal = this._eventEmitterService.participantsPopUpModal.subscribe(res => {
      this.closeParticipantsModal(res);
    });

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
			if(!status){
			  this.changeZIndex();
			}
		  })
		  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
			if(!status){
			  this.changeZIndex();
			}
		  })

      this.auditActivityLogsSubscription = this._eventEmitterService.auditActivityLogsModal.subscribe(res => {
        this.activityLogsCloseModal();
      });
    
    this.getDetails();
  }

  setSubMenu(){
    
    let subMenuItems=[];
     if(this.isAuditLeader() || AuthStore.isRoleChecking('super-admin')){
      
      if(MsAuditStore?.individualMsAuditDetails?.ms_audit_status?.type=='audited')
      {
        //subMenuItems.unshift({activityName: null, submenuItem: {type:'mark_completed',title : ''}});
        subMenuItems = [
          // { activityName: 'UPDATE_MS_AUDIT', submenuItem: { type: 'edit_modal' } },
          {activityName: null, submenuItem: {type:'mark_completed',title : ''}},
          //  { activityName: 'UPDATE_MS_AUDIT', submenuItem: { type: 'edit_modal' } },
          //  { activityName: 'DELETE_MS_AUDIT', submenuItem: { type: 'delete' } },
          { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
           { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
         ]
      }
      else
      {
        if(MsAuditStore?.individualMsAuditDetails?.ms_audit_status?.type!='completed')
        {
          subMenuItems = [
            //{ activityName: 'UPDATE_MS_AUDIT', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MS_AUDIT', submenuItem: { type: 'delete' } },
            { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
           { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
         ]
        }
        else
        {
          subMenuItems = [
            { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
            { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
          ]
        }
       
      }
    }else{
      subMenuItems = [
        { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
        { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
      ]
    }
    this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
  }
  
  isAuditors(){
    if(MsAuditStore.individualMsAuditDetails?.auditors?.length>0){
      return MsAuditStore.individualMsAuditDetails?.auditors?.find(element=>element?.id==AuthStore.user?.id)
    }else{
      return false;
    }
  }

  isAuditLeader(){
    return MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.lead_auditor?.id==AuthStore.user?.id;
  }

  getEdit() {
    if(MsAuditStore.individualMsAuditDetails?.id){
      this.MsAuditObject.type = 'Edit';
      MsAuditStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }  
  }

  // Mark audited
openMarkAudited() {
  MsAuditStore.markAuditModalForm = true;
  SubMenuItemStore.markCompletedClicked = true;
  setTimeout(() => {
    $(this.markAuditModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.markAuditModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.markAuditModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.markAuditModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }, 100);
  this._utilityService.detectChanges(this._cdr);
}
closeMarkAudited(res){
  MsAuditStore.markAuditModalForm = false;
  SubMenuItemStore.markCompletedClicked = false;
  $(this.markAuditModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.markAuditModal.nativeElement, 'display', 'none');
  this._renderer2.setStyle(this.markAuditModal.nativeElement, 'z-index', 9);
  this._renderer2.setStyle(this.markAuditModal.nativeElement, 'overflow', 'none');
  this._utilityService.detectChanges(this._cdr);
  this.getDetails()
}

 // Activity logs
 activityLogsOpenModal(){
  MsAuditStore.activity_log_form_modal=true;
  setTimeout(() => {
    $(this.activityLogsModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }, 100);
}

activityLogsCloseModal(){
  MsAuditStore.activity_log_form_modal=false;
  $(this.activityLogsModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'none');
  this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 9);
  this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'none');
  $('.modal-backdrop').remove();
  this._utilityService.detectChanges(this._cdr);
}

openParticipantsModalBox() {
  this.meetingParticpantsData.values=MsAuditStore.individualMsAuditDetails
  setTimeout(() => {
    $(this.openParticipantsModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.openParticipantsModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.openParticipantsModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.openParticipantsModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }, 100);
  this._utilityService.detectChanges(this._cdr);
}
closeParticipantsModal(res){
  this.meetingParticpantsData.values=null;
  $(this.openParticipantsModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.openParticipantsModal.nativeElement, 'display', 'none');
  this._renderer2.setStyle(this.openParticipantsModal.nativeElement, 'z-index', 9);
  this._renderer2.setStyle(this.openParticipantsModal.nativeElement, 'overflow', 'none');
  this._utilityService.detectChanges(this._cdr);
  this.getDetails()
}
//* Mark audited

  openFormModal() {
    this.test('')
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    this.getDetails();
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.MsAuditObject.type = null;
    AppStore.showDiscussion = false;
  }

  changeZIndex(){
    if($(this.auditorAdd?.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.auditorAdd?.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.auditorAdd?.nativeElement,'overflow','auto');
		}
    if($(this.auditeeAdd.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.auditeeAdd.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.auditeeAdd.nativeElement,'overflow','auto');
		}
	  }

  getDetails(){
      this._msAuditService.getItem(MsAuditStore.msAuditId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getAuditorPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image_token ? users?.image_token : users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }

  getAuditeePopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image_token ? users?.image_token : users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }

  getAuditorLeaderDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image_token ? users?.image_token : users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }

  getArrayFormatedString(type,items){
    let item=[];
    
      for(let i of items){
          item.push(i.ms_type);
       
      }
      items = item;
   
    return this._helperService.getArraySeperatedString(', ',type,items);
  }

  getCreatedByProcessDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token ? users?.image?.token : users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
    return userDetial;

  }

  getCreatedByPopupDetails(users, supplier: boolean = false) {
		let userDetial: any = {};

		
			userDetial['first_name'] = users?.first_name ? users?.first_name : '';
			userDetial['last_name'] = users?.last_name;
			userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
			userDetial['image_token'] = users?.image?.token;
			userDetial['email'] = users?.email;
			userDetial['mobile'] = users?.mobile;
			userDetial['id'] = users?.id;
			userDetial['department'] = users?.department;
			userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
      userDetial['created_at']=MsAuditStore.individualMsAuditDetails?.created_at;
		
		return userDetial;
	}

 

  addAuditorDetails(){
    this.auditorAddObject.type ='Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
      setTimeout(() => {
        this._renderer2.setStyle(this.auditorAdd?.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.auditorAdd.nativeElement, 'z-index', 99999);
        this._renderer2.removeAttribute(this.auditorAdd?.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.auditorAdd?.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeAuditorDetails() {
    this.auditorAddObject.type = null
    $(this.auditorAdd?.nativeElement).modal('hide');
    this.getDetails();
    setTimeout(() => {
      this._renderer2.setStyle(this.auditorAdd?.nativeElement, 'display', 'none');
      // this._renderer2.setStyle(this.auditorAdd.nativeElement, 'z-index', 9);
      this._utilityService.detectChanges(this._cdr);
    },250);
  }

  addAuditeeDetails(){
    this.auditorAddObject.type ='Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
      setTimeout(() => {
        this._renderer2.setStyle(this.auditeeAdd.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.auditeeAdd.nativeElement, 'z-index', 99999);
        this._renderer2.removeAttribute(this.auditeeAdd.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.auditeeAdd.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeAuditeeDetails() {
    this.auditeeAddObject.type = null
    $(this.auditeeAdd.nativeElement).modal('hide');
    this.getDetails();
    setTimeout(() => {
      this._renderer2.setStyle(this.auditeeAdd.nativeElement, 'display', 'none');
      // this._renderer2.setStyle(this.auditeeAdd.nativeElement, 'z-index', 9);
      this._utilityService.detectChanges(this._cdr);
    },250);
  }

  
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  modalControl(status: boolean) {
    
    switch (this.popupObject.type) {
      case '': this.deleteMsAudit(status)
        break;
    }
    
  }

    // delete function call
    deleteMsAudit(status: boolean) {
      if (status && this.popupObject.id) {
        this._msAuditService.delete(this.popupObject.id).subscribe(resp => {
          this._router.navigateByUrl('/ms-audit-management/ms-audits');
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
          // this.pageChange(1);
        });
      }
      else {
        this.clearPopupObject();
      }
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
      // this.pageChange();
    }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
  }

  test(data){
    let vale = 'fjjdfi'
    data = data ?? vale;
  }

  openUrl(url){
    if(url){
      window.open(url.external_link)
    }
   }


  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.popupSubscriptionAddMsAuditor.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditActivityLogsSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    SubMenuItemStore.markCompletedClicked = false;
    // MsAuditStore.unsetIndividualMsAuditDetails(); // don't destory detials .it is use for condition. detials detory main detials page
    this.popupControlEventSubscription.unsubscribe();
    this.participantsModal.unsubscribe();
  }

}
