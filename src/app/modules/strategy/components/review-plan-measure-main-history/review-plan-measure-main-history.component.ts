import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;


@Component({
  selector: 'app-review-plan-measure-main-history',
  templateUrl: './review-plan-measure-main-history.component.html',
  styleUrls: ['./review-plan-measure-main-history.component.scss']
})
export class ReviewPlanMeasureMainHistoryComponent implements OnInit {
  @Input('source') planMeasureData :any;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  AppStore = AppStore;
  constructor(private _eventEmitterService: EventEmitterService,private _reviewService : StrategyReviewService,
    private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService, private _sanitizer: DomSanitizer,
    private _imageService: ImageServiceService,) { }
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    frequency : null
  };
  ngOnInit(): void {
  }

  cancel(){
    this._eventEmitterService.dismissPlanMeasureMainHistoryModal();
  }

  
  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }

    
  }

  viewIncidentDocument( type, docuDetails ,frequencyId,documentFile) {
    switch (type) {
      case "plan-measure":
    this._reviewService.getPlanFilePreview(docuDetails,frequencyId).subscribe(res=>{
      var resp: any = this._utilityService.getDownLoadLink(
        res,
        docuDetails.name
      );
      this.openPreviewModal(type, resp, documentFile, docuDetails, frequencyId );
    }),
    (error) => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage(
          "Error",
          "permission_denied"
        );
      } else {
        this._utilityService.showErrorMessage(
          "Error",
          "unable_generate_preview"
        );
      }
    };
    break;
    case "document-version":
      this._documentFileService
        .getFilePreview(type, docuDetails.document_id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            docuDetails.title
          );
          this.openPreviewModal(type, resp, documentFile, docuDetails,frequencyId);
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

  openPreviewModal(type,filePreview, documentFiles, document , frequencyId) {
    this.previewObject.component=type
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.frequency = frequencyId

      
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }

  }

  *// Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
  
    createPreviewUrl(type, token) {
      return this._reviewService.getThumbnailPreview(type, token)
    }
  
  
    // Returns image url according to type and token
    createImageUrl(type, token) {
      return this._reviewService.getThumbnailPreview(type, token);
    }

    
  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)
   
  }

  
     // for downloading files
downloKpiMesureDocument(type, kpiDocument, docs, frequencyId) {

  event.stopPropagation();
  switch (type) {
    case "plan-measure":
      this._reviewService.downloadFile(
        frequencyId,
        "plan-measure",
        kpiDocument.id,
        null,
        kpiDocument.title,
        kpiDocument
      );
      break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          kpiDocument.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;

  }

}

}
