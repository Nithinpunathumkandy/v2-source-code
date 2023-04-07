import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-add-planned-audit',
  templateUrl: './add-planned-audit.component.html',
  styleUrls: ['./add-planned-audit.component.scss']
})
export class AddPlannedAuditComponent implements OnInit, OnDestroy {
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  formObject = {
    0:[
      'audit_plan_id',
    ],
    1:[
      'start_date',
      'end_date',
      'title'
    ],
    2:[
      'documents'
    ]
  }
  form: FormGroup;
  formErrors: any;
  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  startDate;
  endDate;

  selectedPlan: boolean = false;

  AppStore = AppStore;
  AuditStore = AuditStore;
  SubMenuItemStore = SubMenuItemStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  auditorLeaderInfoObject = [];
  AuditPlanStore = AuditPlanStore;
  fileUploadPopupStore = fileUploadPopupStore;
  fileUploadsArray = []; // for multiple file uploads
  selectedIndex = null;
  cancelEventSubscription: any;
  fileUploadPopupSubscriptionEvent: any = null;
  currentPlan;
  auditPlanEmptyList = "No Audit Plans To Show";
  constructor( private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _internalAuditFileService: InternalAuditFileService,
    private _auditProgramService: AuditProgramService,
    private _utilityService: UtilityService, private _helperService: HelperServiceService,
    private _auditService:AuditService,
    private _auditPlanService: AuditPlanService,
    private _formBuilder: FormBuilder,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    setTimeout(() => {
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);

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
    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }

    ]);


    setTimeout(() => {

      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');

    }, 1000);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: "../" }]);
    // scroll event
    window.addEventListener("scroll", this.scrollEvent, true);

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
      description:[''],
      audit_plan_id: [null, [Validators.required]],
      end_date: ['',[Validators.required]],
      start_date: ['',[Validators.required]],
      documents: ['']
    });

    // for showing initial tab

    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);

    //loading data initially for form

    this.pageChange();

    //edit case 
   if (this._router.url.indexOf('edit-planned-audit') != -1) {
    AuditStore.clearDocumentDetails();
    if (AuditStore.audit_id){
      this._auditService.getItem(AuditStore.audit_id).subscribe(res=>{
        this.setAuditDataForEdit();
        this._utilityService.detectChanges(this._cdr);
      })
    }else{
      this._router.navigateByUrl('/internal-audit/audits');
    }
  }
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditProgramMasterStore.setCurrentPage(newPage);
    this._auditProgramService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  // imageblob function
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._auditService.setDocumentDetails(imageDetails, type);
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

  // checkAcceptFileTypes(type){
  //   return this._imageService.getAcceptFileTypes(type); 
  // }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    AuditStore.unsetDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  // scrollbar function
  checkForFileUploadsScrollbar() {

    if (AuditStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  getAuditProgramDetails( id:number,index:number){
    AuditPlanStore.unsetAuditPlan();
    
    this.selectedPlan = false;
    if(this.selectedIndex == index)
    this.selectedIndex = null;
  else
    this.selectedIndex = index;
    let params = `&audit_program_ids=${id}`;
    this._auditPlanService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    // this._auditProgramService.getItem(id).subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  getPlan(auditPlan){
    this.currentPlan = auditPlan.id;
    if(this.currentPlan == auditPlan.id){
      this.form.patchValue({
        audit_plan_id: auditPlan.id,
        title: auditPlan.title,
        start_date: this._helperService.processDate(auditPlan.start_date, 'split'),
        end_date: this._helperService.processDate(auditPlan.end_date, 'split')
      })
      
      this.selectedPlan = true;
    } else {
      this.currentPlan = null;
      this.selectedPlan = false;
     
    }
  }

  changePlan(){
    if( this.selectedPlan == true){
      this.selectedPlan = false;
      this.currentPlan = null;
      this.form.patchValue({
        audit_plan_id:null,
        title: null,
        start_date: null,
        end_date: null
      })
    } else {
      this.selectedPlan = true;
    }
  }




  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
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


  cancelByUser(status) {
    if (status) {

      this._router.navigateByUrl('/internal-audit/audits');

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

  // Mutli Form

  nextPrev(n) {
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
     this.submitAuditForm();
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
      this.formatDateInputs();
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

  // formating date

  formatDateInputs() {
    this.startDate = null;
    this.endDate = null;
    // converting start date
    if (this.form.value.start_date) {
      let tempstartdate = this.form.value.start_date;

      this.startDate = this._helperService.processDate(tempstartdate, 'join');

    }

    // converting end date
    if (this.form.value.end_date) {
      let tempenddate = this.form.value.end_date;

      this.endDate = this._helperService.processDate(tempenddate, 'join')

    }

  }


  setAuditDataForEdit(){
    var audit = AuditStore.auditDetails;
    this.clearCommonFilePopupDocuments();
    if(audit.documents.length > 0)
    this.setDocuments(audit.documents)
    // for (let i of audit.documents) {

    //   let docurl = this._internalAuditFileService.getThumbnailPreview('audits', i.token);
    //   let docDetails = {
    //     created_at: i.created_at,
    //     created_by: i.created_by,
    //     updated_at: i.updated_at,
    //     updated_by: i.updated_by,
    //     name: i.title,
    //     ext: i.ext,
    //     size: i.size,
    //     url: i.url,
    //     thumbnail_url: i.url,
    //     token: i.token,
    //     preview: docurl,
    //     id: i.id

    //   };
    //   this._auditService.setDocumentDetails(docDetails, docurl);
    //   setTimeout(() => {
    //     this.checkForFileUploadsScrollbar();
    //   }, 200);
    // }

     // patch form values
     this.form.patchValue({
      id: audit.id ? audit.id : '',
      title: audit.title ? audit.title : '',
      description: audit.description ? audit.description : '',
      audit_plan_id: audit.audit_plan ? audit.audit_plan.id: '',
      start_date: audit.start_date ?  this._helperService.processDate(audit.start_date, 'split') : '',
      end_date: audit.end_date ? this._helperService.processDate(audit.end_date, 'split') : '',
     })
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

  processDataForSave(){

    let saveData = {
      title: this.form.value.title ? this.form.value.title : '',
      description: this.form.value.description ? this.form.value.description : '',
      // documents: AuditStore.docDetails,
      audit_plan_id: this.form.value.audit_plan_id ? this.form.value.audit_plan_id : '',
      end_date: this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date, 'join') : '',
      start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : '',
    };

    if(this.form.value.id){
      saveData['documents']=this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile)
    }else
     saveData['documents']=this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')

    return saveData;
  }

  submitAuditForm(){

    let save;

    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";

    if (this.form.value.id) {
      save = this._auditService.updateItem(this.form.value.id, this.processDataForSave());
    } else {

      save = this._auditService.saveItem(this.processDataForSave());
    }
    save.subscribe((res: any) => {
      this.resetForm();
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
     
        this._router.navigateByUrl("/internal-audit/audits/"+res.id);
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


  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.fileUploadsArray = [];
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




  ngOnDestroy() {

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    window.addEventListener('scroll', this.scrollEvent, null);
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
    this.cancelEventSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }


}


