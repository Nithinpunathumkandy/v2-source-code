import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild,OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FindingCorrectiveActionService } from 'src/app/core/services/non-conformity/findings/finding-corrective-action/finding-corrective-action.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CorrectiveActionsResolveStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-resolve-store';
import { FindingCorrectiveActionStore } from 'src/app/stores/non-conformity/findings/finding-corrective-action-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;

@Component({
  selector: 'app-nonconfirmity-corrective-action-info',
  templateUrl: './nonconfirmity-corrective-action-info.component.html',
  styleUrls: ['./nonconfirmity-corrective-action-info.component.scss']
})
export class NonconfirmityCorrectiveActionInfoComponent implements OnInit,OnDestroy {

  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('AddCAformModal', { static: true }) AddCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;

  FindingCorrectiveActionStore = FindingCorrectiveActionStore;
  FindingsStore = FindingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  CorrectiveActionsResolveStore = CorrectiveActionsResolveStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();
  updateSubscriptionEvent: any;
  fileUploadPopupSubscriptionEvent: any;
  resolveSubscriptionEvent: any;
  PreviewSubscriptionEvent: any;
  addCASubscriptionEvent: any;
  popupControlEventSubscription: any;

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

  correctiveActionObject = {
    component: 'CorrectiveAction',
    module: 'non-conformity',
    values: null,
    type: null
  };

  caUpdateObject = {
    component: '',
    values: null,
    type: null
  };

  correctiveActionResolveObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    category: '',
    type: '',
    status_btn: '',
    title: '',
    id: null,
    subtitle: '',
    finding_id: null
  };

  constructor(private _correctiveActionService: FindingCorrectiveActionService,
    private _findingsService: FindingsService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _route: ActivatedRoute,) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this._route.params.subscribe(params => {
      FindingCorrectiveActionStore.FindingCorrectiveActionId = params.id;
      this.getCorrectiveActionDetails();
    });

    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "ca_resolve":
          //   this.resolveCorrectiveAction();
          //   break;
          case "reject":
            this.rejectCorrectiveAction();
            break;
          case "ca_close":
            this.closeCorrectiveAction();
            break;
          case "update_modal":
            this.updateCaModal();
            break;
          case "history":
            this.openHistoryModal();
            break;
          case "edit_modal":
            this.editCorrectiveACtion();
            break;
          case "delete":
            this.delete();
            break;
          case "go_to_findings":
            this.gotoFindingsPage();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.findingCorrectiveActionModalControl.subscribe(res => {
      this.closeFormModal();
    })

    this.resolveSubscriptionEvent = this._eventEmitterService.caResolveModalControl.subscribe(res => {
      this.closeUpdateModal();
    })

    this.updateSubscriptionEvent = this._eventEmitterService.cahistoryModalControl.subscribe(res => {
      this.closeHistoryModal();

    })

    this.PreviewSubscriptionEvent = this._eventEmitterService.correctiveACtionPreviewModal.subscribe(res => {
      this.closePreviewModal();
      this.changeZIndex();
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // this.getFindings();
  }

  getFindings() {
    this._findingsService.getItem(FindingCorrectiveActionStore.correctiveActionDetails?.finding_id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoFindingsPage() {
    this._router.navigateByUrl(`/non-conformity/findings/${this.FindingCorrectiveActionStore.correctiveActionDetails?.finding_id}`);
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


  getCorrectiveActionDetails() {
    this._correctiveActionService.getItem(FindingCorrectiveActionStore.FindingCorrectiveActionId).subscribe(res => {
      this.setSubmenu(res);
      this.getFindings();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // setSubmenu() {
  //   var subMenuItems = [
  //     { submenuItem: { type: 'go_to_findings' } },
  //     { activityName: 'UPDATE_NOC_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
  //     { activityName: 'DELETE_NOC_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
  //     { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'update_modal' } },
  //     { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'history' } },
  //     { activityName: null, submenuItem: { type: 'close', path: "/non-conformity/finding-corrective-actions" } },
  //   ]
  //   this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  // }



  setSubmenu(res) {
    if (res.corrective_action_status?.type == "closed") {

      var subMenuItems = [
        { submenuItem: { type: 'go_to_findings' } },
        // { activityName: 'UPDATE_NOC_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
        // { activityName: 'DELETE_NOC_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
        { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'update_modal' } },
        { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'history' } },
        { activityName: null, submenuItem: { type: 'close', path: "/non-conformity/finding-corrective-actions" } },
      ]
    }
    else {
      var subMenuItems = [
        { submenuItem: { type: 'go_to_findings' } },
        { activityName: 'UPDATE_NOC_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_NOC_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'delete' } },
        { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'update_modal' } },
        { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION_UPDATE', submenuItem: { type: 'history' } },
        { activityName: null, submenuItem: { type: 'close', path: "/non-conformity/finding-corrective-actions" } },
      ]
    }
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  }


  getDaysRemaining() {

    let startDate = new Date(FindingCorrectiveActionStore.correctiveActionDetails?.target_date);

    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  getTotaldays() {
    let startDate = new Date(FindingCorrectiveActionStore.correctiveActionDetails?.start_date);
    let targetDate = new Date(FindingCorrectiveActionStore.correctiveActionDetails?.target_date);

    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;
    return this.Totaldays;

  }


  // Update Modal
  updateCaModal() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.values = {
      ca_id: FindingCorrectiveActionStore.correctiveActionDetails?.id
    };
    FindingCorrectiveActionStore.clearupdateDocumentDetails();
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
    this.caUpdateObject.values = null;
    // this.pageChange();
    this.getCorrectiveActionDetails();
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
    FindingCorrectiveActionStore.unsetCorrectiveActionHistory();
    // this.pageChange();
    //this.getCorrectiveActions();
  }

  historyPageChange(newPage: number = null) {
    if (newPage) FindingCorrectiveActionStore.setHistoryCurrentPage(newPage);
    this._correctiveActionService.getCaHistory(FindingCorrectiveActionStore.correctiveActionDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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
      userInfoObject.department = user?.department;
      return userInfoObject;
    }
  }

  viewAttachments(type, document, khDocuments?) {
    switch (type) {
      case "corrective-action":
        this._correctiveActionService.getFilePreview(type, document.finding_corrective_action_id, document.id).subscribe(res => {
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

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  openPreviewModal(type, filePreview, itemDetails, document) {
    let uploaded_user = null;
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = type;
    this.previewObject.file_details = itemDetails;
    this.previewObject.componentId = document.id;
    this.previewObject.ca_id = document.finding_corrective_action_id;
    this.previewObject.preview_url = previewItem;
    this.previewObject.uploaded_user = document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }

  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
      return this._correctiveActionService.getThumbnailPreview(type, token);
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

  downloadDocument(type, document, docs?) {
    switch (type) {
      case "corrective-action":
        this._correctiveActionService.downloadFile('corrective-action', document.finding_corrective_action_id, document.id, document.title, document);
        break;
      case "document-version":
        this._documentFileService.downloadFile(type, document.document_id, docs.id, null, document.title, docs);
        break;
    }
  }

  changeZIndex() {
    if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');

    }
    // if ($(this.CaResolveformModal.nativeElement).hasClass('show')) {
    //   this._renderer2.setStyle(this.CaResolveformModal.nativeElement, 'z-index', 999999);
    //   this._renderer2.setStyle(this.CaResolveformModal.nativeElement, 'overflow', 'auto');
    // }
  }

  // for opening modal
  openFormModal() {
    // this.CorrectiveActionMasterStore.clearDocumentDetails();
    setTimeout(() => {
      $(this.AddCAformModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.AddCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'overflow', 'auto')
  }

  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.AddCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.AddCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'overflow', 'none');
    this.getCorrectiveActionDetails();
    // FindingCorrectiveActionStore.new_ca_id = null;
    this.correctiveActionObject.type = null;
    this._utilityService.detectChanges(this._cdr);
  }

  editCorrectiveACtion() {
    event.stopPropagation();
    FindingCorrectiveActionStore.clearDocumentDetails();
    const corrective_action = FindingCorrectiveActionStore.correctiveActionDetails; // assigning values for edit

    setTimeout(() => {
      if (corrective_action.documents.length > 0) {
        this.setDocuments(corrective_action.documents)
      }
    }, 200);

    this.correctiveActionObject.values = {
      id: corrective_action.id,
      title: corrective_action.title,
      finding_id: corrective_action.finding_id,
      responsible_user_id: corrective_action.responsible_user.id,
      description: corrective_action.description,
      start_date: this._helperService.processDate(corrective_action.start_date, 'split'),
      target_date: this._helperService.processDate(corrective_action.target_date, 'split'),
      documents: ''
    }


    this.correctiveActionObject.type = 'Edit';
    this.openFormModal();
  }

  modalControl(status: boolean) {
    switch (this.popupObject.status_btn) {
      case '': this.deleteCorrectiveActions(status)
        break;
      case 'statusClose': this.closeCa(status)
        break;
      case 'reject': this.rejectCa(status)
        break;
    }
  }

  delete() {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = FindingCorrectiveActionStore.FindingCorrectiveActionId;
    this.popupObject.status_btn = '';
    // this.popupObject.finding_id = item.finding_id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = "common_delete_subtitle";

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {

      this._correctiveActionService.deleteItem(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('/non-conformity/finding-corrective-actions');
        this.clearPopupObject();
        FindingCorrectiveActionStore.FindingCorrectiveActionId = null;
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }




  closeCorrectiveAction() {
    // event.stopPropagation();
    this.popupObject.type = 'Confirm';
    this.popupObject.id = FindingCorrectiveActionStore.FindingCorrectiveActionId;
    this.popupObject.status_btn = 'statusClose';
    // this.popupObject.finding_id = item.finding_id;
    // this.popupObject.title = 'Delete Corrective Action?';
    // this.popupObject.subtitle = 'Delete Corrective Action ? ';
    this.popupObject.title = 'Are you sure?';
    this.popupObject.subtitle = 'It will change status of the corrective action to close';
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  closeCa(status) {
    if (status && this.popupObject.id) {
      console.log(status);
      this._correctiveActionService.closeCorrectiveAction(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('/non-conformity/finding-corrective-actions/' + this.popupObject.id);
        this.clearPopupObject();
        FindingCorrectiveActionStore.FindingCorrectiveActionId = null;
      });
    } else {
      this.clearPopupObject();
    }
    this.getCorrectiveActionDetails();
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  rejectCorrectiveAction() {
    event.stopPropagation();
    this.popupObject.type = 'Confirm';
    this.popupObject.id = FindingCorrectiveActionStore.FindingCorrectiveActionId;
    this.popupObject.status_btn = 'reject';
    // this.popupObject.finding_id = item.finding_id;
    this.popupObject.title = 'Are you sure?';
    this.popupObject.subtitle = 'It will change status of the corrective action to reject';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  rejectCa(status) {
    if (status && this.popupObject.id) {
      this._correctiveActionService.rejectCorrectiveAction(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('/non-conformity/finding-corrective-actions/' + this.popupObject.id);
        this.clearPopupObject();
        FindingCorrectiveActionStore.FindingCorrectiveActionId = null;
      });
    } else {
      this.clearPopupObject();
    }
    this.getCorrectiveActionDetails();
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.status_btn = '';
    this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }
  // clearCorrectiveActionResolveObject(){
  //   this.correctiveActionResolveObject. = null;
  //   this.correctiveActionResolveObject.title = '';
  //   this.correctiveActionResolveObject.status_btn = '';
  // }

  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document?.versions.forEach(innerElement => {
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
          var purl = this._correctiveActionService.getThumbnailPreview('corrective-action', element.token);
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

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.updateSubscriptionEvent.unsubscribe();
    this.PreviewSubscriptionEvent.unsubscribe();
    this.resolveSubscriptionEvent.unsubscribe();
    this.addCASubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    FindingCorrectiveActionStore.individualLoaded = false;
    FindingCorrectiveActionStore.FindingCorrectiveActionId = null;
    AppStore.showDiscussion = false;

  }

  labelDot(data) {
    let str = data;
    let color = "";
    const myArr = str.split("-");
    color = myArr[0];
    return color;
  }

}
