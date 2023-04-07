
import { ChangeDetectionStrategy, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { autorun, IReactionDisposer } from 'mobx';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { MeetingTypeService } from 'src/app/core/services/masters/mrm/meeting-type/meeting-type.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { VenueService } from 'src/app/core/services/masters/general/venue/venue.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { MeetingTypeMasterStore } from 'src/app/stores/masters/mrm/meeting-type-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { VenueMasterStore } from 'src/app/stores/masters/general/venue-store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.scss']
})
export class AddMeetingComponent implements OnInit,OnDestroy {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild("participantsAdd") participantsAdd: ElementRef;
  @ViewChild('addVenue', { static: true }) addVenue: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('MOMModal')MOMModal:ElementRef;
  @ViewChild("mapActionPlan") mapActionPlan: ElementRef;
  @ViewChild("detailsMapActionPlan") detailsMapActionPlan: ElementRef;
  AppStore=AppStore;
  AuthStore=AuthStore;
  MeetingsStore=MeetingsStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  MeetingPlanStore = MeetingPlanStore;
  VenueMasterStore = VenueMasterStore;
  MeetingTypeMasterStore=MeetingTypeMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  currentTab = 0;
  formErrors: any;
  form: FormGroup;
  saveData: any = null;
  fileUploadsArray = []; //doc
  nextButtonText = "next";
  previousButtonText = "previous";
  todayDate:any = new Date();
  minDate:any
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  UsersStore = UsersStore;
  
  eventSubscriptionCancel: any=null;
  eventSubscriptionVenue:any=null;
  eventSubscriptionAddParticipants:any=null;
  fileUploadPopupSubscriptionEvent: any = null;
  MOMModalSubscription:any=null;

  newMom:string;
  newMomEdit:string;
  meetingAgendas = [];
  meetingAgendaId = null;
  momSameDataError=false;
  freezeMeeting:boolean=false;

  MOMAgenda:any=null;
  MOMTitle:any=null;
  itemPosition: any=null;
  MOMId: any=null;
  MOMActionPlanId: any=null;
  MOMTargetDate:any=null;
  MOMResponsibleUser:any=null;
  actionPlanMapSubscription:any;
  detailsActionPlanMapSubscription:any;

  cancelObject = {
    type: '',
    title: '',
    subtitle: ''
  }

  momSourceObject={
    type:'',
    selectedAgendaValue:'',
    value:''
  }
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

  formObject = {
    0:['meeting_plan_id'],
    1:[
      // 'from',
      // 'to',
      'title'
  ]
  }

  venuelabels={
    main_title:'new_meeting_venue',
    title:'title_of_the_meeting_venue',
    description:'write_a_short_description_of_the_meeting_venue'
  }

