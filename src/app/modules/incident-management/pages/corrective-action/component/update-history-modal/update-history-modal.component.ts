import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { IncidentCorrectiveActionService } from 'src/app/core/services/incident-management/incident-corrective-action/incident-corrective-action.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-update-history-modal',
  templateUrl: './update-history-modal.component.html',
  styleUrls: ['./update-history-modal.component.scss']
})
export class UpdateHistoryModalComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  IncidentCorrectiveActionStore = IncidentCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  previewObject = {
    file_details: null,
    component: '',
    componentId : null,
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }
  historyEmptyList = "Looks like there are no updates recorded in this corrective action";

  constructor(    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _sanitizer: DomSanitizer,
    private _renderer2: Renderer2, private _correctiveActionService : IncidentCorrectiveActionService,
    private _humanCapitalService: HumanCapitalService,private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,


    ) { }

  ngOnInit(): void {
  }

  cancel(){
   this._eventEmitterService.dismissHistoryModalControl();
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(type, token) {
    if (type == 'document') {
      return this._correctiveActionService.getThumbnailPreview('incident-correctiveaction', token);
    }

    if (type == 'user') {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

  }

  viewDocument(document, history_id) {
    this._correctiveActionService.getFilePreview('incident_corrective_action', IncidentCorrectiveActionStore.IncidentCAList.id, history_id, document.id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, document.title);
      this.openPreviewModal(resp, document);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'Permission Denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
      }
    });
  }

    /**
   * Returns whether file extension is of imgage, pdf, document or etc..
   * @param ext File extension
   * @param extType Type - image,pdf,doc etc..
   */
     checkExtension(ext, extType) {
      var res = this._imageService.checkFileExtensions(ext, extType);
      return res;
    }

  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, itemDetails) {

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'incident_corrective_action';
    this.previewObject.file_details = itemDetails;
    this.previewObject.componentId = IncidentCorrectiveActionStore.IncidentCAList.id;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = IncidentCorrectiveActionStore?.IncidentCAList?.created_by;
    this.previewObject.uploaded_user['image_token'] = IncidentCorrectiveActionStore?.IncidentCAList?.created_by?.image?.token;
    this.previewObject.created_at = IncidentCorrectiveActionStore?.IncidentCAList?.created_at;
    setTimeout(() => {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 9999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
      $(this.filePreviewModal.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);

  }

  closePreviewModal(event) {
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'none');
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';

  }

  downloadDocument(id, filename, file_id?, doc?) {

    if (file_id) {
      this._correctiveActionService.downloadFile('incident_corrective_action', IncidentCorrectiveActionStore.IncidentCAList.id, id, filename, file_id, doc);
    }

  }

}
