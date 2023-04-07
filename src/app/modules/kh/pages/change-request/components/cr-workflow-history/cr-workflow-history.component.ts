import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ChangeRequestWorkflowService } from 'src/app/core/services/knowledge-hub/change-request/change-request-workflow.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DocumentWorkflowService } from 'src/app/core/services/knowledge-hub/documents/document-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';

@Component({
  selector: 'app-cr-workflow-history',
  templateUrl: './cr-workflow-history.component.html',
  styleUrls: ['./cr-workflow-history.component.scss']
})
export class CrWorkflowHistoryComponent implements OnInit {

  DocumentsStore = DocumentsStore
  changeRequestStore = changeRequestStore
  DocumentWorkflowStore = documentWorkFlowStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _documentWorkflowService: DocumentWorkflowService,
    private _utilityService: UtilityService,
    private _changeRequestWorkflowService: ChangeRequestWorkflowService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    this.getWorkflowHistory()
    NoDataItemStore.setNoDataItems({title: "Looks like we don't have any workflow history to display here!"});
  }

  getWorkflowHistory() {    
      this._changeRequestWorkflowService.getWorkflowHistoryNew().subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })    
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  closeHistory() {
    this._eventEmitterService.dismissCRWorkflowHistory();
  }

  createImageUrl(type, token, h?, w?) {
    return this._documentFileService.getThumbnailPreview(type,token,h,w);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.


    
    switch (workflow.workflow_status_id) {

      case 5:
        
          className = className+' '+'approved '
        
        break;
      
      case 4:
        
          className = className+' '+'rejected '
        
        break;
      
      case 1: 
        
          className = className+' '+'pending'
        
        break;
       
        case 3: 
        
        className = className+' '+'reverted'
      
        break;
      
      default:
        break;
      }
    


    return className
  }

  ngOnDestroy() {
    documentWorkFlowStore.unsetWorkflowHistory();
  }

}
