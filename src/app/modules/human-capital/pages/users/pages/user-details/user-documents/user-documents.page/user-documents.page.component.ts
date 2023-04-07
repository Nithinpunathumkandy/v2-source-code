import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef,Renderer2, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { UserDocumentTypeMasterStore } from 'src/app/stores/masters/human-capital/user-document-type-master.store';
import { UserDocumentTypeService } from 'src/app/core/services/masters/human-capital/user-document-type/user-document-type.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UserDocumentService } from 'src/app/core/services/human-capital/user/user-document/user-document.service';
import { UserDocument } from 'src/app/core/models/human-capital/users/user-document';
import { UserDocumentStore } from 'src/app/stores/human-capital/users/user-document.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ActivatedRoute } from '@angular/router';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { DomSanitizer } from '@angular/platform-browser';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';

declare var $: any;

@Component({
  selector: 'app-user-documents-page',
  templateUrl: './user-documents.page.component.html',
  styleUrls: ['./user-documents.page.component.scss']
})
export class UserDocumentsPageComponent implements OnInit,OnDestroy {

  documents: Array<any> = new Array(8);

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('renewModal') renewModal: ElementRef;
  @ViewChild('detailsModal') detailsModal: ElementRef;
  @ViewChild('documentModal') documentModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UserDocumentTypeMasterStore = UserDocumentTypeMasterStore;
  UserDocumentStore = UserDocumentStore;
  logoUploaded = false;
  loader:boolean = false;
  renewLoader: boolean = false;
  UsersStore = UsersStore;
  fileUploadProgress = 0;
  AuthStore = AuthStore;
  gIndex = 0;
  previewObject = {
    preview_url: null,
    file_name: '',
    file_type: ''
  }
  current_index = 0;

  deleteObject = {
    id: null,
    type:'',
    subtitle:'',
    position:null,
    groupPosition:null
  };
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  docArray:any=[];

