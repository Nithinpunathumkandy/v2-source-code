import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';

declare var $: any;
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  MeetingsStore = MeetingsStore;
  MeetingPlanStore = MeetingPlanStore;
  reactionDisposer: IReactionDisposer;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;


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
  };

  pieChart:boolean=true;
  chart1:boolean=true;
  actionChartEnable:boolean=true;

  constructor( 
    private _router:Router,
    private _route: ActivatedRoute,
    private _cdr:ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService:UtilityService,
    private _meetingsService:MeetingsService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _meetingPlanService:MeetingPlanService,
    private _eventEmitterService:EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _humanCapitalService:HumanCapitalService,
    private _meetingPlanFileService:MeetingPlanFileService,) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    MeetingsStore.PlanInsideindividualLoaded=false;

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        // { activityName: 'DELETE_MEETING', submenuItem: { type: 'delete' } },
        // {activityName: 'CREATE_MEETING', submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'meeting_can_not_create_until_meeting_plan_is_published', buttonText: null});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //   MeetingsStore.meetingsId=null;
          //   this.MeetingsStore.clearDocumentDetails();
          //   MeetingsStore.newMeetingsMom = [];
          //   this.addnewMeeting();
          //   break;
          // case "delete":
          //   this.deleteMeetingPlan(MeetingsStore.meetingsId);
          //   break;
          default:
            break;
        }

        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        MeetingsStore.setmeetingPlaninsideMeetingAddFlag();
        this.addnewMeeting();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    });

    // this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    //   this.delete(item);
    // });

    this._meetingsService.meetingPlanGetMeetingItemId(MeetingPlanStore.meetingPlanId).subscribe(res=>{
      let meetingId=res?.data[0]?.id;
      if(meetingId){
        this.getMeetingDetials(meetingId);
      }else{
        MeetingsStore.PlanInsideindividualLoaded=true;
      }
      this._utilityService.detectChanges(this._cdr);
    })

  //   this._router.events.subscribe((res) => { 
  //     const myArr = this._router.url.split("/");
  //     if(parseInt(myArr[3])){
  //       this._meetingPlanService.saveMeetingPlanId(parseInt(myArr[3]));
  //     }
  // })
    
    this.getMeetingPlanDetials();
  }

  getMeetingPlanDetials(){
    this._meetingPlanService.getItem(MeetingPlanStore.meetingPlanId).subscribe(res=>{
      if(res){
        if(MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_status?.type=='upcoming'){
          MeetingsStore.meetingsId=null;
          NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_meeting'});
        }
      }
    this._utilityService.detectChanges(this._cdr);
    });

  }

  addnewMeeting(){
    this._router.navigateByUrl('mrm/meetings/add-meeting');
  }

  getMeetingDetials(meetingId){
    this._meetingsService.getItem(meetingId).subscribe(res=>{
      if(res){
        this.getActionPlanCountChart(meetingId);
        setTimeout(() => {
          this.getPieChartAttendance(false);
        },100);
      }
      this._utilityService.detectChanges(this._cdr);
    })
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
      "Attendance": "Present",
      "litres": presentCount,
      "color": am4core.color("#22bf38")
    }, {
      "Attendance": "Absent",
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

  // deleteMeetingPlan(id){//delete
  //   this.deleteObject.id = id;
  //   this.deleteObject.type = 'Delete';
  //   $(this.deletePopup.nativeElement).modal('show');
  // }
  // clearDeleteObject(){//delete
  //   this.deleteObject.id = null;
  //   this.deleteObject.type = '';
  // }

  // delete(status) {//delete
  //   if (status && this.deleteObject.id) {
  //     this._meetingsService.delete(this.deleteObject.id).subscribe(resp => {
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //         this._router.navigateByUrl('mrm/meetings');
        
  //       }, 500);
  //       this.clearDeleteObject();
  //     });
  //   }
  //   else {
  //     this.clearDeleteObject();
  //   }
  //   setTimeout(() => {
  //     $(this.deletePopup.nativeElement).modal('hide');
  //   }, 250);
  // }

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

  // openPreviewModal(type, filePreview, mrmDocument, meetings) {//doc 
  //     switch (type) {
  //       case "viewDocument":
  //         this.previewObject.component = "meetings-document";
  //         break;
  //       default:
  //         break;
  //     }
  
  //     let previewItem = null;
  //     if (filePreview) {
  //       previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
  //       this.previewObject.preview_url = previewItem;
  //       this.previewObject.file_details = mrmDocument;
  //       if (type == "viewDocument") {
  //         this.previewObject.componentId = meetings.id;
  //       } else {
  //         this.previewObject.componentId = meetings.id;
  //       }
  
  //       this.previewObject.uploaded_user =
  //       meetings.updated_by.length > 0 ? meetings.updated_by : meetings.created_by;
  //       this.previewObject.created_at = meetings.created_at;
  //       $(this.filePreviewModal.nativeElement).modal("show");
  //       this._utilityService.detectChanges(this._cdr);
  //     }
  // }

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

    
    getActionPlanCountChart(meetingId){
      this._meetingPlanService.getActionPlanCount(meetingId).subscribe(res=>{
        let requiredDataFormat=[]
    
        requiredDataFormat.push( 
            {
            id:1,
            title:'New',
            count:res.meeting_action_plan_open_count? res.meeting_action_plan_open_count:0
            },
            {
            id:2,
            title:'Closed',
            count:res.meeting_action_plan_closed_count? res.meeting_action_plan_closed_count: 0
            },
            {
            id:3,
            title:'Wip',
            count:res.meeting_action_plan_wip_count ? res.meeting_action_plan_wip_count: 0
            },
            {
            id:4,
            title:'Resolved',
            count:res.meeting_action_plan_resolved_count ? res.meeting_action_plan_resolved_count: 0
            },  
        );
    
        MeetingPlanStore.setActionPlan(requiredDataFormat) 
  
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


    // MOM Against agenda change

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
        userInfoObject.image_token = user?.image_token;
        userInfoObject.email = user?.email;
        userInfoObject.mobile = user?.mobile;
        userInfoObject.id = user?.team_lead_id;
        userInfoObject.status_id = user?.status?.id
        userInfoObject.department = user?.department;
        return userInfoObject;
      }
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
    MeetingsStore.unSetMeetings();//meeting list
    MeetingsStore.unsetIndividualMeetingsDetails();//meeting Detials
    MeetingPlanStore.unsetIndividualMeetingPlanDetails();//meeting plan Detials
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
