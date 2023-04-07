import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { RiskRating } from 'src/app/core/models/masters/external-audit/risk-rating';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { AuditScheduleService } from 'src/app/core/services/internal-audit/audit-schedule/audit-schedule.service';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
import { AuditFindingCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-finding-categories/audit-finding-categories.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { AuditSchedulesStore } from 'src/app/stores/internal-audit/audit-schedule/audit-schedule-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { AuditFindingCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-finding-categories-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
declare var $: any;
@Component({
  selector: 'app-findings-add',
  templateUrl: './findings-add.component.html',
  styleUrls: ['./findings-add.component.scss']
})
export class FindingsAddComponent implements OnInit, OnDestroy {
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('checklistModal', { static: true }) checklistModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;

  formObject = {
    0:[
      'title',
      'audit_schedule_id',
      'finding_category_id',
      'risk_rating_id',
      'recommendation',
      'evidence'
    ],
    1:[
      'checklist_answer_ids'
    ],
    2:[
      'auditable_item_ids'
    ]
  }

  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";
  
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
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  auditableItemObject = {
    component: 'Master',
    values: null,
    type: null
  };


  checklistObject ={
    component: 'Master',
    values: null,
    type: null
  };

  AuditFindingsStore = AuditFindingsStore;
  AppStore = AppStore;
  AuditStore = AuditStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  fileUploadPopupStore = fileUploadPopupStore;
  DivisionMasterStore = DivisionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  SectionMasterStore = SectionMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  AuditFindingCategoryMasterStore = AuditFindingCategoryMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  DepartmentMasterStore = DepartmentMasterStore;
  AuditSchedulesStore = AuditSchedulesStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  fileUploadsArray = []; // for multiple file uploads

  form: FormGroup;
  formErrors: any;
  cancelEventSubscription: any;
  auditableItemEvent;
  checklistEvent;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  fileUploadPopupSubscriptionEvent: any = null;
  auditableItemEmptyList = "Looks like there are no auditable items. Add auditable items and it will show up here.";
  checklistEmptyList = "Looks like there are no checklists. Add checklists and it will show up here.";
  auditScheduleTitle: any;
  modalFocusEvent:any;
  public Editor;
  public Config;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _auditScheduleService: AuditScheduleService,
    private _auditFindingCategoryService: AuditFindingCategoriesService,
    private _router: Router,
    private _internalAuditFileService: InternalAuditFileService,
    private _auditFindingsService: AuditFindingsService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _riskRatingService: RiskRatingService,
    private _http: HttpClient,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _auditService: AuditService
    ) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {

    // Session Storage Test

    // var auditId=sessionStorage.getItem('auditId');
    // if(auditId){
    //   this._auditService.setAuditId(parseInt(auditId));
    //   AuditFindingsStore.auditFindingId=parseInt(auditId)
    // }
    

    AppStore.showDiscussion = false;
    setTimeout(() => {
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);
    // ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );
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
        this.form.pristine;
      }, 250);
    });


    setTimeout(() => {

      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');

    }, 1000);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl }]);
    // scroll event
    window.addEventListener("scroll", this.scrollEvent, true);

    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    this.auditableItemEvent = this._eventEmitterService.importAuditableItemModal.subscribe(res => {
      this.closeModal();
    })

     // focus fix
     this.modalFocusEvent = this._eventEmitterService.checklistsSingleViewModalFocusControl.subscribe(res=>{
      this.manageFocus();
    })

    this.checklistEvent = this._eventEmitterService.checklistAnswersAddModalControl.subscribe(res=>{
      this.closeChecklistModal();
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
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    // form elements

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      audit_schedule_id: [null, [Validators.required]],
      finding_category_id: [null, [Validators.required]],
      risk_rating_id: [null, [Validators.required]],
      recommendation: [''],
      description: [''],
      auditable_item_ids: [],
      checklist_answer_ids:[],
      evidence: [''],
      documents: ['']
    });
    this.getRiskRating();
    this.getFindingCategory();
    this.getAuditSchedule();


    // in the case of edit

    if (this._router.url.indexOf('edit-findings') != -1) {

      AuditFindingsStore.clearDocumentDetails();
      if(AuditFindingsStore.auditFindingId){
        this._auditFindingsService.getItem(AuditFindingsStore.auditFindingId).subscribe(res=>{
          if(res){
            this.setAuditFindingsForEdit()
          }          
        })
      }else{
        this._router.navigateByUrl('/internal-audit/findings');
      }      

      // if (AuditFindingsStore.findingsDetails)
      //   this.setAuditFindingsForEdit();
      // else
      //   this._router.navigateByUrl('/internal-audit/findings');
    } 
     // for showing initial tab

     setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);
  }

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' )
    .createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
}


  // getSchedule

  getAuditSchedule() {
    if(AuditStore.audit_id){
      let params = `&audit_ids=${AuditStore.audit_id}`;
      this._auditScheduleService.getItems(false,params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
    this._auditScheduleService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
   }
  }

  // search schedule

  searchAuditSchedule(e) {
    if(AuditStore.audit_id){
      let params = `&audit_ids=${AuditStore.audit_id}`;
    this._auditScheduleService.getItems(false, '&q=' + e.term+params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  } else {
    this._auditScheduleService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  }

  // getting finding category
  getFindingCategory() {
    this._auditFindingCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // searching in finding category

  searchFindingCategory(e) {
    this._auditFindingCategoryService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // get risk ratings
  getRiskRating() {
    this._riskRatingService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }


  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getAuditScheduleID(e){
    
    AuditFindingsStore.auditSChedule_Id = e;

    AuditFindingsStore.unSelectChecklists();
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

  // scrollbar function
  checkForFileUploadsScrollbar() {

    if (AuditFindingsStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }


  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.checklistModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.checklistModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.checklistModal.nativeElement,'overflow','auto');
    }
  }

  // for opening modal
  openAuditableItemModal() {
    this.auditableItemObject.values={
      scheduleId:AuditFindingsStore.auditSChedule_Id
    }
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
    this.auditableItemObject.type = 'auditFindings';
  }

  openChecklistModal(){

    setTimeout(() => {
      $(this.checklistModal.nativeElement).modal('show');
    }, 100);
    if(this.form.value.id){
      this.checklistObject.type = 'Edit';
    } else {
      this.checklistObject.type = 'Add';
    }
  }
  // for close modal
  closeModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.auditableItemObject.type = null;

  }
  closeChecklistModal(){
    $(this.checklistModal.nativeElement).modal('hide');
   this.checklistObject.type = null;
  }

  manageFocus(){
    setTimeout(() => {
      this._renderer2.setStyle(this.checklistModal.nativeElement,'z-index','999999'); // For Modal to Get Focus
        this._renderer2.setStyle(this.checklistModal.nativeElement,'overflow','auto');
      }, 50);
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
        this._auditFindingsService.setDocumentDetails(imageDetails, type);
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


  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }

  // checkAcceptFileTypes(type){
  //   return this._imageService.getAcceptFileTypes(type); 
  // }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    AuditFindingsStore.unsetDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  // delete auditableItem from list
  deleteAuditableItem(auditableItem) {
    var index = AuditFindingsStore.auditableItemToDisplay.indexOf(auditableItem);
    AuditFindingsStore.auditableItemToDisplay.splice(index, 1);
    this._utilityService.showSuccessMessage('Success!', 'Auditable Item Deleted');
  }

  deleteChecklists(checklists){
    var index = AuditFindingsStore.ChecklistToDisplay.indexOf(checklists);
    AuditFindingsStore.ChecklistToDisplay.splice(index, 1);
    this._utilityService.showSuccessMessage('Success!', 'Checklist Deleted');
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


  // Mutli Form

  nextPrev(n) {
    this.getValues();
    this.getScheduleTitle();
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
      this.getScheduleTitle();
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

  checkFormObject(tabNumber?:number){
    var setValid = true;
    if(!tabNumber){
      if(this.formObject.hasOwnProperty(this.currentTab)){
        for(let i of this.formObject[this.currentTab]){
          if(!this.form.controls[i].valid){
            setValid = false;
            break;
          }
        }
      }
    }
    else{
      for(var i = 0; i < tabNumber; i++){
        if(this.formObject.hasOwnProperty(i)){
          for(let k of this.formObject[i]){
            if(!this.form.controls[k].valid){
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }


  changeStep(step){
    if(step > this.currentTab && this.checkFormObject(step)){
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if(step < this.currentTab){
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }  
  }

  getValues() {
    const risk: RiskRating = RiskRatingMasterStore.getRiskRatingById(this.form.value.risk_rating_id);
    RiskRatingMasterStore.setSingleRiskRating(risk);
    return risk;

  }

  getScheduleTitle(){
     // function to call to getting the title of audit program and aduit category from store
 
    this.auditScheduleTitle = null;
  
    if (this.form.value.audit_schedule_id && AuditSchedulesStore.loaded == true) {
      var singleAuditSchedule = AuditSchedulesStore.getAuditSCheduleById(this.form.value.audit_schedule_id);
      this.auditScheduleTitle = singleAuditSchedule.department;

    }
  
  }


  // edit functions

  setAuditFindingsForEdit() {
    var auditFindings = AuditFindingsStore.findingsDetails;

    AuditFindingsStore.auditSChedule_Id = auditFindings.audit_schedule.id;
    this.clearCommonFilePopupDocuments();
    if(auditFindings.documents.length > 0)
    this.setDocuments(auditFindings.documents)
    // if (auditFindings.documents.length > 0) {
    //   for (let i of auditFindings.documents) {

    //     let docurl = this._internalAuditFileService.getThumbnailPreview('findings', i.token);
    //     let docDetails = {
    //       created_at: i.created_at,
    //       created_by: i.created_by,
    //       updated_at: i.updated_at,
    //       updated_by: i.updated_by,
    //       name: i.title,
    //       ext: i.ext,
    //       size: i.size,
    //       url: i.url,
    //       thumbnail_url: i.url,
    //       token: i.token,
    //       preview: docurl,
    //       id: i.id

    //     };
    //     this._auditFindingsService.setDocumentDetails(docDetails, docurl);
    //     setTimeout(() => {
    //       this.checkForFileUploadsScrollbar();
    //     }, 200);

    //   }

    // }


    // Setting the format similar to while adding auditable Item from popup to show
    let auditbaleItems = []

    if (auditFindings?.auditable_items) {
      for (let i of auditFindings?.auditable_items) {
        let obj = { id:i.id,title: i.title, reference_code:i.reference_code, auditable_item_type:i.auditable_item_type?.title,risk_rating:i.risk_rating?.language[0]?.pivot?.title
          , auditable_item_category:i.auditable_item_category?.title, status_id:i.status_id}
        auditbaleItems.push(obj)
      }

      this.auditableItemEdiValue(auditbaleItems);
    }

    // Setting the format similar to while adding Checklist Item from popup to show

    let checklists = [];

    if(auditFindings.schedule_checklist_answers) {



      for (let i of auditFindings.schedule_checklist_answers) {
        
        checklists.push(i);
      }
      this.checklistEditValue(checklists);
    }


    // patch form values
    this.form.patchValue({
      id: auditFindings.id ? auditFindings.id : '',
      title: auditFindings.title ? auditFindings.title : '',
      description: auditFindings.description ? auditFindings.description : '',
      audit_schedule_id: auditFindings.audit_schedule ? auditFindings.audit_schedule.id : '',
      finding_category_id: auditFindings.finding_category ? auditFindings.finding_category : '',
      risk_rating_id: auditFindings.risk_rating ? auditFindings.risk_rating.id : '',
      recommendation: auditFindings.recommendation ? auditFindings.recommendation : '',
      evidence: auditFindings.evidence ? auditFindings.evidence : '',


    })

    this.checklistObject.type = 'Edit';

  }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents){
    let khDocuments = [];
    documents.forEach(element => {

      if(element.document_id){
        element.kh_document.versions.forEach(innerElement => {

          if(innerElement.is_latest){
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document':true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId':element.id,
              ...innerElement
              
            })
          }

        });
      }
      else
      {
        if (element && element.token) {
          var purl = this._internalAuditFileService.getThumbnailPreview('audit-plan', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document':false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }
  // set auditableItem
  auditableItemEdiValue(auditableItem) {
    this._auditFindingsService.selectRequiredAuditableItem(auditableItem);
  }

  // set checklists
  checklistEditValue(checklists){
    this._auditFindingsService.selectRequiredChecklists(checklists);
  }

  // Returns Values as Array for multiple select case
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i);
    }
    return returnValue;

  }


  processDataForSave() {

    var saveData = {
      title: this.form.value.title ? this.form.value.title : '',
      audit_schedule_id: this.form.value.audit_schedule_id ? this.form.value.audit_schedule_id : '',
      finding_category_id: this.form.value.finding_category_id ? this.form.value.finding_category_id.id : '',
      risk_rating_id: this.form.value.risk_rating_id ? this.form.value.risk_rating_id : '',
      recommendation: this.form.value.recommendation ? this.form.value.recommendation : '',
      description: this.form.value.description ? this.form.value.description : '',
      auditable_item_ids: [],
      checklist_answer_ids:[],
      evidence: this.form.value.evidence ? this.form.value.evidence : '',
      // documents: AuditFindingsStore.docDetails,
    };
    var auditableItemArray = [];
    this.AuditFindingsStore.auditableItemToDisplay.forEach(item => {

      auditableItemArray.push(item.id);
      saveData.auditable_item_ids = auditableItemArray;

    });

    var checklistsArray = [];
    this.AuditFindingsStore.ChecklistToDisplay.forEach(element => {
      checklistsArray.push(element.id);
      saveData.checklist_answer_ids = checklistsArray;
    });


    if(this.form.value.id){
      saveData['documents']=this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile)
    }else
     saveData['documents']=this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')

    return saveData;


  }


  save() {

    this.formErrors = null;
    let save;

    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    // console.log( this.form.value.kpiing_to);
    if (this.form.value.id) {
      save = this._auditFindingsService.updateItem(this.form.value.id, this.processDataForSave());
    } else if(AuditStore.audit_id){
      save = this._auditFindingsService.saveFromAudit(this.processDataForSave());
    } else {

      save = this._auditFindingsService.saveItem(this.processDataForSave());
    } 
    save.subscribe((res: any) => {
      if (!this.form.value.id) {
        this.resetForm();
        this.AuditFindingsStore.clearDocumentDetails();

      }
      this._router.navigateByUrl('/internal-audit/findings/'+res.id);
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
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

  processFormErrors(){
    // console.log(this.formErrors);
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
      
           if(key.startsWith('organization_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['organization_ids'] = this.formErrors['organization_ids']? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('division_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['division_ids'] = this.formErrors['division_ids']? this.formErrors['division_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('department_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['department_ids'] = this.formErrors['department_ids']? this.formErrors['department_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('section_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['section_ids'] = this.formErrors['section_ids']? this.formErrors['section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('sub_section_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids']? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }

      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;

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
  if(type=='document-version')
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



  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }




  cancelByUser(status) {
    if (status) {

      this._router.navigateByUrl('/internal-audit/findings');

    }

    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }


  confirmCancel() {
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);

  }

  ngOnDestroy() {

    window.addEventListener('scroll', this.scrollEvent, null);
    this.cancelEventSubscription.unsubscribe();
    this.auditableItemEvent.unsubscribe();
    this.checklistEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.modalFocusEvent.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");

    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

}