  offlineEnable:boolean=false;
  onlineEnable:boolean=false;
  venueArray:any=[];
  buttonDisabled: boolean=true;

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _venueService: VenueService,
    private _utilityService: UtilityService,
    private _meetingsService:MeetingsService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _meetingTypeService:MeetingTypeService,
    private _meetingPlanService: MeetingPlanService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _documentFileService: DocumentFileService,
    private _meetingPlanFileService:MeetingPlanFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _usersService: UsersService,
    ) {

     }

  ngOnInit(): void {

    this.minDate={year:this.todayDate.getUTCFullYear(), month: this.todayDate.getUTCMonth() + 1, day: this.todayDate.getUTCDate()}

    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    this.reactionDisposer = autorun(() => {
      // var subMenuItems = [
      //   {activityName: 'CREATE_MEETING_PLAN', submenuItem: {type: 'new_modal'}},
      // ];
      // this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_meeting_plan'});

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.gotoMeetingPlanAddPage();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: "../" }]);

    this.form = this._formBuilder.group({
      id:[null],
      to:['',[Validators.required]],
      from:['',[Validators.required]],
      title:['',[Validators.required]],
      venue_id:[null],
      meeting_link : [''],
      duration:[''],
      description:[''],
      organizer_id:[null,[Validators.required]],
      meeting_plan_id:[null,[Validators.required]],
      meeting_minutes:[[]],
      meeting_type_ids:[[]],
      reference_code: [null],
      meeting_participants:[[]],
    });

    // this.meetingUsers=[];
    MeetingsStore.newMeetingsMom = [];

    this.getMeetingType(); 

    this.form.get('from').valueChanges.subscribe(val => { //one houre extra set end_date/time
      if(val){
        let milliseconds = val.getTime() + (1 * 60 * 60 * 1000);
        let date = new Date(milliseconds);
        this.form.controls['to'].setValue(date);
      }
    });

    this.form.get('to').valueChanges.subscribe(val=>{ //end date click duration time set automatic
      this.form.controls['duration'].setValue(''); 
      this.form.controls['duration'].setValue(this.setDuration(this.form.value.from,val)); 
    });

    this.form.get('meeting_type_ids').valueChanges.subscribe(res=>{
      
      if(res?.length>0){
        const offiline = res.find(item=>item.type=='offline');
        const online = res.find(item=>item.type=='online');

          if(offiline){
            this.offlineEnable=true;
          } else{
            this.offlineEnable=false;
          }

          if(online){
            this.onlineEnable=true;
          } else{
            this.onlineEnable=false;
          }
                
      }else{
        this.offlineEnable=false;
        this.onlineEnable=false;
      }
      
    });

    this.eventSubscriptionCancel = this._eventEmitterService.deletePopup.subscribe(item => {
      this.closeMeeting(item);
    })

    this.eventSubscriptionAddParticipants = this._eventEmitterService.addParticipantsModal.subscribe(res => {
      this.setExternalParticipants(res);
      this.closeModelParticipants();
    })

    this.eventSubscriptionVenue = this._eventEmitterService.venue.subscribe(res => {
      this.searchVenue({term:VenueMasterStore.lastInsertedId});
      this.closeModelVenueAdd();
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})

    this.MOMModalSubscription=this._eventEmitterService.MOMModal.subscribe(res=>{
      this.closeMOMModal()
    })

    this.actionPlanMapSubscription=this._eventEmitterService.mapActionPlanModal.subscribe(res=>{
      this.closeActionPlanMaping()
    })

    this.detailsActionPlanMapSubscription=this._eventEmitterService.detailsMapActionPlanModal.subscribe(res=>{
      this.closeDetailsActionPlanMaping()
    })

    setTimeout(() =>{ //Desgin depent-scroll event
    window.addEventListener("scroll", this.scrollEvent, true);
    this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    }, 1000);

    setTimeout(() => { //Desgin depent-showing tab
      this.showTab(this.currentTab);
    }, 100); 
    
    if(this._router.url.indexOf('edit-meeting') != -1){
      if(MeetingsStore.editFlag && MeetingsStore.meetingsId){
        this._meetingsService.getItem(MeetingsStore.meetingsId).subscribe(res => {
          this.meetingEdit(res);
        });
      }else{
        this._router.navigateByUrl('/mrm/meetings');
      }
    }

    if(MeetingsStore.meetingPlanInsideAddmeetingFlag){
      this.freezeMeeting=true;
      this.getPlan(MeetingPlanStore.meetingPlanId);
      MeetingsStore.unsetmeetingPlaninsideMeetingAddFlag();
    }
    this.meetingPlanpageChange(1); 
    this.clearMomNgModels();
  }

  meetingPlanpageChange(newPage: number = null) {
    MeetingPlanStore.orderBy = 'desc';
    MeetingPlanStore.orderItem = 'from';
    if (newPage) MeetingPlanStore.setCurrentPage(newPage);
    this._meetingPlanService.getItems(false,`&meeting_plan_status_ids=2`).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 10));
  }

  gotoMeetingPlanAddPage(){

    this._router.navigateByUrl('mrm/meeting-plans/add-meeting-plan');
  }

