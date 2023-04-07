import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { KpiManagementFileService } from 'src/app/core/services/kpi-management/file-service/kpi-management-file.service';
import { ImprovementLansService } from 'src/app/core/services/kpi-management/improvement-plans/improvement-lans.service';
import { KpisService } from 'src/app/core/services/kpi-management/kpi/kpis.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ImprovementPlansStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-improvement-plans-add',
  templateUrl: './improvement-plans-add.component.html',
  styleUrls: ['./improvement-plans-add.component.scss']
})
export class ImprovementPlansAddComponent implements OnInit, OnDestroy {
  @Input('source') actionPlansObject: any;
  @Input('selectedKpi') selectedKpiData: any;//Kpi base kpi select
  @Input('crubPath') crubPath: any;

  @ViewChild ('filePreviewModal') filePreviewModal: ElementRef;//-document
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;//File-Upload
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;//File-Upload
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;//File-Upload

  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  name = '';

  AppStore = AppStore;
  KpisStore = KpisStore;
  UsersStore = UsersStore;
  reactionDisposer: IReactionDisposer;
  ImprovementPlansStore = ImprovementPlansStore;
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  todayDate: any = new Date();
  disableKpi:boolean=false;

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
  datePlaceholder: any;

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _kpisService: KpisService,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _improvementLansService: ImprovementLansService,
    private _documentFileService: DocumentFileService,//File-Upload
    private _fileUploadPopupService: FileUploadPopupService,//File-Upload
    private _kpiManagementFileService: KpiManagementFileService, //File-Upload
    ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    this.datePlaceholder = this._helperService.getDateFormatType();
    this.form = this._formBuilder.group({

      id: [null],
      title: ["", [Validators.required]],
      description: [''],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      kpi_id: [null],
      responsible_user_id: [null, [Validators.required]],
    });

    this.resetForm();

    //File-Upload
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    });

    if (this.selectedKpiData) {//Kpi detials inside improvement plan add automatic select kpi and set heading

      this.disableKpi=true;
      this.form.patchValue({
        'kpi_id':this.selectedKpiData,
      })

      KpisStore.setKpiId(this.selectedKpiData?.id);
      this.getKpiDetials();
    }else{
      this.disableKpi=false;
    }

    if (ImprovementPlansStore.individualLoaded) {
      this.setEditDetails();
    }

    this.form.get('kpi_id').valueChanges.subscribe(val => {// prv Kpi title set title
      if (val?.id) {
        KpisStore.setKpiId(val?.id);
        this.getKpiDetials();
      } 
    });

  }

  setEditDetails() {
    KpisStore.setKpiId(ImprovementPlansStore.individualImprovementPlansDetails?.kpi_management_kpi?.id);
    this.getKpiDetials();

    this.clearCommonFilePopupDocuments();
    if (ImprovementPlansStore.individualImprovementPlansDetails?.documents.length > 0) {
      this.setDocuments( ImprovementPlansStore.individualImprovementPlansDetails?.documents);
    }

    this.form.setValue({
      id: ImprovementPlansStore.individualImprovementPlansDetails?.id,
      title:ImprovementPlansStore.individualImprovementPlansDetails?.title ? ImprovementPlansStore.individualImprovementPlansDetails?.title : '',
      kpi_id: ImprovementPlansStore.individualImprovementPlansDetails?.kpi_management_kpi ? this.kpiEditdataset( ImprovementPlansStore.individualImprovementPlansDetails?.kpi_management_kpi) : null,
      start_date: ImprovementPlansStore.individualImprovementPlansDetails?.start_date ? this._helperService.processDate(ImprovementPlansStore.individualImprovementPlansDetails?.start_date, 'split') : '',
      target_date: ImprovementPlansStore.individualImprovementPlansDetails?.target_date ? this._helperService.processDate(ImprovementPlansStore.individualImprovementPlansDetails?.target_date, 'split') : '',
      description: ImprovementPlansStore.individualImprovementPlansDetails?.description ? ImprovementPlansStore.individualImprovementPlansDetails?.description : '',
      responsible_user_id: ImprovementPlansStore.individualImprovementPlansDetails?.responsible_user ? ImprovementPlansStore.individualImprovementPlansDetails?.responsible_user : [],
    });
  }

  kpiEditdataset(KpiData){
    return {
      id:KpiData.id,
      title:KpiData.kpi.title
    }
  }

  
  getKpiDetials(){
    this._kpisService.getItem(KpisStore.kpiId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getKpis() {
    this._kpisService.getItems(false,'&kpi_management_status_ids=5').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchKpis(event) {
    this._kpisService.getSearchItems(`q=${event.term}&kpi_management_status_ids=5`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getAllUsers() {
    UsersStore.setAllUsers([]);
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchUsers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchListclickValueClear(event) {
    return event.searchTerm = '';
  }

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
            var purl = this._kpiManagementFileService.getThumbnailPreview('improvement-plans-document', element.token)
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
      this._utilityService.detectChanges(this._cdr);
    }
  
    // kh-module base document- Returns image url according to type and token-document
  createImageUrl(type, token) {
    if(type=='user-profile-picture'){
      return this._imageService.getThumbnailPreview('user-profile-picture', token)
    }else if(type=='improvement-plans-document')
    return this._kpiManagementFileService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);
  }
    // **Common File Upload/Attach Modal Functions Ends Here
    
  createDateTimeValidator() {
    if (ImprovementPlansStore.editFlag) 
      return this.todayDate;
    else 
      return this.form.value.start_date?this.form.value.start_date:this.todayDate;
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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

  cancel() {
    this.closeFormModal('cancel');
  }

  closeFormModal(type, resId?) {
    AppStore.disableLoading();
    this.resetForm();

    if (resId) {
      this._router.navigateByUrl('kpi-management/improvement-plans/' + resId);
      if(this.crubPath){
        ImprovementPlansStore.setPath(this.crubPath?.path);
        BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
        BreadCrumbMenuItemStore.makeEmpty();
        BreadCrumbMenuItemStore.addBreadCrumbMenu(this.crubPath);
      }
      this._eventEmitterService.dismissCommonModal(resId);
    }else{
      this._eventEmitterService.dismissCommonModal(type);
    }
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  getSaveData() {
    
    this.saveData = {
      kpi_management_kpi_id:this.form.value.kpi_id.id? this.form.value.kpi_id.id: null,
      title: this.form.value.title ? this.form.value.title : '',
      description: this.form.value.description ? this.form.value.description : '',
      start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : '',
      target_date: this.form.value.target_date ? this._helperService.processDate(this.form.value.target_date, 'join') : '',
      responsible_user_id: this.form.value.responsible_user_id ? this.form.value.responsible_user_id.id : null,
    }

    if (this.form.value.id) {
			this.saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
		} else{
			this.saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}

  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      this.getSaveData();

      if (this.form.value.id) {
        save = this._improvementLansService.updateItem(this.form.value.id,this.saveData);
      } else {
        save = this._improvementLansService.saveItem(this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm();
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (close) this.closeFormModal('save', res.id);
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
    KpisStore.unSetKpi();//kpi list
    KpisStore.unsetIndividualKpiDetails();//kpi detial
  }

}

