import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProfileService } from "src/app/core/services/organization/business_profile/profile/profile.service";
import { ProfileStore } from "src/app/stores/organization/business_profile/profile/profile.store";

import { AppStore } from 'src/app/stores/app.store';

import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  currentTab = 0;
  saveFlag = false;
  nextButtonText = 'next';
  previousButtonText = "previous";
  regForm: FormGroup;
  formErrors: any;
  previewProfile: any;

  AppStore = AppStore;
  ProfileStore = ProfileStore;
  UsersStore = UsersStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  reactionDisposer: IReactionDisposer;
  fileUploadsArray: any = [];
  minDate = { year: new Date().getUTCFullYear() - 200, month: 12, day: 31 }

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'are_you_sure_cancel',
    type: 'Cancel'
  };

  formObject = {
    0: [
      'title',
      'email',
      'website',
      'instagram',
      'facebook',
      'twitter',
      'linkedin',
      'youtube'
    ],
    2: [
      'ceo_user_id',
      'ceo_message'
    ]

  }

  confirmationEventSubscription: any;

  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('editBar') editBar: ElementRef;
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;
  showForm: boolean = false;
  config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',

      '|',
      'bold',
      'italic',

      '|',
      'link',
      'imageUpload',
      '|',

      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'insertTable',
      'blockQuote',

    ],
    language: 'id',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    }
  };
  public Editor;
  public Config;

  constructor(private _formBuilder: FormBuilder, private _profileService: ProfileService, private _router: Router,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService, private _imageService: ImageServiceService,
    private _renderer2: Renderer2, private _userService: UsersService, private _helperService: HelperServiceService,
    private _organizationFileService: OrganizationfileService, private _eventEmitterService: EventEmitterService,
    private _http: HttpClient) {
    this.Editor = myCkEditor;
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = false;

    // ClassicEditor
    // .create( document.querySelector( '#values' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    SubMenuItemStore.setNoUserTab(true);

    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '/organization/business-profile' },
    ]);

    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.closeEditProfilePage(item);
    })

    // Scroll Listener to set organization bar on top while scrolling
    window.addEventListener('scroll', this.scrollEvent, true);

    AppStore.disableLoading();

    //Create Form Object
    this.regForm = this._formBuilder.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
      image: [''],
      values: [''],
      vision: [''],
      mision: [''],
      ceo_user_id: [null],
      ceo_message: [''],
      employee_count: [''],
      branch_count: [''],
      establish_date: [null],
      phone: [''],
      email: ['', [Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      address: [''],
      website: ['', [Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      brochures: [''],
      instagram: ['', [Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      facebook: ['', [Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      twitter: ['', [Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      skype: [''],
      linkedin: ['', [Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      youtube: ['', [Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]]
    });

    //Gets CEO User
    this.getCeoUser();

    //Clear Variables for Logo and Brochures
    this._profileService.setFileDetails(null, '', 'logo');
    this.ProfileStore.clearBrochureDetails();


    //Get Profile Details
    this._profileService.getItem(null).subscribe(res => {
      var profileDetails = res;
      //Process Logo and get preview url
      if (profileDetails.hasOwnProperty('image') && profileDetails.image.token) {
        var logoPreviewUrl = this._organizationFileService.getThumbnailPreview('business-profile-logo', profileDetails.image.token, 260, 283);
        var logoDetails = {
          name: profileDetails.image.title,
          ext: profileDetails.image.ext,
          size: profileDetails.image.size,
          url: profileDetails.image.url,
          token: profileDetails.image.token,
          preview: logoPreviewUrl,
          thumbnail_url: profileDetails.image.thumbnail_url ? profileDetails.image.thumbnail_url : profileDetails.image.url
        };
        this._profileService.setFileDetails(logoDetails, logoPreviewUrl, 'logo');
      }
      //Process Brochures and get preview url
      if (profileDetails.brouchures.length > 0) {
        for (let brochures of profileDetails.brouchures) {
          let brochurePreviewUrl = this._organizationFileService.getThumbnailPreview('business-profile-brochure', brochures.token);
          let brochureDetails = {
            name: brochures.title,
            ext: brochures.ext,
            size: brochures.size,
            url: brochures.url,
            thumbnail_url: brochures.url,
            token: brochures.token,
            preview: brochurePreviewUrl,
            id: brochures.id
          };
          this._profileService.setFileDetails(brochureDetails, brochurePreviewUrl, 'brochure');
        }
        this.checkForFileUploadsScrollbar();
      }
      this.regForm.reset();
      this.regForm.markAsPristine();
      AppStore.disableLoading();
      setTimeout(() => {
        this.regForm.setValue({
          id: profileDetails.id ? profileDetails.id : '',
          title: profileDetails.title ? profileDetails.title : '',
          description: profileDetails.description ? profileDetails.description : '',
          image: '',
          values: profileDetails.values ? profileDetails.values : '',
          vision: profileDetails.vision ? profileDetails.vision : '',
          mision: profileDetails.mision ? profileDetails.mision : '',
          ceo_user_id: profileDetails.ceo ? profileDetails.ceo.id : null,
          ceo_message: profileDetails.ceo_message ? profileDetails.ceo_message : '',
          employee_count: profileDetails.employee_count ? profileDetails.employee_count : '',
          branch_count: profileDetails.branch_count ? profileDetails.branch_count : '',
          establish_date: profileDetails.establish_date ? this._helperService.processDate(profileDetails.establish_date, 'split') : null,
          phone: profileDetails.phone ? profileDetails.phone : '',
          email: profileDetails.email ? profileDetails.email : '',
          address: profileDetails.address ? profileDetails.address : '',
          website: profileDetails.website ? profileDetails.website : '',
          brochures: '',
          instagram: profileDetails.organization_sns.instagram ? profileDetails.organization_sns.instagram : '',
          facebook: profileDetails.organization_sns.facebook ? profileDetails.organization_sns.facebook : '',
          twitter: profileDetails.organization_sns.twitter ? profileDetails.organization_sns.twitter : '',
          skype: profileDetails.organization_sns.skype ? profileDetails.organization_sns.skype : '',
          linkedin: profileDetails.organization_sns.linkedin ? profileDetails.organization_sns.linkedin : '',
          youtube: profileDetails.organization_sns.youtube ? profileDetails.organization_sns.youtube : ''
        });
        this.saveFlag = false;
        this.showTab(this.currentTab);
        this.showForm = true;
        // this.ceoChange(this.regForm.value.ceo_user_id);
        this._utilityService.detectChanges(this._cdr);
      }, 100);
    }, (error) => {
      this._router.navigateByUrl('/organization/business-profile');
    });

  }

  cdkEditorValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }


  //Returns Thumbnail Preview Url according to type and token
  createPreviewUrl(type, token) {
    return this._organizationFileService.getThumbnailPreview(type, token);
  }

  getCeoUser() {
    UsersStore.setAllUsers([]);
    this._userService.getAllItems('?is_ceo=true').subscribe(res => {
      if (res.data.length > 0) {
        this.regForm.patchValue({
          ceo_user_id: res.data[0].id
        })
        // this.ceoChange(this.regForm.value.ceo_user_id);
        this._utilityService.detectChanges(this._cdr);
      }
    });
  }

  ceoChange(event) {
    if (event) {
      this.regForm.controls['ceo_message'].setValidators(Validators.required);
    }
    else {
      this.regForm.controls['ceo_message'].clearValidators();
      this.regForm.controls['ceo_message'].reset();
    }
    this.regForm.controls['ceo_message'].updateValueAndValidity();
    this._utilityService.detectChanges(this._cdr);
  }

  changeStep(step) {
    if (step > this.currentTab && this.checkFormObject(step)) {
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if (step < this.currentTab) {
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }
  }

  //Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  //Function to show tab in step form
  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      //if(this.regForm.valid){
      this.saveFlag = true;
      let tempdate = this.regForm.value.establish_date;
      this.previewProfile = this.regForm.value;
      this.previewProfile.establish_date = this._helperService.processDate(tempdate, 'join');
      if (document.getElementById("nextBtn")) {
        //document.getElementById("nextBtn").innerHTML = "Save";
        this.nextButtonText = "save";
      }
      //}
    } else {
      this.saveFlag = false;
      if (document.getElementById("nextBtn")) {
        //document.getElementById("nextBtn").innerHTML = "Next"; 
        this.nextButtonText = "next";
      }
    }
    //... and run a function that will display the correct step indicator:
    this._utilityService.scrollToTop();
    this.fixStepIndicator(n);
  }

  nextPrev(n) {
    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    // if (n == 1 && !validateForm()) return false;
    document.getElementsByClassName("step")[this.currentTab].className += " finish";
    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;
    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      //document.getElementById("regForm").submit();
      //console.log(this.regForm.value);
      this.saveProfile();
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  validateForm() {
    // This function deals with validation of the form fields
    var x: any, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[this.currentTab].getElementsByTagName("input");

    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty...
      if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid; // return the valid status
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  setInitialTab() {
    var x: any = document.getElementsByClassName("tab");
    for (var i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.regForm.controls[i].valid) {
            setValid = false;
            break;
          }
        }
      }
    }
    else {
      for (var i = 0; i < tabNumber; i++) {
        if (this.formObject.hasOwnProperty(i)) {
          for (let k of this.formObject[i]) {
            if (!this.regForm.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

  scrollEvent = (event: any): void => {
    // console.log(event);
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      // console.log(number);
      if (number > 50) {
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.editBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.editBar.nativeElement, 'affix');
      }
    }
  }

  //Function to handle file selection
  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams)
            .subscribe((res: HttpEvent<any>) => {
              let uploadEvent: any = res;
              switch (uploadEvent.type) {
                case HttpEventType.UploadProgress:
                  // Compute and show the % done;
                  if (uploadEvent.loaded) {
                    let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                    this.assignFileUploadProgress(upProgress, file);
                  }
                  this._utilityService.detectChanges(this._cdr);
                  break;
                case HttpEventType.Response:
                  // Request success Response handling
                  if (type != 'brochure') $("#file").val('');
                  else $("#myfile").val('');
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  this.assignFileUploadProgress(null, file, true);
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Gets blob file of image
                    this.createImageFromBlob(prew, temp, type);
                  }, (error) => {
                    if (type != 'brochure') $("#file").val('');
                    else $("#myfile").val('');
                    this.assignFileUploadProgress(null, file, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              if (type != 'brochure') $("#file").val('');
              else $("#myfile").val('');
              let errorMessage = "";
              if (error.error?.errors?.hasOwnProperty('file'))
                errorMessage = error.error.errors.file;
              else errorMessage = 'file_upload_failed';
              this._utilityService.showErrorMessage('failed', errorMessage);
              this.assignFileUploadProgress(null, file, true);
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
          if (type != 'brochure') $("#file").val('');
          else $("#myfile").val('');
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
  }

  MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository')
      .createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader, this._http);
      };
  }

  /**
   * 
   * @param progress File Upload Progress
   * @param file Selected File
   * @param success Boolean value whether file upload success 
   */
  assignFileUploadProgress(progress, file, success = false) {
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  checkLogoIsUploading() {
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  //Function to convert image blob file to base64 string
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      this._profileService.setFileDetails(imageDetails, logo_url, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  //Check extension of file to know whether its image or doc or excel or pdf..
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  getPath(ext) {
    return this._imageService.getPath(ext);
  }

  //Save Profile details
  saveProfile() {
    if (this.regForm.valid) {
      let save;
      this.regForm.value.image = this._profileService.getFileDetails('logo') ? this._profileService.getFileDetails('logo') : null;
      this.regForm.value.brochures = this._profileService.getBrochureDetails() ? this._profileService.getBrochureDetails() : [];
      AppStore.enableLoading();
      this.nextButtonText = "loading";
      this.previousButtonText = "loading";
      if (this.regForm.value.id) {
        save = this._profileService.updateItem(this.regForm.value.id, this.regForm.value);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        this._router.navigateByUrl('/organization/business-profile');
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          setTimeout(() => {
            this.currentTab = 0;
            this.saveFlag = false;
            this.nextButtonText = "next";
            this.previousButtonText = "previous";
            this.setInitialTab();
            this.showTab(this.currentTab);
            //this._utilityService.scrollToTop();
            this._utilityService.detectChanges(this._cdr);
          }, 150);
        }
        else {
          //this._utilityService.showErrorMessage('Error!', "Something went wrong. Please try again.");
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
    else {
      this._utilityService.showWarningMessage('form_validation', 'input_validation_failed');
      this.nextButtonText = "next";
      this.previousButtonText = "previous";
      this.currentTab = 0;
      this.saveFlag = false;
      this.showTab(this.currentTab);
      //this._utilityService.scrollToTop();
    }
  }

  getMisionContent(profileDetails) {
    var misionContent = profileDetails.mision.substring(0, 100);
    return misionContent;
  }

  viewMision(type) {
    if (type == 'more')
      ProfileStore.mision_more = true;
    else
      ProfileStore.mision_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  getVisionContent(profileDetails) {
    var misionContent = profileDetails.vision.substring(0, 100);
    return misionContent;
  }

  viewVision(type) {
    if (type == 'more')
      ProfileStore.vision_more = true;
    else
      ProfileStore.vision_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionContent(profileDetails) {
    var misionContent = profileDetails.description.substring(0, 1000);
    return misionContent;
  }

  viewDescription(type) {
    if (type == 'more')
      ProfileStore.description_more = true;
    else
      ProfileStore.description_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  getValuesContent(profileDetails) {
    var valuesContent = profileDetails.values.substring(0, 1000);
    return valuesContent;
  }

  viewValues(type) {
    if (type == 'more')
      ProfileStore.values_more = true;
    else
      ProfileStore.values_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  getCeoMessageContent(profileDetails) {
    var ceoMessageContent = profileDetails.ceo_message.substring(0, 500);
    return ceoMessageContent;
  }

  viewCeoMessage(type) {
    if (type == 'more')
      ProfileStore.ceo_message_more = true;
    else
      ProfileStore.ceo_message_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  removeBrochure(token) {
    ProfileStore.unsetFileDetails('brochure', token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  checkForFileUploadsScrollbar() {
    if (ProfileStore.getBrochureDetails.length > 7 || (this.fileUploadsArray.length > 7 && ProfileStore.getBrochureDetails.length < 7) || ((this._helperService.checkFileisUploadedCount(this.fileUploadsArray) + ProfileStore.getBrochureDetails.length) > 7)) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  cancelEdit() {
    //this._router.navigateByUrl('/organization/business-profile');
    $(this.confirmationPopup.nativeElement).modal('show');
  }

  closeEditProfilePage(status) {
    $(this.confirmationPopup.nativeElement).modal('hide');
    if (status)
      this._router.navigateByUrl('/organization/business-profile');
  }

  // @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //   if(event.key == 'Escape' || event.code == 'Escape'){
  //     this._router.navigateByUrl('/organization/business-profile');
  //   }
  // }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  ngOnDestroy() {
    this.saveFlag = false;
    AppStore.disableLoading();
    ProfileStore.mision_more = false;
    ProfileStore.vision_more = false;
    ProfileStore.description_more = false;
    ProfileStore.values_more = false;
    ProfileStore.ceo_message_more = false;
    this.scrollEvent = null;
    this.confirmationEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
