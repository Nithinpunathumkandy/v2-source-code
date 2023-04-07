import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ExternalAuditMasterStore } from 'src/app/stores/external-audit/external-audit/external-audit-store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ExternalAuditService } from 'src/app/core/services/external-audit/external-audit/external-audit.service';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
import { AuditFindingCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-finding-categories-store';
import { AuditFindingCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-finding-categories/audit-finding-categories.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpEventType, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { FindingsService } from 'src/app/core/services/external-audit/findings/findings.service';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { Router } from '@angular/router';
import { ExternalAuditFileService } from 'src/app/core/services/external-audit/file-service/external-audit-file.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RiskRating } from 'src/app/core/models/masters/external-audit/risk-rating';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-findings',
  templateUrl: './add-findings.component.html',
  styleUrls: ['./add-findings.component.scss']
})
export class AddFindingsComponent implements OnInit, OnDestroy {
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;


  formObject = {
    0: [
      'title',
      'external_audit_id',
      'finding_category_id',
      'risk_rating_id',
      'recommendation',
      'evidence',
      'correction',
      'correction_description',
      'department_id'
    ]
  }

  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";


  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  isReadOnly: boolean = false;

  fileUploadPopupStore = fileUploadPopupStore;
  SubMenuItemStore = SubMenuItemStore;
  ExternalAuditMasterStore = ExternalAuditMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  AuditFindingCategoryMasterStore = AuditFindingCategoryMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  DepartmentMasterStore = DepartmentMasterStore;
  FindingMasterStore = FindingMasterStore;
  reactionDisposer: IReactionDisposer;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  fileUploadsArray: any = []; // Display Mutitle File Loaders

  cancelEventSubscription: any;
  fileUploadPopupSubscriptionEvent: any = null;

