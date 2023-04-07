import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { fileUploadPopupStore } from "src/app/stores/file-upload-popup/fileUploadPopup.store";
import { EventChecklistStore } from 'src/app/stores/event-monitoring/events/event-checklist-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FileUploadPopupService } from "src/app/core/services/fileUploadPopup/file-upload-popup.service";
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { EventChecklistService } from 'src/app/core/services/event-monitoring/event-monitoring-closure/event-checklist.service';
declare var $: any;
@Component({
  selector: 'app-event-checklist-details',
  templateUrl: './event-checklist-details.component.html',
  styleUrls: ['./event-checklist-details.component.scss']
})
export class EventChecklistDetailsComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('checklistModal', { static: true }) checklistModal: ElementRef;

  reactionDisposer: IReactionDisposer;

  AppStore = AppStore
  AuthStore = AuthStore
  EventsStore = EventsStore
  EventChecklistStore = EventChecklistStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  eventChecklistSubscription: Subscription

  checklistId: number

  checklistObject = {
    id: null,
    type: null,
    value: null,
    values: null
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventChecklist: EventChecklistService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _eventFileService: EventFileServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.checklistId = +params['id']; // (+) converts string 'id' to a number                        
    });

    if (EventsStore.selectedEventId) {
      this.getDetails(this.checklistId)
    } else {
      this._router.navigateByUrl('event-monitoring/events');
    }

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.edit(this.checklistId);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.eventChecklistSubscription = this._eventEmitterService.eventChecklistModal.subscribe(item => {
      this.closeFormModal();
    })
  }

  getDetails(id) {
    this._eventChecklist.getDetails(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  edit(id) {
    this._eventChecklist.getDetails(id).subscribe(res => {
      if (res) {
        this.checklistObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openNewChecklist();
      }
    })
  }

  //this is for opening add task  
  openNewChecklist() {
    this.checklistObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.openNewchecklistModal();
  }

  //it will open add modal
  openNewchecklistModal() {
    setTimeout(() => {
      $(this.checklistModal.nativeElement).modal('show');
    }, 100);
  }

  setDocuments(documents) {
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
          var purl = this._documentFileService.getThumbnailPreview('event-checklist', element.token)
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

  // File Preview,Download Starts Here
  downloadDocumentFile(type, document, docs?) {
    switch (type) {
      case "event-checklist":
        this._documentFileService.downloadFile(
          type,
          document.control_id,
          document.id,
          null,
          document.title,
          document
        );
        break;
      case "document-version":
        this._eventFileService.downloadFile(
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
      case "event-checklist":
        this._eventFileService
          .getFilePreview(type, EventsStore.selectedEventId,this.checklistId, documentFile.id)
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
      this.previewObject.componentId = document.id;
      this.previewObject.uploaded_user =
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

  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._eventFileService.getThumbnailPreview(type, token);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  //user popup box objects
  getResponsibleUser(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    if (created) {
      userDetial['designation'] = users?.designation;
    } else {
      userDetial['designation'] = users?.designation?.title;
    }
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

  //it will open add modal
  openNewChecklistModal() {
    setTimeout(() => {
      $(this.checklistModal.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit  modal
  closeFormModal() {
    $(this.checklistModal.nativeElement).modal('hide');
    this.checklistObject.type = null;
  }

  //Don't forget to dispose reaction disposer and unsubscribe eventemitter
  ngOnDestroy(): void {
    SubMenuItemStore.makeEmpty()
    if (this.reactionDisposer) this.reactionDisposer();
    this.eventChecklistSubscription.unsubscribe()
    EventChecklistStore.unsetIndividualEventChecklist()
  }

}
