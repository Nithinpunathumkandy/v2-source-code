import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditInformationRequestStore } from 'src/app/stores/audit-management/am-audit/am-audit-information-request.store';
import { AmAuditInformationRequestService } from 'src/app/core/services/audit-management/am-audit/am-audit-information-request/am-audit-information-request.service';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
declare var $: any;

@Component({
  selector: 'app-am-information-request-details',
  templateUrl: './am-information-request-details.component.html',
  styleUrls: ['./am-information-request-details.component.scss']
})
export class AmInformationRequestDetailsComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  informationRequestId = null;
  AmAuditInformationRequestStore = AmAuditInformationRequestStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  SubMenuItemStore = SubMenuItemStore;
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  requestObject = {
    component: 'Audit',
    values: null,
    type: null,
    requestType: ''
  };
  informationRequestModal: any;
  AppStore = AppStore;
  AmAuditsStore = AmAuditsStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  AuthStore = AuthStore;

  constructor(private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _informationRequestService: AmAuditInformationRequestService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _auditManagementService: AuditManagementService,
    private _documentFileService: DocumentFileService,
    private _sanitizer: DomSanitizer,
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _amAuditService:AmAuditService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if (AmAuditInformationRequestStore?.requestDetails?.am_audit_information_request_status?.type == 'closed' || AmAuditInformationRequestStore?.requestDetails?.created_by.id!=AuthStore.user?.id) {
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'close', path: AppStore.previousUrl } },
        ]
        this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      }
      else {
        if(AmAuditInformationRequestStore?.requestDetails?.am_audit_information_request_status?.type == 'response'){
          var subMenuItem = [
            { activityName: 'DELETE_AM_AUDIT_INFORMATION_REQUEST', submenuItem: { type: 'delete' } },
            { activityName: null,submenuItem: { type: 'close_cmn' } },
            { activityName: null, submenuItem: { type: 'close', path: AppStore.previousUrl } },
          ]
        }
        else{
          var subMenuItem = [
            { activityName: 'DELETE_AM_AUDIT_INFORMATION_REQUEST', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: { type: 'close', path: AppStore.previousUrl } },
          ]
        }
        
          
        }
       
        this._helperService.checkSubMenuItemPermissions(3600, subMenuItem);
      


      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "delete":
            if (this.informationRequestId)
              this.deleteInformationRequest(this.informationRequestId);
            break;
          case "close_cmn":
            this.close(this.informationRequestId);
            break;
          
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.getDetails();

    this.informationRequestModal = this._eventEmitterService.amInformationRequestModal.subscribe(item => {
      this.closeFormModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalSelect(item);
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

  }


  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  getDetails() {
    let id: number;
    this._route.params.subscribe(params => {
      AmAuditsStore.auditId = params['id'];
      id = +params['info_id']; // (+) converts string 'id' to a number
      this.informationRequestId = id;
      this._amAuditService.getItem(params['id']).subscribe(response=>{
        this._informationRequestService.getItem(id).subscribe(res => {
          this._utilityService.detectChanges(this._cdr)
        })
      })
      
    })
  }

  createImageUrl(type, token) {
    if (type == 'information-request')
      return this._auditManagementService.getThumbnailPreview(type, token);
    else if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "information-request":
        this._auditManagementService
          .getFilePreview(type, documents.am_audit_information_request_id, documentFile.id)
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
      this.previewObject.uploaded_user = AmAuditInformationRequestStore.requestDetails?.created_by;
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
      case "information-request":
        this._auditManagementService.downloadFile(
          type,
          document.am_audit_information_request_id,
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

  openResponseModal(request) {

    this.requestObject.values = {
      am_audit_information_request_id: request.id,
      organization_id: AmAuditInformationRequestStore?.requestDetails?.organization,
      division_id: AmAuditInformationRequestStore?.requestDetails?.division,
      department_id: AmAuditInformationRequestStore?.requestDetails?.department,
      section_id: AmAuditInformationRequestStore?.requestDetails?.section,
      sub_section_id: AmAuditInformationRequestStore?.requestDetails?.sub_section,
      description: '',
      type: 'response',
      to_user_id:request.created_by,
      documents: [],

    }
    this.clearCommonFilePopupDocuments();


    this.requestObject.type = 'Add';
    this.requestObject.requestType = 'response';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);


  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
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
          var purl = this._auditManagementService.getThumbnailPreview('information-request', element.token)
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
            am_audit_information_request_id: element.am_audit_information_request_id,
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

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }


  closeFormModal() {
    this.requestObject.type = null;
    this.requestObject.requestType = '';
    AmAuditInformationRequestStore.unsetIndiviudalAuditDetails();
    this.getDetails();
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  /**
 * Delete the audit information request
 */
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._informationRequestService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('audit-management/am-audits/' + AmAuditsStore.auditId + '/am-audit-information-request');

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

  deleteInformationRequest(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_information_request_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  close(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Close';
    this.deleteObject.subtitle = 'close_am_audit_information_request_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    // this.deleteObject.subtitle = '';
  }


  editInformationRequest(reply) {

    this.requestObject.values = {
      am_audit_information_request_id: reply.id,
      organization_id: AmAuditInformationRequestStore?.requestDetails?.organization,
      division_id: AmAuditInformationRequestStore?.requestDetails?.division,
      department_id: AmAuditInformationRequestStore?.requestDetails?.department,
      section_id: AmAuditInformationRequestStore?.requestDetails?.section,
      sub_section_id: AmAuditInformationRequestStore?.requestDetails?.sub_section,
      description: reply.description,
      type: reply.type,
      to_user_id:reply.to_user_id?reply.to_user_id:reply.to_user,
      documents: reply.documents,

    }
    this.clearCommonFilePopupDocuments();
    if (reply.documents?.length > 0) {
      this.setDocuments(reply.documents);
    }

    this.requestObject.type = 'Edit';
    this.requestObject.requestType = reply.type;

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);

  }

  closeInformationRequest() {
    this._informationRequestService.closeInformationRequest(this.informationRequestId).subscribe(() => {
      this.clearDeleteObject();
      this._utilityService.detectChanges(this._cdr)
      setTimeout(() => {
        $(this.deletePopup.nativeElement).modal('hide');
      }, 250);
    }
    // , (error => {
    //   setTimeout(() => {
    //     if (error.status == 405) {
          
    //       this._utilityService.detectChanges(this._cdr);
    //     }
    //   }, 100);
    // })
    );
  }

  modalSelect(status: boolean){
    switch(this.deleteObject.type){
      case '':
        this.delete(status);
        break;
      case 'Close':
        this.closeInformationRequest();
        break;
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.informationRequestModal.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
