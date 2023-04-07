import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { AuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-check-list/audit-check-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
declare var $: any;

@Component({
  selector: 'app-check-list-view-answer',
  templateUrl: './check-list-view-answer.component.html',
  styleUrls: ['./check-list-view-answer.component.scss']
})
export class CheckListViewAnswerComponent implements OnInit {
  @Input('source') viewAnswerPopupSource : any;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  AppStore = AppStore;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    frequency : null
  };

  constructor(_eventEmitterService : EventEmitterService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _documentFileService: DocumentFileService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _auditService : AuditCheckListService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    //console.log(this.viewAnswerPopupSource.value?.checklist?.language[0]?.pivot?.title);
  }

  viewCheckListDocument( type, docuDetails ,id,documentFile) {
    switch (type) {
      case "audit-check-list":
    this._auditService.getCheckListPreview(docuDetails,id).subscribe(res=>{
      var resp: any = this._utilityService.getDownLoadLink(
        res,
        docuDetails.name
      );
      this.openPreviewModal(type, resp, documentFile, docuDetails, id );
    }),
    (error) => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage(
          "Error",
          "permission_denied"
        );
      } else {
        this._utilityService.showErrorMessage(
          "Error",
          "unable_generate_preview"
        );
      }
    };
    break;
    case "document-version":
      this._documentFileService
        .getFilePreview(type, docuDetails.document_id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            docuDetails.title
          );
          this.openPreviewModal(type, resp, documentFile, docuDetails,id);
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

  openPreviewModal(type,filePreview, documentFiles, document , id) {
    this.previewObject.component = type
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.frequency = id

      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }

  }

  *// Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._auditService.getThumbnailPreview(type, token)
  }

   // Returns image url according to type and token
   createImageUrl(type, token) {
    return this._auditService.getThumbnailPreview(type, token);
  }

    // extension check function
checkExtension(ext, extType) {

return this._imageService.checkFileExtensions(ext, extType)

}

downloCheckListDocument(type, kpiDocument, docs, frequencyId) {
event.stopPropagation();
switch (type) {
case "audit-check-list":
  this._auditService.downloadFile(
    frequencyId,
    "audit-check-list",
    kpiDocument.id,
    null,
    kpiDocument.title,
    kpiDocument
  );
  break;
  case "document-version":
    this._documentFileService.downloadFile(
      type,
      kpiDocument.document_id,
      docs.id,
      null,
      document.title,
      docs
    );
    break;

}

}

  getEmployeePopupDetails(users, created?: string) { //user popup
      
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

}
