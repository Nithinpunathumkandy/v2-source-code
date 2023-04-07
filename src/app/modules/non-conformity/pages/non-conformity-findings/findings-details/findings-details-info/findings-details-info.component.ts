import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;

@Component({
  selector: 'app-findings-details-info',
  templateUrl: './findings-details-info.component.html',
  styleUrls: ['./findings-details-info.component.scss']
})
export class FindingsDetailsInfoComponent implements OnInit {

  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('quickCorrectionsFormModal') quickCorrectionsFormModal: ElementRef
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  FindingsStore = FindingsStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  fileUploadPopupStore = fileUploadPopupStore;

  openQuickCorrectionpopup: boolean = false;
  popupCorrectionDeleteEventSubscription: any = null;
  controlQuickCorrectionSubscriptionEvent: any = null;
  controlFindingsSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  quickCorrectionsObject = {
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  findingsObject = {
    values: null,
    type: null
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: '',
    component: '',
    componentId: null
  }

  constructor(
    private _router: Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    // private _findingsService: OrganizationfileService,
    private _sanitizer: DomSanitizer,
    private _fileUploadPopupService: FileUploadPopupService,
    private _findingsService: FindingsService,
    private _renderer2: Renderer2,

  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'UPDATE_FINDINGS', submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "edit_modal":
            this.findingsObject.values = null;
            this.getFindings(FindingsStore.FindingsId);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;


    this.popupCorrectionDeleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteCorrection(item);
    })