  //ck editor configuration
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
  externalAuditTitle: any;
  public Editor;
  public Config;
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _externalAuditService: ExternalAuditService,
    private _auditFindingCategoryService: AuditFindingCategoriesService,
    private _findingService: FindingsService,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _router: Router,
    private _departmentService: DepartmentService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _riskRatingService: RiskRatingService,
    private _externalAuditFileService: ExternalAuditFileService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _http: HttpClient,) {
    this.Editor = myCkEditor;
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {
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
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);
    SubMenuItemStore.setNoUserTab(true);
    //SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl }]);
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: "../" }]);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })


    // form elements

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      external_audit_id: [null, [Validators.required]],
      finding_category_id: [null, [Validators.required]],
      risk_rating_id: ['', [Validators.required]],
      department_id: [null, ''],
      description: [''],
      recommendation: [''],
      evidence: [''],
      correction: [''],
      correction_description: [''],
      documents: ['']
    });
    ExternalAuditMasterStore.setCurrentPage(1);
    this.resetForm()
    // In case of edit
    if (this._router.url.indexOf('edit-findings') != -1) {
      ExternalAuditMasterStore.clearDocumentDetails()
      if (ExternalAuditMasterStore.allItems && FindingMasterStore.auditFindingId)
        this.setAuditFindingDataForEdit(FindingMasterStore.auditFindingId);
      else
        this._router.navigateByUrl('/external-audit/audit-findings');
    }

    if (ExternalAuditMasterStore.auditId) {
      this.searchExternalAudit({term: ExternalAuditMasterStore.auditId},true);
      this.isReadOnly = true;
    } else if (this.form.value.id) {
      this.isReadOnly = true;
    } else {
      this.isReadOnly = false;
    }



    // for showing initial tab

    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);
  }

  MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository')
      .createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader, this._http);
      };
  }

  // seraching external audit
  searchExternalAudit(e,patchValue?:boolean) {
    this._externalAuditService.getItems(false, '&q=' + e.term).subscribe(res => {
      if(patchValue){
        let pos = res.data.findIndex(e => e.id == ExternalAuditMasterStore.auditId);
        if(pos != -1) this.form.patchValue({
          external_audit_id: res.data[pos]
        })
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // getting external audit
  getExternalAudit() {
    this._externalAuditService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  // getting finding category
  getFindingCategory() {
    this._auditFindingCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // get risk ratings
  getRiskRating() {
    this._riskRatingService.getAllItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting department
  getDepartment() {
    this._departmentService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // searching in finding category

  searchFindingCategory(e) {
    this._auditFindingCategoryService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // search in risk rating

  searchRiskRating(e) {
    this._riskRatingService.getAllItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //serach in department

  searchDepartment(e) {
    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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
        this._findingService.setDocumentDetails(imageDetails, type);
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

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  removeDocument(doc) {
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  checkForFileUploadsScrollbar() {
    if (FindingMasterStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // scroll event
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };


  // Mutli Form

  nextPrev(n) {
    this.getValues();
    this.getExternalAuditTitle();
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
      this.save();
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
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (n == x.length - 1) {

      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      // document.getElementById("nextBtn").innerHTML = "Save";
    } else {
      this.getValues();
      this.getExternalAuditTitle();
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

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.form.controls[i].valid) {
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
            if (!this.form.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
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

  getValues() {
    const risk: RiskRating = RiskRatingMasterStore.getRiskRatingById(this.form.value.risk_rating_id);
    RiskRatingMasterStore.setSingleRiskRating(risk);
    return risk;

  }

  getExternalAuditTitle() {
    // function to call to getting the title of audit program and aduit category from store

    this.externalAuditTitle = null;

    if (this.form.value.external_audit_id && ExternalAuditMasterStore.loaded == true) {
      var singleExternalAudit = ExternalAuditMasterStore.getExternalAuditById(this.form.value.external_audit_id.id);
      console.log(singleExternalAudit);
      
      if(singleExternalAudit){
        this.externalAuditTitle = singleExternalAudit.title;
      }

    }

  }

  // for edit value assigning to form

  setAuditFindingDataForEdit(id) {
    this.clearCommonFilePopupDocuments();
    this.getExternalAudit();
    this.getFindingCategory();
    this.getRiskRating();
    this.getDepartment();
    var department = null;
    FindingMasterStore.clearDocumentDetails();
    this._findingService.getItem(id).subscribe(() => {
      let externalAuditFindingDetails = FindingMasterStore.individualExternalAuditFindingItemId;

      externalAuditFindingDetails.departments.forEach(element => {
        department = element
      })

      this.clearCommonFilePopupDocuments();
      if (externalAuditFindingDetails.documents.length > 0){
        this.setDocuments(externalAuditFindingDetails.documents)
      }

      // patch form values for edit
      this.form.patchValue({


        id: externalAuditFindingDetails.id ? externalAuditFindingDetails.id : '',
        external_audit_id: externalAuditFindingDetails.external_audit ? externalAuditFindingDetails.external_audit : null,
        department_id:  FindingMasterStore.individualExternalAuditFindingItemId.departments.length>0?FindingMasterStore.individualExternalAuditFindingItemId.departments[0]:null,
        finding_category_id: FindingMasterStore.individualExternalAuditFindingItemId.finding_category ? FindingMasterStore.individualExternalAuditFindingItemId.finding_category : null,
        risk_rating_id: externalAuditFindingDetails.risk_rating ? externalAuditFindingDetails.risk_rating.id : '',
        recommendation: externalAuditFindingDetails.recommendation ? externalAuditFindingDetails.recommendation : '',
        title: externalAuditFindingDetails.title ? externalAuditFindingDetails.title : '',

        description: externalAuditFindingDetails.description ? externalAuditFindingDetails.description : '',

        evidence: externalAuditFindingDetails.evidence ? externalAuditFindingDetails.evidence : '',

        correction: externalAuditFindingDetails.corrections.length>0 ?externalAuditFindingDetails.corrections[externalAuditFindingDetails.corrections.length-1]?.title : '',

        correction_description: externalAuditFindingDetails.corrections.length>0 ?externalAuditFindingDetails.corrections[externalAuditFindingDetails.corrections.length-1]?.description : '',
        document: ''
      })
      // this.searchFindingCategory({term: externalAuditFindingDetails.finding_category})
      this._utilityService.detectChanges(this._cdr);

    })

  }



  /**
     * cancel modal
     * @param status - decision to cancel
     */
  cancelByUser(status) {
    if (status) {
      if (ExternalAuditMasterStore.auditId) {
        this._router.navigateByUrl('/external-audit/external-audit/' + ExternalAuditMasterStore.auditId + '/findings')
      } else {
        this._router.navigateByUrl('/external-audit/audit-findings');
      }

    } else {

    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }


  confirmCancel() {

    $(this.cancelPopup.nativeElement).modal('show');
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;

  }


  processDataForSave() {

    var saveData = {
      title: this.form.value.title ? this.form.value.title : '',
      external_audit_id: this.form.value.external_audit_id ? this.form.value.external_audit_id.id : '',
      finding_category_id: this.form.value.finding_category_id ? this.form.value.finding_category_id.id : null,
      risk_rating_id: this.form.value.risk_rating_id ? this.form.value.risk_rating_id : '',
      recommendation: this.form.value.recommendation ? this.form.value.recommendation : '',
      description: this.form.value.description ? this.form.value.description : '',
      evidence: this.form.value.evidence ? this.form.value.evidence : '',
      correction: this.form.value.correction ? this.form.value.correction : '',
      correction_description: this.form.value.correction_description ? this.form.value.correction_description : '',
      department_id: this.form.value.department_id?[this.form.value.department_id.id]:[],
      //documents: FindingMasterStore.docDetails,
    };

    // if (this.form.value.department_id) {
    //   saveData.department_id.push(this.form.value.department_id.id);

    // }
    // removing non entries from save object
    if (!this.form.value.correction) {
      delete saveData.correction;
    }
    if (!this.form.value.correction_description) {
      delete saveData.correction_description;
    }

    if (this.form.value.id) {
      saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
    } else
      saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')

    return saveData;

  }

  // save function
  save() {
    this.formErrors = null;
    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";

    // console.log( this.form.value.kpiing_to);
    if (this.form.value.id) {
      save = this._findingService.updateItem(this.form.value.id, this.processDataForSave());
    } else {

      save = this._findingService.saveItem(this.processDataForSave());
    }
    save.subscribe((res: any) => {
      if (!this.form.value.id) {
        this.resetForm();
        this.FindingMasterStore.clearDocumentDetails();

      }
      // this._router.navigateByUrl('/external-audit/audit-findings');
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      this._router.navigateByUrl("/external-audit/audit-findings/" + res.id);
      // this.KpiMasterStore.clearDocumentDetails();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      this.currentTab = 0;
      this.nextButtonText = "Next";
      this.previousButtonText = "Previous";
      this.setIntialTab();
      this.showTab(this.currentTab);
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });

  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents) {
    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
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
    // else
    // return this._organizationFileService.getThumbnailPreview(type,token);

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
    window.addEventListener('scroll', this.scrollEvent, null);
    this.cancelEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    this.clearCommonFilePopupDocuments();

      //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }
}
