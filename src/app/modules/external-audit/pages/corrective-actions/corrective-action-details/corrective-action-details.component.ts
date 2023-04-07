import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ExternalAuditFileService } from 'src/app/core/services/external-audit/file-service/external-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ExternalAuditCorrectiveActionStore } from 'src/app/stores/external-audit/corrective-actions/corrective-actions-store';
import { ExternalAuditCorrectiveActionsService } from 'src/app/core/services/external-audit/corrective-actions/external-audit-corrective-actions.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { CaCommentsStore } from 'src/app/stores/internal-audit/audit-findings/corrective-actions-comment/ca-comment-store';
import { CaCommentService } from 'src/app/core/services/internal-audit/audit-findings/corrective-action-comments/ca-comment.service';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
// import { CorrectiveActionMasterStore } from 'src/app/stores/external-audit/corrective-action/corrective-action-store';
import { CorrectiveActionService } from 'src/app/core/services/external-audit/corrective-action/corrective-action.service';
import { FindingsService } from 'src/app/core/services/external-audit/findings/findings.service';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { SubMenuItem } from 'src/app/core/models/general/sub-menu.model';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-corrective-action-details',
  templateUrl: './corrective-action-details.component.html',
  styleUrls: ['./corrective-action-details.component.scss']
})
export class CorrectiveActionDetailsComponent implements OnInit, OnDestroy {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup', { static: true }) historyPopup: ElementRef;
  @ViewChild('scroll') scroll: any;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  // CorrectiveActionMasterStore = CorrectiveActionMasterStore;
  // FindingMasterStore = FindingMasterStore;
  // CorrectiveActionsStore = CorrectiveActionsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  CaCommentsStore = CaCommentsStore;
  AppStore = AppStore;
  subscription: any;

