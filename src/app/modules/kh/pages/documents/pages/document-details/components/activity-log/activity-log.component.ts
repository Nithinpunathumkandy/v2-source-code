import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WorkFlowStore } from 'src/app/stores/knowledge-hub/work-flow/workFlow.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

  emptyActivityLog:string="kh_no_activity_log"

  AppStore = AppStore
  WorkFlowStore = WorkFlowStore
  DocumentsStore = DocumentsStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _workFlowService: WorkflowService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
  ) { }

  ngOnInit(): void {
    this.getActivity(1)
  }

  getActivity(newPage:number=null) {
    if(newPage) WorkFlowStore.setCurrentActivityLogPage(newPage)
    this._workFlowService.getActivity(DocumentsStore.documentId,false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  cancel() {
    this.close();
  }

  close() {
    this._eventEmitterService.dismissWorkflowActivityLog()
    this._eventEmitterService.setModalStyle()
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  ngOnDestroy(){
    WorkFlowStore.unsetActivityLog()
  }

}
