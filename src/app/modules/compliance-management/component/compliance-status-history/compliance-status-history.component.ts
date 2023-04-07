import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-compliance-status-history',
  templateUrl: './compliance-status-history.component.html',
  styleUrls: ['./compliance-status-history.component.scss']
})
export class ComplianceStatusHistoryComponent implements OnInit {
  @Input('source') complianceStatusHistoryObject: any;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ComplianceRegisterStore = ComplianceRegisterStore;

  previewObject = {
    id:null,
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null,
    status: null,
    complianceStatus: null
  };

  PreviewSubscriptionEvent:any;

  constructor(private _complianceRegisterService:ComplianceRegisterService,
              private _utilityService:UtilityService,
              private _cdr: ChangeDetectorRef,
              private _imageService:ImageServiceService,
              private _sanitizer:DomSanitizer,
              private _eventEmitterService:EventEmitterService,
              private _renderer2:Renderer2,
              private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.getHistory()

    this.PreviewSubscriptionEvent = this._eventEmitterService.slaDocumentPreviewModal.subscribe(res => {
      this.closePreviewModal()
      this.changeZIndex();
    })

  }
  getHistory(){
    this._complianceRegisterService.getComplianceStatusHistory().subscribe(()=> this._utilityService.detectChanges(this._cdr)
    );
  }

  changeZIndex(){
    if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
  }
  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.created_by_first_name ?  users?.created_by_first_name : null;
    userDetial['last_name'] = users?.created_by_last_name ? users?.created_by_last_name:null; 
    userDetial['designation'] = users?.created_by_designation ? users?.created_by_designation: null;
    userDetial['image_token'] = users?.created_by_image_token ? users?.created_by_image_token:null;
    // userDetial['email'] = users?.email ? users?.email:null;
    // userDetial['mobile'] = users?.mobile ? users?.mobile:null;
    // userDetial['id'] = users?.id ? users?.id:null;
    userDetial['department'] = users?.created_by_department ? users?.created_by_department:null;
    // userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;


  }
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
   // Returns default image
   getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getStatusColorKey(colr){
    var label_color = colr.split('-');

    return 'dot-div-new dot-'+label_color[0]+' font-normal';
  }

   // for downloading files
   downloadComplianceStatusDocument(type,history, document) {
    event.stopPropagation();
    switch (type) {
      case "compliance-status-document":
        this._complianceRegisterService.downloadFile(
          "compliance-status-document",
          history.id,
          this.complianceStatusHistoryObject.document_id,
          document.id,
          document.title,
          document
        );
        break;

    }

  }

  viewStatusDocument(type, complianceStatus, complianceStatusDocument) {
    
    switch (type) {
      case "compliance-status-document":
        this._complianceRegisterService
          .getFilePreview("compliance-status-document", complianceStatus.id, this.complianceStatusHistoryObject.document_id , complianceStatusDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              complianceStatus.title
            );
            this.openPreviewModal(resp,complianceStatus, complianceStatusDocument);
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
  openPreviewModal(filePreview,status,document) {
    let uploaded_user = null;
    let status_document = {
      id:status.id , 
      document_id:this.complianceStatusHistoryObject.document_id
    }
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'compliance-status-document';
    this.previewObject.file_details = document;
    this.previewObject.complianceStatus = status_document;
    this.previewObject.file_name = document.title;
    this.previewObject.id = document.id;
    this.previewObject.file_type = document.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = document.size;
    this.previewObject.uploaded_user = uploaded_user;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }


  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.component = '';
    this.previewObject.status = null;
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
    this.previewObject.file_details = null;
  }

  // Returns image url according to type and token
 createImageUrl(type, token) {
  return this._complianceRegisterService.getStatusThumbnailPreview(token);
}

// extension check function
checkExtension(ext, extType) {

  return this._imageService.checkFileExtensions(ext, extType)

}

getTimezoneFormatted(time){
  return this._helperService.timeZoneFormatted(time);
}
}
