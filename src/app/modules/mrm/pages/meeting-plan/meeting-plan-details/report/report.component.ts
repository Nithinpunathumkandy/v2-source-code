
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ReportStore } from 'src/app/stores/mrm/meeting-report/meeting-report.store';
import { MeetingReportService } from 'src/app/core/services/mrm/meeting-report/meeting-report.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { AppStore } from 'src/app/stores/app.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import * as htmlToImage from 'html-to-image';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
declare var $: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  ReportStore = ReportStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;

  reactionDisposer: IReactionDisposer;
  downloadMessage: string = '';

  reportObject = {
    type: null,
    values: null,
  }

  meetingId:number=null;
  reportId:number=null;

  modalEventSubscription: any;
  selectedMeeting: any = null;

  constructor(
    private _helperService: HelperServiceService,
    // private _renderer2: Renderer2,
    // private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _reportService: MeetingReportService,
    private _humanCapitalService: HumanCapitalService,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private route: ActivatedRoute,
    private _meetingPlanFileService:MeetingPlanFileService,
    private _meetingsService:MeetingsService,
  ) { }

  ngOnInit(): void {

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"meeting_plans",
      path:`/mrm/meeting-plans`
    });

    this.reactionDisposer = autorun(() => {

      this.getSubmenu();

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_report' });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            // this.downloadMessage = "exp_meeting_report"
            // this.exportChart();
            this._reportService.exportToPdf(this.reportId);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();

      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.addReport();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    this.meetingListPlanItem();
  }

  //meeting list meeting_plan_id use get Item
  meetingListPlanItem(){
    this._meetingsService.meetingPlanGetMeetingItemId(MeetingPlanStore.meetingPlanId).subscribe(res=>{
      this.meetingId=res?.data[0]?.id;
      
    if( this.meetingId){
      this.getMeetingDetials( this.meetingId);
    }else{
      ReportStore.setMeetingReportDetailsLoaded();
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: null });
    }
    this._utilityService.detectChanges(this._cdr);
  })
  }

   //meeting Detials api
  getMeetingDetials(meetingId){
    this._meetingsService.getItem(meetingId).subscribe(res=>{
      if(res){
        this.pageChange(1);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

 //Report List api
  pageChange(newPage: number = null) {
    if (newPage) ReportStore.setCurrentPage(newPage);
    this._reportService.getItems(false, `&meeting_ids=${this.meetingId}`).subscribe((res) => {
      this.reportId = res.data[0]?.id;
      if (this.reportId) {
        this.getReportDetails(this.reportId);
      } else {
        ReportStore.setMeetingReportDetailsLoaded();
      }
    });
  }

  //Report Detials api
  getReportDetails(id) {

    this._reportService.getItem(id).subscribe(res => {
      if(res){
        this.getSubmenu();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSubmenu(){
    let subMenuItems=[]
    if(this.reportId){
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
    }else{
    subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
    }
    this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
  }

  addReport() {

    this.selectedMeeting = {
      id: MeetingsStore.individualMeetingsDetails?.id,
      title: MeetingsStore.individualMeetingsDetails?.title,
      start: MeetingsStore.individualMeetingsDetails?.start,
    }

    this.reportObject.type = 'Add';
    this.reportObject.values = null;
    ReportStore.editFlag = false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    this.pageChange(1);
    $(this.formModal.nativeElement).modal('hide');
    this.reportObject.type = null;
  }

  createImageUrl(token,type?) {
    if(type=='report-cover-page'){
      return this._meetingPlanFileService.getThumbnailPreview('report-cover-page',token);
    }else{
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }

  exportChart() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    let element: HTMLElement;
    // if(this.chartType == 'user-wise')
    //   element = document.getElementById("capture-user");
    // else
    element = document.getElementById('capture-report');
    let pthis = this;
    htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
      .then(function (dataUrl) {
        var reader = new FileReader();
        reader.readAsDataURL(dataUrl);
        reader.onloadend = function () {
          var base64data = reader.result;
          pthis.downloadPdf(base64data);
        }
        // var link = document.createElement('a');
        // link.download = `MeetingReport.jpeg`;
        // link.href = dataUrl;
        // link.click();
        // SubMenuItemStore.exportClicked = false;
        // pthis.closeLoaderPopUp();
      });
  }

  downloadPdf(file) {
    this._imageService.getPdf(file).subscribe(res => {
      SubMenuItemStore.exportClicked = false;
      this.closeLoaderPopUp();
    }, (error => {
      SubMenuItemStore.exportClicked = false;
      this.closeLoaderPopUp();
    })
    )
  }

  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  passOrganizationIssueCategories(organizationIssueCategories) {
    return this.getArrayFormatedString('title', organizationIssueCategories);
  }

  passOrganizationIssueIypes(organizationIssueTypes) {
    let issue_types_list = [];

    for (let j of organizationIssueTypes) {
      issue_types_list.push(j.title);
    }
    return issue_types_list;
  }

  passIssueDomains(organizationIssueDomains) {
    return this.getArrayFormatedString('title', organizationIssueDomains);
  }

  passdepartments(departments) {
    return this.getArrayFormatedString('title', departments);
  }
  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  checkDepartment(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }
  checkRiskCategory(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }

  checkRiskType(department) {
    if (typeof department === 'object') {
      let e;
      e = this._helperService.getArrayProcessed(department, 'is_external').toString();
      if (e === "1") {
        return "External";
      }
      let i = this._helperService.getArrayProcessed(department, 'is_internal').toString();
      if (i === "1") {
        return "Internal"
      }
      else {
        return "External,Internal"
      }
    }
    else {
      return department;
    }


  }
  getEmployeePopupDetails(users, auth?: string,present?:number) { //user popup

    let userDetails: any = {};
    if (users) {
      userDetails['first_name'] = users?.first_name ? users?.first_name : users?.name;
      userDetails['last_name'] = users?.last_name;
      userDetails['image_token'] = users?.image?.token ? users?.image.token : users?.image_token ? users?.image_token : null;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status_id ? users?.status_id : users?.status.id;
      // userDetails['created_at'] =auth? new Date():null;
      userDetails['designation'] = users?.designation ? users?.designation : users?.designation_title;
      userDetails['present'] = present;
    }
    return userDetails;
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  backgroundCover(tokan){
    return 'url('+this.createImageUrl(tokan,'report-cover-page')+')'
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ReportStore.unsetReportDetails();//Report Detials
    this.modalEventSubscription.unsubscribe();
    MeetingsStore.unSetMeetings();//meeting list
    MeetingsStore.unsetIndividualMeetingsDetails();//meeting Detials
    ReportStore.unsetMeetingReportsList();//Report list
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
}

