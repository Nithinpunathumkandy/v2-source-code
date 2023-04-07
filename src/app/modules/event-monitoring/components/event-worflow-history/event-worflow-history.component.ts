import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { EventCrWorkflowService } from 'src/app/core/services/event-monitoring/event-cr-workflow/event-cr-workflow.service';
import { EventWorkflowService } from 'src/app/core/services/event-monitoring/event-workflow/event-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventWorkflowStore } from 'src/app/stores/event-monitoring/event-workflow/event-workflow-store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { EventChangeRequestWorkflowStore } from 'src/app/stores/event-monitoring/events/event-cr-workflow-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-event-worflow-history',
  templateUrl: './event-worflow-history.component.html',
  styleUrls: ['./event-worflow-history.component.scss']
})
export class EventWorflowHistoryComponent implements OnInit {
  @ViewChild('commetForm', {static: true}) commetForm: ElementRef;

  commentsObject = {
    id : null,
    type : null,
    value : null
  }
  EventChangeRequestWorkflowStore = EventChangeRequestWorkflowStore;
  EventWorkflowStore = EventWorkflowStore;
  EventsStore = EventsStore;
  EventChangeRequestStore = EventChangeRequestStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"
  eventCommentsEventSubscrion: any;
  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _eventWorkflowService: EventWorkflowService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _renderer2: Renderer2, private _router: Router,
    private _changeRequestWorkflowService: EventCrWorkflowService) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    let urlItem = this.checkUrl();
    let subscribeItem = this._eventWorkflowService.getHistory(EventsStore.selectedEventId);
    if(urlItem == 'cr'){
      if (newPage) EventChangeRequestWorkflowStore.workflowHistoryPage = newPage;
      subscribeItem = this._changeRequestWorkflowService.getWorkflowHistory(EventChangeRequestStore.selectedCRId);
    }
    else{
      if (newPage) EventWorkflowStore.setCurrentPage(newPage);
    }
    subscribeItem.subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });

  }

  closeWorkflowHistory(){
    this._eventEmitterService.dismissEventMonitorHistoryModal();
  }

  
  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

 
  checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.

    if(workflow.workflow_status_id==null){
      className=className+' '+'approved';
    }
    
    switch (workflow.workflow_status_id) {

      case 5:
        
          className = className+' '+'approved '
        
        break;
      
      case 4:
        
          className = className+' '+'rejected '
        
        break;
      
      // case 1: 
        
      //     className = className+' '+'pending'
        
      //   break;
       
        case 3: 
        
        className = className+' '+'reverted'
      
        break;
      
      default:
        break;
      }
    


    return className

    

  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  checkUrl(){
    let url = this._router.url;
    if(url.indexOf('change-request') != -1){
      return 'cr'
    }else{
      return 'event'
    }
  }
}
