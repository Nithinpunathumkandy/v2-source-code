import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditDocumentService } from 'src/app/core/services/audit-management/am-audit/am-audit-document/am-audit-document.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditDocumentStore } from 'src/app/stores/audit-management/am-audit/am-audit-document.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
declare var $: any;

@Component({
  selector: 'app-am-audit-documents',
  templateUrl: './am-audit-documents.component.html',
  styleUrls: ['./am-audit-documents.component.scss']
})
export class AmAuditDocumentsComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  AmAuditDocumentStore = AmAuditDocumentStore;
  SubMenuItemStore = SubMenuItemStore;
  AmAuditsStore = AmAuditsStore;
  reactionDisposer: IReactionDisposer;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  documentObject = {
    component: 'Audit',
    values: null,
    type: null,
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };

  deleteEventSubscription: any;
  auditDocumentModal: any;

  constructor(private _auditDocumentService: AmAuditDocumentService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _auditManagementService: AuditManagementService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _humanCapitalService: HumanCapitalService,
    private _sanitizer: DomSanitizer,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    this._helperService.setComponent('doc')
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_audit_document' });
    this.reactionDisposer = autorun(() => {
      if(AmAuditsStore.editAccessUser() && AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type!='completed'){
        var subMenuItems = [
          { activityName: 'AM_AUDIT_DOCUMENT_LIST', submenuItem: { type: 'refresh' } },
          { activityName: 'AM_AUDIT_DOCUMENT_LIST', submenuItem: { type: 'search' } },
          { activityName: 'CREATE_AM_AUDIT_DOCUMENT', submenuItem: { type: 'new_modal' } },
        ]
      }
      else{
        var subMenuItems = [
          { activityName: 'AM_AUDIT_DOCUMENT_LIST', submenuItem: { type: 'refresh' } },
          { activityName: 'AM_AUDIT_DOCUMENT_LIST', submenuItem: { type: 'search' } },
        ]
      }
     
      
      if ((AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'CREATE_AM_AUDIT_DOCUMENT')) || !AmAuditsStore.editAccessUser() || AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type=='completed') {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;

          case 'refresh':
            this.pageChange(1);
            break

          case "search":
            AmAuditDocumentStore.searchText = SubMenuItemStore.searchText;

            this.pageChange(1);
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    AppStore.showDiscussion = false;

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.auditDocumentModal = this._eventEmitterService.amAuditDocumentModal.subscribe(item => {
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
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    AmAuditDocumentStore.loaded = false;
    if (newPage) AmAuditDocumentStore.setCurrentPage(newPage);
    this._auditDocumentService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  createImageUrl(type, token) {
    if (type == 'audit-document')
      return this._auditManagementService.getThumbnailPreview(type, token);
    else if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }


  openFormModal() {
    this.documentObject.type = 'Add';
    this.documentObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);


  }



  closeFormModal() {
    this.documentObject.type = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  editAuditDocument(id) {

    this._auditDocumentService.getItem(id).subscribe(res => {

      this.documentObject.values = {
        id: id,
        title: res['title'],
        am_audit_document_type_id: res['am_audit_document_type'],
        description: res['description'],
        document: res,

      }
      this.clearCommonFilePopupDocuments();
      this.setDocuments(res);

      this.documentObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }



  setDocuments(element) {

    let khDocuments = [];
    if (element.document_id != null) {
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
        var purl = this._auditManagementService.getThumbnailPreview('audit-document', element.token)
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
          asset_id: element.asset_id,
          'is_kh_document': false,
        }
      }
      this._fileUploadPopupService.setSystemFile(lDetails, purl);

    }

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

  /**
* Delete the audit document
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditDocumentService.delete(this.deleteObject.id);
          break;
      }
      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (AmAuditDocumentStore.currentPage > 1 && this.deleteObject.type == '') {
            AmAuditDocumentStore.currentPage = Math.ceil(AmAuditDocumentStore.totalItems / 15);
            this.pageChange(AmAuditDocumentStore.currentPage);
          }
        }, 500);
        this.clearDeleteObject();
      }, (error => {
        setTimeout(() => {
          if (error.status == 405) {
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  deleteAuditDocument(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_document_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }


  downloadFile(doc){
    if(!doc.document_id){
      this.downloadDocumentFile('audit-document',doc)
    }
    else{
      this.downloadDocumentFile('document-version',doc);
    }
  }


  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "audit-document":
        this._auditManagementService
          .getFilePreview(type, documents.id, documentFile.id)
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


      this.previewObject.uploaded_user = {
        first_name: document.created_by_first_name,
        last_name: document.created_by_last_name,
        designation: document.created_by_designation,
        image: { token: document.created_by_image_token },


      }
      document.updated_by ? document.updated_by : document.created_by;
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
      case "audit-document":
        this._auditManagementService.downloadFile(
          type,
          document.id,
          null,
          document.document_title,
          null,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          document.version_id,
          null,
          document.kh_document_title,
          document.kh_document.versions[0]
        );
        break;
    }
  }
  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditDocumentModal.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    AmAuditDocumentStore.searchText = null;
    SubMenuItemStore.searchText = null;
    NoDataItemStore.unsetNoDataItems();
  }


}
