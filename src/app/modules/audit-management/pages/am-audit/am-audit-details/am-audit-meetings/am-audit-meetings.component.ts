import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AmAuditMeetingService } from 'src/app/core/services/audit-management/am-audit/am-audit-meeting/am-audit-meeting.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { FileUploadPopupComponent } from 'src/app/shared/components/file-upload-popup/file-upload-popup.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditMeetingStore } from 'src/app/stores/audit-management/am-audit/am-audit-meeting.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-am-audit-meetings',
  templateUrl: './am-audit-meetings.component.html',
  styleUrls: ['./am-audit-meetings.component.scss']
})
export class AmAuditMeetingsComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  AmAuditMeetingStore = AmAuditMeetingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AmAuditsStore = AmAuditsStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  filterSubscription: Subscription = null;
  meetingModal: any;
  AppStore = AppStore;
  meetingObject = {
    component: 'Audit',
    values: null,
    type: null,
    requestType: ''
  };

  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };

  constructor(private _auditMeetingService: AmAuditMeetingService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _renderer2: Renderer2,
    private _auditManagementService:AuditManagementService,
    private _fileUploadPopupService:FileUploadPopupService
  ) { }

  ngOnInit(): void {
    this._helperService.setComponent('meeting')
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmAuditMeetingStore.loaded = false;
      this.pageChange(1);
    });

    this.reactionDisposer = autorun(() => {
      if(AmAuditsStore.editAccessUser() && AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type!='completed'){
        var subMenuItems = [
          { activityName: 'AM_AUDIT_MEETING_LIST', submenuItem: { type: 'refresh' } },
          { activityName: 'AM_AUDIT_MEETING_LIST', submenuItem: { type: 'search' } },
          { activityName: 'CREATE_AM_AUDIT_MEETING', submenuItem: { type: 'new_modal' } },
          { activityName: 'EXPORT_AM_AUDIT_MEETING', submenuItem: { type: 'export_to_excel' } },
  
        ]
      }
      else{
        var subMenuItems = [
          { activityName: 'AM_AUDIT_MEETING_LIST', submenuItem: { type: 'refresh' } },
          { activityName: 'AM_AUDIT_MEETING_LIST', submenuItem: { type: 'search' } },
          { activityName: 'EXPORT_AM_AUDIT_MEETING', submenuItem: { type: 'export_to_excel' } },
  
        ]
      }
     
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_audit_meeting' });
      if ((AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'CREATE_AM_AUDIT_MEETING')) || !AmAuditsStore.editAccessUser() || AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type=='completed') {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;

          case 'refresh':
            this.pageChange(1);
            break

          case "export_to_excel":
            this._auditMeetingService.exportToExcel();
            break;

          case "search":
            AmAuditMeetingStore.searchText = SubMenuItemStore.searchText;

            this.pageChange(1);
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    AppStore.showDiscussion = false;

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.meetingModal = this._eventEmitterService.amAuditMeetingModal.subscribe(item => {
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
    this.pageChange(1);

    RightSidebarLayoutStore.filterPageTag = 'am_audit_meeting';
    this._rightSidebarFilterService.setFiltersForCurrentPage([

      // 'organization_ids',
      // 'division_ids',
      // 'department_ids',
      // 'section_ids',
      // 'sub_section_ids',
      'organizer_ids',
      'meeting_status_ids'
    ]);
  }

  pageChange(newPage: number = null) {
    AmAuditMeetingStore.loaded = false;
    if (newPage) AmAuditMeetingStore.setCurrentPage(newPage);
    this._auditMeetingService.getItems(false, 'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  editMeeting(id) {

    AmAuditMeetingStore.setAuditId(id);
    this._auditMeetingService.getItem(id).subscribe(res => {

    this.meetingObject.values = {
      id: id,
      title: res['title'],
      description: res['description'],
      duration:res['duration'],
      meeting_participants:res['meeting_participants'],
      organizer:res['organizer'],
      meeting_types:res['meeting_types'],
      start_date: this._helperService.processDate(res['start'], 'split'),
      target_date: this._helperService.processDate(res['end'], 'split'),
      documents: res['documents']
    }
    this.clearCommonFilePopupDocuments();
    if (res['documents']?.length > 0) {
      this.setDocuments(res['documents']);
    }

    this.meetingObject.type = 'Edit';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);

  })
}

setDocuments(documents) {

  let khDocuments = [];
  documents.forEach(element => {
    if (element.document_id) {
      element?.kh_document?.versions?.forEach(innerElement => {

        if (innerElement.is_latest) {
          khDocuments.push({
            ...innerElement,
            'is_kh_document': true
          })
          fileUploadPopupStore.setUpdateFileArray({
            'updateId': element.id,
            ...innerElement

          })
        }

      });
    }
    else {
      if (element && element.token) {
        var purl = this._auditManagementService.getThumbnailPreview('audit-meeting', element.token)
        var lDetails = {
          created_at: element.created_at,
          created_by: element.created_by,
          updated_at: element.updated_at,
          updated_by: element.updated_by,
          name: element.title,
          ext: element.ext,
          size: element.size,
          url: element.url,
          token: element.token,
          thumbnail_url: element.thumbnail_url,
          preview: purl,
          id: element.id,
          meeting_id: element.meeting_id,
          'is_kh_document': false,
        }
      }
      this._fileUploadPopupService.setSystemFile(lDetails, purl);

    }

  });
  fileUploadPopupStore.setKHFile(khDocuments)
  let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
  fileUploadPopupStore.setFilestoDisplay(submitedDocuments);

}

clearCommonFilePopupDocuments() {
  fileUploadPopupStore.clearFilesToDisplay();
  fileUploadPopupStore.clearKHFiles();
  fileUploadPopupStore.clearSystemFiles();
  fileUploadPopupStore.clearUpdateFiles();
}

  
  
  openFormModal() {
    this.meetingObject.type = 'Add';
    this.meetingObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);


  }


  closeFormModal() {
    this.meetingObject.type = null;
    this.meetingObject.requestType = '';
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }


  /**
* Delete the audit meeting
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditMeetingService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (AmAuditMeetingStore.currentPage > 1 && this.deleteObject.type == '') {
            AmAuditMeetingStore.currentPage = Math.ceil(AmAuditMeetingStore.totalItems / 15);
            this.pageChange(AmAuditMeetingStore.currentPage);
          }
        }, 500);
        this.clearDeleteObject();
      }, (error => {
        setTimeout(() => {
          if (error.status == 405) {
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  deleteMeeting(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_meeting_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  getOrganizerDetails(user) {
    let userDetial: any = {};
    userDetial['first_name'] = user?.organizer_first_name ? user?.organizer_first_name : '';
    userDetial['last_name'] = user?.organizer_last_name;
    userDetial['image_token'] = user?.organizer_image_token;
    userDetial['designation'] = user?.organizer_designation_title?user?.organizer_designation_title:user?.designation_title;
    userDetial['department'] = user?.organizer_department_title;
    userDetial['email'] = user?.organizer_email;
    userDetial['mobile'] = user?.organizer_mobile;
    userDetial['status_id'] = user?.organizer_status_id?user?.organizer_status_id:1;
    userDetial['id'] = user?.organizer_id;
    return userDetial;
  }

  gotoDetails(id) {
    this._router.navigateByUrl('/audit-management/am-audits/' + AmAuditsStore.auditId + '/am-audit-meetings/' + id);
  }

  ngOnDestroy() {
    AmAuditMeetingStore.searchText = null;
    SubMenuItemStore.searchText = null;
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
  }

}
