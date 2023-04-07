import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { AmCsaService } from 'src/app/core/services/audit-management/am-csa/am-csa.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { AmCsaAssessmentService } from 'src/app/core/services/audit-management/am-csa/am-csa-assessment.service';
import { CSAAssessmentsStore } from 'src/app/stores/audit-management/am-csa/csa-assessments.store';
import { AmCSAStore } from 'src/app/stores/audit-management/am-csa/am-csa.store';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AmAuditControlSelfAssessmentUpdateStatusService } from 'src/app/core/services/masters/audit-management/am-audit-control-self-assessment-update-status/am-audit-control-self-assessment-update-status.service';
import { SelfAssessmentStatusMasterStore } from 'src/app/stores/masters/audit-management/am-audit-control-self-assessment-update-status-store';
import { AmCSAWorkflowStore } from 'src/app/stores/audit-management/am-csa/am-csa-workflow.store';
import { AmCSAWorkflowService } from 'src/app/core/services/audit-management/am-csa-workflow/am-csa-workflow.service';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-csa-details',
  templateUrl: './csa-details.component.html',
  styleUrls: ['./csa-details.component.scss']
})
export class CsaDetailsComponent implements OnInit {

  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
  @ViewChild('curveToggle') curveToggle: ElementRef;
  @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
  @ViewChild('userRightDetails') userRightDetails: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('actionPlanModal') actionPlanModal: ElementRef;

  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('viewMoreDoc', { static: true }) viewMoreDoc: ElementRef;


  sideCollapsed: boolean = false;
  AuthStore = AuthStore;
  form: FormGroup;
  formErrors: any;
  CSAAssessmentsStore = CSAAssessmentsStore;
  AmCSAStore = AmCSAStore;
  AmCSAWorkflowStore = AmCSAWorkflowStore
  fileUploadPopupStore = fileUploadPopupStore;
  AmAuditTestPlanStore = AmAuditTestPlanStore;
  documentVersion = null;
  AppStore = AppStore;
  currentAssessment = null;
  currentChecklist = null;
  selectedFramework = null;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  submitClicked = false;
  selectedChecklist = null;
  fileUploadProgress = 0;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  SelfAssessmentStatusMasterStore = SelfAssessmentStatusMasterStore;
  emptyAssessment = "checklist_no_data";

