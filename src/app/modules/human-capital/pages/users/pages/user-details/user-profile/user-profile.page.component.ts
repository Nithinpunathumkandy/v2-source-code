import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Experience } from 'src/app/core/models/human-capital/users/user-work-experience';
import { Certificate } from 'src/app/core/models/human-capital/users/user-certificate';
import { Qualification } from 'src/app/core/models/human-capital/users/user-qualification';
import { Router } from '@angular/router';
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { DomSanitizer } from '@angular/platform-browser';
import { UserQualificationService } from 'src/app/core/services/human-capital/user/user-qualification/user-qualification.service';
import { UserCertificateService } from 'src/app/core/services/human-capital/user/user-certificate/user-certificate.service';
import { UserWorkExperienceService } from 'src/app/core/services/human-capital/user/user-work-experience/user-work-experience.service';
import { UserWorkExperienceStore } from 'src/app/stores/human-capital/users/user-profile/user-work-experience.store';
import { UserQualificationStore } from 'src/app/stores/human-capital/users/user-profile/user-qualification.store';
import { UserCertificateStore } from 'src/app/stores/human-capital/users/user-profile/user-certificate.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile.page.component.html',
  styleUrls: ['./user-profile.page.component.scss']
})
export class UserProfilePageComponent implements OnInit,OnDestroy {
  @ViewChild('workFormModal', { static: true }) workFormModal: ElementRef;
  @ViewChild('companyInput') companyInput: ElementRef;
  @ViewChild('qualificationFormModal', { static: true }) qualificationFormModal: ElementRef;
  @ViewChild('schoolInput') schoolInput: ElementRef;
  @ViewChild('certificateFormModal', { static: true }) certificateFormModal: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;


  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  experience: Experience[] = [];
  form: FormGroup;
  qualificationForm: FormGroup;
  formErrors: any;
  UsersStore = UsersStore;
  certificateForm: FormGroup;
  AuthStore = AuthStore;
  fileUploadProgress = 0;
  UserQualificationStore = UserQualificationStore;
  UserCertificateStore = UserCertificateStore;
  UserWorkExperienceStore = UserWorkExperienceStore;
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

  deleteEventSubscription: any;
  deleteObject = {
    type: '',
    id: null,
    status: '',
    subtitle:'',
    category:''
  };

  emptyMessage = "no_data_found";

