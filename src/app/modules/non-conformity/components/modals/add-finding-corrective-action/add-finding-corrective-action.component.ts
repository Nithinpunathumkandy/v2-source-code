import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FindingCorrectiveActionService } from 'src/app/core/services/non-conformity/findings/finding-corrective-action/finding-corrective-action.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { FindingCorrectiveActionStore } from 'src/app/stores/non-conformity/findings/finding-corrective-action-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;
@Component({
  selector: 'app-add-finding-corrective-action',
  templateUrl: './add-finding-corrective-action.component.html',
  styleUrls: ['./add-finding-corrective-action.component.scss']
})
export class AddFindingCorrectiveActionComponent implements OnInit {
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @Input('source') CaSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  correctiveActionForm: FormGroup;
  formErrors :any;
  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  FindingsStore = FindingsStore;
  reactionDisposer: IReactionDisposer;
  FindingCorrectiveActionStore = FindingCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  UsersStore = UsersStore;
  fileUploadPopupStore = fileUploadPopupStore;

  fileUploadsArray = [];

  fileUploadPopupSubscriptionEvent: any = null;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _router: Router,
    private _documentFileService: DocumentFileService,
    private _renderer2: Renderer2,
    private _findingsService: FindingsService,
    private _helperService: HelperServiceService,
    private _correctiveActionService: FindingCorrectiveActionService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.correctiveActionForm = this._formBuilder.group({
      id: [""],
      title: ['',[Validators.required]],
      responsible_user_id: [null,[Validators.required]],
      description: [''],
      finding_id:[''],
      start_date: ['',[Validators.required]],
      target_date: ['',[Validators.required]],
      documents: []
    })

    if (this.CaSource.type=='Edit') {
      this.setFormValues();
    }
    else{
      this.correctiveActionForm.patchValue({
        start_date: this._helperService.getTodaysDateObject(),
        target_date: this._helperService.getTodaysDateObject(),
      })
    }
    // this.assignValues();

