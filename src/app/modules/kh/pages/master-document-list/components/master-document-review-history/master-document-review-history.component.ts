import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MdlService } from 'src/app/core/services/knowledge-hub/mdl/mdl.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-master-document-review-history',
  templateUrl: './master-document-review-history.component.html',
  styleUrls: ['./master-document-review-history.component.scss']
})
export class MasterDocumentReviewHistoryComponent implements OnInit {

  @Input('source') complianceStatusHistoryObject: any;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  // ComplianceRegisterStore = ComplianceRegisterStore;
  MasterListDocumentStore=MasterListDocumentStore;
  historyEmptyList = 'kh_review_no_history';
  openPreview:boolean=false;
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
    componentId: null,
  };

  PreviewSubscriptionEvent:any;

  constructor(
              // private _complianceRegisterService:ComplianceRegisterService,
              private _documentFileService:DocumentFileService,
              private _masterDocumnentService:MdlService,
              private _utilityService:UtilityService,
              private _cdr: ChangeDetectorRef,
              private _imageService:ImageServiceService,
              private _sanitizer:DomSanitizer,
              private _eventEmitterService:EventEmitterService,
              private _renderer2:Renderer2,
              private _helperService:HelperServiceService) { }

  ngOnInit(): void {

    this.getHistory()
    this.PreviewSubscriptionEvent = this._eventEmitterService.documentPreviewModal.subscribe(res => {
      this.closePreviewModal()
      this.changeZIndex();
    })

  }
  getHistory(){
    this._masterDocumnentService.getDocumentReviewHistory(MasterListDocumentStore.documentId).subscribe(()=> this._utilityService.detectChanges(this._cdr)
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

  viewDocument(type, documents, documentFile) {
		switch (type) {
			case "document-file":
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

			case "document-version":
				this._documentFileService
					.getFilePreview(type, documents.document_id, documents.id)
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

  
  openPreviewModal(type, filePreview, documentFiles, document) {
		this.previewObject.component = type
		this.openPreview=true;
		let previewItem = null;
		if (filePreview) {
			previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
			this.previewObject.preview_url = previewItem;
			this.previewObject.file_details = document;
			this.previewObject.componentId = document.id;


			this.previewObject.uploaded_user = documentFiles.created_by;
			this.previewObject.created_at = document.created_at;      
      
			$(this.filePreviewModal.nativeElement).modal("show");
			this._utilityService.detectChanges(this._cdr);
		}
	}

	// Closes from preview
		closePreviewModal() {

			
		this.openPreview=false;
		$(this.filePreviewModal.nativeElement).modal("hide");
		this.previewObject.preview_url = "";
		this.previewObject.uploaded_user = null;
		this.previewObject.created_at = "";
		this.previewObject.file_details = null;
		this.previewObject.componentId = null;
	}

  downloadDocumentFile(type, document, docs?) {
		event.stopPropagation();
		switch (type) {
			case "document-file":
				this._documentFileService.downloadFile(
					type,
					document.document_id,
					document.id,
					null,
					document.title,
					document
				);
				break;
			case "document-version":
				this._documentFileService.downloadFile(
					type,
					document.related_document_id,
					docs.id,
					null,
					document.title,
					docs
				);
				break;
		}
	}

  createImageUrl(type, token, h?, w?) {
    return this._documentFileService.getThumbnailPreview(type,token,h,w);
  }

// extension check function
checkExtension(ext, extType) {

  return this._imageService.checkFileExtensions(ext, extType)

}

getTimezoneFormatted(time){
  return this._helperService.timeZoneFormatted(time);
}

closeFormModal(){
  this._eventEmitterService.dismissDocumentHistoryModal()
}

ngOnDestroy(){
	MasterListDocumentStore.clearDocumentHistory()
}

}
