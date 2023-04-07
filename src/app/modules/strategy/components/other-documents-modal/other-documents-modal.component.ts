import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any;


@Component({
  selector: 'app-other-documents-modal',
  templateUrl: './other-documents-modal.component.html',
  styleUrls: ['./other-documents-modal.component.scss']
})
export class OtherDocumentsModalComponent implements OnInit {
  @Input('source') otherDocumentsData: any;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  AuthStore = AuthStore;
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

  constructor(private _eventEmitterService: EventEmitterService,private _reviewService : StrategyReviewService,
    private _sanitizer: DomSanitizer, private _cdr: ChangeDetectorRef,private _utilityService: UtilityService,private _documentFileService: DocumentFileService,) { }

  ngOnInit(): void {
  }

  createImageUrl(type, token) {
    return this._reviewService.getThumbnailPreview(type, token);
  }

  cancel(){
    this._eventEmitterService.dissmissOtherDocumentModal()
  }

  getToken(doc){
    let token = null
    if(doc.kh_document){
      doc.kh_document.versions.map(data=>{
        if(data.is_latest){
          token = data
        }
      })
    }
    return token
  }

  
  viewIncidentDocument( type, docuDetails ,frequencyId,documentFile) {
    switch (type) {
      case "kpi-document":
    this._reviewService.getFilePreview(docuDetails,frequencyId).subscribe(res=>{
      var resp: any = this._utilityService.getDownLoadLink(
        res,
        docuDetails.name
      );
      this.openPreviewModal(type, resp, documentFile, docuDetails, frequencyId );
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
          this.openPreviewModal(type, resp, documentFile, docuDetails,frequencyId);
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

  openPreviewModal(type,filePreview, documentFiles, document , frequencyId) {
    this.previewObject.component=type
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.frequency = frequencyId

      
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

}
