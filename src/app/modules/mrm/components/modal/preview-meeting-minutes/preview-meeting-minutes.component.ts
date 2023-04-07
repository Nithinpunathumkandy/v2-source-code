import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
declare var $: any;
@Component({
  selector: 'app-preview-meeting-minutes',
  templateUrl: './preview-meeting-minutes.component.html',
  styleUrls: ['./preview-meeting-minutes.component.scss']
})
export class PreviewMeetingMinutesComponent implements OnInit,OnDestroy {
  @Input('source') source: any;
  MOMAgenda:any=null;
  MOMTitle:any=null;
  MeetingsStore=MeetingsStore;
  actionPlanMapSubscription:any;
  AppStore=AppStore;
  mappingActionPlanObject = {
    id : null,
    type : null,
    values : null,
  };
  detailsActionPlanObject={
    id : null,
    type : null,
    values : null,
  }
  @ViewChild("mapActionPlan") mapActionPlan: ElementRef;
  @ViewChild("detailsMapActionPlan") detailsMapActionPlan: ElementRef;
  detailsActionPlanMapSubscription:any;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _meetingsService:MeetingsService
    ) { }

  ngOnInit(): void {
    this.actionPlanMapSubscription=this._eventEmitterService.mapActionPlanModal.subscribe(res=>{
      this.closeActionPlanMaping()
    })
    this.detailsActionPlanMapSubscription=this._eventEmitterService.detailsMapActionPlanModal.subscribe(res=>{
      this.closeDetailsActionPlanMaping()
    })
  }
  checkButtonCondition()
  {
    this.MOMTitle='';
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  cancel()
  {
    MeetingsStore.clearMappedActionPlan();
    this.actionPlanMapSubscription.unsubscribe();
    this.detailsActionPlanMapSubscription.unsubscribe();
    this._eventEmitterService.dismissDetailsActionPlanMappingPreviewModal();
  }

  checkSameMeetingAgend(agenda,mom)
  { 
    let valid=true; 
    let index=MeetingsStore.mappedActionPlan.findIndex(e=>(e.description==mom && e.meeting_plan_meeting_agenda_id==agenda.id ));
    if(index!=-1)
    {
      valid=false;
    }
    return valid;
  }
  removeMOM(position,MOMData){
    MeetingsStore.mappedActionPlan.splice(position, 1)
    this._utilityService.showSuccessMessage('success','mom_removed')
  }
  addMOMPlannedMeeting(agenda,title)
  {
    if(this.checkSameMeetingAgend(agenda,title))
    {
      MeetingsStore.setActionPlan({
        title:agenda.title,
        description:title,
        meeting_minutes:[],
        is_new:true,
        agendaDetails:agenda,
        action_plan:[],
        meeting_plan_meeting_agenda_id:agenda.id
      });
    }
    else
    {
      this._utilityService.showWarningMessage('warning','Can not add same agenda and mom')
    }
    
  }
  openMeetingAtionPlan(agenda,title)
  {
    if(this.checkSameMeetingAgend(agenda,title))
    {
      MeetingsStore.setActionPlan({
        title:agenda.title,
        description:title,
        meeting_minutes:[],
        is_new:true,
        agendaDetails:agenda,
        action_plan:[],
        meeting_plan_meeting_agenda_id:agenda.id
      });
    }
   
    this.mappingActionPlanObject.type = 'Add';
    this.mappingActionPlanObject.values = {agenda:agenda,description:title};
    setTimeout(() => {
      $(this.mapActionPlan.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.mapActionPlan.nativeElement,'display','block');
    this._renderer2.setStyle(this.mapActionPlan.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.mapActionPlan.nativeElement,'z-index',99999);
  }

  closeActionPlanMaping()
  {
    setTimeout(() => {
      this.mappingActionPlanObject.type = null;
      this.mappingActionPlanObject.values = null;
      $(this.mapActionPlan.nativeElement).modal('hide');
      this._renderer2.removeClass(this.mapActionPlan.nativeElement,'show');
      this._renderer2.setStyle(this.mapActionPlan.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  openDetailsMeetingAtionPlan(agenda)
  {
    this.detailsActionPlanObject.type = 'details_from_add';
    this.detailsActionPlanObject.values = {data:agenda,id:agenda.meeting_plan_meeting_agenda_id,description:agenda.description};
    setTimeout(() => {
      $(this.detailsMapActionPlan.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.detailsMapActionPlan.nativeElement,'display','block');
    this._renderer2.setStyle(this.detailsMapActionPlan.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.detailsMapActionPlan.nativeElement,'z-index',99999);
  }

  closeDetailsActionPlanMaping()
  {
    setTimeout(() => {
      this.detailsActionPlanObject.type = null;
      this.detailsActionPlanObject.values = null;
      $(this.detailsMapActionPlan.nativeElement).modal('hide');
      this._renderer2.removeClass(this.detailsMapActionPlan.nativeElement,'show');
      this._renderer2.setStyle(this.detailsMapActionPlan.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  save(val)
  {
    AppStore.enableLoading();
    const payload={
      meeting_minutes:MeetingsStore.mappedActionPlan.length > 0?this.getProcessedDataActionPlan(MeetingsStore.mappedActionPlan):[],
    }
    let save;
      save = this._meetingsService.addMOM(payload);
    save.subscribe(res => {
      AppStore.disableLoading();
      if (val) this.cancel();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        //this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getProcessedDataActionPlan(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(
        {
          meeting_plan_meeting_agenda_id:i.meeting_plan_meeting_agenda_id,
          title:i.description,
          is_new:true,
          meeting_minutes:[],
          action_plan:this.getActionPlanData(i.action_plan)
        }
      )
    }
    return item;
  }
  getActionPlanData(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push({title:i.title,description:i.description,responsible_user_id:i.responsible_user_id.id,
        target_date:this._helperService.processDate(i.target_date, 'join'),
        start_date:this._helperService.processDate(i.start_date, 'join')
      })
    }
    return item;
  }

  ngOnDestroy(): void {
    this.actionPlanMapSubscription.unsubscribe();
    this.detailsActionPlanMapSubscription.unsubscribe();
  }


}
