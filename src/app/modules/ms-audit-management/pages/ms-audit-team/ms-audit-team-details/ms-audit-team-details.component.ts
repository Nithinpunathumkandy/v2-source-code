import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MsAuditTeamService } from 'src/app/core/services/ms-audit-management/ms-audit-team/ms-audit-team.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditTeamStore } from 'src/app/stores/ms-audit-management/ms-audit-team/ms-audit-team-store';
declare var $: any;
@Component({
  selector: 'app-ms-audit-team-details',
  templateUrl: './ms-audit-team-details.component.html',
  styleUrls: ['./ms-audit-team-details.component.scss']
})
export class MsAuditTeamDetailsComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;

  reactionDisposer: IReactionDisposer;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  MsAuditTeamStore = MsAuditTeamStore;
  AppStore = AppStore;
  AuthStore = AuthStore;

  networkFailureSubscription: Subscription;
  idleTimeoutSubscription: Subscription;
  controlMsAuditTeamSubscriptionEvent: Subscription;
  popupControlMsAuditTeamEventSubscription: Subscription;

  msAuditTeamObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  constructor(
    private _msAuditTeamService: MsAuditTeamService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit(): void {

    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id'];
      MsAuditTeamStore.setMsAuditTeamsId(id);
      this.getItem(id);
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name: "teams",
      path: `/ms-audit-management/ms-teams`
    });

    SubMenuItemStore.cancelClicked = false;
    this.reactionDisposer = autorun(() => {
      if (MsAuditTeamStore?.individualLoaded) {
        this.setSubMenuItems();
      }

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.getMsAuditTeam(this.MsAuditTeamStore.msAuditTeamsId);
            }, 200);
            break;
          case "delete":
            setTimeout(() => {
              this.delete(this.MsAuditTeamStore.msAuditTeamsId);
            }, 200);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    // this.getItem(this.MsAuditTeamStore.msAuditTeamsId);

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    // for closing add modal
    this.controlMsAuditTeamSubscriptionEvent = this._eventEmitterService.msAuditTeam.subscribe(res => {
      this.closeFormModal();
    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlMsAuditTeamEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteMsAuditTeam(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })
  }
  setSubMenuItems() {
    var subMenuItems = [];
   if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')) 
   {
     subMenuItems = [
      { activityName: 'UPDATE_MS_TEAM', submenuItem: { type: 'edit_modal' } },
      { activityName: 'DELETE_MS_TEAM', submenuItem: { type: 'delete' } },
      { activityName: null, submenuItem: { type: 'close', path: '../' } },
    ]
   }
   else
   {
     subMenuItems = [
      // { activityName: 'UPDATE_MS_TEAM', submenuItem: { type: 'edit_modal' } },
      // { activityName: 'DELETE_MS_TEAM', submenuItem: { type: 'delete' } },
      { activityName: null, submenuItem: { type: 'close', path: '../' } },
    ]
   }
    
    this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
  }

  getItem(id) {
    this._msAuditTeamService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  getMsAuditTeam(id: number) {
    this._msAuditTeamService.getItem(id).subscribe(res => {
      this.msAuditTeamObject.type = 'Edit';
      this._msAuditTeamService.setFileDetails(null, '', 'logo');
      const ms_audit_team = MsAuditTeamStore.msAuditTeamDetails; // assigning values for edit
      if (ms_audit_team.image_token) {
        var purl = this._msAuditTeamService.getThumbnailPreview('teams-logo', ms_audit_team.image_token);
        var lDetails = {
          name: ms_audit_team.image_title,
          ext: ms_audit_team.image_ext,
          size: ms_audit_team.image_size,
          url: ms_audit_team.image_url,
          token: ms_audit_team.image_token,
          preview: purl,
          thumbnail_url: ms_audit_team.image_url
        };
        this._msAuditTeamService.setFileDetails(lDetails, purl, 'logo');
      }
      this.msAuditTeamObject.values = {
        id: ms_audit_team.id,
        is_audit_team: ms_audit_team.is_audit_team,
        team_lead_id: ms_audit_team.team_lead.id,
        user_ids: ms_audit_team.team_members,
        title: ms_audit_team.title,
      }
      this.openFormModal();
    })
  }

  // for delete
  delete(id: number) {
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Team?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // delete function call
  deleteMsAuditTeam(status: boolean) {
    if (status && this.popupObject.id) {
      this._msAuditTeamService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._router.navigateByUrl('/ms-audit-management/ms-teams');
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && MsAuditTeamStore.getMsAuditTeamById(this.popupObject.id).status_id == AppStore.activeStatusId) {
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else {
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        }
      })
      );
    }
    else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Team?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.msAuditTeamObject.type = null;
    this.getItem(this.MsAuditTeamStore.msAuditTeamsId);
    this._utilityService.detectChanges(this._cdr);
  }


  // Returns Image Url by token
  createImageUrl(token) {
    return this._msAuditTeamService.getThumbnailPreview('teams-logo', token);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  assignUserValues(user, type) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      if (type == 'team_members') {
        userInfoObject.first_name = user?.first_name;
        userInfoObject.last_name = user?.last_name;
        userInfoObject.designation = user?.designation?.title;
        userInfoObject.image_token = user?.image_token;
        userInfoObject.email = user?.email;
        userInfoObject.mobile = user?.mobile;
        userInfoObject.id = user?.id;
        userInfoObject.status_id = user?.status_id
        userInfoObject.department = null;
        return userInfoObject;

      } else if (type == 'audit_leader') {
        userInfoObject.first_name = user?.first_name;
        userInfoObject.last_name = user?.last_name;
        userInfoObject.designation = user?.designation;
        userInfoObject.image_token = user?.image.token;
        userInfoObject.email = user?.email;
        userInfoObject.mobile = user?.mobile;
        userInfoObject.id = user?.id;
        userInfoObject.status_id = user?.status.id
        userInfoObject.department = user?.department;
        return userInfoObject;

      }
    }

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
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.MsAuditTeamStore.unsetIndividualMsAuditTeam();
    this.controlMsAuditTeamSubscriptionEvent.unsubscribe();
    this.popupControlMsAuditTeamEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }



}
