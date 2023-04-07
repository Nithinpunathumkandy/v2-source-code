import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { element } from 'protractor';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('popupSingle') popupSingle: ElementRef;
  @ViewChild("cancelModal") cancelModal: ElementRef;
  @ViewChild('addParticipants') addParticipants: ElementRef;
  @ViewChild ('DateUpdateModal') DateUpdateModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  MeetingPlanStore = MeetingPlanStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  hover = false;
  activeIndex = null;
  hoverSingle =false;
  pieChart:boolean=true;

  toggleClassAgendas=true;
  toggleClassCrieteria=false;
  toggleClassObjectives=false;

  popupObject = {
    id: null,
    position: null,
    type: '',
    subtitle:''
  };

  cancelEventSubscription:any;
  deleteEventSubscription: any;
  dateUpadateEventSubscription:any;
  eventSubscriptionAddParticipants:any=null;

  countDownDate:any;
  days:any;
  hours:any;
  minute:any;
  seconds:any;
  timeUp=false;
  todayDate: any = new Date();

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr:ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService:UtilityService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _meetingPlanService:MeetingPlanService,
    private _eventEmitterService:EventEmitterService,
    private _documentFileService: DocumentFileService,
    private  _discussionBotService: DiscussionBotService,
    private _meetingPlanFileService:MeetingPlanFileService,
    private _humanCapitalService:HumanCapitalService
    ) { }


  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"meeting_plans",
      path:`/mrm/meeting-plans`
    });
    
    AppStore.showDiscussion = true;
    SubMenuItemStore.cancelClicked = false;

    this.reactionDisposer = autorun(() => {

      if(MeetingPlanStore?.individualLoaded){
        this.setSubMenuItems();
      }


      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              MeetingPlanStore.setEditFlag();
              MeetingPlanStore.editListCancelFlag='Detials';
              this._router.navigateByUrl('/mrm/meeting-plans/edit-meeting-plan');
            }, 1000);
            break;
          case "delete":
            this.deleteMeetingPlan();
            break;
          case "publish_modal":
            if(!SubMenuItemStore.cancelClicked)
            this.publishMeetingPlan();
            break; 
          case "is_attending":
            if(!SubMenuItemStore.cancelClicked)
            this.responseMeetingPlan('is_attending');
            break; 
          case "is_not_attending":
            if(!SubMenuItemStore.cancelClicked)
            this.notAttending('is_not_attending');
            break;
          case "is_may_be":
            if(!SubMenuItemStore.cancelClicked)
            this.responseMeetingPlan('is_may_be');
            break; 
          case "is_pending":
            if(!SubMenuItemStore.cancelClicked)
            this.responseMeetingPlan('is_pending');
            break;   
          case "cancel":
            // this.cancelMeetingPlan();
            this.meetingPlanCancel();
            break;        
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    setTimeout(() => {

      window.addEventListener('click', this.clickEvent, false);
      this._utilityService.detectChanges(this._cdr);

    }, 250);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.eventSubscriptionAddParticipants = this._eventEmitterService.addMeetingPlanParticipantsModal.subscribe(res => {
      this.closeModelParticipants(res);
    })

    this.dateUpadateEventSubscription = this._eventEmitterService.meetingPlanDateUpadateModal.subscribe(res => {
      this.colseDateUpdate(res);
    });

    this.cancelEventSubscription = this._eventEmitterService.meetingPlanCancelModal.subscribe(res => {
      this.colseMeetingPlanCancel(res);
    });

    //this.mytimerfunction();
    this.countDownDate=setInterval(() => { this.mytimerfunction(); }, 1000);
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._meetingPlanService.saveMeetingPlanId(id);
      this.getDetials();
      DiscussionBotStore.setDiscussionMessage([]);
      DiscussionBotStore.setbasePath('/meeting-plans/');
      DiscussionBotStore.setDiscussionAPI(MeetingPlanStore.meetingPlanId+'/comments');
      this.downloadDiscussionThumbnial();
      this.getImagePrivew();
      this.showThumbnailImage();
      this.getDiscussions();
    })

  }

	setSubMenuItems() {
		var subMenuItems=[];

		if(MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_status?.type  == 'draft'){
      // 1.crated by and Organiser by only publish options (publish, edit, delete, close) else (edit,delete,close) 
      // 2.past date plan do not publish options (edit, delete,close)  else (edit,delete,close) 
      if(this.createdByDraft() || this.organiserByDraft()){
        //publish,edit,delete,close
        if(this.compareDays()){ 
          // Past date and time
          subMenuItems=[
            { activityName: 'UPDATE_MEETING_PLAN', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MEETING_PLAN', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: {type: 'close',path:'../'}},
          ];
        }else{
           // dit not Past date and time
           
          subMenuItems=[
            { activityName: 'UPDATE_MEETING_PLAN', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MEETING_PLAN', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: {type: 'close',path:'../'}},
          ];
          if(MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_meeting_agendas.length>0){
            subMenuItems.unshift ({ activityName: null, submenuItem: { type: 'publish_modal' } })
         }
        }
      }else{
        // All users (edit, delete , close)
        subMenuItems=[
          { activityName: 'UPDATE_MEETING_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_MEETING_PLAN', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: {type: 'close',path:'../'}},
        ];
      }
    }
		else if (MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_status?.type  == 'upcoming' ){
      // 1. Participants users (attending,not attending, maybe, edit, delete, close)  
      // 2. esle createby,orgztion (cancel,edit,delete,close) else (delete,edit, close) 
      if( this.isUser() && !MeetingPlanStore?.individualMeetingPlanDetails?.meeting){
        subMenuItems = [
          { activityName: null, submenuItem: { type: 'is_attending' } },
          { activityName: null, submenuItem: { type: 'is_not_attending' } },
          { activityName: null, submenuItem: { type: 'is_may_be' } },
          // { activityName: 'UPDATE_MEETING_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_MEETING_PLAN', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: {type: 'close',path:'../'}},
        ];
      }else{
        if(this.createdByDraft() || this.organiserByDraft()){
          subMenuItems = [
            // { activityName: 'UPDATE_MEETING_PLAN', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MEETING_PLAN', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: { type: 'cancel' } },
            { activityName: null, submenuItem: {type: 'close',path:'../'}},
          ];
        } else{
          subMenuItems = [
            // { activityName: 'UPDATE_MEETING_PLAN', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MEETING_PLAN', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: {type: 'close',path:'../'}},
          ];
        }
      }
		}
		else {
      //1. cancelled all disble
      if(MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_status?.type  == 'cancelled'){
        subMenuItems=[
          { activityName: null, submenuItem: {type: 'close',path:'../'}},
        ];
      }else{
        subMenuItems=[
          { activityName: null, submenuItem: {type: 'close',path:'../'}},
        ];
      }
		}
		this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
	}

  isUser() {
    if(MeetingPlanStore.individualLoaded){
      let conditionMatch:boolean=false;

      for(let i of MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_users ){
        if (i.user.id==AuthStore.user.id){
          conditionMatch=true;
          break
        }
      }
      return conditionMatch
    }
    else{
      return false;
    }
  }

  createdByDraft(){
    if(AuthStore.user?.id == MeetingPlanStore.individualMeetingPlanDetails?.created_by?.id)
      return true;
    else  
      return false;
  }

  organiserByDraft(){
    if(AuthStore.user?.id == MeetingPlanStore.individualMeetingPlanDetails?.organizer?.id)
      return true;
    else  
      return false;
  }

  compareDays(){// past date plan do not publish options 
    var objDate=new Date(MeetingPlanStore.individualMeetingPlanDetails?.start_date);
    return (this.todayDate.getTime() / 1000) > (objDate.getTime() / 1000) ? true :false;
  }

  getDiscussions(){
    this._discussionBotService.getDiscussionMessage().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  downloadDiscussionThumbnial(){
    DiscussionBotStore.setThumbnailDownloadAPI(MeetingPlanStore.meetingPlanId+'/comments/')
  }

  showThumbnailImage(){
    DiscussionBotStore.setShowThumbnailAPI(MeetingPlanStore.meetingPlanId+'/comments/')
  }

  getImagePrivew(){
  DiscussionBotStore.setDiscussionThumbnailAPI('/mrm/files/meeting-plan-comment-document/thumbnail?token=')
  }
  
  getDetials(){
    this._meetingPlanService.getItem(MeetingPlanStore.meetingPlanId).subscribe(res=>{
      if(res){
        
        setTimeout(() => {
          this.getPieChartAttendance(false);
          this.setSubMenuItems();
          this.mytimerfunction();
        },100);
      }
    this._utilityService.detectChanges(this._cdr);
    });

  }

  getReposonceSub(){

    let data=MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_users;
    for(let i=0;i<=data.length;i++){
      
      if(AuthStore.getUserId()){
        if(data[i]?.user?.id==AuthStore.getUserId()){
          
          var subMenuItems = [
            { activityName: null, submenuItem: { type: 'is_attending' } },
            { activityName: null, submenuItem: { type: 'is_not_attending' } },
            { activityName: null, submenuItem: { type: 'is_may_be' } },
            // { activityName: null, submenuItem: { type: 'is_pending' } },
            { activityName: 'UPDATE_MEETING_PLAN', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MEETING_PLAN', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: {type: 'close',path:'../'}},
          ]
          this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
          break;
        }{
          var subMenuItems = [
            { activityName: 'UPDATE_MEETING_PLAN', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MEETING_PLAN', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: {type: 'close',path:'../'}},
          ]
          this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
        }
      }
    }
  }

  getEmployeePopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status.id;
    userDetial['created_at'] = created? created:null;
  return userDetial;

  }

  getPieChartAttendance(refreshIssue:boolean){
    let pendingCount:number=0;
    let attendingCount:number=0;
    let notAttendingCount:number=0;
    let mayBeCount:number=0;

  if(MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_users){

    let data=MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_users;
    for(let participant of data){
      if(participant.is_pending){
        pendingCount= pendingCount + 1;
      }
      else if(participant.is_attending){
        attendingCount= attendingCount + 1;
      }
      else if(participant.is_not_attending){
        notAttendingCount= notAttendingCount + 1;
      }
      else if(participant.is_may_be){
        mayBeCount= mayBeCount + 1;
      }
    }

  }
    am4core.addLicense("CH199714744");
    // Themes begin
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    let chart = am4core.create("piechartdiv", am4charts.PieChart);

    // Add data
    chart.data = [ {
      "Attendance": this._helperService.translateToUserLanguage("pending"),
      "litres": pendingCount,
      "color": am4core.color("#0088FF")
    }, {
      "Attendance": this._helperService.translateToUserLanguage("attending"),
      "litres": attendingCount,
      "color": am4core.color("#22bf38")
    }, {
      "Attendance": this._helperService.translateToUserLanguage("not_attending"),
      "litres": notAttendingCount,
      "color": am4core.color("#da2002")
    }, {
      "Attendance": this._helperService.translateToUserLanguage("may_be"),
      "litres": mayBeCount,
      "color": am4core.color("#f7941d")
    }
    ];
    
    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.maxWidth = 100;
    chart.legend.maxHeight = 150;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "Attendance";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;
    if(refreshIssue){
      this.pieChart=false;
    }
  }

  // Run myfunc every second
  mytimerfunction(){

    const countDownDate = new Date(this.getTimezoneFormatted(MeetingPlanStore?.individualMeetingPlanDetails?.start_date)).getTime();
      let NowDate= new Date();
      var  now = this.getTimezoneFormatted(NowDate).getTime();
  
      var  timeleft = countDownDate - now;

      // Calculating the days, hours, minutes and seconds left
      let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
      
          
      // Result is output to the specific element
      this.days = days;
      this.hours = hours;
      this.minute = minutes;
      this.seconds = seconds;
    
      if (timeleft < 0) {  
        this.timeUp=true;
        // clearInterval(this.countDownDate);
      }else{
        this.timeUp=false;
      }
      
      this._utilityService.detectChanges(this._cdr);
  }

  dateUpdate(){
    MeetingPlanStore.date_update_modal_form=true;
    $(this.DateUpdateModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  colseDateUpdate(res){
    MeetingPlanStore.date_update_modal_form=false;
    $(this.DateUpdateModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    if(res){
      MeetingPlanStore.individualLoaded=false;
      this.getDetials();
    }
  }

  meetingPlanCancel(){
    MeetingPlanStore.cancel_modal_form=true;
    $(this.cancelModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.cancelModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  colseMeetingPlanCancel(res){
    MeetingPlanStore.cancel_modal_form=false;
    $(this.cancelModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.cancelModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    if(res){
      MeetingPlanStore.individualLoaded=false;
      this.getDetials();
    }
  }
    
  addModelParticipants(){
    $(this.addParticipants.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }  

  closeModelParticipants(res){
    
    $(this.addParticipants.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // if(res){
    //   MeetingPlanStore.individualLoaded=false;
    //   this.getDetials();
    // }
  }

  modalControl(status: boolean) {
    
    
    switch (this.popupObject.type) {
      case 'Delete': this.delete(status);
        break;
      case 'Publish': this.publish(status);
        break;
      case 'is_attending': this.response(status,this.popupObject.type);
        break;
      case 'is_may_be': this.response(status,this.popupObject.type);
        break;
      case 'is_not_attending': this.response(status,this.popupObject.type);
        break;
      case 'is_pending': this.response(status,this.popupObject.type);
        break;  
      // case 'Cancel': this.cancel(status);
      //   break;  
      case 'partcipant_cancel': this.partcipantsCancel(status);
        break;    
      default:
      break;
    }
  }

  meetingPartcipantsCancel(users){
    this.popupObject.id = users?.id;
    this.popupObject.type = 'partcipant_cancel';
    this.popupObject.subtitle="are_you_sure_want_to_cancel_meeting_partcipant";

    $(this.deletePopup.nativeElement).modal('show');
  }

  // cancelMeetingPlan(){
  //   this.popupObject.id = MeetingPlanStore.meetingPlanId;
  //   this.popupObject.type = 'Cancel';
  //   this.popupObject.subtitle="are_you_sure_want_to_cancel_this_meeting_plan";

  //   $(this.deletePopup.nativeElement).modal('show');
  // }

  notAttending(reponse){
    this.popupObject.id = MeetingPlanStore.meetingPlanId;
    this.popupObject.type = reponse;
    this.popupObject.subtitle='the_organizer_will_be_notified_that_you_will_not_be_available_for_the_meeting';

    $(this.deletePopup.nativeElement).modal('show');
  }

  responseMeetingPlan(reponse){
    this.popupObject.id = MeetingPlanStore.meetingPlanId;
    this.popupObject.type = reponse;
    this.popupObject.subtitle=`are_you_sure_want_to_${reponse}`;

    $(this.deletePopup.nativeElement).modal('show');
  }

  publishMeetingPlan(){
    this.popupObject.id = MeetingPlanStore.meetingPlanId;
    this.popupObject.type = 'Publish';
    this.popupObject.subtitle="it_will_send_invitation_to_all_meeting_participants";

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteMeetingPlan(){
    this.popupObject.id = MeetingPlanStore.meetingPlanId;
    this.popupObject.type = 'Delete';
    this.popupObject.subtitle="common_delete_subtitle";

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {
    setTimeout(() => {
      this.popupObject.id = null;
      this.popupObject.type = '';
    }, 500);
  }

  partcipantsCancel(status){
    
    if (status && this.popupObject.id) {
      MeetingPlanStore.individualLoaded=false;
      this._meetingPlanService.deletePartcipation(MeetingPlanStore.meetingPlanId,this.popupObject.id).subscribe(res=>{
        this.getDetials();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearDeleteObject();
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  
  }


  // cancel(status){
    
  //   if (status && this.popupObject.id) {
  //     MeetingPlanStore.individualLoaded=false;
  //     SubMenuItemStore.cancelClicked = true;

  //     this._meetingPlanService.meetingPlanCancel(this.popupObject.id).subscribe(res=>{
  //       this.getDetials();
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
        
  //       }, 500);
  //       this.clearDeleteObject();
  //       });
  //   }
  //   else {
  //     this.clearDeleteObject();
  //   }
  //   setTimeout(() => {
  //     $(this.deletePopup.nativeElement).modal('hide');
  //   }, 250);
  
  // }

  response(status,type){
    
    if (status && this.popupObject.id) {
      MeetingPlanStore.individualLoaded=false;
      SubMenuItemStore.cancelClicked = true;

      this._meetingPlanService.meetingPlanresponse(this.popupObject.id,type).subscribe(res=>{
        this.getDetials();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearDeleteObject();
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  
  }

  publish(status){

    if (status && this.popupObject.id) {
      MeetingPlanStore.individualLoaded=false;
      SubMenuItemStore.cancelClicked = true;

      this._meetingPlanService.publishMeetingPlan(this.popupObject.id).subscribe(res=>{
        this.getDetials();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearDeleteObject();
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  
  }

  delete(status) {
    if (status && this.popupObject.id) {

      this._meetingPlanService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('mrm/meeting-plans');
        
        }, 500);
        this.clearDeleteObject();

      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  clickEvent = (event: any): void => {
    this.activeIndex = null;
    this.hover = false;
    this._utilityService.detectChanges(this._cdr);
  }

  getArrayFormatedString(type,items,languageSupport?){
    let item=[];
    if(languageSupport){
      for(let i of items){
        for(let j of i.language){
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',',type,items);
  }

  createUserImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type,token) {
    if(!token){
      return this._imageService.getDefaultImageUrl(type);
    }
  }

  // Returns image url according to type and token
  createPrevImageUrl(type, token) {
    return this._meetingPlanFileService.getThumbnailPreview(type, token);
  }

  // preview modal open function
  // openPreviewModal(type, filePreview, mrmDocument, meetingPlan) {
  //   switch (type) {
  //     case "viewDocument":
  //       this.previewObject.component = "meeting-plan-document";
  //       break;
  //     default:
  //       break;
  //   }

  //   let previewItem = null;
  //   if (filePreview) {
  //     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
  //     this.previewObject.preview_url = previewItem;
  //     this.previewObject.file_details = mrmDocument;
  //     if (type == "viewDocument") {
  //       this.previewObject.componentId = meetingPlan.id;
  //     } else {
  //       this.previewObject.componentId = meetingPlan.id;
  //     }

  //     this.previewObject.uploaded_user =
  //     meetingPlan.updated_by.length > 0 ? meetingPlan.updated_by : meetingPlan.created_by;
  //     this.previewObject.created_at = meetingPlan.created_at;
  //     $(this.filePreviewModal.nativeElement).modal("show");
  //     this._utilityService.detectChanges(this._cdr);
  //   }
  // }

   // Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

   // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)
  }

  // for downloading files
  downloadMeetingPlanDocument(type, meetingPlan, meetingDocument,event) {
    event.stopPropagation();
    switch (type) {
      case "downloadMeetingPlanDocument":
        this._meetingPlanFileService.downloadFile(
          "meeting-plan-document",
          meetingPlan.id,
          meetingDocument.id,
          null,
          meetingDocument.title,
          meetingDocument
        );
        break;

    }

  }

  downloadAllAttachments(id){
    this._meetingPlanFileService.downloadFile('meeting-plan-attachemt-all', id, null,null,MeetingPlanStore.individualMeetingPlanDetails.title+'-attachments');
  }
  

  viewMRMDocument(type, meetingPlan, meetingPlanDocument) {
    
    switch (type) {
      case "viewDocument":
        this._meetingPlanFileService
          .getFilePreview("meeting-plan-document", meetingPlan.id, meetingPlanDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              meetingPlan.name
            );
            this.openPreviewModal(type, resp, meetingPlanDocument, meetingPlan);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
    }
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

// kh-module base document
  viewDocument(type, documents, documentFile) {
    
    switch (type) {
      case "meeting-plan-document":
        this._meetingPlanFileService
          .getFilePreview(type, documents.meeting_plan_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
  
        case "document-version":
          this._documentFileService
            .getFilePreview(type, documents.document_id, documentFile.id)
            .subscribe((res) => {
              var resp: any = this._utilityService.getDownLoadLink(
                res,
                documents.title
              );
              this.openPreviewModal(type, resp, documentFile, documents);
            }),
            (error) => {
              if (error.status == 403) {
                this._utilityService.showErrorMessage(
                  "Error",
                  "Permission Denied"
                );
              } else {
                this._utilityService.showErrorMessage(
                  "Error",
                  "Unable to generate Preview"
                );
              }
            };
          break;

    }
  }

  // kh-module base document- Returns image url according to type and token
  createImageUrl(type, token) {
    if(type=='meeting-plan-document')
    return this._meetingPlanFileService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);

  }

  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "meeting-plan-document":
        this._meetingPlanFileService.downloadFile(
          type,
          document.meeting_plan_id,
          document.id,
          null,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
  }

  // kh-module base document
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type;
  
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.meeting_plan_id;
      
      this.previewObject.uploaded_user = MeetingPlanStore.individualMeetingPlanDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  processTime(start_time){
    return this._helperService.processTime(start_time,true)
  }

  getColorKey(){
    let label_color = MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_status?.label.split('-');
    
    return 'draft-tag-'+label_color[0];
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.pieChart=true;
    SubMenuItemStore.cancelClicked = false;
    am4core.disposeAllCharts();
    SubMenuItemStore.makeEmpty();
    clearInterval(this.countDownDate);
    this.deleteEventSubscription.unsubscribe();
    MeetingPlanStore.unsetIndividualMeetingPlanDetails();//meeting plan Detials
    this.cancelEventSubscription.unsubscribe();
    MeetingsStore.unsetIndividualMeetingsDetails();
    this.dateUpadateEventSubscription.unsubscribe();
    this.eventSubscriptionAddParticipants.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}

