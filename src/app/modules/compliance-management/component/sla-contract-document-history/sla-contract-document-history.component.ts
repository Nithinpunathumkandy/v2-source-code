import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SlaContractService } from 'src/app/core/services/compliance-management/sla-contract/sla-contract.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DomSanitizer } from '@angular/platform-browser';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any

@Component({
  selector: 'app-sla-contract-document-history',
  templateUrl: './sla-contract-document-history.component.html',
  styleUrls: ['./sla-contract-document-history.component.scss']
})
export class SlaContractDocumentHistoryComponent implements OnInit {

  @Input('source') documentID: any;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;

  SLAContractStore = SLAContractStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  emptyDocHistory= "common_nodata_title";
  PreviewSubscriptionEvent: any = null;
  previewObject = {
    id:null,
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  };

  constructor(private _helperService: HelperServiceService,
    private _slaContractService: SlaContractService,
    private _sanitizer: DomSanitizer,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.getHistory()

    // NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

    this.PreviewSubscriptionEvent = this._eventEmitterService.slaDocumentPreviewModal.subscribe(res => {
      this.closePreviewModal()
      this.changeZIndex();
    })
  }

  getHistory(){
    this._slaContractService.getHistory(this.documentID).subscribe(() => {setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)});
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.created_by_first_name ? users?.created_by_first_name : null;
    userDetial['last_name'] = users?.created_by_last_name ? users?.created_by_last_name : null;
    userDetial['designation'] = users?.created_by_designation ? users?.created_by_designation : null;
    userDetial['image_token'] = users?.created_by_image_token ? users?.created_by_image_token : null;
    userDetial['email'] = users?.email ? users?.email : null;
    userDetial['mobile'] = users?.mobile ? users?.mobile :null;
    userDetial['id'] = users?.id ? users?.id : null;
    userDetial['department'] = users?.created_by_department ? users?.created_by_department : null;
    // userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;
  }

  createImageUrl(file,token) {
    return this._slaContractService.getThumbnailPreview(file, token);
  }

  downloadCertificate(document){
    this._slaContractService.downloadFile('sla-download-document', this.documentID, document.id, document.title, '', document);
  }

  viewCertificate(document) {
    this._slaContractService.getFilePreview('sla-contract-document', this.documentID, document.id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, document.title);
      this.openPreviewModal(resp, document);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'permission_denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'unable_to_generate_preview');
      }
    });
  }

  openPreviewModal(filePreview, itemDetails) {
    let uploaded_user = { first_name: itemDetails.created_by_first_name, last_name: itemDetails.created_by_last_name, designation: itemDetails.created_by_designation, image_token: itemDetails.created_by_image_token};
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'sla-download-document';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.id = this.documentID;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = uploaded_user;
    this.previewObject.created_at = itemDetails.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }

  changeZIndex(){
    if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){
    this.PreviewSubscriptionEvent.unsubscribe();
  }
}
