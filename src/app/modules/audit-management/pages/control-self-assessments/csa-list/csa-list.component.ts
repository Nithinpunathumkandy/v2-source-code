import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AmCsaService } from 'src/app/core/services/audit-management/am-csa/am-csa.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AmCSAStore } from 'src/app/stores/audit-management/am-csa/am-csa.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-csa-list',
  templateUrl: './csa-list.component.html',
  styleUrls: ['./csa-list.component.scss']
})
export class CsaListComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  AmCSAStore = AmCSAStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  CSAModal: any;
  AppStore = AppStore;
  CSAObject = {
    component: 'CSA',
    values: null,
    type: null,
  };

  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };

  filterSubscription: Subscription = null;

  constructor(private _csaService: AmCsaService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _auditManagementService: AuditManagementService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmCSAStore.loaded = false;
      this.pageChange(1);
    });
      var subMenuItems = [
        { activityName: 'AM_AUDIT_CONTROL_SELF_ASSESSMENT_LIST', submenuItem: { type: 'refresh' } },
        {activityName:'CREATE_AM_AUDIT_CONTROL_SELF_ASSESSMENT',submenuItem:{type:'new_modal'}},
       
        { activityName: 'AM_AUDIT_CONTROL_SELF_ASSESSMENT_LIST', submenuItem: { type: 'search' } },
        { activityName: 'AM_AUDIT_CONTROL_SELF_ASSESSMENT_EXPORT', submenuItem: { type: 'export_to_excel' } },

      ]
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_csa' });
     
    this.reactionDisposer = autorun(() => {
    
      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'CREATE_AM_AUDIT_CONTROL_SELF_ASSESSMENT')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case 'new_modal':
            this.openFormModal();
            break;
          case 'refresh':
            this.pageChange(1);
            break;
          case "export_to_excel":
            this._csaService.exportToExcel();
            break;
          case "search":
            AmCSAStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.addCSA();
        this._utilityService.detectChanges(this._cdr);
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    AppStore.showDiscussion = false;

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.CSAModal = this._eventEmitterService.amCSAModal.subscribe(item => {
      this.closeFormModal();
    })
    this.pageChange(1);

    RightSidebarLayoutStore.filterPageTag = 'am_audit_csa';
    this._rightSidebarFilterService.setFiltersForCurrentPage([

      'department_ids',

    ]);

  }


  addCSA(){
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);
  }

  
  pageChange(newPage: number = null) {
 
    AmCSAStore.loaded = false;
    if (newPage) AmCSAStore.setCurrentPage(newPage);
    this._csaService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoDetails(item) {
    this._router.navigateByUrl('/audit-management/am-audit-control-self-assessments/' + item.id)
  }

  openFormModal() {
    this.CSAObject.type = 'Add';
    this.CSAObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  
  }


  closeFormModal() {
    this.CSAObject.type = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }


  /**
* Delete the audit CSA
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._csaService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (AmCSAStore.currentPage > 1 && this.deleteObject.type == '') {
            AmCSAStore.currentPage = Math.ceil(AmCSAStore.totalItems / 15);
            this.pageChange(AmCSAStore.currentPage);
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

  deleteCSA(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_csa_subtitle';

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


  editCSA(id) {
    this._csaService.getItem(id).subscribe(res => {

      this.CSAObject.values = {
        id: id,
        title: res['title'],
        description: res['description'],
        department: res['department'],
        divisions: res['divisions'],

      }
      this.clearCommonFilePopupDocuments();
      if (res['documents']?.length > 0) {
        this.setDocuments(res['documents']);
      }

      this.CSAObject.type = 'Edit';

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
          var purl = this._auditManagementService.getThumbnailPreview('csa-document', element.token)
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
    this._csaService.sortAuditFindingList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    AmCSAStore.searchText = null;
    SubMenuItemStore.searchText = null;
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
    this.CSAModal.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }

}
