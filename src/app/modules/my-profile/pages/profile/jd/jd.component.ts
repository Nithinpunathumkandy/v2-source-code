import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Supervisor } from 'src/app/core/models/my-profile/profile/profile-jd';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProfileJdService } from 'src/app/core/services/my-profile/profile/jd/profile-jd.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProfileJDStore } from 'src/app/stores/my-profile/profile/profile-jd-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
declare var $: any;

@Component({
  selector: 'app-jd',
  templateUrl: './jd.component.html',
  styleUrls: ['./jd.component.scss']
})
export class JdComponent implements OnInit {

  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  ProfileJDStore = ProfileJDStore;
  selectedIndex = null;

  popupActive: boolean;
  supervisorClicked = false;
  activeIndex = null;
  informedActiveIndex = null;
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
  supervisorDetailObject = {
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
  noDataMessage = "no_job_description_to_show";
  constructor(private _profileJDService: ProfileJdService,
    private _utilityService: UtilityService,
    private _humanCapitalService: HumanCapitalService,
    private _sanitizer: DomSanitizer,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getProfileJD(1);
  }

  getProfileJD(newpage: number) {
    if (newpage) ProfileJDStore.setCurrentPage(newpage);
    this._profileJDService.getProfileJD().subscribe(() => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)

      if (ProfileJDStore.loaded && ProfileJDStore.profileJD.length > 0) {
        this.getJDDetails(ProfileJDStore.profileJD[0].id, 0);

      }
      this._utilityService.detectChanges(this._cdr);

    });
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  getJDDetails(id: number, index: number) {
    this.ProfileJDStore.unsetProfileJDDetails();
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else {
      this.selectedIndex = index;
      this._profileJDService.getItemById(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    this._utilityService.detectChanges(this._cdr);
  }

  mouseOut(event) {
    this.activeIndex = null;
    this.informedActiveIndex = null;
    this.supervisorClicked = false;
    this.hover = false;
    // if (this.popup) {
    //   this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
    // }

  }

  mouseHover(event, indexMain?) {
    if (indexMain != undefined) {
      this.supervisorClicked = false;
      this.activeIndex = indexMain;
    }
    else {
      this.activeIndex = null;
      this.supervisorClicked = true;
    }
    this.popupActive = true;
    this.hover = true;
    // if (this.popup) {
    //   this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
    // }
    this.informedActiveIndex = null;
  }

  downloadDocument(UserId, document) {
    this._humanCapitalService.downloadFile('user-job-documents', UserId, document.jd_id, document.title, document.id, document);
  }

  viewDocument(UserId, document) {

    this._humanCapitalService.getFilePreview('user-job', UserId, document.id, document.jd_id).subscribe(res => {
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

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-job-documents';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    // this.previewObject.uploaded_user = UserJobStore?.individualJobDetails?.created_by;
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

  getPopupDetails(details){
    this.userDetailObject.id = details.id;
    this.userDetailObject.first_name = details.first_name;
    this.userDetailObject.last_name = details.last_name;
    this.userDetailObject.designation = details.designation;
    this.userDetailObject.image_token = details.image.token;
    this.userDetailObject.email = details.email;
    this.userDetailObject.mobile = details.mobile;
    this.userDetailObject.department = details.department ? details.department : null;
    this.userDetailObject.status_id = details.status_id ? details.status.id : 1;

    return this.userDetailObject;
  }

  getSupervisorPopupDetails(){
    let supervisorDetails = ProfileJDStore?.profileJDDetails.supervisor;
    this.supervisorDetailObject.id = ProfileJDStore?.profileJDDetails.supervisor.id;
    this.supervisorDetailObject.first_name = supervisorDetails.first_name;
    this.supervisorDetailObject.last_name = supervisorDetails.last_name;
    this.supervisorDetailObject.designation = supervisorDetails.designation;
    this.supervisorDetailObject.image_token = supervisorDetails.image.token;
    this.supervisorDetailObject.email = supervisorDetails.email;
    this.supervisorDetailObject.mobile = supervisorDetails.mobile;
    this.supervisorDetailObject.department = supervisorDetails.department ? supervisorDetails.department : null;
    this.supervisorDetailObject.status_id = supervisorDetails.status.id ? supervisorDetails.status.id : 1;
   
    return this.supervisorDetailObject;
  }
}
