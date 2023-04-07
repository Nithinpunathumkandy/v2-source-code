import { Component, ElementRef, OnInit, ViewChild , ChangeDetectorRef, OnDestroy} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';

declare var $: any;
@Component({
  selector: 'app-meeting-documents',
  templateUrl: './meeting-documents.component.html',
  styleUrls: ['./meeting-documents.component.scss']
})
export class MeetingDocumentsComponent implements OnInit,OnDestroy {
  reactionDisposer: IReactionDisposer;
  MeetingsStore=MeetingsStore;
  NoDataItemStore=NoDataItemStore;
  SubMenuItemStore=SubMenuItemStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  MeetingPlanStore=MeetingPlanStore
  emptyMessage="No documents added";
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  previewObject = {
    component: "",
    created_at: "",
    preview_url: null,
    componentId: null,
    file_details: null,
    uploaded_user: null,
  };
  constructor(
    private _router:Router,
    private _meetingsService:MeetingsService,
    private _meetingPlanFileService:MeetingPlanFileService,
    private _utilityService:UtilityService,
    private _documentFileService: DocumentFileService,
    private _sanitizer: DomSanitizer,
    private _cdr:ChangeDetectorRef,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _meetingPlanService:MeetingPlanService
  ) { }

  ngOnInit(): void {
    this.getDocuments();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "go_to_meeting_plan":
            this.goToMeetingPlan();
            break;
          default:
            break;
        }

        SubMenuItemStore.unSetClickedSubMenuItem();
      }
       
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", });
     });
     
  }

  getDocuments(){
    this._meetingsService.getItem(MeetingsStore.meetingsId).subscribe(res => {
      if (res) {
        this.getSubmenu()
      }
     this._utilityService.detectChanges(this._cdr);
    })
  }
  getMeetingPlanDocuments()
  {
    this._meetingPlanService.getItem(MeetingPlanStore.meetingPlanId).subscribe(res => {
     this._utilityService.detectChanges(this._cdr);
    })
  }
  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  getSubmenu(){
    let subMenuItems =[];
    if(MeetingsStore.individualMeetingsDetails?.is_unplanned){
      subMenuItems= [
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ];
    } else{
      subMenuItems= [
        { activityName: null, submenuItem: { type: 'go_to_meeting_plan' } },
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ];
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }
  goToMeetingPlan(){
    
    if(MeetingsStore.individualMeetingsDetails?.meeting_plan?.id){
      this._router.navigateByUrl('mrm/meeting-plans/' + MeetingsStore.individualMeetingsDetails?.meeting_plan?.id);
    }
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

  // kh-module base document- Returns image url according to type and token
  createImageUrl(type, token) {
    if(type=='meetings-document' || type=='meeting-plan-document')
    return this._meetingPlanFileService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);

  }
  checkExtension(ext, extType) {//doc
    return this._imageService.checkFileExtensions(ext, extType)   
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
  closePreviewModal(event) {//doc
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.created_at = "";
    this.previewObject.preview_url = "";
    this.previewObject.componentId = null;
    this.previewObject.file_details = null;
    this.previewObject.uploaded_user = null;
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

 ngOnDestroy(): void {
  SubMenuItemStore.makeEmpty();
  if (this.reactionDisposer) this.reactionDisposer();
  // MeetingPlanStore.unsetIndividualMeetingPlanDetails();//meeting plan Detials
  // MeetingsStore.unsetIndividualMeetingsDetails();
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
 }
}
