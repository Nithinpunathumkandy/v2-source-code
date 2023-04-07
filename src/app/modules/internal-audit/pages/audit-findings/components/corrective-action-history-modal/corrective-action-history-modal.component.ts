import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { CorrectiveActionService } from 'src/app/core/services/internal-audit/audit-findings/corrective-action/corrective-action.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { CorrectiveActionsStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-corrective-action-history-modal',
  templateUrl: './corrective-action-history-modal.component.html',
  styleUrls: ['./corrective-action-history-modal.component.scss']
})
export class CorrectiveActionHistoryModalComponent implements OnInit {
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  AuthStore = AuthStore;

  CorrectiveActionsStore = CorrectiveActionsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "common_nodata_title";

  previewObject = {
    ca_id: null,
    file_id:null,
    update_id:null,
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
    // private _correctiveActionService: ExternalAuditCorrectiveActionsService,
    private _correctiveActionService: CorrectiveActionService,
    private _utilityService: UtilityService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _internalAuditFileService: InternalAuditFileService,

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
    if (newPage) CorrectiveActionsStore.setHistoryCurrentPage(newPage);
    this._correctiveActionService.getCaHistory(CorrectiveActionsStore.correctiveActionDetails?.id).subscribe(res => {
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
      return this._internalAuditFileService.getThumbnailPreview(type, token)
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  viewDocument(document, history) {
    this._internalAuditFileService
      .getFilePreview('corrective-action-history', CorrectiveActionsStore.correctiveActionDetails?.id, history.id, document.id).subscribe(res => {
        var resp: any = this._utilityService.getDownLoadLink(res, document.title);
        this.openPreviewModal(resp, document, history);
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
      this._internalAuditFileService.downloadFile('corrective-action-history', CorrectiveActionsStore.correctiveActionDetails?.id, id, file_id, filename, doc);
    }

  }
  openPreviewModal(filePreview, itemDetails, history?) {
    let uploadedUser = {
      first_name: history.created_by_first_name,
      last_name: history.created_by_last_name,
      designation: history.created_by_designation,
      image: {
        token: itemDetails.token
      }
    }

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'corrective-action-history';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = uploadedUser;
    this.previewObject.ca_id = this.CorrectiveActionsStore.correctiveActionDetails.id
    this.previewObject.update_id = itemDetails.finding_corrective_action_update_id;
    this.previewObject.file_id = itemDetails.id;
    
      // this.previewObject.uploaded_user['image_token'] = CorrectiveActionsStore.correctiveActionDetails?.created_by?.image?.token;
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
