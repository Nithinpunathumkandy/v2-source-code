import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditCommencementLetterService } from 'src/app/core/services/audit-management/am-audit/am-audit-commencement-letter/am-audit-commencement-letter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditCommencementLetterStore } from 'src/app/stores/audit-management/am-audit/am-audit-commencement-letter.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ThemeLoginSettingStore } from 'src/app/stores/settings/theme/theme-login.store';
import { ProfileService } from "src/app/core/services/organization/business_profile/profile/profile.service";
import { ProfileStore } from "src/app/stores/organization/business_profile/profile/profile.store";
import { ThemeLoginSettingsService } from 'src/app/core/services/settings/theme-settings/theme-login-settings/theme-login-settings.service';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';


declare var $: any;

@Component({
  selector: 'app-am-audit-commencement-letter',
  templateUrl: './am-audit-commencement-letter.component.html',
  styleUrls: ['./am-audit-commencement-letter.component.scss']
})
export class AmAuditCommencementLetterComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;

  AmAuditsStore = AmAuditsStore;
  ProfileStore = ProfileStore;
  ThemeLoginSettingStore = ThemeLoginSettingStore;
  AmAuditCommencementLetterStore = AmAuditCommencementLetterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  downloadMessage: string = 'sending';
  reactionDisposer: IReactionDisposer;
  commencementLetterModal: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  letterObject = {
    component: 'Audit',
    values: null,
    type: null,
    requestType: ''
  };
  constructor(private _commencementLetterService: AmAuditCommencementLetterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _profileService:ProfileService,
    private _auditsService:AmAuditService,
    private _themeloginservice:ThemeLoginSettingsService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if(AmAuditsStore.editAccessUser() && AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type!='completed'){
        var subMenuItems = [
          { activityName: 'UPDATE_AM_AUDIT_COMMENCEMENT_LETTER', submenuItem: { type: 'edit_modal' } },
          { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audits' } },
        ]
      }
      else{
        subMenuItems = [
          { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audits' } },
        ]
      }
     
      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "edit_modal":
            this.editCommencementLetter();
            break;


          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })
    this.commencementLetterModal = this._eventEmitterService.amAuditCommencementLetterModal.subscribe(item => {
      this.closeFormModal();
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
    this.getOrganizationProfileData();
    this.getAudit()
    // this.getCommencementLetter();
    this.getLoginTheme();
    // this.getIndividualAuditPlanDetails();

  }

  getAudit(){
    this._auditsService.getItem(AmAuditsStore?.auditId).subscribe(res => {
      this.getCommencementLetter();
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getLoginTheme() {
    this._themeloginservice.getLoginTheme().subscribe(() => this.setImage(),
    (error)=>{
        // this.loader = false;
    });

}
setImage() {
    let imageDetails = ThemeLoginSettingStore.themeLoginDetailsById?.app_login_setting_images;
    if (imageDetails?.length > 0) {
        for (let i = 0; i < imageDetails?.length; i++) {
            let category = imageDetails[i].type;
            var preview = this._themeloginservice.getThumbnailPreview(category, imageDetails[i].token);
            imageDetails[i]['preview_url'] = preview;
            this.ThemeLoginSettingStore.setImageDetails(imageDetails[i], category);
            this._utilityService.detectChanges(this._cdr);
        }
    }
    // this.setBackgroundImage();
}


  getOrganizationProfileData(){
    this._profileService.getItem(null,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr); 
   })

  }



  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  getCommencementLetter() {
    this._commencementLetterService.getItems(false, 'department_ids=' + AmAuditsStore.individualAuditDetails?.am_individual_audit_plan?.departments[0]?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMailToDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title?users?.department?.title:users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }

  getCCPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title?users?.department?.title:users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }

  editCommencementLetter() {
    this.letterObject.values = {
      id: AmAuditCommencementLetterStore?.commencementLetters[0]?.id,
      to_user_id: AmAuditCommencementLetterStore?.commencementLetters[0]?.to_user,
      user_ids: AmAuditCommencementLetterStore?.commencementLetters[0]?.am_commencement_letter_cc_users,
      date: this._helperService.processDate(AmAuditCommencementLetterStore?.commencementLetters[0]?.date, 'split'),
      subject: AmAuditCommencementLetterStore?.commencementLetters[0]?.subject,
      body: AmAuditCommencementLetterStore?.commencementLetters[0]?.body,
      // description:AmAuditCommencementLetterStore?.commencementLetters[0]?.description,
    }

    this.letterObject.type = 'Edit';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);

  }

  closeFormModal() {
    this.letterObject.type = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  sendEmail(){
    setTimeout(() => {
			$(this.loaderPopUp.nativeElement).modal('show');
		}, 100);
    this._commencementLetterService.sendEmail(AmAuditCommencementLetterStore?.commencementLetters[0]?.id).subscribe(()=>{
      setTimeout(() => {
        $(this.loaderPopUp.nativeElement).modal('hide');
      }, 100);
      this._utilityService.detectChanges(this._cdr)
    })
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.commencementLetterModal.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

  

}
