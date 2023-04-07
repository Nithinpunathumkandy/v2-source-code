import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProjectWorkflowService } from 'src/app/core/services/project-monitoring/project-workflow/project-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ProjectWorkflowStore } from 'src/app/stores/project-monitoring/project-workflow.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-project-workflow-history',
  templateUrl: './project-workflow-history.component.html',
  styleUrls: ['./project-workflow-history.component.scss']
})
export class ProjectWorkflowHistoryComponent implements OnInit {
  @ViewChild('commetForm', {static: true}) commetForm: ElementRef;

  commentsObject = {
    id : null,
    type : null,
    value : null
  }

  ProjectWorkflowStore = ProjectWorkflowStore;
  ProjectMonitoringStore = ProjectMonitoringStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"
  projectCommentsEventSubscrion: any;
  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _projectWorkflowService:ProjectWorkflowService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _renderer2: Renderer2,) { }

  ngOnInit(): void {
    this.projectCommentsEventSubscrion = this._eventEmitterService.ProjectMonitorHistoryComments.subscribe(item => {
      this.closeCommentsModal()
    })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectWorkflowStore.setCurrentPage(newPage);
    this._projectWorkflowService.getHistory(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });

  }

  closeWorkflowHistory(){
    this._eventEmitterService.dismissProjectMonitorHistoryModal();
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

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  openCommentsModal(comments){
    this.commentsObject.type = "Add"
    this.commentsObject.value = comments
    setTimeout(() => {
      $(this.commetForm.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.commetForm.nativeElement,'show');
    this._renderer2.setStyle(this.commetForm.nativeElement,'display','block');
    this._renderer2.setStyle(this.commetForm.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.commetForm.nativeElement,'z-index',99999);
  }

  closeCommentsModal(){
 
    setTimeout(() => {
      // $(this.outComes.nativeElement).modal('hide');
      this.commentsObject.type = null;
      this.commentsObject.value = null;
      $(this.commetForm.nativeElement).modal('hide');
      this._renderer2.removeClass(this.commetForm.nativeElement,'show');
      this._renderer2.setStyle(this.commetForm.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }


  ngOnDestroy() {
    // documentWorkFlowStore.unsetWorkflowHistory();
  }
}