    // for closing the modal
    this.controlFindingsSubscriptionEvent = this._eventEmitterService.FindingsList.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })



    this.controlQuickCorrectionSubscriptionEvent = this._eventEmitterService.FindingsQuickCorrection.subscribe(res => {
      this.closeQuickCorrections();
    })
    // this.getQuickCorrections();
  }
  gotoEditPage() {
    FindingsStore.FindingsId = null;
    this._router.navigateByUrl('/non-conformity/findings/edit-findings');
    this._utilityService.detectChanges(this._cdr);
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
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



  viewBrochureItem(type, documents, documentFile) {

    switch (type) {
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

      case 'findings-document':
        this._findingsService.getFilePreview('findings-document', documents.finding_id, documentFile).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(res, documents.title);
          this.openPreviewModal(type, resp, documents, documentFile);
        }), (error => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage('error', 'permission_denied');
          }
          else {
            this.openPreviewModal(type, null, documents, documentFile);
          }
        });
        break;

      default:
        break;
    }

    // this._findingsService.getFilePreview('policy-preview', id, brochureItem.id).subscribe(res => {
    //   var resp: any = this._utilityService.getDownLoadLink(res, brochureItem.name);
    //   this.openPreviewModal(resp, brochureItem, id);
    // }), (error => {
    //   if (error.status == 403) {
    //     this._utilityService.showErrorMessage('error', 'permission_denied');
    //   }
    //   else {
    //     this.openPreviewModal(null, brochureItem, id);
    //   }
    // });


  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._findingsService.getThumbnailPreview(type, token);

  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "findings-document":
        this._findingsService.downloadFile(
          type,
          document.finding_id,
          document.id,
          document.title,
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

  openPreviewModal(type, filePreview, documentFiles, document) {

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.uploaded_user = this.FindingsStore.findingDetails.created_by ? this.FindingsStore.findingDetails.created_by : null;
      this.previewObject.created_at = this.FindingsStore.findingDetails.created_at ? this.FindingsStore.findingDetails.created_at : '';
      if (type == 'document-version') {
        this.previewObject.component = type
        this.previewObject.componentId = document.id;
      }
      else {
        this.previewObject.componentId = document;
        this.previewObject.component = 'findings-document'
      }

      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Close brochure preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.preview_url = '';
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = '';
  }


  getStatusColorKey() {
    var color_code = FindingsStore.findingDetails.risk_rating;
    return 'dot-' + color_code['label'];
  }

  StatusColorKey() {
    let stringItem = FindingsStore.findingDetails.findingStatus.label;
    let statusColor = stringItem.split('-')[0];
    return 'draft-tag-' + statusColor;
  }

  getStutas(status){
    return status.language[0]?.pivot?.title;
  }


  getFindings(id: number) {
    event.stopPropagation();
    // const businessApplications: Findings = FindingsStore.getFindingsById(id);
    this._findingsService.getItem(id).subscribe(res => {
      // setTimeout(() => {
      this.clearCommonFilePopupDocuments();
      if (res.documents.length > 0) {
        this.setDocuments(res.documents)
      }
      // }, 200);
      this.findingsObject.values = {
        id: res.id,
        finding_category: res.finding_category,
        risk_rating: res.risk_rating,
        title: res.title,
        description: res.description,
        evidence: res.evidence,
        recommendation: res.recommendation,
        departments: res.departments,
        divisions: res.divisions,
        sections: res.sections,
        organizations: res.organizations,
        sub_sections: res.sub_sections,
        supplier: res.supplier,
        // documents:res.documents


      }
      this.findingsObject.type = 'Edit';
      this._utilityService.detectChanges(this._cdr)
      this.openFormModal();
    });
    //set form value
  }

  setDocuments(documents) {
    // this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        // let doc = element;
        // doc['is_kh_document'] = true;
        // khDocuments.push(doc);
        // let doc2=element;
        // doc2['updateId'] = element.id;
        // fileUploadPopupStore.setUpdateFileArray(doc2)
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
          var purl = this._findingsService.getThumbnailPreview('non-conformity-findings-document', element.token);
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

  openFormModal() {
    // setTimeout(() => {
    // 	$(this.formModal.nativeElement).modal('show');
    // }, 50);
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
  }

  closeFormModal() {
    // $(this.formModal.nativeElement).modal('hide');
    this.findingsObject.type = null;
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this.getfindingservice(FindingsStore.FindingsId);
    this._utilityService.detectChanges(this._cdr);
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }


  addNewQuickCorrection() {
    this.quickCorrectionsObject.type = 'Add';
    this.quickCorrectionsObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openQuickCorrections();
  }

  openQuickCorrections() {
    this.openQuickCorrectionpopup = true;
    this._renderer2.addClass(this.quickCorrectionsFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.quickCorrectionsFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.quickCorrectionsFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeQuickCorrections() {
    this.quickCorrectionsObject.type = null;
    this.quickCorrectionsObject.values = null;
    this._renderer2.removeClass(this.quickCorrectionsFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.quickCorrectionsFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.quickCorrectionsFormModal.nativeElement, 'display', 'none');
    this.openQuickCorrectionpopup = false;
    this.getfindingservice(FindingsStore.FindingsId);

    this._utilityService.detectChanges(this._cdr);
  }

  // getQuickCorrections(){
  //   this._findingsService.getQuickCorrection(FindingsStore?.findingDetails.id).subscribe(res => {
  // })}

  // editQuickCorrections(id:number){
  //    this._findingsService.updateCorrection(FindingsStore?.findingDetails.id,FindingsStore?.findingDetails.finding_quick_actions.id,this.form.value).subscribe(res => {
  // })}

  getfindingservice(id) {
    this._findingsService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
    this._findingsService.saveFindingsId(id);
  }


  getQuickCorrections() {
    event.stopPropagation();
    // const businessApplications: Findings = FindingsStore.getFindingsById(id);
    this._findingsService.getItem(FindingsStore?.findingDetails.id).subscribe(res => {
      setTimeout(() => { }, 200);
      this.quickCorrectionsObject.values = {
        id: res.finding_quick_actions.id,
        findings_id: res.finding_quick_actions.finding_id,
        title: res.finding_quick_actions.title,
        description: res.finding_quick_actions.description,
      }
      this.quickCorrectionsObject.type = 'Edit';
      this._utilityService.detectChanges(this._cdr)
      this.openQuickCorrections();
    });
    //set form value
  }

  delete() {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = FindingsStore?.findingDetails?.finding_quick_actions?.id;
    this.popupObject.title = 'Delete Findings?';
    this.popupObject.subtitle = 'findings_details_qc_delete_popup_msg';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deleteCorrection(status: boolean) {
    if (status && this.popupObject.id) {
      this._findingsService.deleteCorrection(FindingsStore?.findingDetails?.id, this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.pageChange();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
    //this.pageChange();
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  pageChange(newPage: number = null) {
    // if (newPage) FindingsStore.setCurrentPage(newPage);
    this._findingsService.getItem(FindingsStore?.findingDetails?.id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    this.controlFindingsSubscriptionEvent.unsubscribe();
    this.controlQuickCorrectionSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupCorrectionDeleteEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
