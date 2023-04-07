import { Component, OnInit, ChangeDetectorRef, Input, ElementRef, ViewChild, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiCategoryService } from 'src/app/core/services/masters/human-capital/kpi-category/kpi-category.service';
import { KpiCategoryMasterStore } from 'src/app/stores/masters/human-capital/kpi-category-master.store';
import {UnitMasterStore} from 'src/app/stores/masters/human-capital/unit-store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { KpiMasterStore } from 'src/app/stores/masters/human-capital/kpi-master.store';
import { KpiService } from 'src/app/core/services/masters/human-capital/kpi/kpi.service';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';
import { KpiTypesMasterStore } from 'src/app/stores/masters/strategy/kpi-types-store';
import { KpiTypesService } from 'src/app/core/services/masters/strategy/kpi-types/kpi-types.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';

declare var $: any;
@Component({
  selector: 'app-user-kpi-modal',
  templateUrl: './user-kpi-modal.component.html',
  styleUrls: ['./user-kpi-modal.component.scss']
})
export class UserKpiModalComponent implements OnInit , OnDestroy {
  @ViewChild('unitAddformModal', { static: true  }) unitAddformModal: ElementRef;
  @ViewChild('kpiCategoryAddformModal', {static: true}) kpiCategoryAddformModal: ElementRef;
  @ViewChild('kpiTypesAddformModal', {static: true}) kpiTypesAddformModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;//File-Upload
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;//File-Upload
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;//File-Upload

  @Input('source') UserKpiSource: any;

  KpiMasterStore = KpiMasterStore;
  AuthStore = AuthStore;
  KpiCategoryMasterStore = KpiCategoryMasterStore;
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  UnitMasterStore = UnitMasterStore;
  KpiTypesMasterStore = KpiTypesMasterStore;
  form: FormGroup;
  AppStore = AppStore;
  KpisStore = KpisStore
  formErrors: any;


  addUnitObject= {
    component: 'human-capital'
  }

  addKpiCategoryObject= {
    component: 'human-capital'
  }

  addKpiTypesObject= {
    component: 'human-capital'
  }

  // fileUploadsArray: any = []; // Display Mutitle File Loaders
  // deleteObject = {
  //   title: '',
  //   id: null,
  //   subtitle: ''
  // };

  // -document
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  fileUploadPopupSubscriptionEvent: any = null;

