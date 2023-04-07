import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentCaWorkflowService } from 'src/app/core/services/incident-management/incident-ca-workflow/incident-ca-workflow.service';
import { IncidentCorrectiveActionService } from 'src/app/core/services/incident-management/incident-corrective-action/incident-corrective-action.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CorrectiveActionMasterStore } from 'src/app/stores/external-audit/corrective-action/corrective-action-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { IncidentCaWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-ca-workflow.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  selector: 'app-corrective-action-details',
  templateUrl: './corrective-action-details.component.html',
  styleUrls: ['./corrective-action-details.component.scss']
})
export class CorrectiveActionDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('formModals', { static: false }) formModals: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild("formModal") formModal: ElementRef;
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('scroll') scroll: any;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;



  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  IncidentCorrectiveActionStore = IncidentCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  IncidentCaWorkflowStore = IncidentCaWorkflowStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  fileUploadPopupStore=fileUploadPopupStore;
  AppStore = AppStore;
  AuthStore = AuthStore
  IncidentStore = IncidentStore;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  correctiveActionObject = {
    component: 'Master',
    values: null,
    type: null
  };
  updateObject = {
    id: null,
    risk_id: null,
    values: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  incidentCorrectiveActionObject = {
    type: null,
    values: null,
  }
  historyPopupObject = {
    id: null,
    type: null
  }
  // previewObject = {
  //   preview_url: null,
  //   file_details: null,
  //   uploaded_user: null,
  //   created_at: "",
  //   component: "",
  //   componentId: null,
  // };
  previewObject = {
    incident_id: null,
    ca_id: null,
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null,
    componentId: null
  };

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  addCASubscriptionEvent: any;

  correctiveActionId: number;
  updateIncidentCorrectiveAction: boolean;
  updateEventSubscription: any;
  popupControlEventSubscription: any;
  historyPopupSubcriptionEvent: any;
  workflowModalOpened: boolean = false;
  workflowHistoryOpened = false
  IncidentInfoCommentSuvscription: any;
  IncidentInfoWorkflowSubscription: any;
  IncidentInfoHistorySubscription: any;
  fileUploadPopupSubscriptionEvent: any;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _incidentCorrectiveActionService: IncidentCorrectiveActionService,
    private _documentFileService: DocumentFileService,
    private _incidentService: IncidentService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _sanitizer:DomSanitizer,
    private _activatedRouter: ActivatedRoute,
    private _route: Router,
    private _incidentCaWorkflowService: IncidentCaWorkflowService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    IncidentCorrectiveActionStore.unsetIndividualCorrectiveAction();
    // let id: number;
    this._activatedRouter.params.subscribe(params => {
      this.correctiveActionId = +params['id'];
      IncidentCorrectiveActionStore.setSelectedIincidentId(this.correctiveActionId)
      setTimeout(() => {
        this.getIncidentCA(this.correctiveActionId);
      }, 80);
    });
    this.reactionDisposer = autorun(() => {
      // setting submenu items
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editCorrectiveAction()
            break;
          case 'submit':
            // SubMenuItemStore.submitClicked = true;
            this.submitForReview();
            break
          case 'submit':
            SubMenuItemStore.submitClicked = true;
            this.submitForReview();
            break
          case 'approve':
            this.approveRisk();
            break
          case 'review_submit':
            this.approveRisk(true);
            break
          case 'revert':
            // SubMenuItemStore.submitClicked = true;
            this.revertRisk();
            break
          case 'history':
            this.openHistoryPopup();
            break;
          case 'workflow':
            this.openWorkflowPopup()
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })



    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.addIncidentCorrectiveAction.subscribe(res => {
      this.closeCorrectiveActionModal();
    })

    this.historyPopupSubcriptionEvent = this._eventEmitterService.closeHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    })

    this.updateEventSubscription = this._eventEmitterService.incidentCorrectiveActionUpdateModal.subscribe(item => {
      this.closeUpdateFormModal();
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
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.IncidentInfoCommentSuvscription = this._eventEmitterService.IncidentCaWorkflowCommentModal.subscribe(element => {
      this.closeCommentForm();

    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })

    this.IncidentInfoWorkflowSubscription = this._eventEmitterService.IncidentCaWorkflow.subscribe(element => {
      this.closeWorkflowPopup();

    })

    this.IncidentInfoHistorySubscription = this._eventEmitterService.IncidentCaHistory.subscribe(element => {
      this.closeHistoryPopup();

    })
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

  }

  gotoIncident() {
    this._route.navigateByUrl(`/incident-management/${IncidentCorrectiveActionStore.IncidentCAList.incident.id}/info`);
  }

  getWorkflowDetails() {
    this._incidentCaWorkflowService.getItems(this.correctiveActionId).subscribe(res => {
      this.setSubMenu(IncidentCorrectiveActionStore.IncidentCAList);
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getDaysRemaining() {
    let startDate = new Date(IncidentCorrectiveActionStore.IncidentCAList?.target_date);
    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  getTotaldays() {
    let startDate = new Date(IncidentCorrectiveActionStore.IncidentCAList?.start_date);
    let targetDate = new Date(IncidentCorrectiveActionStore.IncidentCAList?.target_date);
    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;
  }

  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  createImageUrl(type, token) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
      return this._incidentCorrectiveActionService.getThumbnailPreview(type, token);
  }

  viewAttachments(type, document, khDocuments?) {
    switch (type) {
      case "corrective-action-details":
        this._incidentCorrectiveActionService.getFilePreview(type, IncidentCorrectiveActionStore.IncidentCAList.id, document.id).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(res, document.title);
          this.openPreviewModal(type, resp, document, document);
        }), (error => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage('Error', 'permission_denied');
          }
          else {
            this._utilityService.showErrorMessage('Error', 'unable_to_generate_preview');
          }
        });
        break;
      case "document-version":
        this._documentFileService.getFilePreview(type, document.document_id, khDocuments.id).subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(res, document.title);
          this.openPreviewModal(type, resp, khDocuments, document);
        }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
    }
  }


  downloadDocument(type, document, docs?) {
    switch (type) {
      case "corrective-action-details":
        this._incidentCorrectiveActionService.downloadFile(type, IncidentCorrectiveActionStore.IncidentCAList.id, document.id,document.title, null, document);
        break;
      case "document-version":
        this._documentFileService.downloadFile(type, document.document_id, docs.id, null, document.title, docs);
        break;
    }
  }

  openPreviewModal(type, filePreview, itemDetails, document) {
    let uploaded_user = null;
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = type;
    this.previewObject.file_details = itemDetails;
    this.previewObject.componentId = document.id;
    this.previewObject.ca_id = document.incident_corrective_action_id;
    this.previewObject.incident_id = IncidentCorrectiveActionStore.IncidentCAList.incident.id;
    this.previewObject.preview_url = previewItem;
    this.previewObject.uploaded_user = IncidentCorrectiveActionStore.IncidentCAList.created_by ? IncidentCorrectiveActionStore.IncidentCAList.created_by : null;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closePreviewModal($event?) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }

  getIncident() {
    this._incidentService.getItem(IncidentCorrectiveActionStore.IncidentCAList?.incident?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  submitAccepted(status) {
    if (status) {
      this._incidentCaWorkflowService.submitCA(this.correctiveActionId).subscribe(res => {
        SubMenuItemStore.submitClicked = false;
        this.getIncidentCA(this.correctiveActionId)
        this._utilityService.detectChanges(this._cdr);
      })
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  submitForReview() {
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'submit_c_a';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  openHistoryPopup() {
    IncidentCaWorkflowStore.setCurrentPage(1);
    this._incidentCaWorkflowService.getHistory(this.correctiveActionId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  openWorkflowPopup() {
    this._incidentCaWorkflowService.getItems(this.correctiveActionId).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }

  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }

  approveRisk(type?) {
    if (type) {
      IncidentCaWorkflowStore.type = 'submit';
    }
    else
      IncidentCaWorkflowStore.type = 'approve';
    IncidentCaWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
    // this._riskInfoWorkflowService.approveRisk(RisksStore.riskId,{}).subscribe(res=>{
    //   this._risksService.getItem(RisksStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))

    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  closeCommentForm() {
    this.getIncidentCA(this.correctiveActionId)
    IncidentCaWorkflowStore.type = '';
    IncidentCaWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

    this._utilityService.detectChanges(this._cdr)
  }

  revertRisk() {
    IncidentCaWorkflowStore.type = 'revert';
    IncidentCaWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  //showing data with id
  getIncidentCA(id) {
    this._incidentCorrectiveActionService.getDetailsCA(id).subscribe((res) => {
      this.getWorkflowDetails();
      this.getIncident();
      this._utilityService.detectChanges(this._cdr)
    }

    );
  }

  setSubMenu(res) {
    var subMenuItems = []
    if (res) {
      if (res.incident_corrective_action_status.type == 'resolved' || res.incident_corrective_action_status.type == 'closed') {
        subMenuItems = [
          { activityName: 'LIST_INCIDENT_CORRECTIVE_ACTION_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'workflow' } },
          { activityName: null, submenuItem: { type: 'close', path: '../' } }
        ]

        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      } else {
        if (res.next_review_user_level == 1 && res.submitted_by == null) {
          subMenuItems = [
            { activityName: 'SUBMIT_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'submit' } },
            { activityName: 'UPDATE_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
            { activityName: 'LIST_INCIDENT_CORRECTIVE_ACTION_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } }
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
        else if (res.submitted_by != null && this.isUser()) {
          if (res?.next_review_user_level == IncidentCaWorkflowStore?.workflowDetails[IncidentCaWorkflowStore?.workflowDetails?.length - 1]?.level) {
            subMenuItems = [
              { activityName: 'APPROVE_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'approve' } },
              { activityName: 'REVERT_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'revert' } },
              { activityName: 'UPDATE_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
              { activityName: 'LIST_INCIDENT_CORRECTIVE_ACTION_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'workflow' } },
              { activityName: null, submenuItem: { type: 'close', path: '../' } }
            ]
            this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
            this._utilityService.detectChanges(this._cdr);
          }
          else if (res.next_review_user_level != IncidentCaWorkflowStore?.workflowDetails[IncidentCaWorkflowStore?.workflowDetails?.length - 1]?.level) {
            subMenuItems = [
              { activityName: 'SUBMIT_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'review_submit' } },
              { activityName: 'REVERT_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'revert' } },
              { activityName: 'UPDATE_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
              { activityName: 'LIST_INCIDENT_CORRECTIVE_ACTION_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'workflow' } },
              { activityName: null, submenuItem: { type: 'close', path: '../' } }
            ]
            this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
            this._utilityService.detectChanges(this._cdr);
          }
        }
        else {
          subMenuItems = [
            { activityName: 'UPDATE_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
            { activityName: 'LIST_INCIDENT_CORRECTIVE_ACTION_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } }
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
      }
    }
  }

  isUser() {
    if (IncidentCorrectiveActionStore?.correctiveActionDetailListLoaded) {
      for (let i of IncidentCorrectiveActionStore?.IncidentCAList.workflow_items) {
        if (i.level == IncidentCorrectiveActionStore?.IncidentCAList?.next_review_user_level) {
          var pos = i.users?.findIndex(e => e.id == AuthStore.user.id)
          if (pos != -1) {
            return true;
          }
          else {
            return false
          }
        }
      }
    }
    else {
      return false;
    }
  }

  // for opening modal
  openFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 50);


  }

  // for closing the ica form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this.correctiveActionObject.type = null;
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
      
    } else if ($(this.formModals.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModals.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModals.nativeElement, 'overflow', 'auto');
    }
  }

  editCorrectiveAction() {
    IncidentCorrectiveActionStore.clearDocumentDetails();
    const corrective_action = IncidentCorrectiveActionStore.IncidentCAList;
    setTimeout(() => {
      if (corrective_action.documents.length > 0) {
        this.setDocuments(corrective_action.documents)
      }
    }, 200);
    this.incidentCorrectiveActionObject.values = {
      id: IncidentCorrectiveActionStore.IncidentCAList.id,
      title: IncidentCorrectiveActionStore.IncidentCAList.title,
      responsible_user_id: IncidentCorrectiveActionStore.IncidentCAList.responsible_user,
      watcher_ids:this._helperService.getArrayProcessed(IncidentCorrectiveActionStore.IncidentCAList.incident_corrective_action_watchers,'id'),
      description: IncidentCorrectiveActionStore.IncidentCAList.description,
      incident_id: IncidentCorrectiveActionStore.IncidentCAList.incident.id,
      start_date: this._helperService.processDate(IncidentCorrectiveActionStore.IncidentCAList.start_date,'split'),
      target_date: this._helperService.processDate(IncidentCorrectiveActionStore.IncidentCAList.target_date,'split'),
      budget: IncidentCorrectiveActionStore.IncidentCAList.budget,
      documents: '',
    }
    this.incidentCorrectiveActionObject.type = 'Edit';
    this._utilityService.detectChanges(this._cdr);
    this.openCorrectionActionModal();
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
          var purl = this._incidentCorrectiveActionService.getThumbnailPreview('corrective-action-details', element.token);
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

  openCorrectionActionModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeCorrectiveActionModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this.getIncidentCA(this.correctiveActionId);
    }, 50);
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
      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      userInfoObject.designation = user?.designation;
      userInfoObject.image_token = user?.image.token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status.id
      userInfoObject.department = null;
      return userInfoObject;
    }
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    if (users) {
      userDetial['first_name'] = users.first_name;
      userDetial['last_name'] = users.last_name;
      userDetial['designation'] = users.designation;
      userDetial['image_token'] = users.image.token;
      userDetial['email'] = users.email;
      userDetial['mobile'] = users.mobile;
      userDetial['id'] = users.id;
      userDetial['department'] = users.department;
      userDetial['status_id'] = users.status_id ? users.status_id : users.status.id;
      userDetial['created_at'] = created ? created : null;
      return userDetial;
    }
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }

  // Closes from preview
  // closePreviewModal(event) {
  //   $(this.filePreviewModal.nativeElement).modal("hide");
  //   this.previewObject.preview_url = "";
  //   this.previewObject.uploaded_user = null;
  //   this.previewObject.created_at = "";
  //   this.previewObject.file_details = null;
  //   this.previewObject.componentId = null;
  // }


  openUpdateModal() {
    this.IncidentCorrectiveActionStore.clearDocumentDetailsUpdate();

    this.updateIncidentCorrectiveAction = true;
    // this.updateObject.risk_id = RiskTreatmentStore.riskTreatmentDetails.risk.id;
    this._incidentCorrectiveActionService.getUpdateData(this.correctiveActionId).subscribe(res => {
      if (res['data'].length > 0) {
        // if (res['data'][0].documents && res['data'][0].documents.length > 0) {
        //   for (let i of res['data'][0].documents) {
        //     let docurl = this._incidentCorrectiveActionService.getThumbnailPreview('incident-correctiveaction', i.token);
        //     let docDetails = {
        //       name: i.title,
        //       ext: i.ext,
        //       size: i.size,
        //       url: i.url,
        //       thumbnail_url: i.url,
        //       token: i.token,
        //       preview: docurl,
        //       id: i.id,
        //       user_document_detail_id: i.risk_treatment_update_id
        //     };
        //     IncidentCorrectiveActionStore.setDocumentImageDetails(docDetails, docurl, 'incident');
        //   }
          

        // }
        this.updateObject.values = {
          percentage: res['data'][0].percentage,
          incident_corrective_action_status_id: res['data'][0].incident_corrective_action_status_id,
          //  amount_used:res['data'][0].amount_used,
          comment: res['data'][0].comment,
          documents: res['data'][0].documents

        }
      }
      this.updateObject.id = this.correctiveActionId;
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModals.nativeElement).modal('show');
      }, 250);
    })


    // setTimeout(() => {
    //   this._renderer2.setStyle(this.controlPopup.nativeElement, 'display', 'block');
    //   // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    //   this._renderer2.removeAttribute(this.controlPopup.nativeElement, 'aria-hidden');
    //   this._renderer2.addClass(this.controlPopup.nativeElement, 'show')
    //   this._utilityService.detectChanges(this._cdr)
    // }, 100);

  }

  closeUpdateFormModal() {
    this.getIncidentCA(this.correctiveActionId);
    this.historyPageChange(1);
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    $(this.formModals.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);

  }

  // for delete
  closeCorrectiveAction() {
    event.stopPropagation();
    this.popupObject.type = 'Confirm';
    this.popupObject.id = this.correctiveActionId;
    this.popupObject.title = 'Close Corrective Action?';
    this.popupObject.subtitle = 'Are you sure about ths?';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  close(status: boolean) {
    if (status && this.popupObject.id) {
      this._incidentCorrectiveActionService.closeCorrectiveActions(this.popupObject.id).subscribe((res) => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this.getIncidentCA(this.correctiveActionId);
        }, 500);
        this.clearPopupObject();
      })

    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  // modal control event
  modalControl(status: boolean) {
    if (this.popupObject.title != 'submit') {
      switch (this.popupObject.type) {
        case 'Confirm': this.close(status)
          break;
      }
    } else {
      switch (this.popupObject.type) {
        case 'Confirm': this.submitAccepted(status)
          break;
      }
    }
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  openHistoryModal() {
    this.historyPageChange(1);
    this.historyPopupObject.type = 'add'
    this.historyPopupObject.id = this.correctiveActionId
    setTimeout(() => {
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'auto');
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);

  }

  closeHistoryModal() {
    this.historyPopupObject.id = null;
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 99);
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'none');
    $(this.historyPopup.nativeElement).modal('hide');
  }

  historyPageChange(newPage: number = null) {
    if (newPage) IncidentCorrectiveActionStore.setHistoryCurrentPage(newPage);
    this._incidentCorrectiveActionService.getUpdateData(this.correctiveActionId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.updateEventSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.historyPopupSubcriptionEvent.unsubscribe();
    this.IncidentInfoCommentSuvscription.unsubscribe();
    this.IncidentInfoWorkflowSubscription.unsubscribe();
    this.IncidentInfoHistorySubscription.unsubscribe()
    AppStore.showDiscussion = false;

  }
}
