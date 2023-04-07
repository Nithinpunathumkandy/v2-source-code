import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AmAuditFindingService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AMAuditDashboardStore } from 'src/app/stores/audit-management/am-audit-dashboard/am-audit-dashboard.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-am-audit-findings',
  templateUrl: './am-audit-findings.component.html',
  styleUrls: ['./am-audit-findings.component.scss']
})
export class AmAuditFindingsComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  AmAuditFindingStore = AmAuditFindingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  findingModal: any;
  AppStore = AppStore;
  AmAuditsStore = AmAuditsStore;
  findingObject = {
    component: 'Audit',
    values: null,
    type: null,
  };

  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };

  filterSubscription: Subscription = null;

  constructor(private _auditFindingService: AmAuditFindingService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _auditManagementService: AuditManagementService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _renderer2:Renderer2
  ) { }

  ngOnInit(): void {
    AmAuditFindingStore.unsetIndiviudalAuditDetails();
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmAuditFindingStore.loaded = false;
      this.pageChange(1);
    });
      var subMenuItems = [
        { activityName: 'AM_AUDIT_FINDING_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'AM_AUDIT_FINDING_LIST', submenuItem: { type: 'search' } },
        { activityName: 'EXPORT_AM_AUDIT_FINDING', submenuItem: { type: 'export_to_excel' } },

      ]

    this.reactionDisposer = autorun(() => {
    
      NoDataItemStore.setNoDataItems({ title: "", subtitle: 'common_nodata_title'});

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case 'refresh':
            this.pageChange(1);
            break;
          case "export_to_excel":
            this._auditFindingService.exportToExcel();
            break;
          case "search":
            AmAuditFindingStore.searchText = SubMenuItemStore.searchText;
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

    this.findingModal = this._eventEmitterService.amAuditFindingModal.subscribe(item => {
      this.closeFormModal();
    })
    RightSidebarLayoutStore.filterPageTag = 'am_audit_finding';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'risk_rating_ids',
      // 'finding_category_ids',
      'finding_status_ids',
    ]);
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    AmAuditFindingStore.unsetAuditFindingId();
    AmAuditFindingStore.loaded = false;
    var additionalParams=''
      if (AMAuditDashboardStore.DashboardParameter) {
        additionalParams = AMAuditDashboardStore.DashboardParameter
      }
    if (newPage) AmAuditFindingStore.setCurrentPage(newPage);
    this._auditFindingService.getItems(false,additionalParams ? additionalParams : '').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoDetails(item) {
    AmAuditFindingStore.findingComponent = 'finding';
    this._router.navigateByUrl('/audit-management/am-audit-field-works/'+item.am_audit_id+'/am-audit-findings/' + item.id)
  }

  openFormModal() {
    this.findingObject.type = 'Add';
    this.findingObject.values = null;
    setTimeout(() => {
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  
  }


  closeFormModal() {
    this.findingObject.type = null;
    setTimeout(() => {
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }


  /**
* Delete the audit finding
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditFindingService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (AmAuditFindingStore.currentPage > 1 && this.deleteObject.type == '') {
            AmAuditFindingStore.currentPage = Math.ceil(AmAuditFindingStore.totalItems / 15);
            this.pageChange(AmAuditFindingStore.currentPage);
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

  deleteFinding(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_finding_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  getPopupDetails(user) {
    // $('.modal-backdrop').remove(); 
    let userDetailObject: any = {};
    userDetailObject['first_name'] = user.created_by_first_name;
    userDetailObject['last_name'] = user.created_by_last_name;
    userDetailObject['designation'] = user.created_by_designation;
    userDetailObject['department'] = user.created_by_department;
    userDetailObject['image_token'] = user.created_by_image_token;
    return userDetailObject;

  }


  editFinding(id) {
    AmAuditFindingStore.setAuditFindingId(id);
    this._auditFindingService.getItem(id).subscribe(res => {

      this.findingObject.values = {

        id: id,
        am_audit_id: res['am_audit']?.id,
        am_audit_test_plan_id: res['am_audit_test_plan']?.id,
        finding_risk_rating_id: res['am_audit_finding_risk_rating']?.id,
        title: res['title'],
        description: res['description'],
        recommendation: res['recommendation'],
        department_response: res['department_response'],
        remarks: res['remarks'],
        finding_risks: res['am_audit_finding_risks']?res['am_audit_finding_risks']:[],
        documents: res['finding_documents'],

      }
      this.clearCommonFilePopupDocuments();
      if (res['finding_documents']?.length > 0) {
        this.setDocuments(res['finding_documents']);
      }

      this.findingObject.type = 'Edit';

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
          var purl = this._auditManagementService.getThumbnailPreview('finding-document', element.token)
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

  sortTitle(type: string) {
    //ExternalAuditMasterStore.setCurrentPage(1);
    this._auditFindingService.sortAuditFindingList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    AmAuditFindingStore.searchText = null;
    SubMenuItemStore.searchText = null;
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
    this.findingModal.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AMAuditDashboardStore.unsetDashboardParam()
  }


}
