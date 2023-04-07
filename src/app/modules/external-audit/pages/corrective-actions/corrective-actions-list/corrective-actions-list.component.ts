import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
// import { CorrectiveActionService } from 'src/app/core/services/external-audit/corrective-action/corrective-action.service';
import { ExternalAuditCorrectiveActionsService } from 'src/app/core/services/external-audit/corrective-actions/external-audit-corrective-actions.service';
import { ExternalAuditFileService } from 'src/app/core/services/external-audit/file-service/external-audit-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ExternalAuditCorrectiveActionStore } from 'src/app/stores/external-audit/corrective-actions/corrective-actions-store';
import { EADashboardStore } from 'src/app/stores/external-audit/ea-dashboard/ea-dashboard-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
// import { CorrectiveActionsStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-corrective-actions-list',
  templateUrl: './corrective-actions-list.component.html',
  styleUrls: ['./corrective-actions-list.component.scss']
})
export class CorrectiveActionsListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('mailConfirmationPopup', { static: true }) mailConfirmationPopup: ElementRef;

  ExternalAuditCorrectiveActionStore = ExternalAuditCorrectiveActionStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  ShareItemStore = ShareItemStore;
  mailConfirmationData = 'corrective_action_share_msg'
  // CorrectiveActionsStore = CorrectiveActionsStore;
  AppStore = AppStore;
  correctiveActionObject = {
    component: 'CorrectiveAction',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  addCASubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  popupControlEventSubscription: any;
  formErrors: any;
  filterSubscription: Subscription = null;

  constructor(private _externalAuditCorrectiveActionService: ExternalAuditCorrectiveActionsService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _externalAuditFileService: ExternalAuditFileService,
    private _eventEmitterService: EventEmitterService,
    // private _correctiveActionService: CorrectiveActionService,
    private _utilityService: UtilityService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ExternalAuditCorrectiveActionStore.loaded = false;
      this.pageChange(1);
    })
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search' } },
        {activityName:null, submenuItem: {type: 'refresh'}},
        { activityName: 'CREATE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_TRAINING_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'IMPORT_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'import' } },
        { activityName: 'EXPORT_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'EXPORT_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
      ]
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_corrective_action' });
      if (NoDataItemStore.clikedNoDataItem) {
        this.addCA();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addCA();
            break;
          case "template":
            this._externalAuditCorrectiveActionService.generateTemplate();
            break;
          case "export_to_excel":
            this._externalAuditCorrectiveActionService.exportToExcel();
            break;
          case "share":
            ShareItemStore.setTitle('share_external_audit_corrective_actions');
            ShareItemStore.formErrors = {};
            break;
          case "search":
            ExternalAuditCorrectiveActionStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            ExternalAuditCorrectiveActionStore.loaded = false;
            ExternalAuditCorrectiveActionStore.searchText = null;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_external_audit_corrective_action');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (ShareItemStore.shareData) {
        this._externalAuditCorrectiveActionService.shareData(ShareItemStore.shareData).subscribe(res => {
          ShareItemStore.unsetShareData();
          ShareItemStore.setTitle('');
          ShareItemStore.unsetData();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            $(this.mailConfirmationPopup.nativeElement).modal('show');
          }, 200);
        }, (error) => {
          if (error.status == 422) {
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();

        });
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._externalAuditCorrectiveActionService.importData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        }, (error) => {
          if (error.status == 422) {
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if (error.status == 500 || error.status == 403) {
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.correctiveActionModalControl.subscribe(res => {
      this.closeFormModal();
    })

    // for deleting  modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.addCAformModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.addCAformModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'auto');
      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    RightSidebarLayoutStore.filterPageTag = 'ea_corrective_action';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
  
      'department_ids',
      'external_audit_ids',
      'finding_ids',
      'external_audit_type_ids',
      'responsible_user_ids',
      'finding_corrective_action_status_ids'
    ]);
    this.pageChange(1);
  }

  editCorrectiveACtion(action) {
    ExternalAuditCorrectiveActionStore.setSubMenuHide(false);
    event.stopImmediatePropagation();
    ExternalAuditCorrectiveActionStore.clearDocumentDetails();
    this.correctiveActionObject.values = null;
    ExternalAuditCorrectiveActionStore.auditFindingId = action.finding_id;
    this._externalAuditCorrectiveActionService.getItem(action.finding_id, action.id).subscribe(res => {
      setTimeout(() => {
        if (res.documents.length > 0) {
          this.setDocuments(res.documents)
        }
      }, 200);
      this.correctiveActionObject.values = {
        id: res.id,
        title: res.title,
        findings: res.findings,
        responsible_user: res.responsible_user,
        description: res.description,
        start_date: this._helperService.processDate(res.start_date, 'split'),
        target_date: this._helperService.processDate(res.target_date, 'split'),
        documents: ''
      }
      this._utilityService.detectChanges(this._cdr);
    })
    this.correctiveActionObject.type = 'Edit';
    this.openFormModal();
  }


  // for sorting
  sortTitle(type: string) {
    // FindingsStore.setCurrentPage(1);
    this._externalAuditCorrectiveActionService.sortCaList(type, null);
    this.pageChange();
  }

  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._externalAuditFileService.getThumbnailPreview('corrective-action', element.token);
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    // this.enableScrollbar();
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  pageChange(newPage: number = null) {

    if (newPage) ExternalAuditCorrectiveActionStore.setCurrentPage(newPage);
    this._externalAuditCorrectiveActionService.getAllItems(EADashboardStore.filterParams ? '&'+EADashboardStore.filterParams : '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  gotoCorrectiveActionDetails(action) {
    this._router.navigateByUrl('/external-audit/corrective-action/findings/' + action.finding_id + '/corrective-actions/' + action.id)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteActionPlan(status)
        break;
    }
  }

  deleteActionPlan(status: boolean) {
    if (status && this.popupObject.id) {

      this._externalAuditCorrectiveActionService.deleteItem(ExternalAuditCorrectiveActionStore.auditFindingId, this.popupObject.id).subscribe(resp => {
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
    ExternalAuditCorrectiveActionStore.auditFindingId = null;
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    //   this.popupObject.title = '';
    //   this.popupObject.subtitle = '';
    //  this.popupObject.type = '';
  }

  // for delete
  delete(actionPlan) {
    event.stopPropagation();
    ExternalAuditCorrectiveActionStore.auditFindingId = actionPlan.finding_id;
    this.popupObject.type = '';
    this.popupObject.id = actionPlan.id;
    this.popupObject.title = 'delete_corrective_action?';
    this.popupObject.subtitle = 'are_you_sure_to_delete_ca';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for opening modal
  openFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.addCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'auto')
  }

  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.addCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'none');
    this.correctiveActionObject.type = null;
    this.pageChange();
  }

  //calling corrective action add modal
  addCA() {
    ExternalAuditCorrectiveActionStore.setSubMenuHide(false);
    this.correctiveActionObject.type = null;
    this.correctiveActionObject.values = null;
    this.ExternalAuditCorrectiveActionStore.clearDocumentDetails();
    this.correctiveActionObject.type = 'Add';

    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);

  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.style.height = '45px';
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ExternalAuditCorrectiveActionStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    // CorrectiveActionsStore.searchText = '';
    ExternalAuditCorrectiveActionStore.loaded = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    ExternalAuditCorrectiveActionStore.unsetCorrectiveActions();
    EADashboardStore.dashboardParam = null;
    EADashboardStore.unSetFilterParams();
  }

}

