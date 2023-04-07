import { ChangeDetectorRef, Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { AmAuditInformationRequestService } from 'src/app/core/services/audit-management/am-audit/am-audit-information-request/am-audit-information-request.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { autorun, IReactionDisposer } from 'mobx';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditInformationRequestStore } from 'src/app/stores/audit-management/am-audit/am-audit-information-request.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';


declare var $: any;


@Component({
  selector: 'app-am-audit-information-request',
  templateUrl: './am-audit-information-request.component.html',
  styleUrls: ['./am-audit-information-request.component.scss']
})
export class AmAuditInformationRequestComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  informationRequestModal: any;
  deleteEventSubscription: any;
  fileUploadPopupStore = fileUploadPopupStore;
  AmAuditsStore = AmAuditsStore;
  reactionDisposer: IReactionDisposer;
  AmAuditInformationRequestStore = AmAuditInformationRequestStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  filterSubscription: Subscription = null;

  requestObject = {
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

  constructor(private _amAuditInformationService: AmAuditInformationRequestService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _informationRequestService: AmAuditInformationRequestService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _auditManagementService: AuditManagementService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    this._helperService.setComponent('info')
    AmAuditInformationRequestStore.unsetIndiviudalAuditDetails();
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmAuditInformationRequestStore.loaded = false;
      this.pageChange(1);
    });
NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_audit_information_request' });
    this.reactionDisposer = autorun(() => {
      if(AmAuditsStore.editAccessUser() && AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type!='completed'){
        var subMenuItems = [
          { activityName: 'AM_AUDIT_INFORMATION_REQUEST_LIST', submenuItem: { type: 'refresh' } },
          { activityName: 'AM_AUDIT_INFORMATION_REQUEST_LIST', submenuItem: { type: 'search' } },
          { activityName: 'CREATE_AM_AUDIT_INFORMATION_REQUEST', submenuItem: { type: 'new_modal' } },
          { activityName: 'EXPORT_AM_AUDIT_INFORMATION_REQUEST', submenuItem: { type: 'export_to_excel' } },
  
        ]
      }
      else{
        var subMenuItems = [
          { activityName: 'AM_AUDIT_INFORMATION_REQUEST_LIST', submenuItem: { type: 'refresh' } },
          { activityName: 'AM_AUDIT_INFORMATION_REQUEST_LIST', submenuItem: { type: 'search' } },
          { activityName: 'EXPORT_AM_AUDIT_INFORMATION_REQUEST', submenuItem: { type: 'export_to_excel' } },
  
        ]
      }
     
      
      if ((AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'CREATE_AM_AUDIT_INFORMATION_REQUEST')) || !AmAuditsStore.editAccessUser() || AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type=='completed') {
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
            this._informationRequestService.exportToExcel();
            break;

          case "search":
            AmAuditInformationRequestStore.searchText = SubMenuItemStore.searchText;

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

    this.informationRequestModal = this._eventEmitterService.amInformationRequestModal.subscribe(item => {
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

    RightSidebarLayoutStore.filterPageTag = 'am_audit_info_request';
    this._rightSidebarFilterService.setFiltersForCurrentPage([

      'organization_ids',
      'division_ids',
      // 'department_ids',
      // 'section_ids',
      // 'sub_section_ids',
      'am_audit_information_request_status_ids',
      'requested_by_user_ids'
    ]);
  }


  pageChange(newPage: number = null,refresh:boolean=true) {
    if(refresh){
      AmAuditInformationRequestStore.loaded = false;
    }
   
    if (newPage) AmAuditInformationRequestStore.setCurrentPage(newPage);
    this._amAuditInformationService.getItems(false, 'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }



  openFormModal() {
    this.requestObject.type = 'Add';
    this.requestObject.requestType = 'request';
    this.requestObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);


  }


  closeFormModal() {
    this.requestObject.type = null;
    this.requestObject.requestType = '';
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }



  editInformationRequest(id) {

    this._informationRequestService.getItem(id).subscribe(res => {

      this.requestObject.values = {
        am_audit_information_request_id: id,
        organization_id: res['organization'],
        division_id: res['division'],
        department_id: res['department'],
        section_id: res['section'],
        sub_section_id: res['sub_section'],
        description: res['description'],
        type: res['type'],
        to_user_id: res['to_user'],
        documents: res['information_request_documents'],

      }
      this.clearCommonFilePopupDocuments();
      if (res['information_request_documents']?.length > 0) {
        this.setDocuments(res['information_request_documents']);
      }

      this.requestObject.type = 'Edit';
      this.requestObject.requestType = 'request';

      
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);
      this._utilityService.detectChanges(this._cdr);
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
          var purl = this._auditManagementService.getThumbnailPreview('asset-document', element.token)
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
            asset_id: element.asset_id,
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

  /**
* Delete the audit information request
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._informationRequestService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        // setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (AmAuditInformationRequestStore.currentPage > 1 && this.deleteObject.type == '') {
            AmAuditInformationRequestStore.currentPage = Math.ceil(AmAuditInformationRequestStore.totalItems / 15);
            
          }
          this.pageChange(AmAuditInformationRequestStore.currentPage,false);
        // }, 500);
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

  deleteInformationRequest(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_information_request_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  getPopupDetails(user) {
    let userDetailObject: any = {};
    userDetailObject['first_name'] = user.created_by_first_name;
    userDetailObject['last_name'] = user.created_by_last_name;
    userDetailObject['designation'] = user.created_by_designation;
    userDetailObject['department'] = user.created_by_department;
    userDetailObject['image_token'] = user.created_by_image_token;
    userDetailObject['email'] = user.created_by_user_email;
    userDetailObject['mobile'] = user.created_by_user_mobile;
    userDetailObject['id'] = user.created_by;
    userDetailObject['status_id'] = user.created_by_status_id?user.created_by_status_id:1;
    return userDetailObject;

  }

  
  getToPopupDetails(user) {
    let userDetailObject: any = {};
    userDetailObject['id'] = user.to_user_id;
    userDetailObject['first_name'] = user.to_user_first_name;
    userDetailObject['last_name'] = user.to_user_last_name;
    userDetailObject['designation'] = user.to_user_designation;
    userDetailObject['image_token'] = user.to_user_image_token;
    userDetailObject['email'] = user.to_user_email;
    userDetailObject['mobile'] = user.to_user_mobile;
    userDetailObject['status_id'] = user.to_user_status_id?user.to_user_status_id:1;

    return userDetailObject;

  }

  gotoDetails(id) {
    this._router.navigateByUrl('/audit-management/am-audits/' + AmAuditsStore.auditId + '/am-audit-information-request/' + id);
  }

  replaceHtmlTag(string) {
    // to erase every tags enclosed in <>
  let str = string.replace(/<[^>]+>/g,'');
  let st = str.replace(/\&nbsp;/g, ' ');
    return st;
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.informationRequestModal.unsubscribe();
    AmAuditInformationRequestStore.searchText = null;
    SubMenuItemStore.searchText = null;
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
  }


}
