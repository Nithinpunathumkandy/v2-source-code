import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingAgendaService } from 'src/app/core/services/masters/mrm/meeting-agenda/meeting-agenda.service';
import{ MeetingAgendaMasterStore } from 'src/app/stores/masters/mrm/meeting-agenda-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-meeting-agenda-modal',
  templateUrl: './meeting-agenda-modal.component.html',
  styleUrls: ['./meeting-agenda-modal.component.scss']
})
export class MeetingAgendaModalComponent implements OnInit {

  @Input('source') MeetingAgendaSource: any;

  //form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  newAgenda:string;
  subAgenda:string;
  meetingAgendas = [];
  meetingAgendaId = null;

  MeetingAgendaMasterStore = MeetingAgendaMasterStore;
    constructor(private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _meetingAgendaService: MeetingAgendaService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {

    MeetingAgendaMasterStore.newMeetingAgenda = [];
    // Checking if Source has Values and Setting Form Value
    if (this.MeetingAgendaSource) {
      this.setValuesForEdit();
    }

  }

  setValuesForEdit(){
    if (this.MeetingAgendaSource.hasOwnProperty('values') && this.MeetingAgendaSource.values) {
      MeetingAgendaMasterStore.newMeetingAgenda = [];
      this.meetingAgendaId = this.MeetingAgendaSource.values.id;
      let newDataObject = { title : this.MeetingAgendaSource.values.details.title, meeting_agendas:[], id: this.MeetingAgendaSource.values.details.id, class: '', text_box_value: null}
      MeetingAgendaMasterStore.newMeetingAgenda.push(newDataObject);
      if(this.MeetingAgendaSource.values.details.children.length > 0){
        for(let j of this.MeetingAgendaSource.values.details.children){
          this.processValuesForEdit(j,newDataObject);
        }
      }
    
    }
  }

  processValuesForEdit(item,parentArray){
    if(item){
      let newDataObject = { title : item.title, meeting_agendas:[], id: item.id, class: 'ml-4', text_box_value: null}
      parentArray.meeting_agendas.push(newDataObject);
      if(item.children.length > 0){
        for(let i of item.children){
          this.processValuesForEdit(i,parentArray.meeting_agendas[parentArray.meeting_agendas.length -1]);
        }
      }
    }
  }



  // for resetting the form
  resetForm() {
    AppStore.disableLoading();
    this.newAgenda = null;
    MeetingAgendaMasterStore.selectedMeeting = null;
    MeetingAgendaMasterStore.updateItem = null;
    MeetingAgendaMasterStore.newMeetingAgenda = [];
  }
  
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  }

  // for closing the modal
  closeFormModal(id?) {
    this.resetForm();
    this._eventEmitterService.dismissMeetingAgendaControlModal(id);
  }

  addAgendaTitle(title)
  {
    if(MeetingAgendaMasterStore.updateItem){
      this.MeetingAgendaMasterStore.newMeetingAgenda[0].title = title;
      MeetingAgendaMasterStore.updateItem = null;
      MeetingAgendaMasterStore.selectedMeeting = null;
      this.newAgenda = null;
    }
    else{
      this.MeetingAgendaMasterStore.newMeetingAgenda.push({ title : title, meeting_agendas:[], id: Date.now(), class: '', text_box_value: null});
      this.newAgenda = null;
    }
  
    this._utilityService.detectChanges(this._cdr);
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
          var res = this.findObjectAndPush(this.MeetingAgendaMasterStore.newMeetingAgenda,meetingItem,itemToPush);
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  cancelAgenda(data?){
    this.newAgenda = null;
    MeetingAgendaMasterStore.selectedMeeting = null;
    MeetingAgendaMasterStore.updateItem = null;
    data.text_box_value = null;
  }

  // addSubAgendaTitle(title,list)
  // {
  //   this.MeetingAgendaMasterStore.newMeetingAgenda[list]['meeting_agendas'].push({"title":title,meeting_agendas:[]});
  //   console.log(this.MeetingAgendaMasterStore.newMeetingAgenda);
  // }
  // addSubAgenda(agenda)
  // {
  //   agenda.meeting_agendas.push({"title":agenda.title,meeting_agendas:[]});
  //   console.log(this.MeetingAgendaMasterStore.newMeetingAgenda);
  // }

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
      }
    }
  }

  createSaveData(){
    var meetingAgendaListString = JSON.stringify(MeetingAgendaMasterStore.newMeetingAgenda);
    var meetingAgendaParsed = JSON.parse(meetingAgendaListString);
    for(let i of meetingAgendaParsed){
      delete i.id;
      delete i.class;
      delete i.text_box_value;
      if(i.meeting_agendas.length > 0){
        this.processObjectsForSave(i.meeting_agendas);
      }
    }
    // console.log(meetingAgendaParsed);
    return {"meeting_agendas": meetingAgendaParsed};
  }

  processObjectsForSave(list){
    for(let i of list){
      delete i.id;
      delete i.class;
      delete i.text_box_value;
      if(i.meeting_agendas.length > 0){
        this.processObjectsForSave(i.meeting_agendas);
      }
    }
  }


  save(close: boolean = false) {
    this.formErrors = null;
    if (MeetingAgendaMasterStore.newMeetingAgenda.length > 0) {
      let save;
      let saveData = this.createSaveData();
     
      AppStore.enableLoading();
      if (this.meetingAgendaId) {
        save = this._meetingAgendaService.updateItem(this.meetingAgendaId, saveData);
      } else {
      save = this._meetingAgendaService.saveItem(saveData);
      }
      save.subscribe((res: any) => {
        if(!this.meetingAgendaId){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal(res.id);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
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
        if(parentArray) parentArray.text_box_value = item.title;
        else{
          this.newAgenda = item.title;
        }
      }
      else{
        if(i.meeting_agendas.length > 0){
          this.findEditPosition(item,i.meeting_agendas,i);
        }
      }
    }
  }
  
  
@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

  if(event.key == 'Escape' || event.code == 'Escape'){     

      this.cancel();

  }

}


    //getting button name by language
    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }

}
