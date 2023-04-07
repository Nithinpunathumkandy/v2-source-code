import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventLessonLearntCaService } from 'src/app/core/services/event-monitoring/event-lesson-learnt-ca/event-lesson-learnt-ca.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LessonLearntCaStore } from 'src/app/stores/event-monitoring/events/event-lesson-learnt-ca-store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-update-ca-history-modal',
  templateUrl: './update-ca-history-modal.component.html',
  styleUrls: ['./update-ca-history-modal.component.scss']
})
export class UpdateCaHistoryModalComponent implements OnInit {

  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  IncidentCorrectiveActionStore = IncidentCorrectiveActionStore;
  LessonLearntCaStore = LessonLearntCaStore;
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

  historyEmptyList = "'no_corrective_action_update_history_title'| translate";

  constructor(    
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _sanitizer: DomSanitizer,
    private _renderer2: Renderer2, 
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _eventLessonLearntCaService: EventLessonLearntCaService
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
      return this._eventLessonLearntCaService.getThumbnailPreview('corrective-action-history', token);
    }

    if (type == 'user') {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

  }

  viewDocument(document, history_id) {
    console.log(document, history_id)
    this._eventLessonLearntCaService.getFilePreview('corrective-action-history', LessonLearntCaStore.LessonLearntCaId, history_id, document.id).subscribe(res => {
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

     checkExtension(ext, extType) {
      var res = this._imageService.checkFileExtensions(ext, extType);
      return res;
    }

  openPreviewModal(filePreview, itemDetails) {
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'corrective-action-history';
    this.previewObject.file_details = itemDetails;
    this.previewObject.componentId = LessonLearntCaStore.LessonLearntCaId;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.frequency = LessonLearntCaStore.LessonLearntCaId;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = LessonLearntCaStore?.correctiveActionDetails?.created_by;
    this.previewObject.uploaded_user['image_token'] = LessonLearntCaStore?.correctiveActionDetails?.created_by?.image?.token;
    this.previewObject.created_at = LessonLearntCaStore?.correctiveActionDetails?.created_at;
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
      this._eventLessonLearntCaService.downloadHistoryFile('corrective-action-history', LessonLearntCaStore.LessonLearntCaId, doc?.event_lesson_learned_corrective_action_status_id, filename, file_id, doc);
    }

  }

}
