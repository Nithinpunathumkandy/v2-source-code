import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BpmFileService } from 'src/app/core/services/bpm/bpm-file/bpm-file.service';
import { ActivityService } from 'src/app/core/services/bpm/process/activity/activity.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ActivityStore } from 'src/app/stores/bpm/process/activity.store';
declare var $: any;

@Component({
  selector: 'app-process-activity-details-modal',
  templateUrl: './process-activity-details-modal.component.html',
  styleUrls: ['./process-activity-details-modal.component.scss']
})
export class ProcessActivityDetailsModalComponent implements OnInit {

  @Input('id') id:number;
  
  ActivityStore = ActivityStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  accountableUserObject = [];
  responsibleUserObject = [];

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _activityService: ActivityService,
    private _eventEmitterService: EventEmitterService,
    private _bpmFileService: BpmFileService,
    private _sanitizer: DomSanitizer,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
  ) { }

  ngOnInit(): void {
    console.log(this.id)
    if(this.id){
      this.getActivityDetails(this.id);
    }
  }

  getActivityDetails(id) {
    this._activityService.getItemById(id).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
      });
  }
  
  closeActivityDetailsModal() {
    this._eventEmitterService.dismissActivityDetailsModal();
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

   // Returns default image url
   getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  // Returns image url according to type and token
  createImageUrl(type, token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
    return this._bpmFileService.getThumbnailPreview(type, token);
  }

  downloadProcessDocument(type, process, ProcessDocument) {
    event.stopPropagation();
    switch (type) {
      case "document":
        this._bpmFileService.downloadFile(
          "process-document",
          process.id,
          ProcessDocument.id,
          null,
          ProcessDocument.name,
          ProcessDocument
        );
        break;
      case "flow":
        this._bpmFileService.downloadFile(
          "flow-document",
          process.id,
          ProcessDocument.id,
          null,
          ProcessDocument.name,
          ProcessDocument
        );
        break;
      case "activity":
        this._bpmFileService.downloadFile(
          "process-activities",
          process.process_id,
          process.id,
          ProcessDocument.id,
          ProcessDocument.name,
          ProcessDocument
        );
        break;
    }
  }

  assignUserValues(user,type){
    var responsibleInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }
    var accountableInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }
  
    if(type=='accountable'){
      accountableInfoObject.first_name = user?.first_name;
      accountableInfoObject.last_name = user?.last_name;
      accountableInfoObject.designation = user?.designation;
      accountableInfoObject.image_token = user?.image?.token;
      accountableInfoObject.email = user?.email;
      accountableInfoObject.mobile = user?.mobile;
      accountableInfoObject.id = user?.id;
      accountableInfoObject.status_id = user?.status_id
      accountableInfoObject.department = null;
       return accountableInfoObject;
    }
    else{
      responsibleInfoObject.first_name = user?.first_name;
      responsibleInfoObject.last_name = user?.last_name;
      responsibleInfoObject.designation = user?.designation;
      responsibleInfoObject.image_token = user?.image?.token;
      responsibleInfoObject.email = user?.email;
      responsibleInfoObject.mobile = user?.mobile;
      responsibleInfoObject.id = user?.id;
      responsibleInfoObject.status_id = user?.status_id
      responsibleInfoObject.department = null;
       return responsibleInfoObject;
    }

  }

    /**
   * View Catalogue
   * @param process Process Details
   * @param ProcessDocument Document Details
   */
  viewProcessDocument(type, product, ProcessDocument) {
    switch (type) {
      case "document":
        this._bpmFileService
          .getFilePreview("process-document", product.id, ProcessDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              ProcessDocument.name
            );
            this.openPreviewModal(type, resp, ProcessDocument, product);
            this.previewObject.component = "process-document";
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

      case "flow":
        this._bpmFileService
          .getFilePreview("flow-document", product.id, ProcessDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              ProcessDocument.name
            );
            this.previewObject.component = "flow-document";
            this.openPreviewModal(type, resp, ProcessDocument, product);
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

      case "activity":
        this._bpmFileService
          .getFilePreview(
            "process-activities",
            product.process_id,
            product.id,
            ProcessDocument.id
          )
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              ProcessDocument.name
            );
            this.previewObject.component = "process-activities";
            this.openPreviewModal(type, resp, ProcessDocument, product);
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

  openPreviewModal(type, filePreview, ProcessDocument, Process) {
    switch (type) {
      case "flow":
        this.previewObject.component = "flow-document";
        break;
      case "document":
        this.previewObject.component = "process-document";
        break;
      case "activity":
        this.previewObject.component = "process-activities";
        break;
      default:
        break;
    }

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = ProcessDocument;
      if (type == "activity") {
        this.previewObject.componentId = Process.process_id;
      } else {
        this.previewObject.componentId = Process.id;
      }

      this.previewObject.uploaded_user =
        Process.updated_by?.length > 0 ? Process.updated_by : Process.created_by;
      this.previewObject.created_at = Process.created_at;
      // $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }
 

}

