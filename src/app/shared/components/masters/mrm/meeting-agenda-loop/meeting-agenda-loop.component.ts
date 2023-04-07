import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MeetingAgendaMasterStore } from 'src/app/stores/masters/mrm/meeting-agenda-store';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-meeting-agenda-loop',
  templateUrl: './meeting-agenda-loop.component.html',
  styleUrls: ['./meeting-agenda-loop.component.scss']
})
export class MeetingAgendaLoopComponent implements OnInit {

  @Input('details') items: any;
  MeetingAgendaMasterStore = MeetingAgendaMasterStore;
  constructor(private _cdr: ChangeDetectorRef, private _utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  addMinutesClicked(meetingItem){
    MeetingAgendaMasterStore.selectedMeeting = meetingItem;
    this._utilityService.detectChanges(this._cdr);
  }

  addToMeetingAgenda(meetingItem){
    if(meetingItem && meetingItem.text_box_value){
      if(MeetingAgendaMasterStore.updateItem){
        MeetingAgendaMasterStore.updateItem.title = meetingItem.text_box_value;
        var resp = this.findObjectAndUpdate(MeetingAgendaMasterStore.newMeetingAgenda,MeetingAgendaMasterStore.updateItem, MeetingAgendaMasterStore.selectedMeeting);
      }
      else{
        let itemToPush = { title : meetingItem.text_box_value, meeting_agendas:[], id: Date.now(), class: 'ml-4', text_box_value: null};
        var res = this.findObjectAndPush(MeetingAgendaMasterStore.newMeetingAgenda,meetingItem,itemToPush);
      }
    
      this._utilityService.detectChanges(this._cdr);
    }
  }

  cancelAgenda(data?){
    MeetingAgendaMasterStore.selectedMeeting = null;
    MeetingAgendaMasterStore.updateItem = null;
    data.text_box_value = null;
  }

  findObjectAndPush(obj, label,data) {
    if(obj.id === label.id) { obj.meeting_agendas.push(data); obj.text_box_value = null; return obj }
    else{
      for(let i of obj) {
        if(i.id == label.id){ i.meeting_agendas.push(data); i.text_box_value = null; return obj }
        else if(i.meeting_agendas.length > 0){
            var foundLabel = this.findObjectAndPush(i.meeting_agendas, label,data);
            if(foundLabel) { 
              return foundLabel; 
            }
          // }
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
        MeetingAgendaMasterStore.updateItem = null;
        MeetingAgendaMasterStore.selectedMeeting = null;
        return obj; 
      }
      else if(i.meeting_agendas.length > 0){
          var foundLabel = this.findObjectAndUpdate(i.meeting_agendas, itemToUpdate, parentItem);
          if(foundLabel) { 
            break;
          }
      }   
    }
  }

  deleteMinutes(item,array){
    for(var i = 0; i < array.length; i++){
      if(array[i].id == item.id){
        array.splice(i,1);
        return true;
      }
      else{
        var deleteRes = this.deleteMinutes(item,array[i].meeting_agendas);
        break;
        // if(deleteRes)
        //   exit;
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

    this.findEditPosition(items,MeetingAgendaMasterStore.newMeetingAgenda)
  }

  findEditPosition(item,dataArray,parentArray?){
    for(let i of dataArray){
      if(i.id == item.id){
        MeetingAgendaMasterStore.updateItem = item;
        MeetingAgendaMasterStore.selectedMeeting = parentArray;
        parentArray.text_box_value = item.title;
      }
      else{
        if(i.meeting_agendas.length > 0){
          this.findEditPosition(item,i.meeting_agendas,i);
        }
      }
    }
  }

}
