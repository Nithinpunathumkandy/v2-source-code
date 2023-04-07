import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { EventClosureMainStore } from 'src/app/stores/event-monitoring/event-closure-main-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventClosureEventDetailsService } from 'src/app/core/services/event-monitoring/event-closure-event-details/event-closure-event-details.service';

@Component({
  selector: 'app-event-closure-workflow-history',
  templateUrl: './event-closure-workflow-history.component.html',
  styleUrls: ['./event-closure-workflow-history.component.scss']
})
export class EventClosureWorkflowHistoryComponent implements OnInit, OnDestroy {

  WorkflowEmptyMessage = "empty_workflow_title"
  emptyMessage = "no_data_found";
  EventClosureMainStore = EventClosureMainStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _eventClosureService: EventClosureEventDetailsService,
    private _documentFileService: DocumentFileService,

  ) { }

  ngOnInit(): void {
    this.pageChange(1)
    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any workflow history to display here!" });
  }

  pageChange(newPage: number = null) {
    EventClosureMainStore.currentWorkflowPage = newPage
    this._eventClosureService.getHistory(EventClosureMainStore.closureId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  closeHistory() {
    this._eventEmitterService.dismissClosureWorkflowHistory();
  }

  checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    switch (workflow.workflow_status_id) {
      case 5:
        className = className + ' ' + 'approved '
        break;

      case 4:
        className = className + ' ' + 'rejected '
        break;

      case 1:
        className = className + ' ' + 'pending'
        break;

      case 3:
        className = className + ' ' + 'reverted'
        break;

      default:
        break;
    }

    return className
  }

  createImageUrl(type, token, h?, w?) {
    return this._documentFileService.getThumbnailPreview(type, token, h, w);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    EventClosureMainStore.unsetWorkflowHistory();
  }

}
