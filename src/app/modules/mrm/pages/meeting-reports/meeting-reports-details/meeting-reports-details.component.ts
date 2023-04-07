import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import * as htmlToImage from 'html-to-image';
import { ReportStore } from 'src/app/stores/mrm/meeting-report/meeting-report.store';
import { MeetingReportService } from 'src/app/core/services/mrm/meeting-report/meeting-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';

declare var $: any;

@Component({
  selector: 'app-meeting-reports-details',
  templateUrl: './meeting-reports-details.component.html',
  styleUrls: ['./meeting-reports-details.component.scss']
})
export class MeetingReportsDetailsComponent implements OnInit {

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  ReportStore = ReportStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;

  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  reactionDisposer: IReactionDisposer;
  downloadMessage: string = '';
  constructor(
    private _helperService: HelperServiceService,
    // private _renderer2: Renderer2,
    // private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _reportService: MeetingReportService,
    private _humanCapitalService: HumanCapitalService,
    private _router: Router, private _imageService: ImageServiceService,
    private route: ActivatedRoute,
    private _meetingPlanFileService:MeetingPlanFileService,
  ) { }

  ngOnInit(): void {
    
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      this.getReportDetails(id);
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"meeting_reports",
        path:`/mrm/meeting-reports`
      });
    }
    
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        {activityName: null, submenuItem: {type: 'close', path: '../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            // this.downloadMessage="exp_meeting_report"
            // this.exportChart();
            this._reportService.exportToPdf(id);
            break;
          default:
            break;
        }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
    })
    
  }

  getReportDetails(id)  {
   
    this._reportService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      })
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token,type?) {
    if(type=='report-cover-page'){
      return this._meetingPlanFileService.getThumbnailPreview('report-cover-page',token);
    }else{
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }

  exportChart(){
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
      reader.onloadend = function() {
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

  downloadPdf(file){
    this._imageService.getPdf(file).subscribe(res=>{
      SubMenuItemStore.exportClicked = false;
      this.closeLoaderPopUp();
    },(error=>{
      SubMenuItemStore.exportClicked = false;
      this.closeLoaderPopUp();
    })
    )
  }

  closeLoaderPopUp(){
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  passOrganizationIssueCategories(organizationIssueCategories){
    return this.getArrayFormatedString('title',organizationIssueCategories);
  }

  passOrganizationIssueIypes(organizationIssueTypes){
    let issue_types_list=[];

    for(let j of organizationIssueTypes){
      issue_types_list.push(j.title);
    }
    return issue_types_list;
  }

  passIssueDomains(organizationIssueDomains){
    return this.getArrayFormatedString('title',organizationIssueDomains);
  }

  passdepartments(departments){
    return this.getArrayFormatedString('title',departments);
  }
  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  checkDepartment(department){
    if(typeof department==='object') {
      return this._helperService.getArrayProcessed(department,'title').toString();
      }
      else{
        return department;
      } 
  }
  checkRiskCategory(department){
    if(typeof department==='object') {
      return this._helperService.getArrayProcessed(department,'title').toString();
      }
      else{
        return department;
      } 
  }

  checkRiskType(department){
    if(typeof department==='object') {
      let e;
      e=this._helperService.getArrayProcessed(department,'is_external').toString();
      if(e==="1"){
        return "External";
      }
      let i=this._helperService.getArrayProcessed(department,'is_internal').toString();
      if(i==="1"){
        return "Internal"
      }
      else{
        return "External,Internal"
      }
      }
      else{
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

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  backgroundCover(tokan){

    let encode=btoa(this.createImageUrl(tokan,'report-cover-page'));
    
    // return 'url(data:image/jpeg;base64,'+encode+')';
    return 'url('+this.createImageUrl(tokan,'report-cover-page')+')';
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ReportStore.unsetReportDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
  }
}