  childModalsubscriptionEvent:any;
  kpiCategoryChildSubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _kpiService: KpiService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _kpiCategoryService: KpiCategoryService,//document tmp pri
    private _unitService: UnitService,
    private _kpiTypesService: KpiTypesService,
    private _documentFileService: DocumentFileService,//File-Upload
    private _fileUploadPopupService: FileUploadPopupService,//File-Upload
    ) { }

  ngOnInit(): void {
        
    // form elements

    this.form = this._formBuilder.group({
      id: [''],
      unit_id: ['', [Validators.required]],
      kpi_category_id: [''],
      kpi_type_id: [Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      target:['',],
      description: [''],
      documents: [''],
      is_dashboard:[0]
    });

    // setTimeout(() => {
     
    //   $(this.uploadArea.nativeElement).mCustomScrollbar();

    // }, 1000);
    // initial form reseting
    this.resetForm();


    // getting kpi categories

    this._kpiCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

    // getting units
    this._unitService.getItems().subscribe(resp => {
      this._utilityService.detectChanges(this._cdr);
    });
     
    //File-Upload
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    // closing child modal
    this.childModalsubscriptionEvent = this._eventEmitterService.humanCapitalUnitControl.subscribe(res => {
      this.closeUnitFormModal();
    })

    this.kpiCategoryChildSubscriptionEvent = this._eventEmitterService.kpiCategoryControl.subscribe(res =>{

      this.closeKpiCategoryFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status)
        this.processZIndex();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status)
        this.processZIndex();
    })
     // Checking if Source has Values and Setting Form Value

     if (this.UserKpiSource) {
      this.setFormValues();
    }

    if(KpisStore.kpiformModal){  
      this.form.controls["kpi_category_id"].clearValidators();
      this.form.controls["kpi_type_id"].updateValueAndValidity();          
    }else{
      this.form.controls["kpi_category_id"].setValidators(Validators.required);
      this.form.controls["kpi_type_id"].updateValueAndValidity();
    }

  }

  // checkForFileUploadsScrollbar() {
  //   if (KpiMasterStore.docDetails.length >= 5 || this.fileUploadsArray.length > 5) {
  //     $(this.uploadArea.nativeElement).mCustomScrollbar();
  //   }
  //   else {
  //     $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  //   }
  // }

  ngDoCheck(){
    if (this.UserKpiSource && this.UserKpiSource.hasOwnProperty('values') && this.UserKpiSource.values && !this.form.value.id)
      this.setFormValues();
  }

  changeGender(e) {
    console.log(e.target.value);
  }
   

  setFormValues(){
    if (this.UserKpiSource.hasOwnProperty('values') && this.UserKpiSource.values) { 
      this.clearCommonFilePopupDocuments();
      if ( this.UserKpiSource.values.documents?.length > 0) {
        this.setDocuments( this.UserKpiSource.values.documents);
      }
  
      this.form.patchValue({
        id: this.UserKpiSource.values.id,
        unit_id:this.UserKpiSource.values.unit_id,
        description: this.UserKpiSource.values.description,
        title: this.UserKpiSource.values.title,
        kpi_category_id:this.UserKpiSource.values.kpi_category_id,
        kpi_type_id: this.UserKpiSource.values.kpi_type_id,
        target: this.UserKpiSource.values.target,
        is_dashboard: this.UserKpiSource.values.is_dashboard,
        // documents: this.UserKpiSource.values.documents
      })
      // this.checkForFileUploadsScrollbar();
    }
  }

  openUnitModal(){
    setTimeout(() => {
      $(this.unitAddformModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.unitAddformModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.unitAddformModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.unitAddformModal.nativeElement, 'overflow', 'auto');
    }, 500);

  }

  openKpiCategoryModal(){
    setTimeout(() => {
      $(this.kpiCategoryAddformModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'overflow', 'auto');
    }, 500);

  }

  openKpiTypesModal(){
    setTimeout(() => {
      $(this.kpiCategoryAddformModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
    }, 500);

  }

  processZIndex(){
    if($(this.unitAddformModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.unitAddformModal.nativeElement,'z-index',9999999);
      this._renderer2.setStyle(this.unitAddformModal.nativeElement,'overflow','auto');
    }
    else if($(this.kpiCategoryAddformModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement,'z-index',9999999);
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement,'overflow','auto');
    }
  }


  // onFileChange(event,type:string){
  //   var selectedFiles:any[] =  event.target.files;
  //   if (selectedFiles.length > 0) {
  //     var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles,type); // Assign Files to Multiple File Uploads Array
  //     this.checkForFileUploadsScrollbar();
  //     Array.prototype.forEach.call(temporaryFiles,elem=>{
  //       const file = elem;
  //       if(this._imageService.validateFile(file,type)){
  //         const formData = new FormData();
  //         formData.append('file',file);
  //         var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
  //         this._imageService.uploadImageWithProgress(formData,typeParams) // Upload file to temporary storage
  //         .subscribe((res: HttpEvent<any>) => {
  //           let uploadEvent: any = res;
  //           switch (uploadEvent.type) {
  //             case HttpEventType.UploadProgress:
  //               // Compute and show the % done;
  //               if(uploadEvent.loaded){
  //                 let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
  //                 this.assignFileUploadProgress(upProgress,file);
  //               }
  //               this._utilityService.detectChanges(this._cdr);
  //               break;
  //             case HttpEventType.Response:
  //               //return event;
  //               let temp: any = uploadEvent['body'];
  //               temp['is_new'] = true;
  //               this.assignFileUploadProgress(null,file,true);
  //               this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
  //                 this.createImageFromBlob(prew,temp,type); // Convert blob to base64 string
  //               },(error)=>{
  //                 this.assignFileUploadProgress(null,file,true);
  //                 this._utilityService.detectChanges(this._cdr);
  //               })
  //           }
  //         },(error)=>{
  //           this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
  //           this.assignFileUploadProgress(null,file,true);
  //           this._utilityService.detectChanges(this._cdr);
  //         })
  //       }
  //       else{
  //         this.assignFileUploadProgress(null,file,true);
  //       }
  //     });
  //   }
  // }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  // createImageFromBlob(image: Blob, imageDetails, type) {
  //   let reader = new FileReader();
  //   reader.addEventListener("load", () => {
  //     var logo_url = reader.result;

  //     imageDetails['preview'] = logo_url;
  //     if (imageDetails != null)
  //       this._kpiService.setDocumentDetails(imageDetails, logo_url);
  //       this.checkForFileUploadsScrollbar();

  //     this._utilityService.detectChanges(this._cdr);
  //   }, false);

  //   if (image) {
  //     reader.readAsDataURL(image);
  //   }
  // }

  /**
 * 
 * @param progress File Upload Progress
 * @param file Selected File
 * @param success Boolean value whether file upload success 
 */
  // assignFileUploadProgress(progress, file, success = false) {

  //   let temporaryFileUploadsArray = this.fileUploadsArray;
  //   this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  // }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  // addItemsToFileUploadProgressArray(files, type) {
  //   var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
  //   this.fileUploadsArray = result.fileUploadsArray;
  //   return result.files;
  // }




  // checkExtension(ext, extType) {
  //   return this._imageService.checkFileExtensions(ext, extType);
  // }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  // removeDocument(token) {
  //   KpiMasterStore.unsetDocumentDetails(token);
  //   this.checkForFileUploadsScrollbar();
  //   this._utilityService.detectChanges(this._cdr);
  // }

    // *Common File Upload/Attach Modal Functions Starts Here

    checkExtension(ext, extType) {
      return this._imageService.checkFileExtensions(ext, extType)
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
            var purl = this._kpiCategoryService.getThumbnailPreview('kpi-document', element.token)
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
  
    enableScrollbar() {
      if (fileUploadPopupStore.displayFiles.length >= 3) {
        $(this.uploadArea.nativeElement).mCustomScrollbar();
        // $(this.previewUploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
        // $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
      }
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
  
    // **Common File Upload/Attach Modal Functions Ends Here
  
      // kh-module base document- Returns image url according to type and token-document
    createImageUrl(type, token) {
      if(type=='kpi-document')
      return this._kpiCategoryService.getThumbnailPreview(type, token);
      else
      return this._documentFileService.getThumbnailPreview(type, token);
  
    }

  
  save(close: boolean = false) {
    this.formErrors = null;
    // this.form.patchValue({
    //   documents: KpiMasterStore.docDetails
    // })
    let saveData = {
      title: this.form.value.title ? this.form.value.title : '',
      kpi_category_id: this.form.value.kpi_category_id ? this.form.value.kpi_category_id : '',
      kpi_type_id: this.form.value.kpi_type_id ? this.form.value.kpi_type_id : '',
      unit_id: this.form.value.unit_id ? this.form.value.unit_id : '',
      description: this.form.value.description ? this.form.value.description : '',
      // documents: this.form.value.documents ? this.form.value.documents : '',
      target: this.form.value.target? this.form.value.target: '',
      is_dashboard: this.form.value.is_dashboard? 1: 0,
    }

    if (this.form.value.id) {
			saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
		} else{
			saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}
    

    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    // console.log( this.form.value.kpiing_to);
    if (this.form.value.id) {
      save = this._kpiService.updateItem(this.form.value.id,saveData);
    } else {

      save = this._kpiService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      if(!this.form.value.id){
        this.resetForm();
        this.KpiMasterStore.clearDocumentDetails();

      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      // this.KpiMasterStore.clearDocumentDetails();

      if (close) {
         this.closeFormModal();

      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    });

  }


  // createImageUrl(type, token) {

  //   return this._humanCapitalService.getThumbnailPreview(type, token);
  // }
  
  getKpiCategories() {
    this._kpiCategoryService.getItems(true,'?access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  searchKpiCategory(e) {
    this._kpiCategoryService.searchKpiCategory('q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  getUnit() {
    this._unitService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  searchUnit(e) {
    this._unitService.getItems(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getKpiTypes()  {
    this._kpiTypesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchKpiTypes(e) {
    this._kpiTypesService.getItems(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
   // for resetting the form
   resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
    
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }
   // for closing the modal
   closeFormModal() {
    this.resetForm();
    this.clearCommonFilePopupDocuments();
    this._eventEmitterService.dismissHumanCapitalUserKpiCOntrolModal();

  }

  closeUnitFormModal(){
    $(this.unitAddformModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.kpiCategoryAddformModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      
    if (UnitMasterStore.lastInsertedId) {
      this.form.patchValue({ unit_id: UnitMasterStore.lastInsertedId });
      this.getUnit()
    }

   
       
       
  }

  closeKpiCategoryFormModal(){
    $(this.kpiCategoryAddformModal.nativeElement).modal('hide');

    if(KpiCategoryMasterStore.lastInsertedId){

      this.form.patchValue({kpi_category_id:KpiCategoryMasterStore.lastInsertedId});
      this.getKpiCategories();
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.closeFormModal();

    }

  }

  // Check any upload process is going on
  // checkFileIsUploading(){
  //   return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  // }

  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy() {
    this.childModalsubscriptionEvent.unsubscribe();
    this.kpiCategoryChildSubscriptionEvent.unsubscribe();
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();

    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

}
