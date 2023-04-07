import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { CorrectiveActionService } from 'src/app/core/services/internal-audit/audit-findings/corrective-action/corrective-action.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CorrectiveActionsStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-plan-list',
  templateUrl: './action-plan-list.component.html',
  styleUrls: ['./action-plan-list.component.scss']
})
export class ActionPlanListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup', { static: true }) mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  CorrectiveActionsStore = CorrectiveActionsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AppStore = AppStore;
  ShareItemStore = ShareItemStore;
  mailConfirmationData = 'corrective_action_share_msg';

  actionPlanObject = {
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
  AuthStore = AuthStore;
  filterSubscription: Subscription = null;
  addCASubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  popupControlEventSubscription: any;
  fileUploadPopupSubscriptionEvent: any;

  formErrors: any;
  constructor(private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _internalAuditFileService: InternalAuditFileService,
    private _eventEmitterService: EventEmitterService,
    private _correctiveActionService: CorrectiveActionService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _utilityService: UtilityService,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CorrectiveActionsStore.loaded = false;
      this.pageChange(1);
    })
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_TRAINING_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addActionPlan();
            break;
          // case "template":
          //    this._correctiveActionService.generateTemplate();
          //    break;
          case "export_to_excel":
            this._correctiveActionService.exportToExcel();
            //  this._correctiveActionService.exportToExcel();
            break;
          case "share":
            ShareItemStore.setTitle('share_internal_audit_corrective_actions');
            ShareItemStore.formErrors = {};
            break;
          case "search":
            CorrectiveActionsStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            CorrectiveActionsStore.loaded = false;
            CorrectiveActionsStore.searchText = null;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (ShareItemStore.shareData) {
        this._correctiveActionService.shareData(ShareItemStore.shareData).subscribe(res => {
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

    })
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: '', buttonText: '' });

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.caFindingsModalControl.subscribe(res => {
      this.closeFormModal();
    })

    // for deleting  modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.checkZindex();
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

    RightSidebarLayoutStore.filterPageTag = 'ia_corrective_action';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'responsible_user_ids',
      'finding_ids',
      'finding_corrective_action_status_ids'
    ]);

    this.pageChange(1);
  }

  sortTitle(type: string) {
    // FindingsStore.setCurrentPage(1);
    this._correctiveActionService.sortCaList(type, null);
    this.pageChange();
  }

  editCorrectiveACtion(actionPlan) {
    CorrectiveActionsStore.setSubMenuHide(false);
    event.stopImmediatePropagation();
    CorrectiveActionsStore.clearDocumentDetails();
    this.actionPlanObject.values = null;
    CorrectiveActionsStore.auditFindingId = actionPlan.finding_id;
    this._correctiveActionService.getItem(CorrectiveActionsStore.auditFindingId, actionPlan.id).subscribe(res => {
      setTimeout(() => {
        if (res.documents.length > 0) {
          this.setDocuments(res.documents)
        }
      }, 200);
      this.actionPlanObject.values = {
        id: res.id,
        title: res.title,
        findings: res.findings,
        responsible_user_id: res.responsible_user.id,
        description: res.description,
        start_date: this._helperService.processDate(res.start_date, 'split'),
        target_date: this._helperService.processDate(res.target_date, 'split'),
        documents: ''
      }
      this._utilityService.detectChanges(this._cdr);
    })
    this.actionPlanObject.type = 'Edit';
    this.openFormModal();
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
          var purl = this._internalAuditFileService.getThumbnailPreview('corrective-action', element.token);
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

  checkZindex() {
    if ($(this.addCAformModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'auto');
    }
  }
  pageChange(newPage: number = null) {

    if (newPage) CorrectiveActionsStore.setCurrentPage(newPage);
    this._correctiveActionService.getAllItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  gotoActionPlanDetails(actionPlan) {
    this._router.navigateByUrl('/internal-audit/corrective-action/findings/' + actionPlan.finding_id + '/corrective-actions/' + actionPlan.id)
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
      this._correctiveActionService.deleteItem(CorrectiveActionsStore.auditFindingId, this.popupObject.id).subscribe(resp => {
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
    CorrectiveActionsStore.auditFindingId = null;
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
  }

  // for delete
  delete(actionPlan) {
    event.stopPropagation();
    CorrectiveActionsStore.auditFindingId = actionPlan.finding_id;
    this.popupObject.type = '';
    this.popupObject.id = actionPlan.id;
    this.popupObject.title = 'Delete Action Plan?';
    this.popupObject.subtitle = 'ca_delete_popup_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for opening modal
  openFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 50);
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
    this.actionPlanObject.type = null;
    this.pageChange();
  }

  //calling corrective action add modal
  addActionPlan() {
    CorrectiveActionsStore.setSubMenuHide(false);
    this.actionPlanObject.type = null;
    this.actionPlanObject.values = null;
    this.CorrectiveActionsStore.clearDocumentDetails();
    this.actionPlanObject.type = 'Add';
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
    CorrectiveActionsStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    CorrectiveActionsStore.searchText = '';
    CorrectiveActionsStore.unsetCorrectiveActions();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