  // Document Index
  documentIndex = null;
  checklistIndex = null;
  deletePopupFlag:boolean =false
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    file_name: "",
    file_type: "",
    size: null
  };

  deleteObject = {
    id: null,
    type: '',
    position: null,
    subtitle: '',
    title: ''
  };

  userDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  assessmentObject = {
    component: 'CSAAssessment',
    values: null,
    type: null
  };

  comment = '';
  hover = false;
  answered = [];
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  assessmentSubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  fileUploadPopupSubscriptionEvent: any = null;
  workflowEventSubscription: Subscription
  historyEventSubscription: Subscription
  workflowCommentEventSubscription: Subscription

  workflowModalOpened = false;
  workflowHistoryOpened = false;
  submitError = null;
  constructor(
    private _renderer2: Renderer2,
    private _humanCpitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _assessmentsService: AmCsaAssessmentService,
    private _csaService: AmCsaService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _auditManagementService: AuditManagementService,
    private _documentFileService: DocumentFileService,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _eventEmitterService: EventEmitterService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _amCSAWorkflowService:AmCSAWorkflowService,
    private _updateStatusService:AmAuditControlSelfAssessmentUpdateStatusService) { }

  ngOnInit(): void {

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.AmCSAStore.setCSAId(id);
      this.setDetails();

    });
   
  this.getUpdateStatuses();
    
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_csa_question' });

    this.reactionDisposer = autorun(() => {
     
      if ((AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'CREATE_AM_AUDIT_CONTROL_SELF_ASSESSMENT_UPDATE')) || AmCSAStore.individualCSADetails?.submitted_by != null || AmCSAStore.individualCSADetails?.created_by?.id != AuthStore.user?.id) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addCSAQuestion();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'workflow' } },
        { activityName: null, submenuItem: { type: 'history' } },
        { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-control-self-assessments' } }
      ]

      if (AmCSAStore.individualCSADetails?.am_audit_control_self_assessment_updates?.length > 0) {
        if (AmCSAStore.individualCSADetails?.am_audit_control_self_assessment_status?.type != 'completed' && AmCSAStore.individualCSADetails?.submitted_by == null && AmCSAStore.individualCSADetails?.created_by?.id == AuthStore.user?.id) {
          subMenuItems.splice(0,0,{ activityName: 'UPDATE_AM_AUDIT_CONTROL_SELF_ASSESSMENT_UPDATE', submenuItem: { type: 'edit_modal',path:'' } })
        }
      }
      else if (AmCSAStore.individualCSADetails?.created_by?.id == AuthStore.user?.id) {
          subMenuItems.splice(0,0,{ activityName: 'CREATE_AM_AUDIT_CONTROL_SELF_ASSESSMENT_UPDATE', submenuItem: { type: 'new_modal',path:'' } })
      }

      if (AmCSAStore.individualCSADetails?.submitted_by == null && AmCSAStore.individualCSADetails?.workflow_items?.length > 0 && AmCSAStore.individualCSADetails?.created_by?.id == AuthStore.user?.id && AmCSAStore.individualCSADetails?.am_audit_control_self_assessment_updates?.length > 0) {
        subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'submit' } })
      }
      else {
        if (this.isUser() && AmCSAStore.individualCSADetails?.submitted_by != null) {
          if (AmCSAStore.individualCSADetails?.next_review_user_level == AmCSAWorkflowStore?.workflowDetails[AmCSAWorkflowStore?.workflowDetails?.length - 1]?.level) {
           
            subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'approve' } })
            subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'revert' } })
          }
          else if (AmCSAStore.individualCSADetails?.next_review_user_level != null && (AmCSAStore.individualCSADetails?.next_review_user_level != AmCSAWorkflowStore?.workflowDetails[AmCSAWorkflowStore?.workflowDetails?.length - 1]?.level)) {
              subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'review_submit' } })
              subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'revert' } })
          }
        }
      }

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);
    

      // NoDataItemStore.setNoDataItems({ title: "checklist_no_data" });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "delete":
            this.deleteAssessment(this.AmCSAStore.csaId);
            break;

          case "edit_modal":
            this.editData();
            break;

          case "new_modal":
            this.getData();
            break;
                      
            case 'submit':
            this.submitConfirm();
            break

          case 'approve':
            this.approveAuditPlan();
            break

          case 'review_submit':
            this.approveAuditPlan(true);
            break

          case 'revert':
            this.revertAuditPlan();
            break

          case 'workflow':
            this.openWorkflowPopup();
            break

          case 'history':
            this.openHistoryPopup();
            break
            default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    SubMenuItemStore.setNoUserTab(true);

    this.form = this._formBuilder.group({
      id: [''],
      comment: ['', Validators.required],
      am_audit_control_self_assessment_update_status_id: [null],
      documents: [[]]
      // document_version_content_id: [null],
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.confirmPopup(item);
    })

    this.assessmentSubscriptionEvent = this._eventEmitterService.amCSAQuestionModal.subscribe(res => {
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

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.workflowEventSubscription = this._eventEmitterService.amCSAWorkflow.subscribe(item => {
      this.closeWorkflowPopup();
    })

    this.historyEventSubscription = this._eventEmitterService.amCSAHistory.subscribe(item => {
      this.closeHistoryPopup();
    })

    this.workflowCommentEventSubscription = this._eventEmitterService.amCSAWorkflowComment.subscribe(item => {
      this.closeCommentForm();
    })

    this.getCSAData();

  }

  isUser() {
    if (AmCSAWorkflowStore?.loaded) {
      if(AmCSAStore.individualCSADetails?.workflow_items){
        for (let i of AmCSAStore.individualCSADetails?.workflow_items) {
          if (i.level == AmCSAStore.individualCSADetails?.next_review_user_level) {
            var pos = i.users.findIndex(e => e.id == AuthStore.user?.id)
            if (pos != -1)
              return true;
            else
              return false
          }
        }
      }
      
    }
    else {
      return false;
    }

  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }

    else if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  addCSAQuestion() {
    this.getData();
    this._utilityService.detectChanges(this._cdr);
  }


  getCSAData() {
    this._csaService.getItem(AmCSAStore.csaId).subscribe(res => {
      this.getAnsweredCount(res['am_audit_control_self_assessment_updates']);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getData() {

    this.assessmentObject.type = 'Add';
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    setTimeout(() => {
      this._renderer2.addClass(this.formModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr);
    }, 200);

  }


  editData() {
    this.assessmentObject.values = {
      document_version_contents: AmCSAStore.individualCSADetails?.am_audit_control_self_assessment_updates
    }
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    // setTimeout(() => {
      this.assessmentObject.type = 'Edit';
      // $(this.formModal.nativeElement).modal('show');
      // this._renderer2.removeClass(this.formModal.nativeElement, 'fade')
      setTimeout(() => {
        this._renderer2.addClass(this.formModal.nativeElement, 'show')
      }, 200);
      
      this._utilityService.detectChanges(this._cdr);
    // }, 500);

  }

  closeFormModal() {
    this.form.reset();
    CSAAssessmentsStore.activeFile = null;
    for (let i of fileUploadPopupStore.displayFiles) {

    }
    setTimeout(() => {
      this._renderer2.removeClass(this.formModal.nativeElement, 'show')

      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
      
      $('.modal-backdrop').remove();
    }, 100);
    this.assessmentObject.type = null;
    this.assessmentObject.values = null;
  }
  processData(data) {
    let msType = [];
    for (let i of data) {
      msType.push(i.id);
    }
    return msType;
  }

  setDetails() {
    this._csaService.getItem(AmCSAStore.csaId).subscribe(res => {
      this.getWorkflow()
      this._utilityService.detectChanges(this._cdr);
    });
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 10) {

        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {

        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }

  }

  collapseSide() {
    if (!this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      setTimeout(() => {
        this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
        this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
      }, 150);
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
      this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position', 'fixed');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index', '99999');
      this.sideCollapsed = true;
    }
  }

  unCollapseSide() {
    if (this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.removeClass(this.userRightDetails.nativeElement, 'flex-98-width');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
      this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');

      this.sideCollapsed = false;
    }
  }

  getUpdateStatuses(){
    this._updateStatusService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }



  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "csa-answer-document":
        this._auditManagementService.downloadFile(
          type,
          document.am_audit_control_self_assessment_id,
          document.id,
          document.title,
          null,
          document
        );
        break;
        case "csa-answer-update-document":
          document['title']=document.name;
          this._auditManagementService.downloadFile(
            type,
            docs.am_audit_control_self_assessment_id,
            document.id,
            document.name,
            docs.id,
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


  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "csa-answer-document":
        this._auditManagementService
          .getFilePreview(type, documents.am_audit_control_self_assessment_id, documentFile.id)
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
      case 'csa-answer-update-document':
        documentFile['title']=documentFile.name
        this._auditManagementService
        .getFilePreview(type, documents.am_audit_control_self_assessment_id, documentFile.id,documents.id)
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



  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component = type


    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document;
      this.previewObject.uploaded_user = AmCSAStore.individualCSADetails?.created_by;
      this.previewObject.created_at = document.created_at;
      // $(this.filePreviewModal.nativeElement).modal("show");
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'display', 'block');
      // this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      // setTimeout(() => {
        this._renderer2.addClass(this.filePreviewModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview
  closePreviewModal(event) {
    // $(this.filePreviewModal.nativeElement).modal("hide");
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'display', 'none');
    // this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
    // setTimeout(() => {
      this._renderer2.removeClass(this.filePreviewModal.nativeElement, 'show')
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }


  deleteAssessment(id) {
    this.deletePopupFlag=true
    this.deleteObject.id = id;
    this.deleteObject.type = '';

    $(this.deletePopup.nativeElement).modal('show');
  }

  confirmSubmit() {
    this.deletePopupFlag=true
    this.deleteObject.id = AmCSAStore.csaId;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'question';
    this.deleteObject.subtitle = 'Are you sure you want to publish this assessment?'


    $(this.deletePopup.nativeElement).modal('show');
  }

  answerSubmit() {
    this.deletePopupFlag=true
    this.deleteObject.id = AmCSAStore.csaId;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'answer';

    this.deleteObject.subtitle = 'Are you sure you want to submit the answers?'


    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.type = '';

  }

  /**
* Delete the assessment
* @param id -assessment id
*/
  confirmPopup(status) {

    if (status && this.deleteObject.id) {
      if (this.deleteObject.type == 'Confirm' && this.deleteObject.title == 'question') {
        this.publishAssessment();
      }
      else if (this.deleteObject.type == 'Confirm' && this.deleteObject.title == 'answer') {
        this.answerAssessment();
      }
      else if (this.deleteObject.type == 'Confirm' && this.deleteObject.title == 'submit') {
        this.submitWorkflow();
      }

      else {
        this._csaService.delete(this.deleteObject.id).subscribe(resp => {
          this._utilityService.detectChanges(this._cdr);
          // this._router.navigateByUrl('/business-assessments/assessments');
          this.clearDeleteObject();

        });
      }


    }
    else {
      this.clearDeleteObject();
      this.deletePopupFlag=false
    }
    setTimeout(() => {
      
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

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
          var purl = this._auditManagementService.getThumbnailPreview('csa-answer-update-document', element.token)
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
            am_audit_control_self_assessment_id: element.am_audit_control_self_assessment_id,
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


  // document upload
  openFileUploadModal(doc) {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      // this.setDocuments(doc.documents)

      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      let pos = AmCSAStore.individualCSADetails.am_audit_control_self_assessment_updates.findIndex(e => e.id == AmCSAStore.currentAssessment);
      if (pos != -1) {
        AmCSAStore.individualCSADetails.am_audit_control_self_assessment_updates[pos].documents = fileUploadPopupStore.displayFiles;
      }
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }




  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  createImageUrl(token, type?) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token);
    }
    else if (type == 'csa-answer-document') {
      return this._auditManagementService.getThumbnailPreview(type, token);
    }
    else if(type=='csa-answer-update-document'){
      return this._auditManagementService.getThumbnailPreview(type, token);
    }
    else
      return this._humanCpitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  getPopupDetails(user) {
    $('.modal-backdrop').remove();
    this.userDetailObject.first_name = user.first_name;
    this.userDetailObject.last_name = user.last_name;
    this.userDetailObject.designation = user.designation;
    this.userDetailObject.image_token = user.image.token;
    this.userDetailObject.email = user.email;
    this.userDetailObject.mobile = user.mobile;
    this.userDetailObject.id = user.id;
    this.userDetailObject.department = user.department ? user.department : null;
    this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
    return this.userDetailObject;
  }


  /**
 * Returns whether file extension is of imgage, pdf, document or etc..
 * @param ext File extension
 * @param extType Type - image,pdf,doc etc..
 */
  checkExtension(extType, ext?) {
    // if(this.documentVersion!=null){
    var res = this._imageService.checkFileExtensions(ext ? ext : this.CSAAssessmentsStore.individualAssessmentDetails.document_version.ext, extType);
    return res;
    // }

  }

  removeDocument(doc, assessmentIndex) {
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);

      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }

    AmCSAStore.individualCSADetails.am_audit_control_self_assessment_updates[assessmentIndex].documents = fileUploadPopupStore.displayFiles;
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }


  checkForFileUploadsScrollbar() {
    if (CSAAssessmentsStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
  }


  viewMore(type) {
    if (type == 'more')
      CSAAssessmentsStore.view_more = true;
    else
      CSAAssessmentsStore.view_more = false;
    this._utilityService.detectChanges(this._cdr);
  }


  clickEvent = (event: any): void => {
    this.hover = false;
    this._utilityService.detectChanges(this._cdr);
  }


  getDocumentToSave(update) {
    let saveData;
    if (update) {
      saveData = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
    } else {
      saveData = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
    }
    return saveData

  }
  /**
   * 
   * @param close -decision variable to close the form modal
   * @param params - will take renew or null
   * renew - will renew the document
   * null- will save or update the document
   */
  saveAnswer(doc, docIndex) {
    this.formErrors = null;
    AppStore.enableLoading();
    let docArray = [];
    let finalDocArray = [];
    docArray = this._assessmentsService.getDocuments();
    for (let j of docArray) {
      if (j.clause_number == doc.id) {

        finalDocArray.push(j);
      }
    }
    let pos = this.answered.findIndex(e => e == doc.id);
    this.form.patchValue({
      am_audit_control_self_assessment_update_status_id: doc.am_audit_control_self_assessment_update_status_id,
      comment: doc.comment,
      documents: pos == -1 ? this.getDocumentToSave(false) : this.getDocumentToSave(true)
    })

    let save;

    if (pos != -1) {
      save = this._assessmentsService.updateAnswer(doc.id, this.form.value);
    }
    else {
      save = this._assessmentsService.saveAnswer(doc.id, this.form.value);
    }


    save.subscribe((res: any) => {

      if (pos == -1) {
        this.answered.push(doc.id);
      }
      this._csaService.getItem(AmCSAStore.csaId).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        let pos2 = res['am_audit_control_self_assessment_updates'].findIndex(e => e.id == this.currentAssessment);
        this.getAssessmentData(res['am_audit_control_self_assessment_updates'][pos2], true);
      })
      this._utilityService.detectChanges(this._cdr);

      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);

      }
      AppStore.disableLoading();

    });
  }

  publishAssessment() {
    this.submitClicked = true;
    AppStore.enableLoading();
    this.submitError = null
    this.deletePopupFlag=false
    this._assessmentsService.publishAssessment(AmCSAStore.csaId).subscribe(res => {
      this.getCSAData();
      AppStore.disableLoading();
      this.submitClicked = false;
      this.currentAssessment = null;
      this._utilityService.detectChanges(this._cdr);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        // console.log(err);
        this.submitError = err.error.message;
        this.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    });
  }


  answerAssessment() {
    this.submitClicked = true;
    AppStore.enableLoading();
    this.submitError = null
    this.deletePopupFlag=false
    this._assessmentsService.answerAssessment(AmCSAStore.csaId).subscribe(res => {
      this.getCSAData();
      AppStore.disableLoading();
      this.submitClicked = false;
      this.currentAssessment = null;
      this._utilityService.detectChanges(this._cdr);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        // console.log(err);
        this.submitError = err.error.message;
        this.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    });
  }

  submitWorkflow() {
    this.submitClicked = true;
    AppStore.enableLoading();
    this.submitError = null
    this.deletePopupFlag=false
    SubMenuItemStore.submitClicked = true;
    this._amCSAWorkflowService.submitAuditPlan(AmCSAStore.csaId).subscribe(res => {
      SubMenuItemStore.submitClicked = false;
      this.getCSAData();
      AppStore.disableLoading();
      this.submitClicked = false;
      this.currentAssessment = null;
      this._utilityService.detectChanges(this._cdr);

    }, (err: HttpErrorResponse) => {
      SubMenuItemStore.submitClicked = false;
      if (err.status == 422) {
        // console.log(err);
        this.submitError = err.error.message;
        this.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    });
  }

  cancelChecklist() {
    this.form.reset();
    this.form.markAsPristine();
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }


  getAssessmentData(doc, update?) {
    this.clearFIleUploadPopupData();
    if (update) {
      this.setDocuments(doc.documents);
    }
    else {
      if (this.currentAssessment == doc.id)
        this.currentAssessment = null;
      else
        this.currentAssessment = doc.id
      this.setDocuments(doc.documents);
      this.comment = doc.comment;
    }
    // this.currentAssessment=

    AmCSAStore.currentAssessment = doc.id;

    this._utilityService.detectChanges(this._cdr);

  }

  getAnsweredCount(data) {
    this.answered = [];
    // let count = 0;
    for (let i of data) {
      if (i.am_audit_control_self_assessment_update_status_id != null) {
        this.answered.push(i.id)
      }
    }
    // return this.answered;

  }


  setStatus(status, index) {
    AmCSAStore.individualCSADetails.am_audit_control_self_assessment_updates[index].am_audit_control_self_assessment_update_status_id = status.id;
    this._utilityService.detectChanges(this._cdr);
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



  removeDot(data) {
    return data.split('-')[0];
  }


  getCreatedByDetails(user) {
    $('.modal-backdrop').remove();
    let userDetail: any = {};
    userDetail['first_name'] = user?.first_name ? user?.first_name : '';
    userDetail['last_name'] = user?.last_name;
    userDetail['designation'] = user?.designation;
    userDetail['image_token'] = user?.image?.token;
    userDetail['email'] = user?.email;
    userDetail['mobile'] = user?.mobile;
    userDetail['id'] = user?.id;
    userDetail['department'] = user?.department;
    userDetail['status_id'] = user?.status?.id;
    userDetail['created_at'] = AmCSAStore.individualCSADetails?.created_at;

    return userDetail;
  }



  // Action Plan Form Code Ends here

  //Workflow starts here
  submitConfirm() {
    this.deleteObject.id=AmCSAStore.csaId
    this.deletePopupFlag=true
    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'submit';
    this.deleteObject.subtitle = 'am_annual_audit_plan_submit_confirm?';
    $(this.deletePopup.nativeElement).modal('show');
  }

  approveAuditPlan(type?) {
    if (type) {
      AmCSAWorkflowStore.type = 'submit';
    }
    else{
      AmCSAWorkflowStore.type = 'approve';
    }      
    AmCSAWorkflowStore.approveText = 'am_annual_audit_plan_approve_text';
    AmCSAWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.addClass(this.commentModal.nativeElement, 'show')
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');

  }

  revertAuditPlan() {
    AmCSAWorkflowStore.type = 'revert';
    AmCSAWorkflowStore.commentForm = true;
    this._renderer2.addClass(this.commentModal.nativeElement, 'show')
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  openHistoryPopup() {
    AmCSAWorkflowStore.setCurrentPage(1);
    this._amCSAWorkflowService.getHistory(AmCSAStore.csaId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      // $(this.workflowHistory.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowHistory.nativeElement, 'display', 'block');
      this._renderer2.addClass(this.workflowHistory.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr);
    });
  }

  openWorkflowPopup() {
    this._amCSAWorkflowService.getItems(AmCSAStore.csaId).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    this._renderer2.setStyle(this.workflowHistory.nativeElement, 'display', 'none');
      this._renderer2.removeClass(this.workflowHistory.nativeElement, 'show')
    // $(this.workflowHistory.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  closeCommentForm() {
    AmCSAWorkflowStore.type = '';
    AmCSAWorkflowStore.approveText = '';
    AmCSAWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    // this.setSubmenu();
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

    this._utilityService.detectChanges(this._cdr)
  }

  getWorkflow(){
    this._amCSAWorkflowService.getItems(AmCSAStore.csaId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //Workflow ends here

  openViewMore() {
    this._renderer2.addClass(this.viewMoreDoc.nativeElement, 'show')
    this._renderer2.setStyle(this.viewMoreDoc.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.viewMoreDoc.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.viewMoreDoc.nativeElement, 'display', 'block');
    $(this.viewMoreDoc.nativeElement).modal('show');
    setTimeout(() => {
      // this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);

  }

  closeViewMore() {
    this._renderer2.removeClass(this.viewMoreDoc.nativeElement, 'show')
    this._renderer2.removeStyle(this.viewMoreDoc.nativeElement, 'z-index', 999999);
    // this._renderer2.setStyle(this.viewMoreDoc.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.viewMoreDoc.nativeElement, 'display', 'none');
    $(this.viewMoreDoc.nativeElement).modal('show');
    setTimeout(() => {
      // this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);

  }

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    CSAAssessmentsStore.clearChecklistDocuments();
    CSAAssessmentsStore.unsetIndiviudalAssessmentDetails();
    AmCSAStore.unsetIndiviudalCSADetails();
    CSAAssessmentsStore.unsetCheckList();
    this.deleteEventSubscription?.unsubscribe();
    this.assessmentSubscriptionEvent?.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    this.idleTimeoutSubscription?.unsubscribe();
    this.networkFailureSubscription?.unsubscribe();
    CSAAssessmentsStore.individual_assessment_loaded = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.fileUploadPopupSubscriptionEvent?.unsubscribe();
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
    NoDataItemStore.unsetNoDataItems();
    AppStore.loading = false;
    this.workflowEventSubscription.unsubscribe()
    this.historyEventSubscription.unsubscribe()
    this.workflowCommentEventSubscription.unsubscribe()
  }

}
