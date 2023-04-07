import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EventCrWorkflowService } from 'src/app/core/services/event-monitoring/event-cr-workflow/event-cr-workflow.service';
import { EventWorkflowService } from 'src/app/core/services/event-monitoring/event-workflow/event-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventWorkflowStore } from 'src/app/stores/event-monitoring/event-workflow/event-workflow-store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

@Component({
  selector: 'app-add-event-workflow-comment',
  templateUrl: './add-event-workflow-comment.component.html',
  styleUrls: ['./add-event-workflow-comment.component.scss']
})
export class AddEventWorkflowCommentComponent implements OnInit {

  EventsStore = EventsStore;
  EventWorkflowStore = EventWorkflowStore;
  AppStore = AppStore;
  title: string;
  comments: string
  form: FormGroup;
  formErrors: any;
  levelArray=[];
  level:number;
  body: string = '';

  constructor(
    private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _eventWorkflowService : EventWorkflowService,
    private _router: Router, private _crWorkflowService: EventCrWorkflowService
  ) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }

  setTitle() {
    if(EventWorkflowStore.type == 'revert'){
      this.title =  'Send back'
      this.body = 'You can select changes required areas along with the comments and send them back to the user'
  
    }else if (EventWorkflowStore.type == 'submit'){
      this.title =  'Approve'; 
      this.body = 'Approval describes gaining the customers or contractees acceptance at the end of a event by successfully delivering goods and services that meet the requirements that were set at the beginning of the event.'
  
    }else if(EventWorkflowStore.type == 'reject'){
      this.body= 'The event is  failed to receive that approval.'
      this.title =  EventWorkflowStore.type; 
    }
    else {
      this.title =  EventWorkflowStore.type; 
      this.body = 'Approval describes gaining the customers or contractees acceptance at the end of a event by successfully delivering goods and services that meet the requirements that were set at the beginning of the event.'
  
    }
    }
  
    setLevel(){
      this.levelArray=[];
      this.levelArray.push(0);
      let urlItem = this.checkUrl();
      let workflowItems:any = EventsStore?.eventDetails;
      if(urlItem == 'cr') workflowItems = EventChangeRequestStore.individualChangeRequestItem;
        for(let i of workflowItems?.workflow_items){
          if(i.level < workflowItems?.next_review_user_level)
          this.levelArray.push(i.level);
        }
    }
  
    getButtonText(text) {  
      return this._helperService.translateToUserLanguage(text);
    }
  
    
  
    save(close: boolean = false) {
      let urlItem = this.checkUrl();
      let save;
      AppStore.enableLoading();
  
      let comment = {
        comment: this.comments
      }
  
      switch (EventWorkflowStore.type) {
  
        case 'approve':
          let comment = {
            comment: this.comments,
            // status_title : EventWorkflowStore.type
          }
          save = this._eventWorkflowService.approveEvent(EventsStore.selectedEventId,comment);
          if(urlItem == 'cr') save = this._crWorkflowService.approveWorkflow(EventChangeRequestStore.selectedCRId,comment);
          break;
          case 'submit':
            let submitComment = {
              comment: this.comments,
              // status_title : EventWorkflowStore.type
  
            }
            save = this._eventWorkflowService.approveEvent(EventsStore.selectedEventId,submitComment);
            if(urlItem == 'cr') save = this._crWorkflowService.approveWorkflow(EventChangeRequestStore.selectedCRId,submitComment);
            break;
  
        case 'revert':
          let data = {
            comment: this.comments,
            status_title : EventWorkflowStore.type,
            revert_to_level:this.level
          }
          save = this._eventWorkflowService.revertEvent(EventsStore.selectedEventId,data);
          if(urlItem == 'cr') save = this._crWorkflowService.revertWorkflow(EventChangeRequestStore.selectedCRId,data);
          break;
  
          case 'reject':
          let rejectdata = {
            comment: this.comments,
            status_title : EventWorkflowStore.type,
            // revert_to_level:this.level
          }
          save = this._eventWorkflowService.rejectEvent(EventsStore.selectedEventId,rejectdata);
          if(urlItem == 'cr') save = this._crWorkflowService.rejectWorkflow(EventChangeRequestStore.selectedCRId,rejectdata);
          break;
  
        default:
          break;
      }
  
      save.subscribe(
        (res: any) => {
          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        },
        (err: HttpErrorResponse) => {
          // AppStore.disableLoading();
          //   this._utilityService.showErrorMessage(
          //     "Error!",
          //     "Something went wrong. Please try again."
          //   );
          // this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error;
            // this.processFormErrors()
          } else {
            this._utilityService.showErrorMessage(
              "Error!",
              "Something went wrong. Please try again."
            );
            this._utilityService.detectChanges(this._cdr);
          }
        }
      );
  
    }
  
    cancel() {
      this.closeFormModal();
    }
  
    closeFormModal() {
      AppStore.disableLoading();
      this.level=null;
      this.comments = null;
      this._eventEmitterService.dismissEventApproveCommentModal()
    }

    checkUrl(){
      let url = this._router.url;
      if(url.indexOf('change-request') != -1){
        return 'cr'
      }else{
        return 'event'
      }
    }
  
    ngOnDestroy() {
      this.level=null;
      this.formErrors = null;
      this.comments = null;
    }

}
