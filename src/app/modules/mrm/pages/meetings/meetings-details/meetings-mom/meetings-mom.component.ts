import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-meetings-mom',
  templateUrl: './meetings-mom.component.html',
  styleUrls: ['./meetings-mom.component.scss']
})
export class MeetingsMomComponent implements OnInit {

  AppStore = AppStore;
  AuthStore = AuthStore;
  MeetingsStore = MeetingsStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  NoDataItemStore=NoDataItemStore;
  reactionDisposer: IReactionDisposer;
  detailsActionPlanMapSubscription:any;

  newMom:string;
  newMomEdit:string;
  meetingAgendas = [];
  meetingAgendaId = null;
  momSameDataError=false;

  modalEventSubscription: any;
  deleteMOMSubscription:any;
  actionPlanMapSubscription:any;
  previewActionPlanSubscription:any;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  detailsActionPlanObject={
    id : null,
    type : null,
    values : null,
  }
  mappingActionPlanObject = {
    id : null,
    type : null,
    values : null,
  };

  mappingActionPlanPreviewObject = {
    id : null,
    type : null,
    values : null,
  };
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("detailsMapActionPlan") detailsMapActionPlan: ElementRef; 
  @ViewChild("mapActionPlan") mapActionPlan: ElementRef;
  @ViewChild("mapActionPlanPreview") mapActionPlanPreview: ElementRef;
  constructor(
    private _renderer2: Renderer2,
    private _router:Router,
    private _cdr:ChangeDetectorRef,
    private _utilityService:UtilityService,
    private _meetingsService:MeetingsService,
    private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = true;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    
    this.reactionDisposer = autorun(() => {
      this.getSubmenu();
      if (SubMenuItemStore.clikedSubMenuItem) {
        
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openMeetingAtionPlanPreview();
            break;
          case "go_to_meeting_plan":
            this.goToMeetingPlan();
            break;
          default:
            break;
        }

        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openMeetingAtionPlanPreview();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    this.modalEventSubscription = this._eventEmitterService.meetingMomTab.subscribe(res => {
      this.getDetials();
    });

    this.deleteMOMSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteMOM(item);
    })
    this.actionPlanMapSubscription=this._eventEmitterService.mapActionPlanModal.subscribe(res=>{
      this.closeActionPlanMaping()
    })

    this.detailsActionPlanMapSubscription=this._eventEmitterService.detailsMapActionPlanModal.subscribe(res=>{
      this.closeDetailsActionPlanMaping()
    })

    this.previewActionPlanSubscription=this._eventEmitterService.detailsMapActionPlanPreviewModal.subscribe(res=>{
      this.closeDetailsActionPlanPreviewMaping()
    })

    this.getDetials();
  }

  getDetials(){
    this._meetingsService.getItem(MeetingsStore.meetingsId).subscribe(res => {
      if(res){
        this.getSubmenu();
        this.setMomForEdit();
      }
    this._utilityService.detectChanges(this._cdr);
    })
  }