  qualification_year = [];
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _usersService: UsersService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _qualificationService: UserQualificationService,
    private _certificateService: UserCertificateService,
    private _experienceService: UserWorkExperienceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _renderer2:Renderer2) { }

  ngOnInit() {
    if(!AuthStore.getActivityPermission(200,'USER_PROFILE_LIST')){
     let url =  OrganizationModulesStore.getOrganizationSubModules(200,6101)[0]?.client_side_url=='human-capital/users'?'/'+ OrganizationModulesStore.getOrganizationSubModules(200,6101)[0]?.client_side_url+'/'+UsersStore.user_id:'/human-capital/users/'+UsersStore.user_id+'/'+ OrganizationModulesStore.getOrganizationSubModules(200,6101)[0]?.client_side_url;
this._router.navigateByUrl(url)    
}

    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this.formErrors = null;
              this._utilityService.detectChanges(this._cdr);
              AddUserStore.setEditFlag();
              if(UsersStore.user_id)
              this._router.navigateByUrl('/human-capital/users/edit/'+UsersStore.user_id);
            }, 1000);
            break;
          case "delete":
            this.deleteUser();
            break;
          case "activate":
            this.updateStatus('activate');
            break;
          case "deactivate":
            this.updateStatus('deactivate');
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();


      }

      if (UsersStore.individual_user_loaded && UsersStore.individualUser && UsersStore.usersProfile) {
        this.addSubmenu() 
      }

    })

  
    

    UsersStore.setUsersProfile();


    //year selection data for start date and end date
    this.getYears();





    //work experience form
    this.form = this._formBuilder.group({

      id: [''],
      company: ['', [Validators.required, Validators.maxLength(255)]],
      designation: ['', [Validators.required, Validators.maxLength(255)]],
      location:[''],
      start: [null, [Validators.required]],
      end: [null]
    });


    //qualification form
    this.qualificationForm = this._formBuilder.group({

      id: [''],
      school: ['', [Validators.required]],
      degree: ['', [Validators.required]],
      start: [null, [Validators.required]],
      end: [null]
    });

    //certification form
    this.certificateForm = this._formBuilder.group({
      id: [''],
      certificate_name: ['', [Validators.required]],
      name: [''],
      ext: [''],
      mime_type: [''],
      size: [''],
      url: [''],
      thumbnail_url: [''],
      token: [''],
      is_new:['']
    });


    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    SubMenuItemStore.setNoUserTab(true);


  }

  addSubmenu() {

    setTimeout(() => {
      if (UsersStore.individualUser.status.id == AppStore.activeStatusId) {
        if(this.checkIfSuperAdmin()){
          var subMenuItems = [
            { activityName: 'DELETE_USER', submenuItem: { type: 'delete' } },
            { activityName: 'DEACTIVATE_USER', submenuItem: { type: 'deactivate' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } },
          ]
        }
        else{
          var subMenuItems = [
            { activityName: 'UPDATE_USER', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_USER', submenuItem: { type: 'delete' } },
            { activityName: 'DEACTIVATE_USER', submenuItem: { type: 'deactivate' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } },
          ]
        }
      }
      else {

        if(this.checkIfSuperAdmin()){
          var subMenuItems = [
            { activityName: 'DELETE_USER', submenuItem: { type: 'delete' } },
            { activityName: 'ACTIVATE_USER', submenuItem: { type: 'activate' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } },
          ]
        }
        else{
          var subMenuItems = [
            { activityName: 'UPDATE_USER', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_USER', submenuItem: { type: 'delete' } },
            { activityName: 'ACTIVATE_USER', submenuItem: { type: 'activate' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } },
          ]
        }
        
      }
      this._helperService.checkSubMenuItemPermissions(200, subMenuItems);
    }, 250);

  }

  checkIfSuperAdmin(){
    const index =  UsersStore.individualUser?.roles.findIndex(i => i.type=='super-admin')
    if(index!=-1 && UsersStore.individualUser?.designation?.is_super_admin) 
    return true
    else return false
  }

  changeZIndex(){
    if($(this.workFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.workFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.workFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.qualificationFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.qualificationFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.qualificationFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.certificateFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.certificateFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.certificateFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
  }


  openWorkFormModal() {
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
    $(this.workFormModal.nativeElement).modal('show');
  }

  closeWorkFormModal() {
    this.form.reset();
    this.form.markAsPristine();
    $(this.workFormModal.nativeElement).modal('hide');
  }

  openQualificationFormModal() {
    this.qualificationForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
    $(this.qualificationFormModal.nativeElement).modal('show');
  }

  closeQualificationFormModal() {
    this.qualificationForm.reset();
    this.qualificationForm.markAsPristine();
    $(this.qualificationFormModal.nativeElement).modal('hide');
  }

  getYears() {
    for (let i = UsersStore.currentDate.getFullYear() - 100; i <= UsersStore.currentDate.getFullYear(); i++) {
      this.qualification_year.push(i);
    }
  }


  /**
   * to get certificate preview
   * @param certificate passng certificate details
   */
  viewCertificate(certificate) {

    this._humanCapitalService.getFilePreview('user-certificate', UsersStore.user_id, certificate.id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, certificate.title);
      this.openPreviewModal(resp, certificate);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'Permission Denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
      }
    });
  }


  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, itemDetails) {

    let uploaded_user = { first_name: itemDetails.created_by_first_name, last_name: itemDetails.created_by_last_name, designation: itemDetails.created_by_designation, image_token: itemDetails.created_by_image_token };
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-download-certificate';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.certificate_name;
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

  /**
   * getting values to edit user experience
   * @param id - experience id
   */
  editExperience(id) {
    const experience: Experience = UserWorkExperienceStore.getExperinceById(id);
    //set form value
    this.form.reset();
    this.form.markAsPristine();
    this.form.patchValue({
      id: experience.id,
      company: experience.company,
      designation: experience.designation,
      location:experience.location,
      start: this._helperService.processDate(experience.start, 'split') ? this._helperService.processDate(experience.start, 'split') : null,//converting date format
      end: this._helperService.processDate(experience.end, 'split') ? this._helperService.processDate(experience.end, 'split') : null
    });

    this.openWorkFormModal();
    setTimeout(() => this.companyInput.nativeElement.focus(), 150);
  }

  /**
   * getting values for editing qualification
   * @param id - qualification id
   */
  editQualification(id) {
    const qualification: Qualification = UserQualificationStore.getQualificationById(id);
    //set form value
    this.qualificationForm.reset();
    this.qualificationForm.markAsPristine();
    this.qualificationForm.setValue({
      id: qualification.id,
      school: qualification.school,
      degree: qualification.degree,
      start: qualification.start,
      end: qualification.end
    });

    this.openQualificationFormModal();
    setTimeout(() => this.companyInput.nativeElement.focus(), 150);
  }




  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  /**
   * saving work experience details
   * @param close - decision value to close the modal
   */
  saveWork(close: boolean = false) {
    this.formErrors = null;
    // if (this.form.valid) {
      let save;
      AppStore.enableLoading();

      let tempstartdate = this.form.value.start;
      this.form.patchValue({
        start: this._helperService.processDate(tempstartdate, 'join')//converting date format
      })

      let tempenddate = this.form.value.end;
      this.form.patchValue({
        end: this._helperService.processDate(tempenddate, 'join')
      })

      if (this.form.value.id) {
        save = this._experienceService.updateWorkExperience(this.form.value.id, UsersStore.user_id, this.form.value);
      } else {
        let saveData = {
          company: this.form.value.company ? this.form.value.company : '',
          designation: this.form.value.designation ? this.form.value.designation : '',
          location:this.form.value.location?this.form.value.location:'',
          start: this.form.value.start ? this.form.value.start : null,
          end: this.form.value.end ? this.form.value.end : null
        }
        save = this._experienceService.saveWorkExperience(UsersStore.user_id, saveData);

      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        this.form.patchValue({
          start: tempstartdate,
          end:tempenddate
        })
        if (!this.form.value.id) {
          this.form.reset();
          this.form.markAsPristine();
        }


        this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.form.reset();
          this.closeWorkFormModal();

        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          
        }
        else if(err.status == 403 || err.status == 500){
          this.closeWorkFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    // }
  }

  /**
   * saving qualification details
   * @param close - decision value to close the modal
   */
  saveQualification(close: boolean = false) {
    this.formErrors = null;
    if (this.qualificationForm.valid) {
      let save;
      AppStore.enableLoading();



      if (this.qualificationForm.value.id) {
        save = this._qualificationService.updateQualification(this.qualificationForm.value.id, UsersStore.user_id, this.qualificationForm.value);
      } else {
        let saveData = {
          school: this.qualificationForm.value.school ? this.qualificationForm.value.school : '',
          degree: this.qualificationForm.value.degree ? this.qualificationForm.value.degree : '',
          start: this.qualificationForm.value.start ? this.qualificationForm.value.start : null,
          end: this.qualificationForm.value.end ? this.qualificationForm.value.end : null
        }
        save = this._qualificationService.saveQualification(UsersStore.user_id, saveData);

      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.qualificationForm.value.id) {
          this.qualificationForm.reset();
          this.qualificationForm.markAsPristine();
        }
        this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.qualificationForm.reset();
          this.closeQualificationFormModal();

        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
       
        }
        else if(err.status == 403 || err.status == 500){
          this.closeQualificationFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  /**
   * Deleting certificate image
   * @param token -image token to delete
   */
  deleteCertificateImage() {
    UserCertificateStore.clearCertificate();
    // UserCertificateStore.unsetImageDetails('user-certificate', token);
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * deleting work experience
   * @param id -work experience id
   */
  deleteWork(id: number) {

    this.deleteObject.id = id;
    this.deleteObject.category = 'Delete Experience';
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    

    $(this.deletePopup.nativeElement).modal('show');
  }


  /**
   * delete qualification
   * @param id -qualification id
   */
  deleteQualification(id: number) {

    this.deleteObject.id = id;
    this.deleteObject.category = 'Delete Qualification';
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    

    $(this.deletePopup.nativeElement).modal('show');
  }

  /**
   * delete certificate
   * @param id -certificate id
   */
  deleteCertificate(id: number) {
    this.deleteObject.id = id;
    this.deleteObject.category = 'Delete Certificate';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    
    this.deleteObject.type = 'Delete';

    $(this.deletePopup.nativeElement).modal('show');

  }

  /**
   * delete user
   */
  deleteUser() {

    this.deleteObject.id = UsersStore.user_id;
    this.deleteObject.category = 'Delete User';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    
    this.deleteObject.type = 'Delete';

    $(this.deletePopup.nativeElement).modal('show');

  }

  /**
   * delete confirmation with delete modal
   * @param status - status from delete event emitter
   */
  delete(status) {
    // console.log(status);
    let deleteType;
    if (status && this.deleteObject.id && this.deleteObject.type && this.deleteObject.category) {
      switch (this.deleteObject.category) {
        case 'Delete User':
          deleteType = this._usersService.deleteUser(this.deleteObject.id);
          break;
        case 'Deactivate':
          deleteType = this._usersService.userStatus(this.deleteObject.status, this.deleteObject.id);
          break;
        case 'Activate':
          deleteType = this._usersService.userStatus(this.deleteObject.status, this.deleteObject.id);
          break;
        case 'Delete Certificate':
          deleteType = this._certificateService.deleteCertificate(this.deleteObject.id, UsersStore.user_id);
          break;
        case 'Delete Experience':
          deleteType = this._experienceService.deleteWork(this.deleteObject.id, UsersStore.user_id);
          break;
        case 'Delete Qualification':
          deleteType = this._qualificationService.deleteQualification(this.deleteObject.id, UsersStore.user_id);
          break;
        default:
          break;

      }
      deleteType.subscribe(resp => {
        this.closeConfirmationPopUp();
        this._utilityService.detectChanges(this._cdr);
        if (this.deleteObject.category == 'Deactivate'||this.deleteObject.category == 'Activate') {
          this.addSubmenu();
        }
        if(this.deleteObject.category == 'Delete User'){
          this._router.navigateByUrl('/human-capital/users');
        }
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        if (error.status == 405) {
          setTimeout(() => {
            this.updateStatus('deactivate');
            this.addSubmenu();
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
      $(this.deletePopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    // }, 250);
  } 

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.type = '';
    this.deleteObject.category = '';
    this.deleteObject.status = '';
    this.deleteObject.subtitle = '';
    

  }




  /**
   * getting selected file values
   * @param event  - selected file details
   * @param type - type of the image
   */
  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this._imageService.validateFile(file, type)) {
        const formData = new FormData();
        formData.append('file', file);
        if (type == 'logo') UsersStore.logo_preview_available = true;
        else
          UserCertificateStore.certificate_preview_available = true;
        var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
        this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {

          let uploadEvent: any = res;
          switch (uploadEvent.type) {
            case HttpEventType.UploadProgress:
              // Compute and show the % done;
              if (uploadEvent.loaded)
                this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);

              this._utilityService.detectChanges(this._cdr);
              break;
            case HttpEventType.Response:
              //return event;
              let temp: any = uploadEvent['body'];

              temp['is_new'] = true;

              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                UsersStore.logo_preview_available = false;
                UserCertificateStore.certificate_preview_available = false;


                this.createImageFromBlob(prew, temp, type);

              }, (error) => {
                UsersStore.logo_preview_available = false;
                UserCertificateStore.certificate_preview_available = false;

                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
          UsersStore.logo_preview_available = false;
          UserCertificateStore.certificate_preview_available = false;
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if (type == 'logo') {
        this._usersService.setImageDetails(imageDetails, logo_url, type);
      }
      else {
        
        this._certificateService.setImageDetails(imageDetails, logo_url, type);
        if(!this.certificateForm.value.certificate_name){
          this.certificateForm.patchValue({
            certificate_name: imageDetails.name
          })
        }
       

      }

      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /**
   * 
   * @param ext exstension of the image
   * @param extType type of the image
   */
  /**
    * Returns whether file extension is of imgage, pdf, document or etc..
    * @param ext File extension
    * @param extType Type - image,pdf,doc etc..
    */
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }




  openCertificateFormModal() {
    this.certificateForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
    $(this.certificateFormModal.nativeElement).modal('show');
  }

  closeCertificateFormModal() {
    this.certificateForm.reset();
    this.certificateForm.markAsPristine();
    UserCertificateStore.clearCertificate();
    $(this.certificateFormModal.nativeElement).modal('hide');
  }

  getIsNew(){
    if(UserCertificateStore.certificateImage.is_new==true){
      return true;
    }
    else
      return false;
  }

  /**
   * saving certificate
   * @param close -decision value to close the modal
   */
  saveCertificate(close: boolean = false) {
    this.formErrors = null;
    if (this.certificateForm.valid) {
      let save;

      AppStore.enableLoading();

      if (UserCertificateStore.certificateImage) {
        this.certificateForm.patchValue({
          name: UserCertificateStore.certificateImage.name,
          ext: UserCertificateStore.certificateImage.ext,
          mime_type: UserCertificateStore.certificateImage.mime_type,
          size: UserCertificateStore.certificateImage.size,
          url: UserCertificateStore.certificateImage.url,
          thumbnail_url: UserCertificateStore.certificateImage.thumbnail_url,
          token: UserCertificateStore.certificateImage.token,
          is_new:this.getIsNew()
        })

      }


      if (this.certificateForm.value.id) {

        save = this._certificateService.updateCertificate(this.certificateForm.value.id, UsersStore.user_id, this.certificateForm.value);
      } else {

        let saveData = {
          certificate_name: this.certificateForm.value.certificate_name ? this.certificateForm.value.certificate_name : '',
          name: this.certificateForm.value.name ? this.certificateForm.value.name : '',
          ext: this.certificateForm.value.ext ? this.certificateForm.value.ext : '',
          mime_type: this.certificateForm.value.mime_type ? this.certificateForm.value.mime_type : '',
          size: this.certificateForm.value.size ? this.certificateForm.value.size : '',
          url: this.certificateForm.value.url ? this.certificateForm.value.url : '',
          thumbnail_url: this.certificateForm.value.thumbnail_url ? this.certificateForm.value.thumbnail_url : '',
          token: this.certificateForm.value.token ? this.certificateForm.value.token : ''
        }

        save = this._certificateService.saveCertificate(UsersStore.user_id, saveData);

      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.certificateForm.value.id) {
          this.certificateForm.reset();
          this.certificateForm.markAsPristine();
        }

        this.UserCertificateStore.clearCertificate();

        this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.certificateForm.reset();
          this.closeCertificateFormModal();
        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }

        else if(err.status == 403 || err.status == 500){
          this.closeCertificateFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  /**
   * edit certificate - getting values and opening the modal
   * @param id certificate id
   */
  editCertificate(id) {
    const certificate: Certificate = UserCertificateStore.getCertificateById(id);
    //set form value

    this.certificateForm.reset();
    this.certificateForm.markAsPristine();
    if (certificate.token) {

      let certificateurl = this._humanCapitalService.getThumbnailPreview('user-certificate', certificate.token);

      let certificateDetails = {
        name: certificate.title,
        ext: certificate.ext,
        size: certificate.size,
        url: certificate.url,
        thumbnail_url: certificate.url,
        token: certificate.token,
        preview: certificateurl,
        id: certificate.id,
      };

      this._certificateService.setImageDetails(certificateDetails, certificateurl, 'support-file');


    }

    this.certificateForm.patchValue({

      id: certificate.id,

      certificate_name: certificate.certificate_name,
    });

    this.openCertificateFormModal();

  }

  /**
   * 
   * @param id certificate id
   * @param filename certificate name
   */
  downloadCertificate(id, filename, doc) {
    this._humanCapitalService.downloadFile('user-download-certificate', UsersStore.user_id, id, filename, '', doc);
  }

  /**
   * getting thumbnail preview of the image
   * @param token image token
   */
  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-certificate', token);
  }

  updateStatus(status) {
    if (status == 'deactivate') {
      this.deleteObject.id = UsersStore.user_id;
    this.deleteObject.type = 'Deactivate';
      this.deleteObject.category = 'Deactivate';
      this.deleteObject.subtitle = 'are_you_sure_deactivate';
    
      this.deleteObject.status = status;
      $(this.deletePopup.nativeElement).modal('show');

    }
    else {
      this.deleteObject.id = UsersStore.user_id;
      this.deleteObject.type = 'Activate';
      this.deleteObject.category = 'Activate';
      this.deleteObject.subtitle = 'are_you_sure_activate';
      this.deleteObject.status = status;
      $(this.deletePopup.nativeElement).modal('show');
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    UsersStore.unsetUsersProfile();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    UserCertificateStore.clearCertificate();

  }


}
