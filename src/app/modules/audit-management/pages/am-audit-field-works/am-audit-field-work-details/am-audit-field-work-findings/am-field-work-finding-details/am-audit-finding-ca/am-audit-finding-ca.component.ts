import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { Router } from '@angular/router';
import { AmFindingCAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-ca.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { AmAuditFindingCaService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding-ca/am-audit-finding-ca.service';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';

declare var $: any;
@Component({
  selector: 'app-am-audit-finding-ca',
  templateUrl: './am-audit-finding-ca.component.html',
  styleUrls: ['./am-audit-finding-ca.component.scss']
})
export class AmAuditFindingCaComponent implements OnInit {
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('UpdateCAformModal') UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('mailConfirmationPopup', { static: true }) mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AmFindingCAStore = AmFindingCAStore;
  AmAuditFindingStore = AmAuditFindingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ShareItemStore = ShareItemStore;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();
  subscription: any;
  addCASubscriptionEvent: any;

  previewFocusSubscription: any;
  fileUploadPreviewFocus: any;
  updateSubscriptionEvent: any;
  historySubscriptionEvent: any;
  mailConfirmationData = 'corrective_action_share_msg';

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  caUpdateObject = {
    component: 'FindingCorrectiveAction',
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

  correctiveActionObject = {
    component: 'FindingCorrectiveAction',
    values: null,
    type: null
  };

  correctiveActionResolveObject = {
    component: 'Master',
    values: null,
    type: null
  };

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  currectiveActionId: number;
  popupControlAuditableEventSubscription: any;
  constructor(private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _auditManagementService: AuditManagementService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _discussionBotService: DiscussionBotService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _sanitizer: DomSanitizer,
    private _correctiveActionService: AmAuditFindingCaService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _documentFileService: DocumentFileService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addCA();
            break;
          case "export_to_excel":
            this._correctiveActionService.exportToExcel(AmAuditFindingStore.auditFindingId);
            break;
          // case "share":
          //   ShareItemStore.setTitle('share_internal_audit_corrective_actions');
          //   ShareItemStore.formErrors = {};
          //   break;
    
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
   

      if (NoDataItemStore.clikedNoDataItem) {
        this.addCA();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed')
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_corrective_action' });
    else
    NoDataItemStore.setNoDataItems({ title: "", subtitle: 'common_nodata_title'});
   

    // Subscribe Event Emitter from corrective action
    this.subscription = this._correctiveActionService.itemChange.subscribe(item => {
      this.getCorrectiveAction(item);
    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.amAuditFindingCaModal.subscribe(res => {
      this.closeFormModal();
    })


    this.updateSubscriptionEvent = this._eventEmitterService.amAuditFindingCaUpdateModal.subscribe(res => {
      this.closeUpdateModal();
    })

    this.historySubscriptionEvent = this._eventEmitterService.amAuditFindingCaHistoryModal.subscribe(res => {
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

    this.previewFocusSubscription = this._eventEmitterService.previewFocus.subscribe(res => {
      this.changeZIndex();
    })

    this.fileUploadPreviewFocus = this._eventEmitterService.fileUploadPreviewFocus.subscribe(res => {
      this.changeZIndex();
    })

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.pageChange();
  }

  // page change event
  pageChange() {
    AmFindingCAStore.unsetCorrectiveActions();
    this._correctiveActionService.getAllItems('&finding_ids='+AmAuditFindingStore.auditFindingId).subscribe(res => {
      this.setSubmenu();
      if (res['data'].length > 0 && AmFindingCAStore.new_ca_id == null) {
        this.getCorrectiveAction(res['data'][0].id);
      } if (res['data'].length > 0 && AmFindingCAStore.new_ca_id != null) {
        this.getCorrectiveAction(AmFindingCAStore.new_ca_id);
      }
      this._utilityService.detectChanges(this._cdr);
    })

  }

  // gotoAuditPage() {
  //   this._router.navigateByUrl(`/internal-audit/audits/${AmFindingCAStore.correctiveActionDetails?.findings?.audit_id}`)
  // }


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

    let startDate = new Date(AmFindingCAStore.correctiveActionDetails?.target_date);

    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if(this.remainingDaysAre>this.getTotaldays()){
      this.remainingDaysAre = this.getTotaldays();
    }
    else if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  getTotaldays() {
    let startDate = new Date(AmFindingCAStore.correctiveActionDetails?.start_date);
    let targetDate = new Date(AmFindingCAStore.correctiveActionDetails?.target_date);

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

  setPreviewFocus() {
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
  }

  // markClose() {
  //   this._correctiveActionService.closeCorrectiveAction(AmAuditFindingStore.auditFindingId, this.currectiveActionId, '').subscribe(res => {
  //     AmFindingCAStore.new_ca_id = this.currectiveActionId;
  //     this.pageChange();
  //     this._utilityService.detectChanges(this._cdr);
  //     $(this.confirmationPopUp.nativeElement).modal('hide');
  //   })
  // }

  // call corrective action by id
  getCorrectiveAction(id: number) {
    AmFindingCAStore.unsetSelectedItemDetails()
    AmFindingCAStore.new_ca_id = null;
    this._correctiveActionService.getItem(AmAuditFindingStore.auditFindingId, id).subscribe(res => {
 
      // DiscussionBotStore.setDiscussionMessage([]);
      // DiscussionBotStore.setbasePath('/findings/');
      this.currectiveActionId = res.id;
      // DiscussionBotStore.setDiscussionAPI(AmAuditFindingStore.auditFindingId + '/corrective-actions/' + this.currectiveActionId + '/comments');

      this._utilityService.detectChanges(this._cdr);
      // this.getImagePrivew();
      // this.downloadDiscussionThumbnial();
      // this.showThumbnailImage();
      // this.getDiscussions();
    })
    this._correctiveActionService.setSelected(id);
  }

  setSubmenu() {
    if (AmFindingCAStore.correctiveActionDetails?.findings?.audit_id) {
      if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'fieldwork'){
        if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
      var subMenuItems = [
        // { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
        { activityName: 'CREATE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings' } },
      ]
    }
    else{
      var subMenuItems = [
        // { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings' } },
      ]
    }
    }
    else if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'finding'){
      if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
      var subMenuItems = [
        // { activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'go_to_audit' } },
        { activityName: 'CREATE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-findings' } },
      ]
    }
    else{
      var subMenuItems = [
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-findings' } },
      ]
    }
    }
    
    } else {
      if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'fieldwork'){
        if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
      var subMenuItems = [
        { activityName: 'CREATE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings' } },
      ]
    }
    else{
      var subMenuItems = [
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-field-works/'+AmAuditFieldWorkStore.auditFieldWorkId+'/am-audit-findings' } },
      ]
    }
    }
    else if(AmAuditFieldWorkStore.auditFieldWorkId &&  AmAuditFindingStore.findingComponent == 'finding'){
      if(AmAuditFindingStore.individualFindingDetails?.am_audit_finding_status?.type!='closed'){
      var subMenuItems = [
        { activityName: 'CREATE_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-findings' } },
      ]
    }
    else{
      var subMenuItems = [
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-findings' } },
      ]
    }
    }
    else{
      var subMenuItems = [
        { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: "close", path: '/audit-management/am-audit-findings' } },
      ]
    }
    }
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  }

  getDiscussions() {
    this._discussionBotService.getDiscussionMessage().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  downloadDiscussionThumbnial() {
    DiscussionBotStore.setThumbnailDownloadAPI(AmAuditFindingStore.auditFindingId + '/corrective-actions/' + this.currectiveActionId + '/comments/')
  }

  showThumbnailImage() {
    DiscussionBotStore.setShowThumbnailAPI(AmAuditFindingStore.auditFindingId + '/corrective-actions/' + this.currectiveActionId + '/comments/')
  }

  getImagePrivew() {
    DiscussionBotStore.setDiscussionThumbnailAPI('/internal-audit/files/finding-corrective-action-comment-document/thumbnail?token=')
  }


  assignUserValues(users) {
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
    return userDetial;

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

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
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
          var purl = this._auditManagementService.getThumbnailPreview('corrective-action', element.token)
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
  editCorrectiveACtion() {
    AmFindingCAStore.setSubMenuHide(true);
    AmFindingCAStore.clearDocumentDetails();
    const corrective_action = AmFindingCAStore.correctiveActionDetails; // assigning values for edit
    // for edit

    if (corrective_action.am_audit_finding_corrective_action_documents && corrective_action.am_audit_finding_corrective_action_documents.length > 0) {
      this.setDocuments(corrective_action.am_audit_finding_corrective_action_documents)
      // for (let i of corrective_action.documents) {
      //   let docurl = this._auditManagementService.getThumbnailPreview('corrective-action', i.token);
      //   let docDetails = {
      //     created_at: i.created_at,
      //     created_by: i.created_by,
      //     updated_at: i.updated_at,
      //     updated_by: i.updated_by,
      //     name: i.title,
      //     ext: i.ext,
      //     size: i.size,
      //     url: i.url,
      //     thumbnail_url: i.url,
      //     token: i.token,
      //     preview: docurl,
      //     id: i.id,
      //   };
      //   this._correctiveActionService.setDocumentDetails(docDetails, docurl);
      // }

    }

    this.correctiveActionObject.values = {
      id: corrective_action.id,
      title: corrective_action.title,
      responsible_user_id: corrective_action.responsible_user.id,
      description: corrective_action.description,
      findings: corrective_action.findings,
      start_date: this._helperService.processDate(corrective_action.start_date, 'split'),
      target_date: this._helperService.processDate(corrective_action.target_date, 'split'),
      documents: ''
    }


    this.correctiveActionObject.type = 'Edit';
    this.openFormModal();
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

  // for opening modal
  openFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 50);


  }

  // History Modal
  openHistoryModal() {
    this.historyPageChange(1);

    setTimeout(() => {
      $(this.historyPopup?.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }
  closeHistoryModal() {
    setTimeout(() => {
      $(this.historyPopup?.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);

    // this.pageChange();
    //this.getCorrectiveActions();
  }

  historyPageChange(newPage: number = null) {
    if (newPage) AmFindingCAStore.setHistoryCurrentPage(newPage);
    this._correctiveActionService.getCaHistory(AmFindingCAStore.correctiveActionDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Update Modal
  updateCorrectiveAction() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: AmFindingCAStore.correctiveActionDetails?.id
    };
    AmFindingCAStore.clearDocumentDetails();
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
    this.getCorrectiveAction(AmFindingCAStore.correctiveActionDetails.id);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Confirm': this.closeCorrectiveAction(status)
        break;  
      case '': this.deleteCorrectiveActions(status)
        break;
    }
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = 'Delete Corrective Action ? ';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {

      this._correctiveActionService.deleteItem(AmFindingCAStore.correctiveActionDetails.finding_id, this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        AmFindingCAStore.new_ca_id = null;
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
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }


  // closeCorrectiveAction(status) {
  //   if (status) {
  //     this.markClose();
  //   } else {
  //     setTimeout(() => {
  //       $(this.confirmationPopUp.nativeElement).modal('hide');
  //     }, 250);
  //   }
  // }

  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this.correctiveActionObject.type = null;
    this.pageChange();
  }

  //calling corrective action add modal
  addCA() {
    AmFindingCAStore.setSubMenuHide(true);
    this.clearCommonFilePopupDocuments();
    this.correctiveActionObject.type = null;
    this.correctiveActionObject.values = null;
    this.AmFindingCAStore.clearDocumentDetails();
    this.correctiveActionObject.type = 'Add';

    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);

  }

  // for downloading files
  downloadAuditFindingCADocument(type, auditFinding, downloadCADocument) {
    event.stopImmediatePropagation();
    switch (type) {
      case "downloadCADocument":
        this._auditManagementService.downloadFile(
          "corrective-action",
          AmAuditFindingStore.auditFindingId,
          auditFinding.id,
          downloadCADocument.id,
          downloadCADocument
        );
        break;

    }

  }

  viewAuditDocument(type, AuditFindingCA, AuditFindingCADocument) {
    switch (type) {
      case "viewDocument":
        this._auditManagementService
          .getFilePreview("corrective-action", AuditFindingCA.id, AuditFindingCADocument.id)
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

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  // Common File Upload Details Page Function Starts Here

  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component = type


    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document;
      this.previewObject.uploaded_user = AmFindingCAStore?.correctiveActionDetails?.created_by;
      this.previewObject.created_at = document.created_at;

      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
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



  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "corrective-action":
        this._auditManagementService.downloadFile(
          type,
          // AmAuditFindingStore.auditFindingId,
          document.finding_corrective_action_id,
          document.id,
          document.title,
          null,
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
      case "corrective-action":
        this._auditManagementService
          .getFilePreview(type, documents.finding_corrective_action_id, documentFile.id)
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


  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'corrective-action')
      return this._auditManagementService.getThumbnailPreview(type, token);
    else
      return this._documentFileService.getThumbnailPreview(type, token);

  }

  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }



  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  closeCorrectiveAction(status){
    if (status && this.popupObject.id) {

      this._correctiveActionService.closeCorrectiveAction(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        // AmFindingCAStore.new_ca_id = null;
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

  confirmCloseCorrectiveACtion(id){
    event.stopPropagation();
    this.popupObject.type = 'Confirm';
    this.popupObject.id = id;
    this.popupObject.title = 'Close Corrective Action?';
    this.popupObject.subtitle = 'Close Corrective Action ? ';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // Common FIle Upload Details Page Function Ends Here

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.subscription.unsubscribe();
    this.addCASubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.updateSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.popupControlAuditableEventSubscription.unsubscribe();
    this.previewFocusSubscription.unsubscribe();
    this.fileUploadPreviewFocus.unsubscribe();
    AmFindingCAStore.unsetSelectedItemDetails()
    AmFindingCAStore.loaded = false;
    AmFindingCAStore.new_ca_id = null;
    // AppStore.showDiscussion = false;
    AmFindingCAStore.unsetCorrectiveActions()
    AmFindingCAStore.individualLoaded = false;
    NoDataItemStore.unsetNoDataItems();

  }

}