  openMeetingAtionPlanPreview()
  {
    
    this.mappingActionPlanPreviewObject.type = 'Add';
    this.mappingActionPlanPreviewObject.values = null;
    setTimeout(() => {
      $(this.mapActionPlanPreview.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.mapActionPlanPreview.nativeElement,'display','block');
    this._renderer2.setStyle(this.mapActionPlanPreview.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.mapActionPlanPreview.nativeElement,'z-index',99999);
  }

  closeDetailsActionPlanPreviewMaping()
  {
    setTimeout(() => {
      this.mappingActionPlanPreviewObject.type = null;
      this.mappingActionPlanPreviewObject.values = null;
      $(this.mapActionPlanPreview.nativeElement).modal('hide');
      this._renderer2.removeClass(this.mapActionPlanPreview.nativeElement,'show');
      this._renderer2.setStyle(this.mapActionPlanPreview.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }



  openMeetingAtionPlan(data)
  {
    
    this.mappingActionPlanObject.type = 'Edit';
    this.mappingActionPlanObject.values = {agenda:data?.agenda,description:data.title,id:data.id};
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
    this.detailsActionPlanObject.type = 'details_from_meetings';
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

  deleteMOM(status){
    if (status && this.popupObject.id) {
      this._meetingsService.deleteMOM(MeetingsStore.meetingsId,this.popupObject.id).subscribe(resp => {
        this.getDetials();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }
  
  clearPopupObject(){
    this.popupObject.id = null;
  }

  delete(id: number,event) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'delete_mom';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  getSubmenu(){
    let subMenuItems =[];
    if(MeetingsStore.individualMeetingsDetails?.is_unplanned){
      subMenuItems= [
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ];
    } else{
      subMenuItems= [
        { activityName: null, submenuItem: { type: 'new_modal' } },
        { activityName: null, submenuItem: { type: 'go_to_meeting_plan' } },
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ];
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_minutes_of_meeting' });
  }

  goToMeetingPlan(){
    
    if(MeetingsStore.individualMeetingsDetails?.meeting_plan?.id){
      this._router.navigateByUrl('mrm/meeting-plans/' + MeetingsStore.individualMeetingsDetails?.meeting_plan?.id);
    }
  }


  setMomForEdit(){//mom edit
    if (MeetingsStore.individualMeetingsDetails?.meeting_minutes){
      MeetingsStore.newMeetingsMom = [];
      let newDataObject;
      for(let j of MeetingsStore.individualMeetingsDetails.meeting_minutes)
      {
        newDataObject = { title : j.title, meeting_minutes:[], id: j.id, class: '', text_box_value: null}
        MeetingsStore.newMeetingsMom.push(newDataObject);
        if(j.children.length > 0){
          for(let i of j.children){
            this.processMomValuesForEdit(i,newDataObject);
          }
        }
      }
    }
  }

  processMomValuesForEdit(item,parentArray){//mom edit
    if(item){
      let newDataObject = { title : item.title, meeting_minutes:[], id: item.id, class: 'ml-4', text_box_value: null}
      parentArray.meeting_minutes.push(newDataObject);
      if(item.children.length > 0){
        for(let i of item.children){
          this.processMomValuesForEdit(i,parentArray.meeting_minutes[parentArray.meeting_minutes.length -1]);
        }
      }
    }
  }

  addMomTitle(title){//mom
    
    let checksametitle=true;
    if(MeetingsStore.updateItem){
      for(let i of this.MeetingsStore.newMeetingsMom) {
        if(i.title==MeetingsStore.updateItem.title)
        {
          i.title=title;
          this.saveMom(i.id,{title:title,parent_minute_id:null});//save 
          
        }
      }
      MeetingsStore.updateItem = null;
      MeetingsStore.selectedMeeting = null;
      this.newMom = null;
    }
    else{
      for(let i of this.MeetingsStore.newMeetingsMom){//this are same title check
        if(i.title==title){ 
          checksametitle=false;
        }
      }

      if(checksametitle){
        this.saveMom(null,{title:title,parent_minute_id:null});//save 

        this.MeetingsStore.newMeetingsMom.push({ title : title, meeting_minutes:[], id: Date.now(), class: '', text_box_value: null});
        this.newMom = null;
        this.momSameDataError=false;
      }else{
        this.momSameDataError=true;
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  meetingMomSameDataErrorClick(event:any){//error message input filed click remove error message
    if(event){
      this.momSameDataError=false;
    }

  }

  cancelMom(data?){//mom
    this.newMom = null;
    MeetingsStore.selectedMeeting = null;
    MeetingsStore.updateItem = null;
    if(data){
      data.text_box_value = null;
    }
  }

  addMinutesClicked(meetingItem){//mom
    
    MeetingsStore.selectedMeeting = meetingItem;
    this._utilityService.detectChanges(this._cdr);
  }

  editValue(items){//mom

    this.findEditPosition(items,MeetingsStore.newMeetingsMom)
  }

  findEditPosition(item,dataArray,parentArray?){//mom
    for(let i of dataArray){
      if(i.id == item.id){
        MeetingsStore.updateItem = item;
        MeetingsStore.selectedMeeting = parentArray;
        this.newMomEdit = item.title;
        if(parentArray) parentArray.text_box_value = item.title;
        else{
          this.newMomEdit = item.title;
        }
      }
      else{
        if(i.meeting_minutes.length > 0){
          this.findEditPosition(item,i.meeting_minutes,i);
        }
      }
    }
  }

  deleteMinutes(item,array){//mom
    for(var i = 0; i < array.length; i++){
      if(array[i].id == item.id){
        //delete Minutes api  
      
        this._meetingsService.minutesDelete(MeetingsStore.meetingsId,item.id).subscribe(res=>{
          this.getDetials();
          this._utilityService.detectChanges(this._cdr);
        });

        array.splice(i,1);
        return true;
      }
      // else{
      //   var deleteRes = this.deleteMinutes(item,array[i].meeting_minutes);
      //   break;
      //   // if(deleteRes)
      //   //   exit;
      // }
    }
  }
  

  keyboardEvent(event,item){//mom
    var code = (event.keyCode ? event.keyCode : event.which);
    if(code == 13){
      this.addToMeetingsMom(item);
    }
  }

  addToMeetingsMom(meetingItem){//mom
    if(meetingItem && meetingItem.text_box_value){
      if(MeetingsStore.updateItem){

        this.saveMom(MeetingsStore.updateItem.id,{title:meetingItem['text_box_value'],parent_minute_id:meetingItem['id']});
        
        MeetingsStore.updateItem.title = meetingItem.text_box_value;
          var resp = this.findObjectAndUpdate(MeetingsStore.newMeetingsMom,MeetingsStore.updateItem, MeetingsStore.selectedMeeting);
      }
      else{
          
        this.saveMom(null,{title:meetingItem['text_box_value'],parent_minute_id:meetingItem['id']});
        
          let itemToPush = { title : meetingItem.text_box_value, meeting_minutes:[], id: Date.now(), class: 'ml-4', text_box_value: null};
          var res = this.findObjectAndPush(this.MeetingsStore.newMeetingsMom,meetingItem,itemToPush);
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  findObjectAndUpdate(obj, itemToUpdate, parentItem){//mom
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

  findObjectAndPush(obj, label,data) {//mom
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

  saveMom(minuteId,saveData){
    MeetingsStore.meetingMomDetialLoaded=false;

    let save;
    if(!minuteId){
      save = this._meetingsService.minutesSaveUnPlanned(MeetingsStore.meetingsId,saveData);
    }else{
      save = this._meetingsService.minutesUpdateUnPlanned(MeetingsStore.meetingsId,saveData,minuteId);
    }
    save.subscribe(res=>{
      if(minuteId)
      {
        this._utilityService.showSuccessMessage('Sucess','Mom Updated successfully')
      }
      else
      {
        this._utilityService.showSuccessMessage('Sucess','Mom Added successfully')
      }
      this.getDetials();
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getEmployeePopupDetails(users, created?:string){//user popup
    let userDetial: any = {};
  
    if(users){
      userDetial['id'] = users.id;
    userDetial['email'] = users.email;
    userDetial['mobile'] = users.mobile;
    userDetial['last_name'] = users.last_name;
    userDetial['first_name'] = users.first_name;
    userDetial['department'] = users.department;
    userDetial['designation'] = users.designation;
    userDetial['image_token'] = users.image.token;
    userDetial['created_at'] = created? created:null;
    userDetial['status_id'] = users.status_id? users.status_id:users.status.id;

    return userDetial;
    }
  }

  // assignUserValues(user) {

  //   if (user) {

  //     var userInfoObject = {
  //       first_name: '',
  //       last_name: '',
  //       designation: '',
  //       image_token: '',
  //       mobile: null,
  //       email: '',
  //       id: null,
  //       department: '',
  //       status_id: null
  //     }
  //     userInfoObject.first_name = user?.first_name;
  //     userInfoObject.last_name = user?.last_name;
  //     userInfoObject.image_token = user?.image_token;
  //     userInfoObject.email = user?.email;
  //     userInfoObject.mobile = user?.mobile;
  //     userInfoObject.id = user?.team_lead_id;
  //     userInfoObject.status_id = user?.status?.id
  //     userInfoObject.department = user?.department;
  //     return userInfoObject;
  //   }
  // }

  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      if (user?.designation) {
        userInfoObject.designation = user?.designation;
      }
      if (user?.designation?.title) {
        userInfoObject.designation = user?.designation?.title;
      }
      if (user?.image?.token) {
        userInfoObject.image_token = user?.image.token
      }
      if (user?.image_token) {
        userInfoObject.image_token = user?.image_token
      }
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      if (user?.status?.id) {
        userInfoObject.status_id = user?.status.id
      }
      if (user?.status_id) {
        userInfoObject.status_id = user?.status_id
      }
      userInfoObject.department = null;
      return userInfoObject;
    }
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    // MeetingsStore.unsetIndividualMeetingsDetails();//meeting detials
    this.modalEventSubscription.unsubscribe();
    MeetingsStore.newMeetingsMom=[];
    MeetingsStore.meetingMomDetialLoaded=false;
    this.actionPlanMapSubscription.unsubscribe();
    this.deleteMOMSubscription.unsubscribe();
    this.previewActionPlanSubscription.unsubscribe();
    MeetingsStore.clearMappedActionPlan();
  }

}
