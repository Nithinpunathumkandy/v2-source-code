import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';

declare var $: any;
@Component({
  selector: 'app-meeting-plan-documents',
  templateUrl: './meeting-plan-documents.component.html',
  styleUrls: ['./meeting-plan-documents.component.scss']
})
export class MeetingPlanDocumentsComponent implements OnInit,OnDestroy {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  MeetingPlanStore = MeetingPlanStore;
  emptyMessage="No documents added";
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  NoDataItemStore=NoDataItemStore;
  MeetingsStore=MeetingsStore;
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  constructor(
    private _cdr:ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _documentFileService: DocumentFileService,
    private _meetingPlanFileService:MeetingPlanFileService,
    private _helperService:HelperServiceService,
    private _meetingPlanService:MeetingPlanService,
    private _utilityService:UtilityService,
    private _imageService:ImageServiceService,
    private _meetingsService:MeetingsService,
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", });
      
      SubMenuItemStore.unSetClickedSubMenuItem();
    });
    this.getDocuments();
  }

  getDocuments()
  {
    this._meetingPlanService.getItem(MeetingPlanStore.meetingPlanId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getMeetingDocuments()
  {
    if(MeetingPlanStore?.individualMeetingPlanDetails?.meeting?.id)
    {
      this._meetingsService.getItem(MeetingPlanStore?.individualMeetingPlanDetails?.meeting?.id).subscribe(res => {
        if (res) {
        }
       this._utilityService.detectChanges(this._cdr);
      })
    }
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
      this.previewObject.componentId = document.meeting_plan_id;
      
      this.previewObject.uploaded_user = MeetingPlanStore.individualMeetingPlanDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // kh-module base document- Returns image url according to type and token
  createImageUrl(type, token) {
    if(type=='meeting-plan-document' || type=='meetings-document')
    return this._meetingPlanFileService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);

  }

   // extension check function
   checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)
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
  closePreviewModal(event) {//doc
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.created_at = "";
    this.previewObject.preview_url = "";
    this.previewObject.componentId = null;
    this.previewObject.file_details = null;
    this.previewObject.uploaded_user = null;
  }
  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }
  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MeetingPlanStore.unsetIndividualMeetingPlanDetails();//meeting plan Detials
    MeetingsStore.unsetIndividualMeetingsDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
