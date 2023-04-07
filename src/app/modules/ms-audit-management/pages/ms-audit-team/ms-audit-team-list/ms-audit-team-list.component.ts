import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { MsAuditTeamService } from 'src/app/core/services/ms-audit-management/ms-audit-team/ms-audit-team.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditTeamStore } from 'src/app/stores/ms-audit-management/ms-audit-team/ms-audit-team-store';
declare var $: any;

@Component({
  selector: 'app-ms-audit-team-list',
  templateUrl: './ms-audit-team-list.component.html',
  styleUrls: ['./ms-audit-team-list.component.scss']
})
export class MsAuditTeamListComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;

  reactionDisposer: IReactionDisposer;
  MsAuditTeamStore = MsAuditTeamStore;
  SubMenuItemStore = SubMenuItemStore;
  NodataItemStore = NoDataItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_team_message';

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

  controlMsAuditTeamSubscriptionEvent: any = null;
  popupControlMsAuditTeamEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  filterSubscription: Subscription = null;

  constructor(
    private _msAuditTeamService: MsAuditTeamService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MsAuditTeamStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      //'department_ids',
      'team_lead_ids',
      'team_user_ids',
      'ms_audit_category_ids',
    ]);
    if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin'))
    {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_team' });
    }
    else
    {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });
    }
    
    this.reactionDisposer = autorun(() => {
       this.setMenu()
      
      if (!AuthStore.getActivityPermission(100, 'CREATE_MS_TEAM')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      



      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 200);
            break;
          // case "template":
          //   this._msAuditTeamService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._msAuditTeamService.exportToExcel();
            break;
          case "search":
            MsAuditTeamStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.searchSlaCategory(SubMenuItemStore.searchText);
            break;
          case "refresh":
            
            SubMenuItemStore.searchText = '';
            MsAuditTeamStore.searchText = '';
            MsAuditTeamStore.loaded = false;
            MsAuditTeamStore.unsetMsAuditTeam();
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_teams');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_teams');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      // if (ImportItemStore.importClicked) {
      //   ImportItemStore.importClicked = false;
      //   this._msAuditTeamService.importData(ImportItemStore.getFileDetails).subscribe(res => {
      //     ImportItemStore.unsetFileDetails();
      //     ImportItemStore.setTitle('');
      //     ImportItemStore.setImportFlag(false);
      //     $('.modal-backdrop').remove();
      //     this._utilityService.detectChanges(this._cdr);
      //   }, (error) => {
      //     if (error.status == 422) {
      //       ImportItemStore.processFormErrors(error.error.errors);
      //     }
      //     else if (error.status == 500 || error.status == 403) {
      //       ImportItemStore.unsetFileDetails();
      //       ImportItemStore.setImportFlag(false);
      //       $('.modal-backdrop').remove();
      //     }
      //     this._utilityService.detectChanges(this._cdr);
      //   })
      // }

    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    // for deleting/activating/deactivating using delete modal
    this.popupControlMsAuditTeamEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing add modal
    this.controlMsAuditTeamSubscriptionEvent = this._eventEmitterService.msAuditTeam.subscribe(res => {
      this.closeFormModal();
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

    this.pageChange(1);
    RightSidebarLayoutStore.filterPageTag = 'audit_teams';
   
  }

  setMenu()
  {
    var subMenuItems=[]
    if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin'))
    {
      subMenuItems = [
        { activityName: 'MS_TEAM_LIST', submenuItem: { type: 'search' } },
        { activityName: 'MS_TEAM_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_MS_TEAM', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_MS_TEAM_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_MS_TEAM', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_MS_TEAM', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_MS_TEAM', submenuItem: { type: 'import' } },
      ]
    }
    else
    {
      subMenuItems = [
        { activityName: 'MS_TEAM_LIST', submenuItem: { type: 'search' } },
        { activityName: 'MS_TEAM_LIST', submenuItem: { type: 'refresh' } },
        //{ activityName: 'CREATE_MS_TEAM', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_MS_TEAM_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_MS_TEAM', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_MS_TEAM', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_MS_TEAM', submenuItem: { type: 'import' } },
      ]
    }
     
   
    this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
  }

  addNewItem() {
    this.msAuditTeamObject.type = 'Add';
    this._msAuditTeamService.setFileDetails(null, '', 'logo');
    this.msAuditTeamObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) MsAuditTeamStore.setCurrentPage(newPage);
    this._msAuditTeamService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  getDetails(id) {
    MsAuditTeamStore.setMsAuditTeamsId(id);
    this._router.navigateByUrl('ms-audit-management/ms-teams/' + id);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns Image Url by token
  // createImageUrl(token) {
  //   return this._msAuditTeamService.getThumbnailPreview('teams-logo', token);
  // }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
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

  assignUserValues(user) {
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
      userInfoObject.first_name = user?.team_lead_first_name;
      userInfoObject.last_name = user?.team_lead_last_name;
      userInfoObject.designation = user?.team_lead_designation_title;
      userInfoObject.image_token = user?.team_lead_image_token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.team_lead_id;
      userInfoObject.status_id = user?.status.id
      userInfoObject.department = user?.department;
      return userInfoObject;
    }
  }

  openFormModal() {
    setTimeout(() => {
      //$(this.formModal.nativeElement).modal('show');
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }, 50);
   
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    }, 50);
//$(this.formModal.nativeElement).modal('hide');
    this.msAuditTeamObject.type = null;
    this.pageChange();
    this._utilityService.detectChanges(this._cdr);
  }

  getMsAuditTeam(id: number) {
    event.stopPropagation();
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
      // this.msAuditTeamObject.values = {
      //   id: ms_audit_team.id,
      //   is_audit_team: ms_audit_team.is_audit_team,
      //   team_lead_id: ms_audit_team.team_lead,
      //   user_ids: ms_audit_team.team_members,
      //   title: ms_audit_team.title,
      // }
      this.openFormModal();
    })
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteMsAuditTeam(status)
        break;
      case 'Activate': this.activateMsAuditTeam(status)
        break;
      case 'Deactivate': this.deactivateMsAuditTeam(status)
        break;
    }
  }

  // delete function call
  deleteMsAuditTeam(status: boolean) {
    if (status && this.popupObject.id) {
      this._msAuditTeamService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
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

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function
  activateMsAuditTeam(status: boolean) {
    if (status && this.popupObject.id) {
      this._msAuditTeamService.activate(this.popupObject.id).subscribe(resp => {
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

  // calling deactivate function
  deactivateMsAuditTeam(status: boolean) {
    if (status && this.popupObject.id) {

      this._msAuditTeamService.deactivate(this.popupObject.id).subscribe(resp => {
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

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Team?';
    this.popupObject.subtitle = 'common_activate_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Team?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Team?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // for sorting
  sortTitle(type: string) {
    this._msAuditTeamService.sortMsAuditTeamList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlMsAuditTeamSubscriptionEvent.unsubscribe();
    this.popupControlMsAuditTeamEventSubscription.unsubscribe();
    MsAuditTeamStore.searchText = '';
    MsAuditTeamStore.currentPage = 1;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    MsAuditTeamStore.unsetMsAuditTeam();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