  correctiveActionObject = {
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


  caUpdateObject = {
    component: '',
    values: null,
    type: null
  };


  previewObject = {
    fid: null,
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
  findings_id: number;
  corrective_action_id: number;
  historySubscriptionEvent: any;
  updateSubscriptionEvent: any;
  idleTimeoutSubscription: any;
  PreviewSubscriptionEvent: any;
  networkFailureSubscription: any;
  fileUploadPopupSubscriptionEvent: any;
  addCASubscriptionEvent: any;
  popupControlAuditableEventSubscription: any;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  fileUploadPopupStore = fileUploadPopupStore;
  ExternalAuditCorrectiveActionStore = ExternalAuditCorrectiveActionStore;
  comments: any;
  comment_id: number = null;
  constructor(

    private _findingService: FindingsService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _externalAuditFileService: ExternalAuditFileService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _caCommentService: CaCommentService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _sanitizer: DomSanitizer,
    private _externalCorrectiveActionService: ExternalAuditCorrectiveActionsService,
    // private _correctiveActionService: CorrectiveActionService,
    private _discussionBotService: DiscussionBotService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = true;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.gotoEditPage();
            break;
          case "delete":
            this.deleteCa(ExternalAuditCorrectiveActionStore.correctiveActionDetails.id);
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

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.correctiveActionModalControl.subscribe(res => {
      this.closeFormModal();
    })


    this.PreviewSubscriptionEvent = this._eventEmitterService.correctiveACtionPreviewModal.subscribe(res => {
      this.closePreviewModal();
      this.changeZIndex();
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
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

    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"corrective_action",
      path:'/external-audit/corrective-action'
    });

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

  gotoFindingsPage() {
    this._router.navigateByUrl(`/external-audit/audit-findings/${this.findings_id}`)
  }

  gotoAuditPage() {
    this._router.navigateByUrl(`/external-audit/external-audit/${ExternalAuditCorrectiveActionStore.correctiveActionDetails?.findings?.audit_id}`)
  }

  getActionPlan(id) {
    this.comments = null;
    this.comment_id = null;
    this._externalCorrectiveActionService.getItem(this.findings_id, id).subscribe(res => {
      this.setSubmenu(res);
      DiscussionBotStore.setDiscussionMessage([]);
      DiscussionBotStore.setbasePath('/external-audit/findings/');
      DiscussionBotStore.setDiscussionAPI(this.findings_id + '/corrective-actions/' + this.corrective_action_id + '/comments');
      this.getImagePrivew();
      this.downloadDiscussionThumbnial();
      this.showThumbnailImage();
      this.getDiscussions();
      this._utilityService.detectChanges(this._cdr);
    });
    // this._findingService.getItem(ExternalAuditCorrectiveActionStore.correctiveActionDetails?.finding_id).subscribe(res => {
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  setSubmenu(res) {
    if (res.corrective_action_status?.type != "closed") {
      if (ExternalAuditCorrectiveActionStore.correctiveActionDetails?.findings?.audit_id) {

        var subMenuItems = [
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_findings' } },
          { activityName: 'UPDATE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
          { activityName: 'CREATE_EA_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'update_modal' } },
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/external-audit/corrective-action' } },
        ]
      }
      else {
        var subMenuItems = [
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_findings' } },
          { activityName: 'UPDATE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
          { activityName: 'CREATE_EA_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'update_modal' } },
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/external-audit/corrective-action' } },
        ]
      }
    } else {
      if (ExternalAuditCorrectiveActionStore.correctiveActionDetails?.findings?.audit_id) {
        var subMenuItems = [
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_findings' } },
          // { activityName: 'DELETE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/external-audit/corrective-action' } },
        ]
      } else {
        var subMenuItems = [
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_findings' } },
          // { activityName: 'DELETE_EA_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
          { activityName: 'EA_FINDING_CORRECTIVE_ACTION_UPDATE_LIST', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: '/external-audit/corrective-action' } },
        ]
      }
    }
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  }

  getDaysRemaining() {
    let startDate = new Date(ExternalAuditCorrectiveActionStore.correctiveActionDetails?.target_date);
    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  getTotaldays() {
    let startDate = new Date(ExternalAuditCorrectiveActionStore.correctiveActionDetails?.start_date);
    let targetDate = new Date(ExternalAuditCorrectiveActionStore.correctiveActionDetails?.target_date);
    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;
  }

  // Update Modal
  updateCorrectiveAction() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: ExternalAuditCorrectiveActionStore.correctiveActionDetails?.id
    };
    ExternalAuditCorrectiveActionStore.clearDocumentDetails();
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
    this.getActionPlan(ExternalAuditCorrectiveActionStore.correctiveActionDetails.id);
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
    if (newPage) ExternalAuditCorrectiveActionStore.setHistoryCurrentPage(newPage);
    this._externalCorrectiveActionService.getCaHistory(ExternalAuditCorrectiveActionStore.correctiveActionDetails?.id).subscribe(res => {
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
    DiscussionBotStore.setDiscussionThumbnailAPI('/external-audit/files/ea-finding-corrective-action-comment-document/thumbnail?token=')
  }

  getComments() {
    this._caCommentService.getComments(this.findings_id, this.corrective_action_id).subscribe(res => {
      // $(this.scroll.nativeElement).mCustomScrollbar();
      this._utilityService.detectChanges(this._cdr);
    })
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
    this.correctiveActionObject.type = null;
    this.getActionPlan(this.corrective_action_id);
  }

  changeZIndex() {
    if ($(this.addCAformModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
  }
  gotoEditPage() {
    ExternalAuditCorrectiveActionStore.setSubMenuHide(false);
    ExternalAuditCorrectiveActionStore.auditFindingId = this.findings_id;
    ExternalAuditCorrectiveActionStore.clearDocumentDetails();
    const corrective_action = ExternalAuditCorrectiveActionStore.correctiveActionDetails; // assigning values for edit
    setTimeout(() => {
      if (corrective_action.documents.length > 0) {
        this.setDocuments(corrective_action.documents)
      }
    }, 200);
    this.correctiveActionObject.values = {
      id: corrective_action.id,
      title: corrective_action.title,
      findings: corrective_action.findings,
      responsible_user: corrective_action.responsible_user,
      // responsible_user_id: corrective_action.responsible_user.id,
      description: corrective_action.description,
      start_date: this._helperService.processDate(corrective_action.start_date, 'split'),
      target_date: this._helperService.processDate(corrective_action.target_date, 'split'),
      documents: '',
      finding_id: corrective_action.findings
    }

    this.correctiveActionObject.type = 'Edit';
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

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  createPreviewUrlForResolve(type, token) {
    return this._externalAuditFileService.getThumbnailPreview(type, token)
  }

  // Returns image url according to type and token
  // createImageUrl(type, doc, token) {
  //   return this._externalAuditFileService.getThumbnailPreview(type, token);
  // }

  createImageUrl(type, token) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
      return this._externalAuditFileService.getThumbnailPreview(type, token);
  }

  viewAttachments(type, document, khDocuments?) {
    switch (type) {
      case "corrective-action":
        this._externalAuditFileService.getFilePreview(type, ExternalAuditCorrectiveActionStore.correctiveActionDetails.finding_id, document.finding_corrective_action_id, document.id).subscribe(res => {
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

  openPreviewModal(type, filePreview, itemDetails, document) {
    let uploaded_user = null;
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = type;
    this.previewObject.file_details = itemDetails;
    this.previewObject.componentId = document.id;
    this.previewObject.ca_id = document.finding_corrective_action_id;
    this.previewObject.fid = ExternalAuditCorrectiveActionStore.correctiveActionDetails.finding_id;
    this.previewObject.preview_url = previewItem;
    // this.previewObject.uploaded_user = document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.uploaded_user = ExternalAuditCorrectiveActionStore.correctiveActionDetails.created_by ? ExternalAuditCorrectiveActionStore.correctiveActionDetails.created_by : null;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  downloadDocument(type, document, docs?) {
    switch (type) {
      case "corrective-action":
        this._externalAuditFileService.downloadFile('corrective-action', ExternalAuditCorrectiveActionStore.correctiveActionDetails.finding_id, document.finding_corrective_action_id, document.id, document.title, document);
        break;
      case "document-version":
        this._documentFileService.downloadFile(type, document.document_id, docs.id, null, document.title, docs);
        break;
    }
  }


  closePreviewModal($event?) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  // for downloading files
  downloadAuditFindingCADocument(type, correctiveAction, downloadCADocument) {
    event.stopImmediatePropagation();
    switch (type) {
      case "downloadCADocument":
        this._externalAuditFileService.downloadFile(
          "corrective-action",
          this.findings_id,
          correctiveAction.id,
          downloadCADocument.id,
          downloadCADocument
        );
        break;
    }
  }

  viewAuditDocument(type, AuditFindingCA, AuditFindingCADocument) {
    switch (type) {
      case "viewDocument":
        this._externalAuditFileService
          .getFilePreview("corrective-action", this.findings_id, AuditFindingCA.id, AuditFindingCADocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              AuditFindingCADocument.name
            );
            this.openPreviewModal(type, resp, AuditFindingCADocument, AuditFindingCA);
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
    this.popupObject.subtitle = 'it_will_remove_the_corrective_action';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {
      this._externalCorrectiveActionService.deleteItem(ExternalAuditCorrectiveActionStore.correctiveActionDetails.finding_id, this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        ExternalAuditCorrectiveActionStore.new_ca_id = null;
        this._router.navigateByUrl('/external-audit/corrective-action');
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

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  checkItemPresent(item) {
		if (SubMenuItemStore.subMenuItems) {
			for (let i of SubMenuItemStore.subMenuItems) {
				if (i.type == item) {
					return true;
				}
			}
			return false;
		}
		else
			return false;
	}

	returnItem(item) {
		if (SubMenuItemStore.subMenuItems) {
			for (let i of SubMenuItemStore.subMenuItems) {
				if (i.type == item) {
					return i;
				}
			}
		}
	}

  itemClicked(item: SubMenuItem) {
	
		if (item.type == 'export_to_excel')
			SubMenuItemStore.exportClicked = true;
		else if (item.type == 'import')
			SubMenuItemStore.importClicked = true;
		else (item.type == 'template')
			SubMenuItemStore.templateClicked = true;
		

		SubMenuItemStore.setClickedSubMenuItem(item);
	}

  getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AppStore.showDiscussion = false;
    ExternalAuditCorrectiveActionStore.unsetCorrectiveActionHistory();
    ExternalAuditCorrectiveActionStore.unsetDocumentDetails();
    ExternalAuditCorrectiveActionStore.unsetSelectedItemDetails();
    this.PreviewSubscriptionEvent.unsubscribe();
    this.updateSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.popupControlAuditableEventSubscription.unsubscribe();

  }
}