/**** START EDIT ****/
  meetingEdit(res){
    if(MeetingsStore.individualLoaded) {
      // MeetingsStore.clearDocumentDetails();//doc
      this.getPlan(MeetingsStore.individualMeetingsDetails?.meeting_plan.id);
      // this.setDocuments(MeetingsStore.individualMeetingsDetails?.documents);
      var meetingItem =JSON.parse(JSON.stringify( MeetingsStore.individualMeetingsDetails));
      this.clearCommonFilePopupDocuments();
      if (meetingItem.documents.length > 0) {
              
        this.setDocuments('meetings-document',meetingItem.documents);
      }
      this.searchVenue({term:res.venue?.id});
      // this.setMomForEdit();
     // this.setMOMData()
      this.form.patchValue({
        id:MeetingsStore.individualMeetingsDetails.id ? MeetingsStore.individualMeetingsDetails.id: null,
        reference_code: MeetingsStore.individualMeetingsDetails.reference_code ? MeetingsStore.individualMeetingsDetails.reference_code  : '',
        organizer_id: MeetingsStore.individualMeetingsDetails?.organizer.id? MeetingsStore.individualMeetingsDetails.organizer.id : null,
        meeting_plan_id: MeetingsStore.individualMeetingsDetails?.meeting_plan.id? MeetingsStore.individualMeetingsDetails.meeting_plan.id : null,
        from:MeetingsStore.individualMeetingsDetails.start ?  new Date (MeetingsStore.individualMeetingsDetails.start) : '',
        to:MeetingsStore.individualMeetingsDetails.end ?  new Date (MeetingsStore.individualMeetingsDetails.end) : '',
        title:MeetingsStore.individualMeetingsDetails.title ?  MeetingsStore.individualMeetingsDetails.title : '',
        description:MeetingsStore.individualMeetingsDetails.description ? MeetingsStore.individualMeetingsDetails.description : '',
        meeting_type_ids: MeetingsStore.individualMeetingsDetails.meeting_types ? MeetingsStore.individualMeetingsDetails.meeting_types : [],
        venue_id:MeetingsStore.individualMeetingsDetails?.venue ? MeetingsStore.individualMeetingsDetails?.venue : null,
        duration: this.setDuration(MeetingsStore.individualMeetingsDetails.start,MeetingsStore.individualMeetingsDetails.end),
        meeting_participants:MeetingsStore.individualMeetingsDetails.meeting_participants ? this.processMeetingParticipants(JSON.parse(JSON.stringify(MeetingsStore.individualMeetingsDetails.meeting_participants))) : [],
        meeting_link : MeetingsStore.individualMeetingsDetails.meeting_link ?  MeetingsStore.individualMeetingsDetails?.meeting_link : '',
      });
      this._utilityService.detectChanges(this._cdr);  
    }
  }

  processMeetingParticipants(usersList){
    let users = [];
    for(let i of usersList){
      if(MeetingsStore.editFlag){
        if(i.is_present != 0) i.user['is_present'] = true;
        else i.user['is_present'] = false;
      }
      else{
        if(i.is_attending){
          i.user['is_present'] = true;
        }else{   
          i.user['is_present'] = false;
        }
      }
      users.push(i.user)
    }
    return users;
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
/**** END EDIT ****/ 

  changeStep(step){ //Desgin depent-tab click
    if(step > this.currentTab && this.checkFormObject(step)){
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if(step < this.currentTab){
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }  
  }

  checkIfPresentInMeetingPlan(id){
    let pos = MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_users.findIndex(e => e.user.id === id);
    if(pos == -1) return true;
    else return false;
  }

  checkDinamicaly(){
    let enable:boolean=true;
    if(this.offlineEnable || this.onlineEnable){
      enable=true;
        if(this.offlineEnable && this.onlineEnable){
          enable=true;
          if(this.form.value.venue_id && this.form.value.meeting_link){
            enable=false;
          }
      }else if(this.offlineEnable){
        enable=true;
        if(this.form.value.venue_id){
          enable=false;
        }
      }else{
        enable=true;
        if(this.form.value.meeting_link){
          enable=false;
        }
      }
    } else{
      enable=false;
    }
    
    return enable;
  }

  checkFormObject(tabNumber?:number){ //Desgin depent-fill value next
    var setValid = true;
    if(!tabNumber){
      if(this.formObject.hasOwnProperty(this.currentTab)){
        for(let i of this.formObject[this.currentTab]){
          if(!this.form.controls[i].valid){
            setValid = false;
            break;
          }
        }
      }
    }
    else{
      for(var i = 0; i < tabNumber; i++){
        if(this.formObject.hasOwnProperty(i)){
          for(let k of this.formObject[i]){
            if(!this.form.controls[k].valid){
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

  confirmCancel(){ //Desgin depent-Cancel
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'Cancel Meeting Plan Creation ?';
    this.cancelObject.subtitle = 'Entered data will lost';
    $(this.cancelPopup.nativeElement).modal('show');
  }

  nextPrev(n?:number) { //Desgin depent-Next

    var x: any = document.getElementsByClassName("tab");
  
    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
    }

    x[this.currentTab].style.display = "none";
    if(this.currentTab == 1 && MeetingsStore.editFlag){
      if(n == 1) this.currentTab = this.currentTab + n*2;
      else this.currentTab = this.currentTab + n;
    } 
    else if(this.currentTab == 3 && MeetingsStore.editFlag){
      // if(n > 0) this.currentTab = this.currentTab + n;
      // else {
        if(n == -1) this.currentTab = this.currentTab + n*2;
        else this.currentTab = this.currentTab + n;
      // }
    }
    else this.currentTab = this.currentTab + n;

    if (this.currentTab >= x.length) {
      
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.submitForm();
      return false;
    }
    this.showTab(this.currentTab);
  }

  showTab(n) { //Desgin depent-showing tab
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    
    if (n == 0) {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (n == x.length - 1) {
      this.setSaveData();
      if (document.getElementById("nextBtn")) this.nextButtonText = "save";
    } else {
      
      if (document.getElementById("nextBtn")) this.nextButtonText = "next";
    }
    this.fixStepIndicator(n);
  }

  fixStepIndicator(n) {

    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  scrollEvent = (event: any): void => { //Desgin depent-scroll event
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };

  addModelParticipants(){
    $(this.participantsAdd.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  addModelVenue(){
    $(this.addVenue.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModelVenueAdd(){
    $(this.addVenue.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModelParticipants(){
    $(this.participantsAdd.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  closeMeeting(status){
    if (status) {
      if(this.freezeMeeting){
        this._router.navigateByUrl('mrm/meeting-plans/'+MeetingPlanStore.meetingPlanId+'/meeting-plan-meeting');
      }else{
        // if(MeetingsStore.meetingListCancelFlag=='list'){
        //   this._router.navigateByUrl('mrm/meetings');
        // }else{
          if(MeetingsStore.meetingsId){
            this._router.navigateByUrl('mrm/meetings/' + MeetingsStore.meetingsId);
          }else{
            this._router.navigateByUrl('mrm/meetings');
          }
        // }
      }
      AppStore.disableLoading();
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
      this.clearCancelObject();
    }, 250);
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

  clearCancelObject() {
    this.cancelObject.type = '';
    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';
  }

  searchVenue(event){
    this._venueService.getSearchItems('q='+event.term).subscribe(res => {

      if(VenueMasterStore.lastInsertedId){
        for(let item of res.data){
          if(VenueMasterStore.lastInsertedId == item.id){
            this.form.patchValue({venue_id:item});
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEmployeePopupDetails(users,auth?:string){ //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        userDetails['department'] = typeof(users.department) == 'string' ? users?.department : users?.department?.title ? users?.department?.title : null;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =auth? new Date():null;
        if(auth=='auth'){
          userDetails['designation'] = users?.designation.title ;
        }else{
          userDetails['designation'] = users?.designation? users?.designation : users?.designation_title;
        }
      }
    return userDetails;
  }

  onCheckboxChange(e,data) { //checkbox online,offline
    const meeting_type_ids:any = this.form.get('meeting_type_ids').value;
    if (e.target.checked) {
      meeting_type_ids.push(data);
      if(data.type == 'offline') this.form.controls["venue_id"].setValidators(Validators.required);
      else if(data.type == 'online') this.form.controls["meeting_link"].setValidators(Validators.required);
    } else {
        const index = meeting_type_ids.findIndex(x => x.id === data.id);
        meeting_type_ids.splice(index,1);
        if(data.type == 'offline') this.form.patchValue({venue_id : null})
        else if(data.type == 'online') this.form.patchValue({meeting_link : ''})
    }
    this.form.patchValue({
      meeting_type_ids: meeting_type_ids
    });
  }

  getMeetingTypeStatus(id: number){ //checkbox online,offline
    const meeting_type_ids = this.form.get('meeting_type_ids').value;
    const index = meeting_type_ids.findIndex(x => x.id === id);
    if(index != -1) return true;
    else return false;
  }

  // getMeetingTypeStatusByType(type: string){ //checkbox online,offline
  //   const meeting_type_ids = this.form.get('meeting_type_ids').value;
  //   if(meeting_type_ids){
  //     const index = meeting_type_ids.findIndex(x => x.type === type);
  //     if (index != -1) return true;
  //     else return false;
  //   }
  // }

  getMeetingType(){ //checkbox online,offline
    this._meetingTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setDuration(startDateTime:any,endDateTime:any){ //DurationTime
    let startTime = new Date(startDateTime); 
    let endTime = new Date(endDateTime);
    let millisec = endTime.getTime() - startTime.getTime(); // in milliseconds
    // var resultInMinutes = millisec / 60000; 
    // var housers=Math.round(resultInMinutes/60);
    let hour = (millisec / (1000 * 60 * 60)).toFixed(2);
    
    let hh:any=hour.split(".")[0];
    let mm:any=hour.split(".")[1];
  
    if(hh<10){
      return "0"+hh+"."+mm;
    }else{
      if(hh<24){ 
        return hour;}
      else{ 
        return "00.00";}  
    } 
  }

  setExternalParticipants(res){
    if(res){
      for(let i of res){
        i['is_present'] = true;
      }
      this.form.controls['meeting_participants'].setValue(this.form.value.meeting_participants.concat(res)); 
      this._utilityService.detectChanges(this._cdr);
    }
  }

  getVenue(){
    this._venueService.getItems(true).subscribe(res => {
      this.venueArray=res.data;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  selectPlanDetial(id:number,setFlag:boolean = false){ //select meetin plans set data
    this._meetingPlanService.getItem(id).subscribe(res=>{
      MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_users
      if(res && setFlag){
        this.setMeetingPlanInfo(res);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setMeetingPlanInfo(res){
    // MeetingsStore.clearDocumentDetails();//doc
    this.searchVenue({term:res.venue?.id});
    // this.setDocuments(MeetingPlanStore.individualMeetingPlanDetails?.documents);
    var meetingPlanItem =JSON.parse(JSON.stringify(MeetingPlanStore.individualMeetingPlanDetails));
    this.clearCommonFilePopupDocuments();
    if (meetingPlanItem.documents.length > 0) {
      this.setDocuments('meeting-plan-document',meetingPlanItem.documents);
    }

    this.form.patchValue({
      organizer_id: MeetingPlanStore.individualMeetingPlanDetails?.organizer?.id? MeetingPlanStore.individualMeetingPlanDetails?.organizer?.id : '',
      meeting_plan_id: MeetingPlanStore.individualMeetingPlanDetails?.id? MeetingPlanStore.individualMeetingPlanDetails.id : '',
      from:MeetingPlanStore.individualMeetingPlanDetails.start_date ?  new Date (MeetingPlanStore.individualMeetingPlanDetails.start_date) : '',
      to:MeetingPlanStore.individualMeetingPlanDetails.end_date ?  new Date (MeetingPlanStore.individualMeetingPlanDetails.end_date) : '',
      title:MeetingPlanStore.individualMeetingPlanDetails.title ?  MeetingPlanStore.individualMeetingPlanDetails.title : '',
      meeting_type_ids: MeetingPlanStore.individualMeetingPlanDetails.meeting_types ? MeetingPlanStore.individualMeetingPlanDetails.meeting_types : [],
      //meeting_type_ids: MeetingPlanStore.individualMeetingPlanDetails.meeting_types ? this._helperService.processPivotArray(MeetingPlanStore.individualMeetingPlanDetails.meeting_types,'meeting_type_language_title') : [],
      description:MeetingPlanStore.individualMeetingPlanDetails.description ? MeetingPlanStore.individualMeetingPlanDetails.description : '',
      venue_id:MeetingPlanStore.individualMeetingPlanDetails?.venue ? MeetingPlanStore.individualMeetingPlanDetails?.venue : null,
      meeting_link : MeetingPlanStore.individualMeetingPlanDetails?.meeting_link ?  MeetingPlanStore.individualMeetingPlanDetails?.meeting_link : '',
      duration: this.setDuration(MeetingPlanStore.individualMeetingPlanDetails.start_date,MeetingPlanStore.individualMeetingPlanDetails.end_date),
      meeting_participants:MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users ? this.processMeetingParticipants(JSON.parse(JSON.stringify(MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users))) : [],
    });
  }

  addMomTitle(title){//mom
    let checksametitle=true;
    if(MeetingsStore.updateItem){
      for(let i of this.MeetingsStore.newMeetingsMom) {
        if(i.title==MeetingsStore.updateItem.title)
        {
          i.title=title;
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
        MeetingsStore.updateItem.title = meetingItem.text_box_value;
          var resp = this.findObjectAndUpdate(MeetingsStore.newMeetingsMom,MeetingsStore.updateItem, MeetingsStore.selectedMeeting);
      }
      else{
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

  createPrevImageUrl(type, token) {//doc-prv
    return this._meetingPlanFileService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {//doc-prv
    return this._imageService.getDefaultImageUrl(type);
  }

  // setDocuments(documents){ //doc-prv
  //   for (let i of documents) {
  //     let docurl;
  //     if(MeetingsStore.editFlag){
  //       docurl = this._meetingPlanFileService.getThumbnailPreview('meetings-document', i.token);
  //     }else{
  //       docurl = this._meetingPlanFileService.getThumbnailPreview('meeting-plan-document', i.token);
  //     }
  //     let docDetails = {
  //       created_at: i.created_at,
  //       created_by: i.created_by,
  //       updated_at: i.updated_at,
  //       updated_by: i.updated_by,
  //       name: i.title,
  //       ext: i.ext,
  //       size: i.size,
  //       url: i.url,
  //       thumbnail_url: i.url,
  //       token: i.token,
  //       preview: docurl,
  //       id: i.id
  //     };

  //     this._meetingsService.setDocumentDetails(docDetails, docurl);
  //     setTimeout(() => {
  //       this.checkForFileUploadsScrollbar();
  //     }, 200);
  //   } 
  // }

  checkExtension(ext, extType) {//doc-add
    return this._imageService.checkFileExtensions(ext, extType)
  }
  
  createDateTimeValidator() {
    if (MeetingsStore.editFlag) 
      return this.form.value.from?this.form.value.from:this.todayDate;
    else 
      return this.todayDate;
  }


  checkForFileUploadsScrollbar() {//doc-add scrollbar function
    if (MeetingsStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  onFileChange(event, type: string) {// doc-add  file change function
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); 
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams) 
            .subscribe((res: HttpEvent<any>) => {
              let uploadEvent: any = res;
              switch (uploadEvent.type) {
                case HttpEventType.UploadProgress:
                  // Compute and show the % done;
                  if (uploadEvent.loaded) {
                    let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                    this.assignFileUploadProgress(upProgress, file);
                  }
                  this._utilityService.detectChanges(this._cdr);
                  break;
                case HttpEventType.Response:
                  //return event;
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  this.assignFileUploadProgress(null, file, true);
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { 
                    this.createImageFromBlob(prew, temp, type); 
                  }, (error) => {
                    this.assignFileUploadProgress(null, file, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
              this.assignFileUploadProgress(null, file, true);
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
  }

  checkAcceptFileTypes(type){// doc-add
    return this._imageService.getAcceptFileTypes(type); 
  }
    
  checkLogoIsUploading(){// doc-add  Check if logo is being uploaded
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  createImageFromBlob(image: Blob, imageDetails, type) {//doc-add imageblob function
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._meetingsService.setDocumentDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  assignFileUploadProgress(progress, file, success = false) {// doc-add
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  addItemsToFileUploadProgressArray(files, type) {// doc-add
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  getPlan(id?){// user-defind-select checkbox
    if(id){
      this.form.controls['meeting_plan_id'].setValue(id); 
      if(this.form.value.meeting_plan_id == id){
        
        if(MeetingsStore.editFlag==false){
          this.selectPlanDetial(id,true);
        }
        else{
          this.selectPlanDetial(id,false);
        }
            
      }else {
        this.form.value.meeting_plan_id = null;
      }
    }else{
      this.form.controls['meeting_plan_id'].setValue(null);
    }
  }
  
  createSaveData(){//mom saveData
    var meetingMomListString = JSON.stringify(MeetingsStore.newMeetingsMom);
    var meetingAgendaParsed = JSON.parse(meetingMomListString);
    for(let i of meetingAgendaParsed){
      delete i.id;
      delete i.class;
      delete i.text_box_value;
      if(i.meeting_minutes.length > 0){
        this.processObjectsForSave(i.meeting_minutes);
      }
    }
    if(meetingAgendaParsed.length){
      return meetingAgendaParsed;
    }   
  }

  processObjectsForSave(list){//mom saveData
    for(let i of list){
      delete i.id;
      delete i.class;
      delete i.text_box_value;
      if(i.meeting_minutes.length > 0){
        this.processObjectsForSave(i.meeting_minutes);
      }
    }
  }
//Check uncheck 
  onChange(e,user) {
    let pos = this.form.value.meeting_participants.findIndex(e=>e.id == user.id);
    this.form.value.meeting_participants[pos]['is_present'] = e.target.checked;
  }

 createSaveDataParticipants(){//participants saveData 
  let user = [];
  for(let i of this.form.value.meeting_participants){
    let userObj = {"is_present":i['is_present'],"is_new":false,"user_id":i.id};
    user.push(userObj);
  }
  for(let j of user){
    if(MeetingsStore.editFlag){
      let pos = MeetingsStore.individualMeetingsDetails.meeting_participants.findIndex(e=>e.user.id == j.user_id);
      if(pos == -1) j['is_new'] = true;
      else j['is_new'] = false;

    }
    else{
      let pos = MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users.findIndex(e=>e.user.id == j.user_id);
      if(pos == -1) j['is_new'] = true;
      else j['is_new'] = false;
    }
  }
    
  return user;
  }

    	// *Common  File Upload/Attach Modal Functions Starts Here

	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

	setDocuments(type,documents) {
    
		let khDocuments = [];
		documents.forEach(element => {

			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {
          
					if (innerElement.is_latest) {

            if(type=='meeting-plan-document'){
              khDocuments.push({
                'document_id':innerElement.document_id,
                'ext':innerElement.ext,
                'id':innerElement.document_id,
                'is_latest':innerElement.is_latest,
                'size':innerElement.size,
                'thumbnail_url':innerElement.thumbnail_url,
                'title':innerElement.title,
                'token':innerElement.token,
                'url':innerElement.url,
                'version':innerElement.version,
                'is_kh_document': true
              })
            }else{
              khDocuments.push({
                ...innerElement,
                title:element?.kh_document.title,
                'is_kh_document': true
              })
            }

            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement
            })

					}

				});
			}
			else {
				if (element && element.token) {
          
					var purl = this._meetingPlanFileService.getThumbnailPreview(type, element.token)
					var lDetails = {
						name: element.title,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: type=='meeting-plan-document'?null:element.id,
						'is_kh_document': false,
					}
				}
        
				this._fileUploadPopupService.setSystemFile(lDetails, purl)

			}

		});

		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
	}

	openFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
			this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
			setTimeout(() => {
				this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
				this._utilityService.detectChanges(this._cdr)
			}, 100);
		}, 250);
	}

	closeFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = false;
			document.body.classList.remove('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
			this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
			$('.modal-backdrop').remove();
			setTimeout(() => {
				this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
				this._utilityService.detectChanges(this._cdr)
			}, 200);
		}, 100);
	}

	enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
			$(this.previewUploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
			$(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

  removeDocument(doc) {
    
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }


	// *Common  File Upload/Attach Modal Functions Ends Here

  createImageUrl(type,token) {// user-defined
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getButtonText(text){// user-defined
    return this._helperService.translateToUserLanguage(text);
  }

  setSaveData(){//user defined
    this.saveData={
      organizer_id: this.form.value.organizer_id? this.form.value.organizer_id : '',
      meeting_plan_id: this.form.value.meeting_plan_id? this.form.value.meeting_plan_id : '',
      venue_id:this.form.value.venue_id ? this.form.value.venue_id.id : null,
      description: this.form.value.description ? this.form.value.description : '',
      start: this.form.value.from ? this._helperService.passSaveFormatDate(this.form.value.from) : '',
      end: this.form.value.to ? this._helperService.passSaveFormatDate(this.form.value.to) : '',
      duration: this.form.value.duration ? this.form.value.duration : '',
      title: this.form.value.title ? this.form.value.title : '',
      meeting_type_ids:this._helperService.getArrayProcessed(this.form.value.meeting_type_ids,'id'),
      // documents: MeetingsStore.docDetails,
      // meeting_minutes:this.createSaveData()?this.createSaveData(): [],
      meeting_minutes:MeetingsStore.mappedActionPlan.length > 0?this.getProcessedDataActionPlan(MeetingsStore.mappedActionPlan):[],
      meeting_participants:this.form.value.meeting_participants ?this.createSaveDataParticipants():[],
      meeting_link: this.form.value.meeting_link ? this.form.value.meeting_link : '',
    }; 
    //console.log(this.saveData.meeting_minutes)
    if (this.form.value.id) {
			this.saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
    } else{
      this.saveData['documents'] = this.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}
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
// ******  it loop issue check now**********
  	//  For Sorting KHFiles and System Files into proper Format
	sortFileuploadData(Files,type){
    
		let processedArray=[];
		if(type=='save'){
			Files.forEach(element => {
				if(element?.id){
				  processedArray.push({
					'document_id':element.id,
					'name':null,
					'size':null,
					'url':null,
					'ext':null,
					'thumbnail_url':null
				  })
				}else{
				//   processedArray.push(element)
				  processedArray.push({
					...element,
					'document_id':null
				  }
				  )
				}
			});
		}else{


		}

		return processedArray;
	}

  submitForm(){//user defined
    AppStore.enableLoading();
    this.nextButtonText = "loading";
    this.previousButtonText = "loading";
    let save;
    if (MeetingsStore.meetingsId) {
      save = this._meetingsService.updateItem(MeetingsStore.meetingsId, this.saveData);
    }
    else {
      save = this._meetingsService.saveItem(this.saveData);  
    }

    save.subscribe(res => {
      AppStore.disableLoading();
      this._router.navigateByUrl('mrm/meetings/' + res['id']);
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "next";
        this.previousButtonText = "previous";
        this.setIntialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  setIntialTab() { //user defined-Setting Intial Tab
    var x: any = document.getElementsByClassName("tab");
    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  removeParticipants(value){  
    let index = this.form.value.meeting_participants.findIndex(e=>e.id == value);
    if(index != -1)this.form.value.meeting_participants.splice(index, 1);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }
 

  // MOM against agenda code starts here

  // checkButtonCondition(){
  //   if(MeetingsStore.minutesOfMeeting.some(el=>el.agenda_title==this.momSourceObject.selectedAgendaValue['title']))
  //     this.buttonDisabled=true
  //   else
  //   this.buttonDisabled=false;

  // }


  setMOMData(){
    if (MeetingsStore.individualMeetingsDetails?.meeting_minutes){
      MeetingsStore.clearMOMs()
      let newDataObject;
      for(let j of MeetingsStore.individualMeetingsDetails.meeting_minutes)
      {
        if(j?.action_plan?.length > 0){
          newDataObject = { 
            id:j.id,
            title:j.title,
            agenda_title:j.agenda.title,
            meeting_plan_meeting_agenda_id:j.meeting_plan_meeting_agenda_id,
            target_date:j.action_plan[0].target_date,
            responsible_user_id:j.action_plan[0].responsible_user_id,
            display_user:j.action_plan[0].responsible_user,
            is_deleted:false,
            meeting_action_plan_id:j.action_plan[0].id,
            is_new:false}

            if(j.action_plan[0].meeting_action_plan_status_id==1)
            {
              newDataObject['is_editable']=true;
              newDataObject['is_deletable']=true;
            }

            else{
              newDataObject['is_deletable']=false;
              newDataObject['is_editable']=false;
            }
            
        }


        else
        {
          newDataObject = { 
            id:j.id,
            title:j.title,
            agenda_title:j.agenda.title,
            meeting_plan_meeting_agenda_id:j.meeting_plan_meeting_agenda_id,          
            is_editable:true,
            is_deleted:false,
            is_new:false}
        }
      

          MeetingsStore.setMinutesOfMeeting(newDataObject)
      }
    }

  }


  editMOM(position,MOMData){


    if(MOMData.display_user){
      this.MOMResponsibleUser=MOMData.display_user,
      this.MOMTargetDate=this._helperService.processDate(MOMData.target_date,'split')
      this.MOMActionPlanId=MOMData.meeting_action_plan_id,
      this.MOMAgenda=MOMData.agenda_title,
      this.MOMTitle=MOMData.title
      this.MOMId=MOMData.id,
      this.itemPosition=position
    }
    else{
      this.MOMAgenda=MOMData.agenda_title,
      this.MOMTitle=MOMData.title
      this.MOMId=MOMData.id,
      this.itemPosition=position
    }
    this.checkButtonCondition()
  }

  addMOM(){

    
    if(this.itemPosition || this.itemPosition==0)
    {

      if(this.MOMResponsibleUser){
        MeetingsStore.minutesOfMeeting[this.itemPosition]['target_date']=this._helperService.processDate( this.MOMTargetDate, 'join'),
        MeetingsStore.minutesOfMeeting[this.itemPosition]['responsible_user_id']=this.MOMResponsibleUser.id,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['display_user']=this.MOMResponsibleUser,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['meeting_action_plan_id']=this.MOMActionPlanId,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['title']=this.MOMTitle,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['agenda_title']=this.MOMAgenda?.title?this.MOMAgenda.title:this.MOMAgenda,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['meeting_plan_meeting_agenda_id']=this.MOMAgenda.id,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['is_new']=false,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['is_deleted']=false,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['id']=this.MOMId
      }
      else if(MeetingsStore.minutesOfMeeting[this.itemPosition]['is_editable']=true){
        MeetingsStore.minutesOfMeeting[this.itemPosition]['title']=this.MOMTitle,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['agenda_title']=this.MOMAgenda?.title?this.MOMAgenda.title:this.MOMAgenda,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['meeting_plan_meeting_agenda_id']=this.MOMAgenda.id,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['meeting_action_plan_id']=this.MOMActionPlanId,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['is_new']=false,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['is_deleted']=false,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['id']=this.MOMId
        this.MOMResponsibleUser=null,
        this.MOMTargetDate=null;
        MeetingsStore.minutesOfMeeting[this.itemPosition]['display_user']=null
       delete MeetingsStore.minutesOfMeeting[this.itemPosition]['responsible_user_id']
       delete MeetingsStore.minutesOfMeeting[this.itemPosition]['target_date']
      }
      else{
        MeetingsStore.minutesOfMeeting[this.itemPosition]['title']=this.MOMTitle,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['agenda_title']=this.MOMAgenda?.title?this.MOMAgenda.title:this.MOMAgenda,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['meeting_plan_meeting_agenda_id']=this.MOMAgenda.id,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['is_new']=false,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['is_deleted']=false,
        MeetingsStore.minutesOfMeeting[this.itemPosition]['id']=this.MOMId
      }

    setTimeout(() => {
      this._utilityService.showSuccessMessage('success','mom_updated')
      this.clearMomNgModels()
      this.checkButtonCondition()
      this._utilityService.detectChanges(this._cdr)
    }, 150);


    }

    else{

      let processedObject
  
      if(this.MOMResponsibleUser){

        processedObject={
          title:this.MOMTitle,
          agenda_title:this.MOMAgenda.title,
          meeting_plan_meeting_agenda_id:this.MOMAgenda.id,
          target_date:this._helperService.processDate( this.MOMTargetDate, 'join'),
          responsible_user_id:this.MOMResponsibleUser.id,
          display_user:this.MOMResponsibleUser,
          is_editable:false,
          is_new:true,
          is_deleted:false,
          is_deletable:true,
        }
  

      }
      else{
      
        processedObject={
          title:this.MOMTitle,
          agenda_title:this.MOMAgenda.title,
          meeting_plan_meeting_agenda_id:this.MOMAgenda.id,
          target_date:this._helperService.processDate( this.MOMTargetDate, 'join'),
          is_editable:false,
          is_new:true,
          is_deleted:false,
          is_deletable:true,
        }
    
        
      }

  
  
      if(MeetingsStore.minutesOfMeeting.some(el=>el.title==processedObject.title)){
        this._utilityService.showWarningMessage('item_already_added','')
        this.clearMomNgModels();
      }
      else{
        MeetingsStore.setMinutesOfMeeting(processedObject)
        this._utilityService.showSuccessMessage('success','mom_added')
        this.clearMomNgModels()
      }
      this.checkButtonCondition()
    }
  }


  removeMOM(position,MOMData){
    MeetingsStore.mappedActionPlan.splice(position, 1)
    this._utilityService.showSuccessMessage('success','mom_removed')
  }

  openMOMModal(){
    $(this.MOMModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }
  closeMOMModal(){
    $(this.MOMModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
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
      if(user?.designation_title){
        userInfoObject.designation = user?.designation_title;
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
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
    // Returns default image

    getStringsFormatted(stringArray, characterLength, seperator) {
      return this._helperService.getFormattedName(stringArray, characterLength, seperator);
    }

    getUsers() {
      var params = '';
      this._usersService.getAllItems(params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
  
    }
  
    searchUsers(e) {
      this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    customSearchFn(term: string, item: any) {
      term = term.toLowerCase();
      // Creating and array of space saperated term and removinf the empty values using filter
      let splitTerm = term.split(' ').filter(t => t);
      let isWordThere = [];
      // Pushing True/False if match is found
      splitTerm.forEach(arr_term => {
        item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
        let search = item['searchLabel'].toLowerCase();
        isWordThere.push(search.indexOf(arr_term) != -1);
      });
  
      const all_words = (this_word) => this_word;
      // Every method will return true if all values are true in isWordThere.
      return isWordThere.every(all_words);
    }



    clearMomNgModels(){
      this.MOMAgenda=null;
      this.MOMTitle=null;
      this.MOMTargetDate=null;
      this.MOMResponsibleUser=null;
      this.itemPosition=null;
      this.MOMId=null,
      this.MOMActionPlanId=null;
    }


    checkButtonCondition(){
      this.MOMTitle='';
      if(this.MOMAgenda && this.MOMTitle && this.MOMTargetDate && this.MOMResponsibleUser)
      this.buttonDisabled=false;
      if(this.MOMAgenda && this.MOMTitle && this.MOMTargetDate && !this.MOMResponsibleUser)
      this.buttonDisabled=true;
      if(this.MOMAgenda && this.MOMTitle && !this.MOMTargetDate && this.MOMResponsibleUser)
      this.buttonDisabled=true;
      if(this.MOMAgenda && this.MOMTitle && !this.MOMTargetDate && !this.MOMResponsibleUser)
      this.buttonDisabled=false;
      if(this.MOMAgenda && !this.MOMTitle && !this.MOMTargetDate && !this.MOMResponsibleUser)
      this.buttonDisabled=true;
      if(!this.MOMAgenda && !this.MOMTitle && !this.MOMTargetDate && !this.MOMResponsibleUser)
      this.buttonDisabled=true;
      if(this.MOMAgenda && !this.MOMTitle && this.MOMTargetDate && this.MOMResponsibleUser)
      this.buttonDisabled=true;
      if(!this.MOMAgenda && this.MOMTitle && this.MOMTargetDate && this.MOMResponsibleUser)
      this.buttonDisabled=true;
      
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }


  // MOM against agenda code ends here

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    this.eventSubscriptionAddParticipants.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.eventSubscriptionCancel.unsubscribe();
    this.eventSubscriptionVenue.unsubscribe();
    this.MOMModalSubscription.unsubscribe();
    this.actionPlanMapSubscription.unsubscribe();
    this.detailsActionPlanMapSubscription.unsubscribe();
    // this.meetingUsers=[];
    SubMenuItemStore.makeEmpty();
    MeetingsStore.unsetEditFlag();
    MeetingsStore.newMeetingsMom = [];
    this.freezeMeeting=false;
    MeetingsStore.unsetIndividualMeetingsDetails(); //meeting plan detials
    MeetingPlanStore.unSetMeetingPlan();//meeting plan list

    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
    MeetingsStore.clearMOMs();
    MeetingsStore.clearMappedActionPlan();
  }

}
