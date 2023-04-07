import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
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
import { AmAuditMeetingService } from 'src/app/core/services/audit-management/am-audit/am-audit-meeting/am-audit-meeting.service';
import { AmAuditMeetingStore } from 'src/app/stores/audit-management/am-audit/am-audit-meeting.store';
declare var $: any;

@Component({
  selector: 'app-am-audit-meeting-details',
  templateUrl: './am-audit-meeting-details.component.html',
  styleUrls: ['./am-audit-meeting-details.component.scss']
})
export class AmAuditMeetingDetailsComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  auditMeetingId = null;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  SubMenuItemStore = SubMenuItemStore;
  AmAuditMeetingStore = AmAuditMeetingStore;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  meetingObject = {
    component: 'Audit',
    values: null,
    type: null,
  };
  AppStore = AppStore;
  AmAuditsStore = AmAuditsStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  meetingModalSubscription: any;


  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  constructor(private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _auditManagementService: AuditManagementService,
    private _documentFileService: DocumentFileService,
    private _sanitizer: DomSanitizer,
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _amMeetingService: AmAuditMeetingService,
    private _renderer2:Renderer2) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if(AmAuditsStore.editAccessUser() && AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type!='completed'){
        var subMenuItems = [
          { activityName: 'UPDATE_AM_AUDIT_MEETING', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_AM_AUDIT_MEETING', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: { type: 'close', path: AppStore.previousUrl } },
  
        ]
      }
      else{
        subMenuItems = [

          { activityName: null, submenuItem: { type: 'close', path: AppStore.previousUrl } },
  
        ]
      }
     


      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editMeeting();
            break;
          case "delete":
            if (this.auditMeetingId)
              this.deleteAuditMeeting(this.auditMeetingId);
            break;

          case "template":

            // this._auditPlansService.generateTemplate();
            break;

          case "export_to_excel":
            // this._auditPlansService.exportToExcel();
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      // AppStore.showDiscussion = false;
    })
    this.getDetails();

    this.meetingModalSubscription = this._eventEmitterService.amAuditMeetingModal.subscribe(item => {
      this.closeFormModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
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

  getDetails() {
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['meeting_id']; // (+) converts string 'id' to a number
      this.auditMeetingId = id;
      this._amMeetingService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    })
  }

  
  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }


  createImageUrl(type, token) {
    if (type == 'audit-meeting')
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
      case "audit-meeting":
        this._auditManagementService
          .getFilePreview(type, documents.meeting_id, documentFile.id)
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
      this.previewObject.uploaded_user = AmAuditMeetingStore.individualMeetingDetails?.created_by;
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
      case "audit-meeting":
        this._auditManagementService.downloadFile(
          type,
          document.meeting_id,
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
          var purl = this._auditManagementService.getThumbnailPreview('audit-meeting', element.token)
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
            meeting_id: element.meeting_id,
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
    this.meetingObject.type = null;
    this.getDetails();
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  /**
 * Delete the audit plan
 * @param id -audit plan id
 */
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._amMeetingService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('audit-management/am-audits/' + AmAuditsStore.auditId + '/am-audit-meetings');
   
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

  deleteAuditMeeting(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_meeting_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }


  editMeeting() {

    this.meetingObject.type = 'Edit';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);

  }

  getParticipantData(data){
    let participants = [];
    for(let i of data){
      participants.push(i.user);
    }
    return participants;
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }


  getOrganizerDetails(user) {
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

    return userDetail;
  }

  getParticipantsDetails(user) {
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

    return userDetail;
  }

  getCreatedByDetails(user) {
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
    userDetail['created_at'] = AmAuditMeetingStore.individualMeetingDetails?.created_at;

    return userDetail;
  }
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.meetingModalSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
  }

}
