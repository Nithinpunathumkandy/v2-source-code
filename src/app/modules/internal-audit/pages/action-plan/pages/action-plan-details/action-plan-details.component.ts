import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { CorrectiveActionService } from 'src/app/core/services/internal-audit/audit-findings/corrective-action/corrective-action.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CorrectiveActionsStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { CaCommentsStore } from 'src/app/stores/internal-audit/audit-findings/corrective-actions-comment/ca-comment-store';
import { CaCommentService } from 'src/app/core/services/internal-audit/audit-findings/corrective-action-comments/ca-comment.service';
import { DiscussionBotStore } from "src/app/stores/general/discussion-bot.store";
import { DiscussionBotService } from "src/app/core/services/general/discussion-bot/discussion-bot.service";
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-plan-details',
  templateUrl: './action-plan-details.component.html',
  styleUrls: ['./action-plan-details.component.scss']
})
export class ActionPlanDetailsComponent implements OnInit, OnDestroy {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('UpdateCAformModal') UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup', { static: true }) historyPopup: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('scroll') scroll: any;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  CorrectiveActionsStore = CorrectiveActionsStore;
  AuditFindingsStore = AuditFindingsStore
  fileUploadPopupStore = fileUploadPopupStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  subscription: any;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  // CorrectiveActionsStore = CorrectiveActionsStore;
  CaCommentsStore = CaCommentsStore;
  actionPlanObject = {
    component: 'CorrectiveAction',
    values: null,
    type: null
  };

  caUpdateObject = {
    component: 'CorrectiveAction',
    values: null,
    type: null
  };