  deleteEventSubscription: any;
  history = [];
  historyPage: number = 1;
  documentPage: number = 1;
  documentTypeEventSubscription: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _userDocumentTypeService: UserDocumentTypeService,
    private _userDocumentService: UserDocumentService,
    private _usersService: UsersService,
    private route: ActivatedRoute,
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _renderer2:Renderer2) { }

  ngOnInit() {
    this.loader = false;
    this.renewLoader = false;
    NoDataItemStore.setNoDataItems({title: "document_nodata_title", subtitle: 'docuemnt_nodata_subtitle',buttonText: 'add_new_document'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'CREATE_USER_DOCUMENT', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_USER_DOCUMENT_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_USER_DOCUMENT', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/human-capital/users' } },
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_USER_DOCUMENT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }

      this._helperService.checkSubMenuItemPermissions(200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.form.reset();
              this.form.pristine;

              this.formErrors = null;
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "template":

            var fileDetails = {
              ext: 'xlsx',
              title: 'DocumentTemplate.xlsx',
              size: null
            };
            this._humanCapitalService.downloadFile('document-template', null, null, fileDetails.title, null, fileDetails);
            break;
          case "export_to_excel":

            var fileDetails = {
              ext: 'xlsx',
              title: 'Documents.xlsx',
              size: null
            };
            this._humanCapitalService.downloadFile('document-export', null, null, fileDetails.title, null, fileDetails);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addNewDocument();
        NoDataItemStore.unSetClickedNoDataItem();
      }


    })

    this.form = this._formBuilder.group({
      id: [''],
      user_document_type_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      issue_date: [null, [Validators.required]],
      expiry_date: [null],
      documents: ['']
    });

    this.documentTypeEventSubscription = this._eventEmitterService.userDocument.subscribe(res => {
      this.closeDocModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteDocument(item);
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

    if (UsersStore.user_id == null) {
      let id: number;
      this.route.params.subscribe(params => {
        id = +params['id']; // (+) converts string 'id' to a number

        // In a real app: dispatch action to load the details here.
        this._usersService.saveUserId(id);
      });


    }

    /**
     * getting user documents and user document types
     */
    // setTimeout(() => {
      // $(this.uploadArea.nativeElement).mCustomScrollbar();
      this.getDocumentTypes();
      this._userDocumentService.getAllItems().subscribe(() =>
       setTimeout(() =>{
        this._utilityService.detectChanges(this._cdr);
        this.setAccordion();
        this.getDoc(0,true)
       } , 100));
      if (UsersStore.user_id) {
        this._usersService.getIndividualItem(UsersStore.user_id).subscribe();
      }
    // }, 250);

  }

  getDoc(index,initial){
    // console.log(index);
    if(UserDocumentStore.userDocumentDetails.length>0){
      if(UserDocumentStore.userDocumentDetails[index]?.is_accordion_active==false || initial){
        initial=false;
        UserDocumentStore.userDocumentDetails[index].is_accordion_active=true; 
        this.setAccordion(index);
        
      }
      else
        UserDocumentStore.userDocumentDetails[index].is_accordion_active=false;   
      this._utilityService.detectChanges(this._cdr);
    }  
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    if($(this.renewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.renewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.renewModal.nativeElement,'overflow','auto');
    }
    if($(this.detailsModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.detailsModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.detailsModal.nativeElement,'overflow','auto');
    }
    if($(this.documentModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.documentModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.documentModal.nativeElement,'overflow','auto');
    }
  }

  addNewDocument(){
    this.form.reset();
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  setAccordion(index?){
    for(let i=0; i<UserDocumentStore.userDocumentDetails.length;i++){
      if(i==index){

      }
      else
      UserDocumentStore.userDocumentDetails[i].is_accordion_active=false;
    }
  }

  getDocumentTypes() {
    UserDocumentTypeMasterStore.orderBy = 'asc';
    this._userDocumentTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDocumentTypes(e) {
    this._userDocumentTypeService.searchUserDocumentType('q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }



  /**
   * form for adding  or editing document
   */
  openFormModal() {
    
    this.formErrors = null;
    AppStore.disableLoading();
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 250);
  }


  /**
   * form for renewing document
   * @param id -id of document for renew
   */
  openRenewModal(id) {
    this.renewLoader = true;
    this.formErrors = null;
    AppStore.disableLoading();
    this.closeDetailsModal();
    UserDocumentStore.clearDocumentDetails();

    this._userDocumentService.getItemById(id).subscribe(res => {
      if (UserDocumentStore.individual_document_loaded) {

        const renewDocument: UserDocument = UserDocumentStore.UserDocumentById;

        this._utilityService.detectChanges(this._cdr);
        //set form value
        this.form.reset();
        this.form.markAsPristine();
        this.form.patchValue({

          id: renewDocument.id,
          user_document_type_id: renewDocument.user_document_type.id,
          title: renewDocument.user_document_type.title,
          documents: ''

        });
        this._renderer2.setStyle(this.renewModal.nativeElement, 'z-index', '999999');
        $(this.renewModal.nativeElement).modal('show');

      }
    });
    setTimeout(() => {
      this.renewLoader = false;
      this._utilityService.detectChanges(this._cdr);
    }, 2000);
  }

  /**
   * form for adding new user document type
   */
  openDocumentModal() {
    this.formErrors = null;
    AppStore.disableLoading();
    $(this.documentModal.nativeElement).modal('show');
  }


  /**closing the document form */
  closeFormModal() {
    
    this.fileUploadsArray = [];
    this.UserDocumentStore.clearDocumentDetails();
    this.form.reset();
    this.form.markAsPristine();
    $(this.formModal.nativeElement).modal('hide');
    // console.log(this.gIndex);
    // this._utilityService.detectChanges(this._cdr);
    this._userDocumentService.getAllItems().subscribe(res=>{
     
      setTimeout(() => {
        this.getDoc(this.gIndex,false);
      }, 100);
    })
    
    AppStore.disableLoading();
  }

  /**
   * closing the renew form
   */
  closeRenewModal() {
    this.fileUploadsArray = [];
    this.UserDocumentStore.clearDocumentDetails();
    this.form.reset();
    this.form.markAsPristine();
    this._renderer2.setStyle(this.renewModal.nativeElement, 'z-index', '9999999');
    $(this.renewModal.nativeElement).modal('hide');
    AppStore.disableLoading();
  }

  /**
   * closing the user document type form
   */
  closeDocModal() {


    $(this.documentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '666666');
    this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    
    AppStore.disableLoading();
    if (UserDocumentTypeMasterStore.lastInserted) {
      this._userDocumentTypeService.searchUserDocumentType('?q=' + UserDocumentTypeMasterStore.lastInserted).subscribe(res => {
        this.form.patchValue({
          user_document_type_id: UserDocumentTypeMasterStore.lastInserted
        })
        this._utilityService.detectChanges(this._cdr);
      })


    }

  }

  documentArray(){
    
    var dArray=[];
    
    if(UserDocumentStore.individualDocumentDetails.files.length < 3){
      
      for(let i=0;i<UserDocumentStore.individualDocumentDetails.files.length;i++){
        dArray.push(i);

      }
      return dArray;
    }

    else if(UserDocumentStore.individualDocumentDetails.files.length == 3 || (this.current_index+1==1&&UserDocumentStore.individualDocumentDetails.files.length > 3)){
      return [0,1,2];
    }
    else{
      if(this.current_index==0 ){
        return [0,1,2]
      }
      if((this.current_index+1 < UserDocumentStore.individualDocumentDetails.files.length) &&!(this.current_index+1 > UserDocumentStore.individualDocumentDetails.files.length)){
        return [this.current_index-1, this.current_index, this.current_index+1]
      }
      else if(this.current_index+1 == UserDocumentStore.individualDocumentDetails.files.length){
        return [this.current_index-2, this.current_index-1, this.current_index]
      }
      
    }
  }

  setCurrentIndex(ind){
    this.current_index = ind;
  }

  getDocType(){
    let fileCount=0;
    
    if(UserDocumentStore.individualDocumentDetails.files.length>1){
      var fileType = UserDocumentStore.individualDocumentDetails.files[0].ext;
      for(let i=1; i< UserDocumentStore.individualDocumentDetails.files.length;i++){
        if(UserDocumentStore.individualDocumentDetails.files[i].ext != fileType){
          fileCount++;
        } 
      }
      if(fileCount>0){
        return false;
      }
      else{
        return true
      }

    }
    else{
      return true;
    }
    

  }

  /**
   * closing the user document details page
   */
  closeDetailsModal() {
    this.UserDocumentStore.clearDocumentDetails();
    $(this.detailsModal.nativeElement).modal('hide');
    AppStore.disableLoading();
  }


  checkDocPresent(){
    let count = 0
    for(let doc of UserDocumentStore.getDocumentDetails){
      if(doc.is_deleted){
        count++;
      }
    }
    if(UserDocumentStore.getDocumentDetails?.length==count){
      return true
    }
    else
    return false;
  
  }


  /**
   * 
   * @param close -decision variable to close the form modal
   * @param params - will take renew or null
   * renew - will renew the document
   * null- will save or update the document
   */
  save(close: boolean = false, params?: string) {
    this.formErrors = null;
    this.form.patchValue({
      documents: this._userDocumentService.getDocuments()
    })
    let save;
    AppStore.enableLoading();
    if (this.form.value.issue_date) {
      let tempstartdate = this.form.value.issue_date;

      this.form.value.issue_date = this._helperService.processDate(tempstartdate, 'join');

    }
    if (this.form.value.expiry_date) {
      let tempenddate = this.form.value.expiry_date;

      this.form.value.expiry_date = this._helperService.processDate(tempenddate, 'join')

    }
    if (this.form.value.id) {
      if (params == 'renew') {
        save = this._userDocumentService.renewItem(this.form.value.id, this.form.value);
      }
      else {
        save = this._userDocumentService.updateItem(this.form.value.id, this.form.value);
      }
    } else {

      let saveData = {
        user_document_type_id: this.form.value.user_document_type_id,
        title: this.form.value.title ? this.form.value.title : '',
        issue_date: this.form.value.issue_date ? this.form.value.issue_date : null,
        expiry_date: this.form.value.expiry_date ? this.form.value.expiry_date : null,
        documents: this.form.value.documents ? this.form.value.documents : ''
      };
      save = this._userDocumentService.saveItem(saveData);

    }
    save.subscribe((res: any) => {
      this._utilityService.detectChanges(this._cdr);
      AppStore.disableLoading();
      const index: number = UserDocumentStore.userDocumentDetails.findIndex(e => e.user_document_type_id == this.form.value.user_document_type_id);
      if (!this.form.value.id) {
        this._userDocumentService.getAllItems().subscribe(res=>{
          this.gIndex = res.length-1;
        })
        // setTimeout(() => {
          
        // }, 300);
       
        this.form.reset();
        this.form.markAsPristine();
        this.UserDocumentStore.clearDocumentDetails();
      }
      // else if(!this.form.value.id && index > -1){
      //   this.gIndex = index;
      // }
     
      this._utilityService.detectChanges(this._cdr);
      if (close) {
        if (params == 'renew') {
          this.closeRenewModal();
          AppStore.disableLoading();
        }
        else {
          this.closeFormModal();
          this.form.reset();
          AppStore.disableLoading();
        }
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      
      }
      else if (err.status == 403 || err.status == 500) {
        this.closeFormModal();
        this.closeRenewModal();
      }
      this._utilityService.detectChanges(this._cdr);
      AppStore.disableLoading();
    });
  }


  /**
   * 
   * @param type -document -will get thumbnail preview of document or else user profile picture
   * 
   * @param token -image token
   */
  createImageUrl(type, token) {
    if (type == 'document') {
      return this._humanCapitalService.getThumbnailPreview('user-document', token);
    }
    else {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  onFileChange(event, type: string) {
    //this.fileUploadProgress = 0;
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {


        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          UserDocumentStore.document_preview_available = true;
          var typeParams = (type == 'support-file') ? '?type=support-file' : '?type=logo';
          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
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
                $("#file").val('');
                let temp: any = uploadEvent['body'];

                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                  UserDocumentStore.document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  $("#file").val('');
                  UserDocumentStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            $("#file").val('');
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            UserDocumentStore.document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,true);
          $("#file").val('');
           this._utilityService.detectChanges(this._cdr);
        }
      });
    }
    event.srcElement.value = null;
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



  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._userDocumentService.setImageDetails(imageDetails, logo_url, type);
      else
        this._userDocumentService.setSelectedImageDetails(logo_url, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  /**
   * Returns whether file extension is of imgage, pdf, document or etc..
   * @param ext File extension
   * @param extType Type - image,pdf,doc etc..
   */
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }


  /**
   * 
   * @param id - id of the document clicked
   * @param edit - if the parameter is edit then will open the edit form
   * or else will get the value of document and will open details modal
   * 
   */
  editDocument(id, edit: string,gIndex) {
    this.gIndex=gIndex;
    this.form.reset();
    this.form.markAsPristine();
    this.UserDocumentStore.clearDocumentDetails();
    this._userDocumentService.getItemById(id).subscribe(res => {
      setTimeout(() => {
        if (UserDocumentStore.individual_document_loaded) {
          const userDocument: UserDocument = UserDocumentStore.UserDocumentById;
          //set form value
          if (userDocument.files && userDocument.files.length > 0) {
            for (let i of userDocument.files) {
              let docurl = this._humanCapitalService.getThumbnailPreview('user-document', i.token);
              let docDetails = {
                name: i.title,
                ext: i.ext,
                size: i.size,
                url: i.url,
                thumbnail_url: i.url,
                token: i.token,
                preview: docurl,
                id: i.id,
                user_document_detail_id: i.user_document_detail_id
              };
              this._userDocumentService.setImageDetails(docDetails, docurl, 'user-document');
            }
            this.checkForFileUploadsScrollbar();

          }
          this.form.patchValue({

            id: userDocument.id,
            user_document_type_id: userDocument.user_document_type.id,
            title: userDocument.title,
            issue_date: this._helperService.processDate(userDocument.issue_date, 'split') != '' ? this._helperService.processDate(userDocument.issue_date, 'split') : null,
            expiry_date: this._helperService.processDate(userDocument.expiry_date, 'split') != '' ? this._helperService.processDate(userDocument.expiry_date, 'split') : null,
            documents: ''

          });
          if (edit == 'edit') {

            this.openFormModal();
          }
          else if (AuthStore.getActivityPermission(200, 'USER_DOCUMENT_DETAILS')) {
            //getting values for document preview
            UserDocumentStore.individualDocumentDetails.files.forEach(i => {
              i['preview_src'] = [];
              this._humanCapitalService.getFilePreview('documents-preview', UsersStore.user_id, i.id, id).subscribe(res => {
                let filePreview = this._utilityService.getDownLoadLink(res, UserDocumentStore.individualDocumentDetails.title);
                i['preview_src'] = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);

                this._utilityService.detectChanges(this._cdr);
              }), (error => {
                if (error.status == 403) {
                  this._utilityService.showErrorMessage('Error', 'Permission Denied');
                }
                else {
                  this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
                }
              });
            });

            setTimeout(() => {
              $(this.detailsModal.nativeElement).modal('show');
            }, 300);
          }
        }
      }, 300);

      this._utilityService.detectChanges(this._cdr);
    });
  }

  /**
   * changing the number of days in to month and years
   * @param days -number of days
   */
  createDaysString(days) {
    return this._helperService.daysConversion(days);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


  /**
  * delete user
  */
  delete(id: number,position,gPosition) {

    this.deleteObject.id = id;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    this.deleteObject.position = position;
    this.deleteObject.groupPosition = gPosition;
    $(this.deletePopup.nativeElement).modal('show');

  }

  /**
   * Delete the document
   * @param id -document id
   */
  deleteDocument(status) {
    // console.log(status);
    if (status && this.deleteObject.id) {
      // const index: number = UserDocumentStore.userDocumentDetails.findIndex(e => e.id == this.deleteObject.id);
      
      this._userDocumentService.delete(this.deleteObject.id,this.deleteObject.groupPosition,this.deleteObject.position).subscribe(resp => {
        this._userDocumentService.getAllItems().subscribe(res=>{
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
            if(this.deleteObject.position==0)
            this._userDocumentService.setSelected(this.deleteObject.groupPosition,this.deleteObject.position);
            else
            UserDocumentStore.userDocumentDetails[this.deleteObject.groupPosition].is_accordion_active = true;
          }, 100);
        });
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
        if(this.documentPage>0&& ((this.deleteObject.position+1)%5) !=0 )
        this.documentPage = this.documentPage-1;

        // if (this.deleteObject.position == 0 && UserDocumentStore.userDocumentDetails.length > 0 && this.deleteObject.groupPosition!=0){
        //   UserDocumentStore.userDocumentDetails[this.deleteObject.groupPosition - 1].is_accordion_active = true;
        //   // this._utilityService.detectChanges(this._cdr);
        // } 
        // else if (this.deleteObject.groupPosition == 0 && UserDocumentStore.userDocumentDetails.length > 0){
        //   UserDocumentStore.userDocumentDetails[0].is_accordion_active = true;
        //   // this._utilityService.detectChanges(this._cdr);
        // } 

        // else{
           
        // }
       

      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.groupPosition=null;
    this.deleteObject.position=null;

  }

  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    UserDocumentStore.unsetProductImageDetails('support-file', token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }


  /**
   * download all file in a document or single file
   * @param id - document id
   * @param filename - the downloading file name
   * @param file_id - file id in the document
   */
  downloadDocument(id, filename, doc, file_id?) {
    this.loader = true;
    if (file_id) {
      this._humanCapitalService.downloadFile('user-download-documents', UsersStore.user_id, id, filename, file_id, doc);
    }
    else {
      // doc['title'] = doc.hasOwnProperty('') ? doc['user_document_title'];
      if(doc.hasOwnProperty('user_document_title')){
        doc['title'] = doc['user_document_title'];
      }
      else if(doc.hasOwnProperty('user_document_type')){
        doc['title'] = doc.user_document_type.title ? doc.user_document_type.title : 'all-files';
      }
      this._humanCapitalService.downloadFile('user-download-all-documents', UsersStore.user_id, id, filename, null, doc);
      setTimeout(() => {
        this.loader = false;
        this._utilityService.detectChanges(this._cdr);
      }, 2000);
    }
  }

  /**
   * 
   * @param id -history document id
   * @param filename - document name 
   * @param version - version of the document
   */
  downloadHistory(id, filename, version) {
    this._humanCapitalService.downloadFile('user-document-history', UsersStore.user_id, id, filename, version);
  }

  /**
   * finding image index
   * @param inc - to increment or decrement index
   */
  addIndex(inc) {
    this.current_index += inc;
  }

  checkForFileUploadsScrollbar() {
    if (UserDocumentStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }


  ngOnDestroy() {

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.documentTypeEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
