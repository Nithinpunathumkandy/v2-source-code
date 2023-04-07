import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild,OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FindingCorrectiveActionStore } from 'src/app/stores/non-conformity/findings/finding-corrective-action-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;

@Component({
  selector: 'app-findings-details-corrective-action',
  templateUrl: './findings-details-corrective-action.component.html',
  styleUrls: ['./findings-details-corrective-action.component.scss']
})
export class FindingsDetailsCorrectiveActionComponent implements OnInit,OnDestroy {
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
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  remainingDaysAre: number = 0;
  Totaldays: number = 0;
  todayDate: any = new Date();

  updateSubscriptionEvent: any;
  PreviewSubscriptionEvent: any;
  addCASubscriptionEvent: any;
  popupControlEventSubscription: any;
  historyEmptyList = "update_ca_empty_title";

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
    component: 'FindingCorrectiveAction',
    values: null,
    type: null
  };

  caUpdateObject = {
    component: '',
    values: null,
    type: null
  };

  popupObject = {
    category: '',
    type: '',
    title: '',
    id: null,
    subtitle: '',
    finding_id: null
  };

  constructor(private _correctiveActionService: FindingCorrectiveActionService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _findingsService: FindingsService,
    private _sanitizer: DomSanitizer,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_TRAINING', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_NOC_FINDING_CORRECTIVE_ACTION_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_NOC_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/non-conformity/findings' } },

      ]

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_corrective_action' });

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addCA();
            break;
          case "template":
            this._correctiveActionService.generateTemplate(FindingsStore.FindingsId);
            break;
          case "export_to_excel":
            this._correctiveActionService.exportToExcel(FindingsStore.FindingsId);
            break;
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

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.findingCorrectiveActionModalControl.subscribe(res => {
      this.closeFormModal();
    })

    this.updateSubscriptionEvent = this._eventEmitterService.caResolveModalControl.subscribe(res => {
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
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.getDaysRemaining();
    this.getTotaldays()
    this.getCorrectiveActions(1);
  }


  historyPageChange(newPage: number = null) {
    if (newPage) FindingCorrectiveActionStore.setHistoryCurrentPage(newPage);
    this._correctiveActionService.getCaHistory(FindingCorrectiveActionStore.correctiveActionDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  labelDot(data) {
    let str = data;
    let color="";
    const myArr = str.split("-");
    color=myArr[0];
    return color;
  }

  // Update Modal
  updateCorrectiveAction() {
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
    // this.pageChange();
    this.getCorrectiveActions();
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

  getCorrectiveActions(newPage: number = null, closeModal: boolean = false) {
    if (newPage) FindingCorrectiveActionStore.setCurrentPage(newPage);
    this._correctiveActionService.getItems(false, '&limit=8&finding_ids=' + FindingsStore.FindingsId).subscribe(res => {
      // this._utilityService.detectChanges(this._cdr);
      // if(FindingCorrectiveActionStore.allItems?.length>0)
      // this.getCorrectiveActionDetails(FindingCorrectiveActionStore.allItems[0])

      // this._utilityService.detectChanges(this._cdr);

      if (FindingCorrectiveActionStore.allItems?.length > 0 && !closeModal) {
        this.getCorrectiveActionDetails(FindingCorrectiveActionStore.allItems[0].id);
        this._utilityService.detectChanges(this._cdr);
      }
      // else if(FindingCorrectiveActionStore.allItems?.length>0 && FindingCorrectiveActionStore.new_ca_id!=null) {
      //   for(let i of FindingCorrectiveActionStore.allItems){
      //     if(i.id == FindingCorrectiveActionStore.new_ca_id)
      //     this.getCorrectiveActionDetails(i);
      //     this._utilityService.detectChanges(this._cdr); 
      //   }        
      // }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCorrectiveActionDetails(id) {
    FindingCorrectiveActionStore.unsetIndividualCADetails();
    FindingCorrectiveActionStore.unsetCorrectiveActionHistory();
    FindingCorrectiveActionStore.FindingCorrectiveActionId = id;
    this._correctiveActionService.getItem(id).subscribe(res => {
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
    // this.previewObject.uploaded_user = document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.uploaded_user = document.created_by ? document.created_by : null;
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
  }

  //calling corrective action add modal
  addCA() {
    FindingCorrectiveActionStore.setSubMenuHide(true);
    this.correctiveActionObject.type = null;
    this.correctiveActionObject.values = null;
    this.FindingCorrectiveActionStore.clearDocumentDetails();
    this.correctiveActionObject.type = 'Add';
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);

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
    let pageNumber = this.correctiveActionObject.type == 'Add' ? FindingCorrectiveActionStore.last_page : FindingCorrectiveActionStore.currentPage;
    this.getCorrectiveActions(pageNumber, true);
    if (FindingCorrectiveActionStore.FindingCorrectiveActionId)
      this.getCorrectiveActionDetails(FindingCorrectiveActionStore.FindingCorrectiveActionId);
    // FindingCorrectiveActionStore.new_ca_id = null;
    this.correctiveActionObject.type = null;
    this._utilityService.detectChanges(this._cdr);
  }

  editCorrectiveACtion() {
    FindingCorrectiveActionStore.setSubMenuHide(true);
    event.stopPropagation();
    FindingCorrectiveActionStore.clearDocumentDetails();
    const corrective_action = FindingCorrectiveActionStore.correctiveActionDetails; // assigning values for edit
    // for edit

    // if (corrective_action.documents && corrective_action.documents.length > 0) {
    //   for (let i of corrective_action.documents) {
    //     let docurl = this._correctiveActionService.getThumbnailPreview('corrective-action', i.token);
    //     let docDetails = {
    //       created_at: i.created_at,
    //       created_by: i.created_by,
    //       updated_at: i.updated_at,
    //       updated_by: i.updated_by,
    //       name: i.title,
    //       ext: i.ext,
    //       size: i.size,
    //       url: i.url,
    //       thumbnail_url: i.url,
    //       token: i.token,
    //       preview: docurl,
    //       id: i.id,
    //     };
    //     this._correctiveActionService.setDocumentDetails(docDetails, docurl);
    //   }
    // }

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
    switch (this.popupObject.type) {
      case '': this.deleteCorrectiveActions(status)
        break;
    }
  }

  delete(item) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = item.id;
    this.popupObject.finding_id = item.finding_id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = "common_delete_subtitle";

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {

      this._correctiveActionService.deleteItem(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        FindingCorrectiveActionStore.FindingCorrectiveActionId = null;
        this.getCorrectiveActions();
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

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
    FindingCorrectiveActionStore.loaded = false;
    FindingCorrectiveActionStore.FindingCorrectiveActionId = null;
    this.popupControlEventSubscription.unsubscribe();
    AppStore.showDiscussion = false;
    this.PreviewSubscriptionEvent.unsubscribe();
    FindingCorrectiveActionStore.unsetFindingCorrectiveAction();
    FindingCorrectiveActionStore.unsetCorrectiveActionHistory();

  }

}
