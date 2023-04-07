import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventTaskStore } from 'src/app/stores/event-monitoring/events/event-task.store';
import { TaskHistoryStore } from 'src/app/stores/event-monitoring/events/event-task-history-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventTaskService } from 'src/app/core/services/event-monitoring/events/event-task/event-task.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';

declare var $: any;
@Component({
  selector: 'app-event-task-history',
  templateUrl: './event-task-history.component.html',
  styleUrls: ['./event-task-history.component.scss']
})
export class EventTaskHistoryComponent implements OnInit {

  @Input('source') source
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  EventTaskStore = EventTaskStore
  TaskHistoryStore = TaskHistoryStore;
  IncidentCorrectiveActionStore = IncidentCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  previewObject = {
    file_details: null,
    component: '',
    componentId: null,
    preview_url: null,
    frequency: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }

  historyEmptyList = "event_task_history_no_data";

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _eventTaskService: EventTaskService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _eventFileService: EventFileServiceService,
  ) { }

  ngOnInit(): void {
    this.getHistory()
  }

  getHistory() {
    this._eventTaskService.getHistory(this.source.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  cancel() {
    this._eventEmitterService.dismissHistoryModalControl();
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(type, token) {
    if (type == 'document') {
      return this._eventFileService.getThumbnailPreview('event-task-update', token);
    }

    if (type == 'user') {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }

  viewDocument(document, history_id, taskId) {
    this._eventFileService.getFilePreview('event-task-update', EventsStore.selectedEventId, taskId, history_id, document).subscribe(res => {
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
    this.previewObject.component = 'event-task-update';
    this.previewObject.file_details = itemDetails;
    this.previewObject.componentId = EventTaskStore.taskId;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.frequency = EventTaskStore.taskId;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = EventTaskStore?.IndividualEventTaskDetails?.created_by;
    this.previewObject.uploaded_user['image_token'] = EventTaskStore?.IndividualEventTaskDetails?.created_by?.image?.token;
    this.previewObject.created_at = EventTaskStore?.IndividualEventTaskDetails?.created_at;
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
      this._eventFileService.downloadFile('event-task-update', EventsStore.selectedEventId, id, doc?.id, file_id, doc);
    }
  }

}