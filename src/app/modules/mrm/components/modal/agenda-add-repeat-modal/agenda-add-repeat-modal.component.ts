

import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  
  selector: 'app-agenda-add-repeat-modal',
  templateUrl: './agenda-add-repeat-modal.component.html',
  styleUrls: ['./agenda-add-repeat-modal.component.scss']
})
export class AgendaAddRepeatModalComponent implements OnInit {

  @Input('details') items: any;
  @ViewChild('newAgendaInput') newAgendaInput: ElementRef;

  hoverButton=false;

  MeetingPlanStore = MeetingPlanStore;
  subItemButtonClicked=false;
  constructor(
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService
    ) { }

  ngOnInit(): void {
  }

  addMinutesClicked(meetingItem){
    this.subItemButtonClicked=true;
    MeetingPlanStore.selectedMeeting = meetingItem;
    setTimeout(() => {
      let input=this.newAgendaInput.nativeElement;
      input.focus();
      input.select();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  addToMeetingAgenda(meetingItem){
    if(meetingItem && meetingItem.text_box_value){
      if(MeetingPlanStore.updateItem){
        MeetingPlanStore.updateItem.title = meetingItem.text_box_value;
        var resp = this.findObjectAndUpdate(MeetingPlanStore.newMeetingAgenda,MeetingPlanStore.updateItem, MeetingPlanStore.selectedMeeting);
      }
      else{
        let itemToPush = { title : meetingItem.text_box_value, meeting_agendas:[], id: Date.now(), class: 'ml-4', text_box_value: null};
        var res = this.findObjectAndPush(MeetingPlanStore.newMeetingAgenda,meetingItem,itemToPush);
      }
    //  this.cancelAgenda(meetingItem)
    if(this.hoverButton){
      MeetingPlanStore.selectedMeeting = meetingItem;
      this.hoverButton=false;
      let input=this.newAgendaInput.nativeElement;
      input.focus();
      input.select();
    }
     this.subItemButtonClicked=false;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  cancelAgenda(data?){
    MeetingPlanStore.selectedMeeting = null;
    MeetingPlanStore.updateItem = null;
    data.text_box_value = null;
  }

  mousepPointerOver(){
    this.hoverButton=true;
  }
  mousepPointerOut(){
    this.hoverButton=false;
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
        MeetingPlanStore.updateItem = null;
        MeetingPlanStore.selectedMeeting = null;
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
        if(array[i].meeting_agendas.length > 0){
          this.deleteInnerArray(item, array[i].meeting_agendas)
        }
      }
    }
  }

  deleteInnerArray(item, array){
    
    for(var i = 0; i < array.length; i++){
      if(array[i].id == item.id){
        array.splice(i,1);
        return true;
      }
      else{
        if(array[i].meeting_agendas.length > 0){
          this.deleteInnerArray(item, array[i].meeting_agendas)
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
    this.findEditPosition(items,MeetingPlanStore.newMeetingAgenda)
  }

  findEditPosition(item,dataArray,parentArray?){
    for(let i of dataArray){
      if(i.id == item.id){
        MeetingPlanStore.updateItem = item;
        MeetingPlanStore.selectedMeeting = parentArray;
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
