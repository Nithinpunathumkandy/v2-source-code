import { ChangeDetectorRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { AppStore } from 'src/app/stores/app.store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-meetings-info',
  templateUrl: './meetings-info.component.html',
  styleUrls: ['./meetings-info.component.scss']
})
export class MeetingsInfoComponent implements OnInit, OnDestroy {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('agendaItemsdiv', { static: false }) agendaItemsdiv: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  MeetingsStore = MeetingsStore;
  reactionDisposer: IReactionDisposer;
  MeetingPlanStore = MeetingPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  chart1:boolean=true;
  activeIndex = null;
  hover = false;
  pieChart:boolean=true;
  actionChartEnable:boolean=true;

  previewObject = {
    component: "",
    created_at: "",
    preview_url: null,
    componentId: null,
    file_details: null,
    uploaded_user: null,
  };

  deleteObject = {
    type: '',
    id: null,
    position: null,
    subtitle:''
  };

  deleteEventSubscription: any;

  constructor( 
    private _router:Router,
    private _cdr:ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _utilityService:UtilityService,
    private _meetingsService:MeetingsService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _discussionBotService: DiscussionBotService,
    private _meetingPlanFileService:MeetingPlanFileService,
    private _meetingPlanService:MeetingPlanService,
    private _humanCapitalService:HumanCapitalService
    ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "no_mrm_dashboard_data"});
    AppStore.showDiscussion = true;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"meetings",
        path:`/mrm/meetings`
      });
    }
    this.reactionDisposer = autorun(() => {

     this.getSubmenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
        
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
              setTimeout(() => {
                this._utilityService.detectChanges(this._cdr);
                MeetingsStore.setEditFlag();
                MeetingsStore.meetingListCancelFlag='Detials';
                if(MeetingsStore.individualMeetingsDetails?.is_unplanned)
                  this._router.navigateByUrl('/mrm/meetings/edit-unplanned-meeting');
                else
                this._router.navigateByUrl('/mrm/meetings/edit-meeting');
              }, 1000);
            break;
          case "delete":
            this.deleteMeetingPlan(MeetingsStore.meetingsId);
            break;
          case "go_to_meeting_plan":
            this.goToMeetingPlan();
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
      this.delete(item);
    });

    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._meetingsService.saveMeetingId(id);
      DiscussionBotStore.setDiscussionMessage([]);
      DiscussionBotStore.setbasePath('/meetings/');
      DiscussionBotStore.setDiscussionAPI(MeetingsStore.meetingsId+'/comments');
      this.downloadDiscussionThumbnial();
      this.getImagePrivew();
      this.showThumbnailImage();
      this.getDiscussions();
     
    })
    this.getDetials();
  }

   getDiscussions(){
     this._discussionBotService.getDiscussionMessage().subscribe(res=>{
       this._utilityService.detectChanges(this._cdr);
     })
   }
   downloadDiscussionThumbnial(){
     DiscussionBotStore.setThumbnailDownloadAPI(MeetingsStore.meetingsId+'/comments/')
   }

   showThumbnailImage(){
     DiscussionBotStore.setShowThumbnailAPI(MeetingsStore.meetingsId+'/comments/')
   }

   getImagePrivew(){
    DiscussionBotStore.setDiscussionThumbnailAPI('/mrm/files/meeting-comment-document/thumbnail?token=')
   }

  getDetials(){
    this._meetingsService.getItem(MeetingsStore.meetingsId).subscribe(res => {
      if (res) {
        if(res?.meeting_plan?.id){
          MeetingPlanStore.setMeetingPlanId(res?.meeting_plan?.id);
          this._meetingPlanService.getItem(res?.meeting_plan?.id).subscribe();
        }
        this.getActionPlanCount();
        this.getSubmenu();
        this.checkForObjectiveItemsScrollbar();
        setTimeout(() => {
          this.getPieChartAttendance(false);
        },100);
      }
    this._utilityService.detectChanges(this._cdr);
    })
  }

  getSubmenu(){
    let subMenuItems =[];
    if(MeetingsStore.individualMeetingsDetails?.is_unplanned){
      subMenuItems= [
        { activityName: 'UPDATE_MEETING', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_MEETING', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: {type: 'close',path:MeetingsStore.path}},
      ];
    } else{
      subMenuItems= [
        { activityName: null, submenuItem: { type: 'go_to_meeting_plan' } },
        { activityName: 'UPDATE_MEETING', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_MEETING', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: {type: 'close',path:MeetingsStore.path}},
      ];
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  goToMeetingPlan(){
    
    if(MeetingsStore.individualMeetingsDetails?.meeting_plan?.id){
      this._router.navigateByUrl('mrm/meeting-plans/' + MeetingsStore.individualMeetingsDetails?.meeting_plan?.id);
    }
  }

  getPieChartAttendance(refreshIssue:boolean){
    let absentCount=0;
    let presentCount=0;
    let data=MeetingsStore.individualMeetingsDetails?.meeting_participants;
    if(data){
      for(let participant of data){
        if(participant.is_present==false){
          absentCount=absentCount+1;        
        }else{
          presentCount=presentCount+1;
        }
      }
    }
    
    am4core.addLicense("CH199714744");
    am4core.useTheme(am4themes_animated);// Themes begin
    let chart = am4core.create("piechartdiv", am4charts.PieChart);// Create chart instance

    chart.data = [ {// Add data
      "Attendance": this._helperService.translateToUserLanguage("present"),
      "litres": presentCount,
      "color": am4core.color("#22bf38")
    }, {
      "Attendance": this._helperService.translateToUserLanguage("absent"),
      "litres": absentCount,
      "color": am4core.color("#da2002")
    }];
    
    chart.legend = new am4charts.Legend();// Add a legend
    chart.legend.maxWidth = 100;
    chart.legend.maxHeight = 150;
    chart.legend.scrollable = true;

    let pieSeries = chart.series.push(new am4charts.PieSeries()); // Add and configure Series
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "Attendance";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    pieSeries.hiddenState.properties.opacity = 1;  // This creates initial animation
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;

    if(refreshIssue){
      this.pieChart=false;
    }
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

  deleteMeetingPlan(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle="common_delete_subtitle";

    $(this.deletePopup.nativeElement).modal('show');
  }
  clearDeleteObject(){//delete
    this.deleteObject.id = null;
    this.deleteObject.type = '';
  }

  checkForObjectiveItemsScrollbar(){
    setTimeout(() => {
      if($(this.agendaItemsdiv?.nativeElement).height() >= 100){
        $(this.agendaItemsdiv?.nativeElement).mCustomScrollbar();
      }
      else{
        if (MeetingsStore.individualMeetingsDetails?.is_unplanned && 
          MeetingsStore.individualMeetingsDetails?.meeting_unplanned_agendas.length > 0)
        $(this.agendaItemsdiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }

  delete(status) {//delete
    if (status && this.deleteObject.id) {
      this._meetingsService.delete(this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('mrm/meetings');
        
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

  closePreviewModal(event) {//doc
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.created_at = "";
    this.previewObject.preview_url = "";
    this.previewObject.componentId = null;
    this.previewObject.file_details = null;
    this.previewObject.uploaded_user = null;
  }

  checkExtension(ext, extType) {//doc
    return this._imageService.checkFileExtensions(ext, extType)   
  }

  downloadMeetingPlanDocument(type, meetingPlan, meetingDocument,event) {//doc
    event.stopPropagation();
      switch (type) {
        case "downloadMeetingsDocument":
              this._meetingPlanFileService.downloadFile(
                "meetings-document",
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
    this._meetingPlanFileService.downloadFile('meetings-attachemt-all', id, null,null,MeetingsStore.individualMeetingsDetails.title+'-attachments');
  }

  getDefaultImage(type,token) {
    if(!token){
      return this._imageService.getDefaultImageUrl(type);
    }
  }
    
  createPrevImageUrl(type, token) {//doc
    return this._meetingPlanFileService.getThumbnailPreview(type, token);
  }

  viewMRMDocument(type, meetings, meetingsDocument) {//doc

    switch (type) {
      case "viewDocument":
        this._meetingPlanFileService
          .getFilePreview("meetings-document", meetings.id, meetingsDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              meetings.name
            );
            this.openPreviewModal(type, resp, meetingsDocument, meetings);
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
      case "meetings-document":
        this._meetingPlanFileService
          .getFilePreview(type, documents.meeting_id, documentFile.id)
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
    if(type=='meetings-document')
    return this._meetingPlanFileService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);

  }

  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "meetings-document":
        this._meetingPlanFileService.downloadFile(
          type,
          document.meeting_id,
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
      this.previewObject.componentId = document.meeting_id;
      
      this.previewObject.uploaded_user = MeetingsStore.individualMeetingsDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  getActionPlanCount(){
    this._meetingPlanService.getActionPlanCount(MeetingsStore.meetingsId).subscribe(res=>{
      let requiredDataFormat=[]
      if(res.meeting_action_plan_closed_count || res.meeting_action_plan_rejected_count || res.meeting_action_plan_resolved_count ||res.meeting_action_plan_wip_count || res.meeting_action_plan_open_count)
      {
        requiredDataFormat.push( 
          {
          id:1,
          title:'New',
          count:res.meeting_action_plan_open_count
          },
          {
          id:2,
          title:'Closed',
          count:res.meeting_action_plan_closed_count
          },
          {
          id:3,
          title:'Wip',
          count:res.meeting_action_plan_wip_count
          },
          {
          id:4,
          title:'Resolved',
          count:res.meeting_action_plan_resolved_count
          },  
          )
      }
  
      MeetingPlanStore.setActionPlan(requiredDataFormat);

      const enable=requiredDataFormat.find(element=>element.count>0);

      if(enable){
        this.actionChartEnable=true;
      }else{
        this.actionChartEnable=false;
      }

      this.createPieChartForActionPlan(false);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Action Plan Chart
   //chart pie-1
   createPieChartForActionPlan(refreshIssue:boolean) {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("actionPlanDiv", am4charts.PieChart);
    chart.data = MeetingPlanStore.actionPlan;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "MRMActionPlan"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Action Plans";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 14;

    chart.legend = new am4charts.Legend();
    // chart.legend.valueLabels.template.disabled = true;
    chart.legend.maxWidth = 85;
    chart.legend.maxHeight = 20;
    chart.legend.position = "right";
    // chart.legend.scrollable = true;
    
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0,0,0,0);
    chart.legend.fontSize= 12;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    // pieSeries.slices.template.propertyFields.fill = "color";
    //color
    pieSeries.colors.list = [
      am4core.color("#FFBB00"),
      am4core.color("#F7941D"),
      am4core.color("#8F5DB5"),
      am4core.color("#19C268"),
    ];
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.tooltipText =  "{category}: {value.percent.formatNumber('#.')}% ({value.value})";
    pieSeries.alignLabels = false;
    pieSeries.labels.template.disabled=true;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }

    if(refreshIssue){
      this.chart1=false;
    }
    
    this._utilityService.detectChanges(this._cdr);
  }

  
  createUserImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  processTime(start_time){
    return this._helperService.processTime(start_time,true)
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    am4core.disposeAllCharts();
    this.deleteEventSubscription.unsubscribe();
    // MeetingsStore.unsetIndividualMeetingsDetails(); //meeting detials
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    this.chart1=true;
  }

}
