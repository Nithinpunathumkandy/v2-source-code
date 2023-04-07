import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { IReactionDisposer, autorun } from "mobx";
import { AppStore } from "src/app/stores/app.store";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ExternalAuditTypesMasterStore } from 'src/app/stores/masters/external-audit/external-audit-types-store';
import { ExternalAuditTypesService } from 'src/app/core/services/masters/external-audit/external-audit-types/external-audit-types.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { MsTypeStore } from "src/app/stores/organization/business_profile/ms-type/ms-type.store";
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ExternalAuditFileService } from 'src/app/core/services/external-audit/file-service/external-audit-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ExternalAuditMasterStore } from 'src/app/stores/external-audit/external-audit/external-audit-store'
import { Router } from '@angular/router';
import { ExternalAuditService } from 'src/app/core/services/external-audit/external-audit/external-audit.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';

declare var $: any;

@Component({
  selector: 'app-add-external-audit',
  templateUrl: './add-external-audit.component.html',
  styleUrls: ['./add-external-audit.component.scss']
})
export class AddExternalAuditComponent implements OnInit {

  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('externalAuditTypesFormModal') externalAuditTypesFormModal: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };
  externalAuditTypesObject = {
    component: 'external-Audit'
  }


  externalAuidtForm: FormGroup;
  externalAuidtFormErrors: any;
  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";

  AuthStore = AuthStore;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  fileUploadPopupStore = fileUploadPopupStore;
  reactionDisposer: IReactionDisposer;
  ExternalAuditTypesMasterStore = ExternalAuditTypesMasterStore;
  ExternalAuditMasterStore = ExternalAuditMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsTypeStore = MsTypeStore;
  UsersStore = UsersStore;
  externalAuditTypesSubscriptionEvent: any;
  fileUploadPopupSubscriptionEvent: any = null;
  cancelEventSubscription: any
  fileUploadsArray = []; // for multiple file uploads

  formObject = {
    0: [
      'external_audit_type_id',
      'ms_type_organization_ids',
      'responsible_user_ids',
      'title',
      'auditor_name',
      'start_date',
      'end_date'
    ]
  }
  responsibleUsers: any[];
  startDate: any;
  endDate: any;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _msTypeService: MstypesService,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _externalAuditFileService: ExternalAuditFileService,
    private _eventEmitterService: EventEmitterService,
    private _externalAuditTypesService: ExternalAuditTypesService,
    private _externalAuditService: ExternalAuditService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _humanCapitalService: HumanCapitalService,
    private _fileUploadPopupService: FileUploadPopupService,) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    AppStore.disableLoading();

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      setTimeout(() => {
        this.externalAuidtForm.pristine;
      }, 250);
    });

    setTimeout(() => {

      //  $(this.uploadArea.nativeElement).mCustomScrollbar();
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: "../" }]);
    // scroll event
    window.addEventListener("scroll", this.scrollEvent, true);

    // for closing the child modal
    this.externalAuditTypesSubscriptionEvent = this._eventEmitterService.externalAuditTypesControl.subscribe(res => {
      this.closeExternalAuditTypesFormModal();
    })
    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    // form values

    this.externalAuidtForm = this._formBuilder.group({
      id: [""],
      external_audit_type_id: [null, [Validators.required]],
      ms_type_organization_ids: [],
      responsible_user_ids: [null,[Validators.required]],
      title: ['',[Validators.required]],
      description: [''],
      auditor_name: ['',[Validators.required]],
      start_date: ['',[Validators.required]],
      end_date: ['',[Validators.required]],
      documents: [],
      reference_code: [null],

    })

    // In case of edit
    if (this._router.url.indexOf('edit-external-audit') != -1) {
      ExternalAuditMasterStore.clearDocumentDetails()
      if (ExternalAuditMasterStore.allItems && ExternalAuditMasterStore.auditId)
        this.setExternalAuditDataForEdit(ExternalAuditMasterStore.auditId);
      else
        this._router.navigateByUrl('/external-audit/external-audit');
    }

    // calling data initially

    this.getExternalAuditTypes();
    this.getMsType();
    this.getResponsibleUsers();


    // all set timeout functions
    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);
    }, 250);

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

  // getting external audit types
  getExternalAuditTypes() {
    this._externalAuditTypesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }
  // getting mstype
  getMsType() {
    this._msTypeService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // getting Responsible user
  getResponsibleUsers() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // search mstype

  searchMsType(event) {
    this._msTypeService.getItems(true, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  // search external audit types

  searchExternalAuditTypes(event, patchValue: boolean = false) {
    this._externalAuditTypesService.getItems(false, '&q=' + event.term).subscribe(res => {
      if (patchValue) {
        let newAuditType = null;
        for (let i of res.data) {
          if (i.id == event.term) {
            newAuditType = i;
            this.externalAuidtForm.patchValue({ external_audit_type_id: newAuditType });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })

  }

  // serach users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }



  // formating date

  formatDate() {

    this.startDate = null;
    this.endDate = null;
    // converting start date
    if (this.externalAuidtForm.value.start_date) {
      let tempstartdate = this.externalAuidtForm.value.start_date;

      this.startDate = this._helperService.processDate(tempstartdate, 'join');
      this.externalAuidtForm.value.start_date = this.startDate;

    }

    // converting end date
    if (this.externalAuidtForm.value.end_date) {
      let tempenddate = this.externalAuidtForm.value.end_date;

      this.endDate = this._helperService.processDate(tempenddate, 'join')
      this.externalAuidtForm.value.end_date = this.endDate;
    }

  }

  // Setting Data for Edit Form
  setExternalAuditDataForEdit(id) {


    this._externalAuditService.getItem(id).subscribe(() => {
      let externalAuditDetails = ExternalAuditMasterStore.individualExternalAuditItemId;

      this.clearCommonFilePopupDocuments();
      if (externalAuditDetails?.documents.length > 0) {
        this.setDocuments(externalAuditDetails?.documents)
      }

      // patch form values for edit
      this.externalAuidtForm.patchValue({


        id: externalAuditDetails.id ? externalAuditDetails.id : '',
        external_audit_type_id: externalAuditDetails.external_audit_type ? externalAuditDetails.external_audit_type : '',
        title: externalAuditDetails.title ? externalAuditDetails.title : '',

        description: externalAuditDetails.description ? externalAuditDetails.description : '',

        auditor_name: externalAuditDetails.auditor_name ? externalAuditDetails.auditor_name : '',

        start_date: externalAuditDetails.start_date ? this._helperService.processDate(externalAuditDetails.start_date, 'split') : null,

        end_date: externalAuditDetails.end_date ? this._helperService.processDate(externalAuditDetails.end_date, 'split') : null,
        reference_code: externalAuditDetails?.reference_code ? externalAuditDetails?.reference_code : '',

        ms_type_organization_ids: externalAuditDetails.ms_type_organizations ? this.getEditValue(externalAuditDetails.ms_type_organizations) : [],
        responsible_user_ids: externalAuditDetails.responsible_users ? this.responsibleUserValue(externalAuditDetails.responsible_users) : [],

      })
      this._utilityService.detectChanges(this._cdr);
      // this.searchMsType({term: externalAuditDetails.ms_type_organizations[0].id })
    })
  }

  // Returns Values as Array for multiple select case
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i.id);
    }
    return returnValue;

  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  // for user previrews
  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      userInfoObject.designation = (user?.designation_title) ? user?.designation_title : user?.designation?.title;
      userInfoObject.image_token = user?.image_token ? user?.image_token : user?.image?.token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status_id
      userInfoObject.department = (user?.department) ? user?.department : user?.department?.title;
      return userInfoObject;
    }
  }
  // for users array
  responsibleUserValue(reporting) {
    let reporting_to = [];
    for (let i of reporting) {
      reporting_to.push(i);
    }
    return reporting_to;
  }

  // function for preview (selected field values to show )
  getSelectedValues() {
    // crearing value initially 
    ExternalAuditMasterStore._msType = [];
    if (ExternalAuditMasterStore.docDetails) {
      this.externalAuidtForm.patchValue({
        documents: ExternalAuditMasterStore.docDetails
      })
    }

    if (this.externalAuidtForm.value.ms_type_organization_ids && this.externalAuidtForm.value.ms_type_organization_ids.length > 0) {
      MsTypeStore.msTypeDetails.forEach(element => {
        if (this.externalAuidtForm.value.ms_type_organization_ids.includes(element.id)) {
          ExternalAuditMasterStore._msType.push({
            title: element.ms_type_title,
            version: element.ms_type_version_title
          })
        }
      });
    } else {
      this.externalAuidtForm.value.ms_type_organization_ids = [];
    }




  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // getting external_audit_type_id from object
  getIds() {
    if (this.externalAuidtForm.value.external_audit_type_id != null) {

      return this.externalAuidtForm.value.external_audit_type_id.id;

    }
  }

  // prepare user details for save/ update
  getUserDetails() {
    if (this.externalAuidtForm.value.responsible_user_ids.length > 0) {
      var responsibleUsers = []
      this.externalAuidtForm.value.responsible_user_ids.forEach(element => {
        responsibleUsers.push(element.id)
      });
      return responsibleUsers;
    }
  }


  // form submit function
  submitExternalAuditForm() {

    let save;

    const externalAuditType = this.getIds();


    this.responsibleUsers = this.getUserDetails();

    var saveData = {

      ...this.externalAuidtForm.value,


      //documents: ExternalAuditMasterStore.docDetails,

      responsible_user_ids: this.responsibleUsers,
      external_audit_type_id: externalAuditType


    }

    if (this.externalAuidtForm.value.id) {
      saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
    } else
      saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')

    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";



    if (this.externalAuidtForm.value.id) {
      save = this._externalAuditService.updateItem(this.externalAuidtForm.value.id, saveData);
    } else {
      this.externalAuidtForm.removeControl('id');
      save = this._externalAuditService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      this.resetFormDetails();
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      this._router.navigateByUrl("/external-audit/external-audit/" + res.id);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        this.externalAuidtFormErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "Next";
        this.previousButtonText = "Previous";
        this.setIntialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    });

  }

  // for reset

  resetFormDetails() {

    this.externalAuidtForm.reset();
    this.externalAuidtForm.pristine;
    this.externalAuidtFormErrors = null;
    this.fileUploadsArray = [];
    this.responsibleUsers = [];

  }

  checkForFileUploadsScrollbar() {
    if (ExternalAuditMasterStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image url
  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  // file change function

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
          this._imageService.uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
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
                  //return event;
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  this.assignFileUploadProgress(null, file, true);
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                    this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                  }, (error) => {
                    this.assignFileUploadProgress(null, file, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
              this.assignFileUploadProgress(null, file, true);
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }


  }

  // imageblob function
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._externalAuditService.setDocumentDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
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



  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)


  }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    ExternalAuditMasterStore.unsetDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  // calling child modal
  addExternalAuditTypes() {
    setTimeout(() => {
      $(this.externalAuditTypesFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.externalAuditTypesFormModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);

  }

  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }
  // close child modal and assign last added value to form
  closeExternalAuditTypesFormModal() {
    $(this.externalAuditTypesFormModal.nativeElement).modal('hide');
    if (ExternalAuditTypesMasterStore.lastInsertedId) {
      this.searchExternalAuditTypes({ term: ExternalAuditTypesMasterStore.lastInsertedId }, true);
      // this.externalAuidtForm.patchValue({ external_audit_type_id: ExternalAuditTypesMasterStore.lastInsertedId });
    }
  }

  // for closing the modal
  closeFormModal() {
    // this.resetForm();
    this._eventEmitterService.dismissExternalAuditTypesModal();


  }

  // Mutli Form

  nextPrev(n) {
    this.formatDate();
    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    // if (n == 1 && !validateForm()) return false;

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
    }

    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.submitExternalAuditForm();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
    } else {
      this.formatDate();
      this.getSelectedValues();
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == x.length - 1) {

      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      // document.getElementById("nextBtn").innerHTML = "Save";
    } else {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Next";
      //document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n);
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i,
      x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  // Setting Intial Tab

  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  // scroll event
  scrollEvent = (event: any): void => {
    //console.log(event);
    const number = event.target.documentElement?.scrollTop;
    //console.log(number);
    if (number > 100) {
      if (this.formSteps)
        this._renderer2.addClass(this.formSteps.nativeElement, "small");
      this._renderer2.addClass(this.navigationBar.nativeElement, "affix");
    } else {
      if (this.formSteps)
        this._renderer2.removeClass(this.formSteps.nativeElement, "small");
      this._renderer2.removeClass(this.navigationBar.nativeElement, "affix");
    }


    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;

      if (number > 50) {

        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };


  /**
   * cancel modal
   * @param status - decision to cancel
   */
  cancelByUser(status) {
    if (status) {

      this._router.navigateByUrl('external-audit/external-audit');
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }


  confirmCancel() {
    $(this.cancelPopup.nativeElement).modal('show');
  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.externalAuidtForm.controls[i].valid) {
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
            if (!this.externalAuidtForm.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents) {
    let khDocuments = [];
    if (documents.length != 0) {
      documents.forEach(element => {
        if (element.document_id) {
          element?.kh_document?.versions.forEach(innerElement => {
            if (innerElement.is_latest) {
              khDocuments.push({
                "fileName":element.kh_document.title,
                ...innerElement,
                title:element?.kh_document.title,
                'is_kh_document': true
              })
              fileUploadPopupStore.setUpdateFileArray({
                'updateId': element.id,
                ...innerElement

              })
            }
          });
        }
        else {
          if (element && element.token) {
            var purl = this._externalAuditFileService.getThumbnailPreview('findings-document', element.token)
            var lDetails = {
              name: element.title,
              ext: element.ext,
              size: element.size,
              url: element.url,
              token: element.token,
              thumbnail_url: element.thumbnail_url,
              preview: purl,
              id: element.id,
              'is_kh_document': false,
            }
          }
          this._fileUploadPopupService.setSystemFile(lDetails, purl)
        }
      });
    }
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  // *Common  File Upload/Attach Modal Functions Starts Here

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }
  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._humanCapitalService.getThumbnailPreview(type, token)

  }
  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
      $(this.previewUploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // *Common  File Upload/Attach Modal Functions Ends Here


  ngOnDestroy() {
    this.externalAuditTypesSubscriptionEvent.unsubscribe();
    this._externalAuditService.setDocumentDetails(null, '');
    this.cancelEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    window.addEventListener('scroll', this.scrollEvent, null);
    ExternalAuditMasterStore._msType = [];
    ExternalAuditMasterStore._responsibleUser = [];
    $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
    this.fileUploadPopupSubscriptionEvent.unsubscribe();

    //document clear
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

}