    if (this.CaSource.component=='FindingCorrectiveAction' && (this.CaSource.type=='Add' || this.CaSource.type == 'Edit')) {
      // this.setFindingId();
      this.searchFindings({term: FindingsStore.FindingsId},true);
    }
    else if(this.CaSource.component=='CorrectiveAction' && this.CaSource.type=='Add'){
      this.correctiveActionForm.patchValue({
        finding_id: null,
      })
    }

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }


  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }
  
  setFindingId() {
    this.correctiveActionForm.setValue({
      id: null,
      title: null,
      description: null,
      responsible_user_id: null,
      finding_id: FindingsStore.FindingsId,
      start_date: null,
      target_date: null,
      documents: ''
    })
    this.getResponsibleUsers();
  }

  ngDoCheck(){
    if (this.CaSource && this.CaSource.hasOwnProperty('values') && this.CaSource.values && !this.correctiveActionForm.value.id)
      this.setFormValues();
  }

  setFormValues(){
    setTimeout(() => {
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);

    if (this.CaSource.hasOwnProperty('values') && this.CaSource.values) {
      this.correctiveActionForm.patchValue({
        id: this.CaSource.values.id,
        title: this.CaSource.values.title,
        description: this.CaSource.values.description,
        responsible_user_id: this.CaSource.values.responsible_user_id,
        start_date: this.CaSource.values.start_date,
        target_date: this.CaSource.values.target_date,
        documents:''
      })
    }
    if(this.CaSource.component=='CorrectiveAction') this.searchFindings({term: this.CaSource.values.finding_id},true)
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  setDepartment(finding_id){
    UsersStore.unsetUserList();
  }

  // getting Responsible user
  getResponsibleUsers() {
    if (this.correctiveActionForm.value.finding_id) {
      let params = '?department_ids=' + this.correctiveActionForm.value.finding_id.department_ids
      this._userService.getAllItems(params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // serach users
  searchUsers(e) {
    if(this.correctiveActionForm.value.finding_id){
      let params = '&department_ids='+this.correctiveActionForm.value.finding_id.department_ids
    this._userService.searchUsers('?q=' + e.term + params ).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  }

  formatStartDate() {
    // converting start date
    if (this.correctiveActionForm.value.start_date) {
      let tempstartdate = this.correctiveActionForm.value.start_date;

      this.correctiveActionForm.value.start_date = this._helperService.processDate(tempstartdate, 'join');
      return this.correctiveActionForm.value.start_date;
    }
  }

  formatTargetDate() {
    if (this.correctiveActionForm.value.target_date) {
      let tempTargetdate = this.correctiveActionForm.value.target_date;

      this.correctiveActionForm.value.target_date = this._helperService.processDate(tempTargetdate, 'join')
      return this.correctiveActionForm.value.target_date;
    }
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

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
        this._correctiveActionService.setDocumentDetails(imageDetails, type);
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


   // cancel modal
   cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  
  
  }

  removeDocument(doc) {
    if(doc.hasOwnProperty('is_kh_document')){
      if(!doc['is_kh_document']){
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else{
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else{
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }
  
  checkForFileUploadsScrollbar(){

    if(FindingCorrectiveActionStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  // for resetting the form
  resetForm() {
     // resetting respective form values to the null state for keeping findings id 
     if(this.CaSource.component == 'FindingCorrectiveAction'){
    this.correctiveActionForm.patchValue({
      title:'',
      responsible_user_id: null,
      description: '',
      start_date: null,
      target_date: null
    });
  }else {
    
    this.correctiveActionForm.reset();
    this.correctiveActionForm.pristine;
  }
    this.formErrors = null;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();
  }

  // save function
  save(close: boolean = false) {
    this.formErrors = null;
    this.correctiveActionForm.patchValue({
      documents: FindingCorrectiveActionStore.docDetails,
      start_date:  this.formatStartDate(),
      target_date: this.formatTargetDate(),
    })
    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    this.correctiveActionForm.value.documents = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
      if(this.correctiveActionForm.value.id){
        let updateParam = {
          ...this.correctiveActionForm.value,
          finding_id : this.correctiveActionForm.value.finding_id?.id,
          documents: this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
        }
        save = this._correctiveActionService.updateItem(this.correctiveActionForm.value.id,updateParam);
      } else {
        delete this.correctiveActionForm.value.id
        let updateParam = {
          ...this.correctiveActionForm.value,
          finding_id : this.correctiveActionForm.value.finding_id?.id,
        }
      save = this._correctiveActionService.saveItem(updateParam);
      }
    save.subscribe((res: any) => {
      FindingCorrectiveActionStore.FindingCorrectiveActionId = res.id;
      FindingCorrectiveActionStore.new_ca_id = res.id;
      this.resetForm();
      FindingCorrectiveActionStore.clearDocumentDetails();

      if (this.CaSource.component == 'CorrectiveAction')
        this._router.navigateByUrl('/non-conformity/finding-corrective-actions/' + FindingCorrectiveActionStore.FindingCorrectiveActionId);

      AppStore.disableLoading();
      // setTimeout(() => {
      //   this._utilityService.detectChanges(this._cdr);
      // }, 500);
      if (close){
      this.closeFormModal();
      }
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      }
    });

  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    AppStore.disableLoading();
    this._eventEmitterService.dismissFindingCorrectiveActionModal();
 
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  customSearchFn(term: string, item: any) { 
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }
  
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
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

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);    
  }

  getFindings(){
    this._findingsService.getItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  // serach Findings
  searchFindings(e,patchValue?) {
    this._findingsService.getItems(false, '&q=' + e.term).subscribe(res => {
      if(patchValue){
        res.data.forEach(element=>{
          if(element.id== e.term){
            this.correctiveActionForm.patchValue({
              finding_id: element,
            })
            this.getFindingDetails();
          }
        })
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFindingDetails(){
    this._findingsService.getItem(this.correctiveActionForm.value.finding_id.id).subscribe(res=>{
      this.getResponsibleUsers();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Returns todays date for ngbDate Pickeer
  getTodaysDateObject(){ 
    return this._helperService.getTodaysDateObject();
  }

  ngOnDestroy(){

    this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }
}
