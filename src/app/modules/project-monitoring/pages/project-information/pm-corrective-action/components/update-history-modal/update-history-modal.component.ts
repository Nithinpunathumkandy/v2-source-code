import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProjectIssueCaService } from 'src/app/core/services/project-monitoring/project-ca/project-issue-ca.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { CaStore } from 'src/app/stores/project-monitoring/project-issue-ca-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-update-history-modal',
  templateUrl: './update-history-modal.component.html'
})
export class UpdateHistoryModalComponent implements OnInit {

  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  IncidentCorrectiveActionStore = IncidentCorrectiveActionStore;
  CaStore = CaStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  previewObject = {
    file_details: null,
    component: '',
    componentId : null,
    preview_url: null,
    frequency: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }

  historyEmptyList = "Looks like there are no updates recorded in this corrective action";

  constructor(    
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _sanitizer: DomSanitizer,
    private _renderer2: Renderer2, 
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _projectIssueCaService: ProjectIssueCaService
    ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof UpdateHistoryModalComponent
   */
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
      return this._projectIssueCaService.getThumbnailPreview('corrective-action-history', token);
    }

    if (type == 'user') {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

  }

  viewDocument(document, history_id) {
    console.log(document, history_id)
    this._projectIssueCaService.getFilePreview('corrective-action-history', CaStore.ProjectIssueCaId, history_id, document.id).subscribe(res => {
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
    this.previewObject.component = 'corrective-action-history';
    this.previewObject.file_details = itemDetails;
    this.previewObject.componentId = CaStore.ProjectIssueCaId;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.frequency = CaStore.ProjectIssueCaId;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = CaStore?.correctiveActionDetails?.created_by;
    this.previewObject.uploaded_user['image_token'] = CaStore?.correctiveActionDetails?.created_by?.image?.token;
    this.previewObject.created_at = CaStore?.correctiveActionDetails?.created_at;
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
      this._projectIssueCaService.downloadHistoryFile('corrective-action-history', CaStore.ProjectIssueCaId, doc?.project_issue_corrective_action_update_id, filename, file_id, doc);
    }

  }

}