  popupObject = {
    category: '',
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  findings_id: number;
  corrective_action_id: number;
  comments: any;
  comment_id: number = null;
  fileUploadPreviewFocus: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  addCASubscriptionEvent: any;
  updateSubscriptionEvent: any;
  historySubscriptionEvent: any;
  popupControlDeleteSubscription: any;

  commentEmptyList = "No Discussions Found!! Type to start..";

  constructor(private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _internalAuditFileService: InternalAuditFileService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _caCommentService: CaCommentService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _sanitizer: DomSanitizer,
    private _documentFileService: DocumentFileService,
    private _correctiveActionService: CorrectiveActionService,
    private _auditFindingsService: AuditFindingsService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _router: Router,
    private _discussionBotService: DiscussionBotService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = true;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.gotoEditPage();
            break;
          case "delete":
            this.deleteCa(CorrectiveActionsStore.correctiveActionDetails.id);
            break;
          case "go_to_audit":
            this.gotoAuditPage();
            break;
          case "go_to_findings":
            this.gotoFindingsPage();
            break;
          case "update_modal":
            this.updateCorrectiveAction();
            break;
          case "history":
            this.openHistoryModal();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.popupControlDeleteSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.addCASubscriptionEvent = this._eventEmitterService.caFindingsModalControl.subscribe(res => {
      this.closeFormModal();
    })

    this.fileUploadPreviewFocus = this._eventEmitterService.fileUploadPreviewFocus.subscribe(res => {
      this.changeZIndex();
    })

    this.updateSubscriptionEvent = this._eventEmitterService.externalAuditCaUpdateModal.subscribe(res => {
      this.closeUpdateModal();
    })

    this.historySubscriptionEvent = this._eventEmitterService.externalAuditCaHistoryModal.subscribe(res => {
      this.closeHistoryModal();
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

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    let finding_id: number
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      finding_id = +params['finding_id'];
      this.findings_id = finding_id;
      this.corrective_action_id = id;
      this.getActionPlan(id);
    });
  }

  getActionPlan(id) {
    this.comments = null;
    this.comment_id = null;
    this._correctiveActionService.getItem(this.findings_id, id).subscribe(res => {
      this.setSubmenu(res);
      this.getFindings();
      DiscussionBotStore.setDiscussionMessage([]);
      DiscussionBotStore.setbasePath('/findings/');
      DiscussionBotStore.setDiscussionAPI(this.findings_id + '/corrective-actions/' + this.corrective_action_id + '/comments');
      this.getImagePrivew();
      this.downloadDiscussionThumbnial();
      this.showThumbnailImage();
      this.getDiscussions();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setSubmenu(res) {
    if (res.corrective_action_status?.type != "closed") {
      if (CorrectiveActionsStore.correctiveActionDetails?.findings?.audit_id) {

        var subMenuItems = [
          { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
          { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_findings' } },
          { activityName: 'UPDATE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
          { activityName: 'CREATE_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'update_modal' } },
          { activityName: 'FINDING_CORRECTIVE_ACTION_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/internal-audit/corrective-action' } },
        ]
      }
      else {
        var subMenuItems = [
          { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_findings' } },
          { activityName: 'UPDATE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
          { activityName: 'CREATE_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'update_modal' } },
          { activityName: 'FINDING_CORRECTIVE_ACTION_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/internal-audit/corrective-action' } },
        ]
      }
    } else {
      if (CorrectiveActionsStore.correctiveActionDetails?.findings?.audit_id) {
        var subMenuItems = [
          { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
          { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_findings' } },
          // { activityName: 'DELETE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
          { activityName: 'FINDING_CORRECTIVE_ACTION_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/internal-audit/corrective-action' } },
        ]
      } else {
        var subMenuItems = [
          { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_findings' } },
          // { activityName: 'DELETE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
          { activityName: 'FINDING_CORRECTIVE_ACTION_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/internal-audit/corrective-action' } },
        ]
      }
    }
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  }

  getFindings() {
    this._auditFindingsService.getItem(CorrectiveActionsStore.correctiveActionDetails?.finding_id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDiscussions() {
    this._discussionBotService.getDiscussionMessage().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  downloadDiscussionThumbnial() {
    DiscussionBotStore.setThumbnailDownloadAPI(this.findings_id + '/corrective-actions/' + this.corrective_action_id + '/comments/')
  }

  showThumbnailImage() {
    DiscussionBotStore.setShowThumbnailAPI(this.findings_id + '/corrective-actions/' + this.corrective_action_id + '/comments/')
  }

  getImagePrivew() {
    DiscussionBotStore.setDiscussionThumbnailAPI('/internal-audit/files/finding-corrective-action-comment-document/thumbnail?token=')
  }

  getComments() {
    this._caCommentService.getComments(this.findings_id, this.corrective_action_id).subscribe(res => {
      // $(this.scroll.nativeElement).mCustomScrollbar();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  processMessage() {
    var saveDate = {
      description: this.comments
    }
    return saveDate;
  }

  editComment(comment) {
    this.comment_id = comment.id;
    this.comments = comment.description;
  }

  deleteComment(comment_id: number) {
    this.comment_id = comment_id;
    if (this.comment_id) {
      this._caCommentService.deleteComment(this.findings_id, this.corrective_action_id, this.comment_id).subscribe(res => {
        if (res) {
          this.getActionPlan(this.findings_id);
          this.mscrollToBottom();
        }
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  getMessage() {
    if (!this.comment_id) {
      this._caCommentService.saveComment(this.findings_id, this.corrective_action_id, this.processMessage()).subscribe(res => {
        if (res) {
          this.getActionPlan(this.findings_id);
          this.mscrollToBottom();
        }
        this._utilityService.detectChanges(this._cdr);
      })

    } else {
      this._caCommentService.upateComment(this.findings_id, this.corrective_action_id, this.comment_id, this.processMessage()).subscribe(res => {
        if (res) {
          this.getActionPlan(this.findings_id);
          this.mscrollToBottom();
        }
        this._utilityService.detectChanges(this._cdr);
      })

    }
    this.comments = null;
    this.comment_id = null;

  }

  mscrollToBottom() {
    // setTimeout(() => {
    //     $(this.scroll.nativeElement).mCustomScrollbar("scrollTo", "bottom", {
    //         scrollEasing: "linear"
    //     });
    // }, 25);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
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
    this.actionPlanObject.type = null;
    this.getActionPlan(this.corrective_action_id);
  }

  changeZIndex() {
    if ($(this.addCAformModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.UpdateCAformModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.UpdateCAformModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.UpdateCAformModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.historyPopup.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'auto');
    }
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

  getDaysRemaining() {
    let startDate = new Date(CorrectiveActionsStore.correctiveActionDetails?.target_date);
    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }

  getTotaldays() {
    let startDate = new Date(CorrectiveActionsStore.correctiveActionDetails?.start_date);
    let targetDate = new Date(CorrectiveActionsStore.correctiveActionDetails?.target_date);
    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;
  }

  labelDot(data) {
    let str = data;
    let color = "";
    const myArr = str.split("-");
    color = myArr[0];
    return color;
  }

  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "corrective-action":
        this._internalAuditFileService
          .getFilePreview(type, documents.finding_corrective_action_id, documentFile.id, AuditFindingsStore.auditFindingId)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
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

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
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

  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'corrective-action')
      return this._internalAuditFileService.getThumbnailPreview(type, token);
    else
      return this._documentFileService.getThumbnailPreview(type, token);
  }

  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "corrective-action":
        this._internalAuditFileService.downloadCADocument(
          type,
          AuditFindingsStore.auditFindingId,
          document.finding_corrective_action_id,
          document.id,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
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
              ...innerElement

            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._internalAuditFileService.getThumbnailPreview('corrective-action', element.token)
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
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component = type
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.uploaded_user =
        document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCorrectiveActions(status)
        break;
    }
  }

  deleteCa(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = 'ca_delete_popup_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {
      this._correctiveActionService.deleteItem(this.CorrectiveActionsStore.correctiveActionDetails.finding_id, this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        CorrectiveActionsStore.new_ca_id = null;
        this.pageChange();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  pageChange() {
    CorrectiveActionsStore.setFindingCorrectiveActions([]);// crears previous loaded data if any
    this._correctiveActionService.getFindingsCorrectiveActions(AuditFindingsStore.auditFindingId).subscribe(res => {
      if (res.length > 0 && CorrectiveActionsStore.new_ca_id == null) {
        this.getActionPlan(res[0].id);
      } if (res.length > 0 && CorrectiveActionsStore.new_ca_id != null) {
        this.getActionPlan(CorrectiveActionsStore.new_ca_id);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoFindingsPage() {
    this._router.navigateByUrl(`/internal-audit/findings/${this.findings_id}`)
  }

  gotoAuditPage() {
    this._router.navigateByUrl(`/internal-audit/audits/${CorrectiveActionsStore.correctiveActionDetails?.findings?.audit_id}`)
  }

  updateCorrectiveAction() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: CorrectiveActionsStore.correctiveActionDetails?.id
    };
    CorrectiveActionsStore.clearDocumentDetails();
    this.caUpdateObject.type = 'Add'

    setTimeout(() => {
      $(this.UpdateCAformModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  }

  closeUpdateModal() {
    setTimeout(() => {
      $(this.UpdateCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);

    this.caUpdateObject.type = null;
    // this.pageChange();
    this.getActionPlan(CorrectiveActionsStore.correctiveActionDetails.id);
  }

  // History Modal
  openHistoryModal() {
    this.historyPageChange(1);

    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }
  closeHistoryModal() {
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);

    // this.pageChange();
    //this.getCorrectiveActions();
  }

  historyPageChange(newPage: number = null) {
    if (newPage) CorrectiveActionsStore.setHistoryCurrentPage(newPage);
    this._correctiveActionService.getCaHistory(CorrectiveActionsStore.correctiveActionDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoEditPage() {
    CorrectiveActionsStore.setSubMenuHide(false);
    CorrectiveActionsStore.auditFindingId = this.findings_id;
    CorrectiveActionsStore.clearDocumentDetails();
    const corrective_action = CorrectiveActionsStore.correctiveActionDetails; // assigning values for edit
    // for edit

    if (corrective_action.documents && corrective_action.documents.length > 0) {
      this.setDocuments(corrective_action.documents)
    }
    this.actionPlanObject.values = {
      id: corrective_action.id,
      title: corrective_action.title,
      findings: corrective_action.findings,
      responsible_user_id: corrective_action.responsible_user.id,
      description: corrective_action.description,
      start_date: this._helperService.processDate(corrective_action.start_date, 'split'),
      target_date: this._helperService.processDate(corrective_action.target_date, 'split'),
      documents: '',
      finding_id: corrective_action.findings
    }
    this.actionPlanObject.type = 'Edit';
    this.openFormModal();
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
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns image url according to type and token
  // createImageUrl(type, token) {
  //   return this._internalAuditFileService.getThumbnailPreview(type, token);
  // }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  // for downloading files
  downloadAuditFindingCADocument(type, auditFinding, downloadCADocument) {
    event.stopImmediatePropagation();
    switch (type) {
      case "downloadCADocument":
        this._internalAuditFileService.downloadCADocument(
          "corrective-action",
          this.findings_id,
          auditFinding.id,
          downloadCADocument.id,
          downloadCADocument
        );
        break;
    }
  }

  // Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
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
    AppStore.showDiscussion = false;
    CorrectiveActionsStore.unsetSelectedItemDetails()
    this.popupControlDeleteSubscription.unsubscribe();
    this.fileUploadPreviewFocus.unsubscribe();
    this.updateSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
  }
}
