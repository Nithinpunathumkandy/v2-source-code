import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileServiceService } from 'src/app/core/services/ms-audit-management/file-service/file-service.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditCorrectiveActionStore } from 'src/app/stores/ms-audit-management/corrective-acction/corrective-action.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-history-corrective-action-modal-ms-audit',
  templateUrl: './history-corrective-action-modal-ms-audit.component.html',
  styleUrls: ['./history-corrective-action-modal-ms-audit.component.scss']
})
export class HistoryCorrectiveActionModalMsAuditComponent implements OnInit {

  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;

  AuditCorrectiveActionStore = AuditCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "common_nodata_title";

   previewObject = {
    file_id:null,
    update_id:null,
    ca_id:null,
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }

  constructor(
    private _imageService: ImageServiceService,
    private  _followUpService : FollowUpService,
    private _utilityService: UtilityService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _fileServiceService: FileServiceService

  ) { }
  ngOnInit(): void {
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  closeHistoryModal() {
    this._eventEmitterService.dismissExternalAuditCaHistoryModal();
  }
  historyPageChange(newPage: number = null) {
    if (newPage) AuditCorrectiveActionStore.setHistoryCurrentPage(newPage);
    this._followUpService.caHistory(AuditCorrectiveActionStore.correctiveActionDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  labelDot(data) {
    let str = data;
    let color = "";
    const myArr = str.split("-");
    color = myArr[0];
    return color;
  }

  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'corrective-action-history') {
     return this._fileServiceService.getThumbnailPreview(type, token)
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  viewDocument(document, history) {
    this._fileServiceService
          .getFilePreview('corrective-action-history', AuditCorrectiveActionStore.correctiveActionDetails?.id, document.id,history.id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, document.title);
      this.openPreviewModal(resp, document,history);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'Permission Denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
      }
    });
  }

  downloadDocument(id, filename, file_id?, doc?) {

    if (file_id) {
      this._fileServiceService.downloadFile('corrective-action-history', AuditCorrectiveActionStore.correctiveActionDetails?.id, file_id, id, filename, doc);
    }

  }

  openPreviewModal(filePreview, itemDetails,history?) {
    let uploadedUser={
      first_name:history.created_by_first_name,
      last_name:history.created_by_last_name,
      designation:history.created_by_designation,
      image:{
        token:itemDetails.token
      }
    }

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'corrective-action-history';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = uploadedUser,
    this.previewObject.ca_id = this.AuditCorrectiveActionStore.correctiveActionDetails.id
    this.previewObject.update_id = itemDetails.ms_audit_finding_corrective_action_update_id;
    this.previewObject.file_id = itemDetails.id;
    // this.previewObject.uploaded_user['image_token'] = ExternalAuditCorrectiveActionStore.correctiveActionDetails?.created_by?.image?.token;
    this.previewObject.created_at = itemDetails?.created_at;
    setTimeout(() => {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 9999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
      $(this.filePreviewModal.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);

  }

  closePreviewModal(event) {
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 99);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'none');
    // this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 999999);
    // this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'auto');
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';

  }

}
