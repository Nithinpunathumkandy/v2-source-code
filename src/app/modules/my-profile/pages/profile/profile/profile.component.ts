import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IReactionDisposer } from 'mobx';
import { Qualification } from 'src/app/core/models/human-capital/users/user-qualification';
import { Certificate } from 'src/app/core/models/human-capital/users/user-certificate';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MyprofileProfileService } from 'src/app/core/services/my-profile/profile/profile/myprofile-profile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  MyProfileProfileStore = MyProfileProfileStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  profileSubscriptionEvent: any = null;
  profileObject = {
    component: 'Myprofile',
    values: null,
    type: null,
    category : null
  };
  deleteEventSubscription: any;
  deleteObject = {
    type: '',
    id: null,
    status: '',
    subtitle:'',
    category:''
  };
  previewObject = {
    userId:null,
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  };
  
  constructor(private _profileService:MyprofileProfileService,
              private _humanCapitalService:HumanCapitalService,
              private _helperService:HelperServiceService,
              private _imageService:ImageServiceService,
              private _sanitizer: DomSanitizer,
              private _eventEmitterService:EventEmitterService,
              private _utilityService:UtilityService,private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.profileSubscriptionEvent = this._eventEmitterService.profileQualificationModal.subscribe(res => {
      this.closeFormModal();
    })
    this.profileSubscriptionEvent = this._eventEmitterService.profileExperienceModal.subscribe(res => {
      this.closeFormModal();
    })
    this.profileSubscriptionEvent = this._eventEmitterService.profileCertificateModal.subscribe(res => {
      this.closeFormModal();
    })
    this.getprofile();
  }

  getprofile() {
    this._profileService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImageUrl(file,token) {
    return this._humanCapitalService.getThumbnailPreview(file, token);
  }

  downloadCertificate(certificate){
    this._humanCapitalService.downloadFile('user-download-certificate', certificate.user.id, certificate.id, certificate.title, '', certificate);
  }

  viewCertificate(certificate) {
    this._humanCapitalService.getFilePreview('user-certificate', certificate.user.id, certificate.id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, certificate.title);
      this.openPreviewModal(resp, certificate);
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
    let uploaded_user = { first_name: itemDetails.created_by.first_name, last_name: itemDetails.created_by.last_name, designation: itemDetails.created_by.designation, image_token: itemDetails.created_by.image.token};
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-download-certificate';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.certificate_name;
    this.previewObject.userId = itemDetails.user.id;
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

  editQualification(row){
    const qualification: Qualification = row;
    this.profileObject.values = {
      id: qualification.id,
      school: qualification.school,
      degree: qualification.degree,
      start: qualification.start,
      end: qualification.end
      
    }
    this.profileObject.type = 'Edit';
    this.profileObject.category = 'Qualification' ; 
    this.openFormModal();
  }

  editExperience(row){
    const experience  = row;

    this.profileObject.values = {
      id: experience.id,
      company: experience.company,
      designation: experience.designation,
      location:experience.location,
      start: this._helperService.processDate(experience.start, 'split'),//converting date format
      end: this._helperService.processDate(experience.end, 'split')
      
    }
    this.profileObject.type = 'Edit';
    this.profileObject.category = 'Experience' ; 
    this.openFormModal();
  }

  getTransformedArray(arrayObject){
    return this._helperService.getArraySeperatedString(',','title',arrayObject);
  }

  editCertificate(row){
    const certificate:Certificate  = row;
    if (certificate.token) {
          let certificateurl = this._humanCapitalService.getThumbnailPreview('user-certificate', certificate.token);
          let certificateDetails = {
            certificate_name: certificate.certificate_name,
            name: certificate.title,
            ext: certificate.ext,
            size: certificate.size,
            url: certificate.url,
            thumbnail_url: certificate.url,
            token: certificate.token,
            preview: certificateurl,
            id: certificate.id,
          };
          this._profileService.setCertificateImageDetails(certificateDetails, certificateurl, 'support-file');
        }
    this.profileObject.values = {
      id: certificate.id,
      certificate_name: certificate.certificate_name,
      name: certificate.title,
      ext: certificate.ext,
      size: certificate.size,
      url: certificate.url,
      thumbnail_url: certificate.url,
      token: certificate.token,
    }
    this.profileObject.type = 'Edit';
    this.profileObject.category = 'Certificate' ; 
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    this.getprofile();
    // this._utilityService.detectChanges(this._cdr);
    $(this.formModal.nativeElement).modal('hide');
    this.profileObject.type = null;
    this.profileObject.values = null;
  }

  addNewQualification(){
    this.profileObject.type = 'Add';
    this.profileObject.category = 'Qualification' ; 
    this.profileObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  addNewExperience(){
    this.profileObject.type = 'Add';
    this.profileObject.category = 'Experience' ;
    this.profileObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  addNewCertificate(){
    this.profileObject.type = 'Add';
    this.profileObject.category = 'Certificate' ;
    this.profileObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  deleteQualification(id: number) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'delete_qualification_subtitle'
    this.deleteObject.category = 'Qualification'

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteExperience(id: number) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'delete_experience_subtitle'
    this.deleteObject.category = 'Experience'

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteCertificate(id: number) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'delete_certificate_subtitle'
    this.deleteObject.category = 'Certificate'

    $(this.deletePopup.nativeElement).modal('show');
  }

  delete(status) {
    let deleteType;
    if (status && this.deleteObject.id && this.deleteObject.type) {
      switch (this.deleteObject.category) {
        case 'Certificate':
          deleteType = this._profileService.deleteCertificate(this.deleteObject.id);
          break;
        case 'Experience':
          deleteType = this._profileService.deleteWork(this.deleteObject.id);
          break;
        case 'Qualification':
          deleteType = this._profileService.deleteQualification(this.deleteObject.id);
          break;
        default:
          break;

      }
      deleteType.subscribe(resp => {
        this.closeConfirmationPopUp();
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        if (error.status == 405) {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
      }));
    }
    else {
      this.closeConfirmationPopUp();
      this.clearDeleteObject();
    }
    
  }

  closeConfirmationPopUp(){
    // setTimeout(() => {
      this.getprofile();
    // this._utilityService.detectChanges(this._cdr);
      $(this.deletePopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    // }, 250);
  } 

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.type = '';
    this.deleteObject.status = '';
    this._utilityService.detectChanges(this._cdr);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  ngOnDestroy() {
    
    this.profileSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
  }
}
