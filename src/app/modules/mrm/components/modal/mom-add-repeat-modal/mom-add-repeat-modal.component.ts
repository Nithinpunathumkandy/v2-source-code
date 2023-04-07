import { Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';

@Component({
  selector: 'app-mom-add-repeat-modal',
  templateUrl: './mom-add-repeat-modal.component.html',
  styleUrls: ['./mom-add-repeat-modal.component.scss']
})
export class MomAddRepeatModalComponent implements OnInit {

  @Input('details') items: any;
  @Input('meetingMomTab') meetingMomTab: boolean=false;
 
  MeetingsStore=MeetingsStore;
  
  constructor(
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService,
    private _meetingsService:MeetingsService,
    private _eventEmitterService: EventEmitterService,
    ) { }

  ngOnInit(): void {
  }

  addMinutesClicked(meetingItem){
    
    MeetingsStore.selectedMeeting = meetingItem;
    this._utilityService.detectChanges(this._cdr);
  }

  addToMeetingAgenda(meetingItem){
    if(meetingItem && meetingItem.text_box_value){
      if(MeetingsStore.updateItem){
        
        //meeting detials tab only 
        if(this.meetingMomTab){
          this.saveMom(MeetingsStore.updateItem.id,{title:meetingItem['text_box_value'],parent_minute_id:meetingItem['id']});
        }

        MeetingsStore.updateItem.title = meetingItem.text_box_value;
        var resp = this.findObjectAndUpdate(MeetingsStore.newMeetingsMom,MeetingsStore.updateItem, MeetingsStore.selectedMeeting);
      }
      else{
        //meeting detials tab only
        if(this.meetingMomTab){
          
          this.saveMom(null,{title:meetingItem['text_box_value'],parent_minute_id:meetingItem['id']});
        }

        let itemToPush = { title : meetingItem.text_box_value, meeting_minutes:[], id: Date.now(), class: 'ml-4', text_box_value: null};
        var res = this.findObjectAndPush(MeetingsStore.newMeetingsMom,meetingItem,itemToPush);
      }
     
      this._utilityService.detectChanges(this._cdr);
    }
  }

  cancelAgenda(data?){
    MeetingsStore.selectedMeeting = null;
    MeetingsStore.updateItem = null;
    if(data)
      data.text_box_value = null;
  }

  findObjectAndPush(obj, label,data) {
    if(obj.id === label.id) { obj.meeting_minutes.push(data); obj.text_box_value = null; return obj }
    else{
      for(let i of obj) {
        if(i.id == label.id){ i.meeting_minutes.push(data); i.text_box_value = null; return obj }
        else if(i.meeting_minutes.length > 0){
            var foundLabel = this.findObjectAndPush(i.meeting_minutes, label,data);
            if(foundLabel) { 
              return foundLabel; 
            }
        }   
      }
    }
    return null;
  }

  findObjectAndUpdate(obj, itemToUpdate, parentItem){
    for(let i of obj) {
      if(i.id == itemToUpdate.id){ 
        i = itemToUpdate; 
        parentItem.text_box_value = null; 
        MeetingsStore.updateItem = null;
        MeetingsStore.selectedMeeting = null;
        return obj; 
      }
      else if(i.meeting_minutes.length > 0){
          var foundLabel = this.findObjectAndUpdate(i.meeting_minutes, itemToUpdate, parentItem);
          if(foundLabel) { 
            break;
          }
      }   
    }
  }

  deleteMinutes(item,array){
    for(var i = 0; i < array.length; i++){
      if(array[i].id == item.id){

        if(this.meetingMomTab){//mmeting detials tab only
          this._meetingsService.minutesDelete(MeetingsStore.meetingsId,item.id).subscribe(res=>{
            this._utilityService.detectChanges(this._cdr);
          });
        }

        array.splice(i,1);
        return true;
      }
      else{
        if(array[i].meeting_minutes.length > 0){
          this.deleteInnerArray(item, array[i].meeting_minutes)
        }
      }
    }
  }

  deleteInnerArray(item, array){ 
    for(var i = 0; i < array.length; i++){
      if(array[i].id == item.id){

        if(this.meetingMomTab){//mmeting detials tab only

          this._meetingsService.minutesDelete(MeetingsStore.meetingsId,item.id).subscribe(res=>{
            this._eventEmitterService.dismissMomTab(true);
            this._utilityService.detectChanges(this._cdr);
          });
        }

        array.splice(i,1);
        return true;
      }
      else{
        if(array[i].meeting_minutes.length > 0){
          this.deleteInnerArray(item, array[i].meeting_minutes)
        }
      }
    }
  }

  keyboardEvent(event,item){
    var code = (event.keyCode ? event.keyCode : event.which);
    if(code == 13){
      this.addToMeetingAgenda(item);
    }
  }

  editValue(items){
    this.findEditPosition(items,MeetingsStore.newMeetingsMom)
  }

  findEditPosition(item,dataArray,parentArray?){
    for(let i of dataArray){
      if(i.id == item.id){
        MeetingsStore.updateItem = item;
        MeetingsStore.selectedMeeting = parentArray;
        parentArray.text_box_value = item.title;
      }
      else{
        if(i.meeting_minutes.length > 0){
          this.findEditPosition(item,i.meeting_minutes,i);
        }
      }
    }
  }

  saveMom(minuteId,saveData){//mmeting detials tab only
    MeetingsStore.meetingMomDetialLoaded=false;

    let save;
    if(!minuteId){
      save = this._meetingsService.minutesSave(MeetingsStore.meetingsId,saveData);
    }else{
      save = this._meetingsService.minutesUpdate(MeetingsStore.meetingsId,saveData,minuteId);
    }
    save.subscribe(res=>{
      this._eventEmitterService.dismissMomTab(true);
      this._utilityService.detectChanges(this._cdr);
    })
  }


}
