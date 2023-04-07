import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProfileDocumentsService } from 'src/app/core/services/my-profile/profile/documents/profile-documents.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProfileDocumentsStore } from 'src/app/stores/my-profile/profile/profile-documents-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit { 

  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  ProfileDocumentsStore = ProfileDocumentsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  selectedIndex = null;
  individualFileDetails : any;
  previewObject = {
    file_details: null,
    component: '',
    preview_url: null,
    doc_id:null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }
  noDataMessage = "no_documents_to_show";
  constructor(private _profileDocumentService:ProfileDocumentsService,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService,
              private _imageService:ImageServiceService,
              private _sanitizer: DomSanitizer,
              private _humanCapitalService: HumanCapitalService,
              private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getprofileDocuments();
  }

  getprofileDocuments() {
    this._profileDocumentService.getItems().subscribe(() => {
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)

    if (ProfileDocumentsStore.loaded && ProfileDocumentsStore.profileDocument.length > 0) {
      this.getDocumentDetails(0);
    }
    this._utilityService.detectChanges(this._cdr);
    }); 
  }

  createImageUrl(type, token) {
      return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }

  getDocumentDetails(index:number){
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else 
      this.selectedIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  downloadDocument(id, filename, doc, file_id?) {
      this._humanCapitalService.downloadFile('user-download-all-documents', MyProfileProfileStore.userId, id, filename,null,doc);
  }

  createDaysString(days) {
    return this._helperService.daysConversion(days);
  }

  viewDocument(id){

    this._profileDocumentService.getItemById(id).subscribe(res => {
      this.individualFileDetails = res;
     this._humanCapitalService.getFilePreview('documents-preview', this.individualFileDetails.user_id, ProfileDocumentsStore.individualDocumentDetails.files[0].id, id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res,  ProfileDocumentsStore.individualDocumentDetails.title);
      this.openPreviewModal(resp, ProfileDocumentsStore.individualDocumentDetails.files[0]);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'permission_denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'unable_to_generate_preview');
      }
    });
  });
  }

  openPreviewModal(filePreview, itemDetails) {
    let profileDocumentDetail = ProfileDocumentsStore.individualDocumentDetails.created_by;
    let uploaded_user = { first_name: profileDocumentDetail.first_name, last_name: profileDocumentDetail.last_name, designation: profileDocumentDetail.designation, image_token: profileDocumentDetail.image.token };
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-download-documents';
    this.previewObject.doc_id = ProfileDocumentsStore.individualDocumentDetails.id;
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = uploaded_user;
    this.previewObject.created_at = itemDetails.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }

  closePreviewModal(event) {

    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }
  
}
