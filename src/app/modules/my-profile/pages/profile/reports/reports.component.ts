import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProfileReportService } from 'src/app/core/services/my-profile/profile/report/profile-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProfileReportStore } from 'src/app/stores/my-profile/profile/profile-report-store';
declare var $: any

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  ProfileReportStore = ProfileReportStore;
  selectedIndex = null;
  activeIndex = null;
  informedActiveIndex = null;
  popupActive: boolean;
  hover = false;
  previewObject = {
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }
  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null

  }
  noDataMessage = "no_report_to_show";
  constructor(private _profileReportService: ProfileReportService,
    private _utilityService: UtilityService,
    private _sanitizer: DomSanitizer,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.GetProfileReport(1);
  }

  GetProfileReport(newpage: number) {
    this._profileReportService.getprofileReport().subscribe(() => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);

      if (ProfileReportStore.loaded && ProfileReportStore?.profileReport[0]?.reports?.length > 0) {
        this.getReportDetails(ProfileReportStore?.profileReport[0]?.reports[0]?.id, 0);
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getReportDetails(id: number, index: number) {
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else {
      this.selectedIndex = index;
      this._profileReportService.getItemById(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    this._utilityService.detectChanges(this._cdr);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  downloadDocument(userid, user_report_id, filename, doc_id, doc) {
    this._humanCapitalService.downloadFile('user-report-documents', userid, user_report_id, filename, doc_id, doc);
  }

  viewDocument(userid, document) {
    this._humanCapitalService.getFilePreview('user-report', userid, document.id, document.user_report_id).subscribe(res => {
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
    let profileReportDetail = ProfileReportStore?.profileReportDetail;
    let uploaded_user = { first_name: profileReportDetail.created_by.first_name, last_name: profileReportDetail.created_by.last_name, designation: profileReportDetail.created_by.designation, image_token: profileReportDetail.created_by.image.token };
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-report-documents';
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

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  mouseOut(event) {
    this.activeIndex = null;
    this.informedActiveIndex = null;
    this.hover = false;

  }

  mouseHover(event, indexMain?) {
    this.activeIndex = indexMain;
    this.popupActive = true;
    this.hover = true;
    this.informedActiveIndex = null;
  }

  getPopupDetails(details){
    this.userDetailObject.id = details.id;
    this.userDetailObject.first_name = details.first_name;
    this.userDetailObject.last_name = details.last_name;
    this.userDetailObject.designation = details.designation;
    this.userDetailObject.image_token = details.image.token;
    this.userDetailObject.email = details.email;
    this.userDetailObject.mobile = details.mobile;
    this.userDetailObject.department = details.department ? details.department : null;
    this.userDetailObject.status_id = details.status.id ? details.status.id : 1;

    return this.userDetailObject;
  }
}
