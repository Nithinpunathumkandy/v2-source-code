import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { toJS } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventClosureStore } from 'src/app/stores/event-monitoring/event-closure-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventClosureService } from 'src/app/core/services/event-monitoring/event-closure/event-closure.service';
import { EventClosureChecklistMasterStore } from 'src/app/stores/masters/event-monitoring/event-closure-checklist-store';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { EventClosureChecklistService } from 'src/app/core/services/masters/event-monitoring/event-closure-checklist/event-closure-checklist.service';

declare var $: any;
@Component({
  selector: 'app-add-event-closure',
  templateUrl: './add-event-closure.component.html',
  styleUrls: ['./add-event-closure.component.scss']
})
export class AddEventClosureComponent implements OnInit {
  @Input('source') source: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  AppStore = AppStore;
  EventsStore = EventsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  EventClosureChecklistMasterStore = EventClosureChecklistMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  form: FormGroup;
  formErrors: any;
  indexChange = 0;  

  updateArray = []
  khFilesArray = []
  systemFilesArray = []
  fileUploadsArray = []
    
  fileUploadPopupSubscriptionEvent: any = null;

  event_closure_checklist_status = ["Yes","No"]
  //   {
  //     title: "Yes",
  //     event_closure_checklist_status: "Yes",
  //     id: 1
  //   },
  //   {
  //     title: "No",
  //     event_closure_checklist_status: "No",
  //     id: 0
  // }
//]

  formNgModal = [];
  eventClosureId = null;  
  end_date_model = null;
  event_closure_checklists = [];  
  planned_event_completion: string = '';
  actual_event_completion_date: string = '';  

  constructor(
    private _renderer2: Renderer2,            
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventService: EventsService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,    
    private _documentFileService: DocumentFileService,
    private _eventClosureService: EventClosureService,
    private _eventEmitterService: EventEmitterService,
    private _eventFileService: EventFileServiceService,    
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventClosureChecklistMasterService: EventClosureChecklistService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      event_id: [null],
      // planned_event_completion: ['', { disabled: true }, [Validators.required]],
      // actual_event_completion_date: ['', [Validators.required]],

    });

    if (this.source) {
      if (this.source.hasOwnProperty('value') && this.source.value) {
        //this.setEditValue();
        this.eventClosureId = this.source.value.id;
      }
      if (this.source.type == 'Edit FromSubMenu' || this.source.type == 'Add FromSubMenu') {
        this.getEventList();
        this.form.controls.event_id.setValidators([Validators.required]);
        this.form.controls.event_id.updateValueAndValidity();
      }
    }

    this.form.patchValue({
      planned_event_completion: EventsStore.eventDetails?.start_date
    })

    // this.getPlannedEventDate();
    this.planned_event_completion = EventsStore.eventDetails?.start_date
    this.getClosureMasterData();

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    //this.initializeFormNgModal();
  }

  getEventList() {
    this._eventService.getItemsAll().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  changeEvent(e) {
    if (e) {
      EventsStore.selectedEventId = e;
      this._eventService.getItem(e).subscribe(res => {
        this.form.patchValue({
          planned_event_completion: EventsStore.eventDetails?.start_date,
        })
      })
    }
  }

  editIndividual(){
    this.setIndividualDocument(EventClosureStore.indivitualEventClosure?.documents)
    this.formNgModal.push({
      'event_closure_checklist_title':EventClosureStore.indivitualEventClosure?.event_closure_checklist?.language[0]?.pivot?.title,
      'event_closure_checklist_id':EventClosureStore.indivitualEventClosure?.event_closure_checklist?.id,
      'id':EventClosureStore.indivitualEventClosure?.id,
      'comment':EventClosureStore.indivitualEventClosure?.comment,
      'event_closure_checklist_status':EventClosureStore.indivitualEventClosure?.event_closure_checklist_status,
      'documents':EventClosureStore.indivitualEventClosure?.documents,
    })    
  }

  setIndividualDocument(documents){
    let dataArray=[]    
    
    for (let doc of documents) {
      dataArray.push({
        'verificationId':EventClosureStore.indivitualEventClosure?.event_closure_checklist?.id,
        ...doc})
    }    
    fileUploadPopupStore.setFilestoDisplay(dataArray)
    this.setDocuments(fileUploadPopupStore.displayFiles)
  }

  setEditValue() {
    this.formNgModal = []
    this.formNgModal = [...toJS(this.source.value.checkList)]
    for (let i = 0; i < EventClosureChecklistMasterStore?.eventClosureChecklist.length; i++) {
      this.formNgModal[i].event_closure_checklist_title = EventClosureChecklistMasterStore?.eventClosureChecklist[i].event_closure_checklist_title
      this.formNgModal[i].event_closure_checklist_id = EventClosureChecklistMasterStore?.eventClosureChecklist[i].id
    }

    if (this.source.hasOwnProperty('value') && this.source.value) {
      let { actual_event_completion_date, id, planned_event_completion } = this.source.value;
      this.form.patchValue({
        actual_event_completion_date: this._helperService.processDate(actual_event_completion_date, 'split'),
        planned_event_completion: EventsStore.eventDetails?.start_date ? EventsStore.eventDetails?.start_date : planned_event_completion.start_date,
        id: id,
      })
      if (this.source.type == 'Edit FromSubMenu') {
        this.form.patchValue({
          event_id: planned_event_completion.id
        })
      }
    }
    this.setDocument()
    this._utilityService.detectChanges(this._cdr);
  }

  setDocument() {
    let dataArray = []
    for (let object of EventClosureStore.indivitualEventClosure?.checklist) {
      for (let doc of object.documents) {
        dataArray.push({
          'verificationId': object.event_closure_checklist_id,
          ...doc
        })
      }
    }
    fileUploadPopupStore.setFilestoDisplay(dataArray)
    this.setDocuments(fileUploadPopupStore.displayFiles)
  }

  setDocuments(documents) {
    this.clearFIleUploadPopupData()
    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              'is_kh_document': true,
              'verificationId': element.verificationId
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              'verificationId': element.verificationId,
              ...innerElement
            })
          }
        });
      }
      else {
        if (element && element.token) {
          var purl = this._eventFileService.getThumbnailPreview('event-file', element.token)
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
            'verificationId': element.verificationId
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)
      }
    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  getValuesForEdit(id: number) {
    let closureValues = this.source.values.checklist[0]?.find(e => e.id == id);
    return closureValues;
  }

  getPlannedEventDate() {
    this.form.patchValue({
      planned_event_completion: EventsStore.eventDetails?.start_date
    })
  }

  getClosureMasterData() {
    this._eventClosureChecklistMasterService.getItems(true,`?event_id=${EventsStore.selectedEventId}`, true).subscribe(res => {
      if (this.source.type == 'Edit' || this.source.type == 'Edit FromSubMenu') {
        this.editIndividual()
      } else {
        this.initializeFormNgModal()
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  initializeFormNgModal() {
    for (let i of EventClosureChecklistMasterStore?.eventClosureChecklist) {
      this.formNgModal.push({
        event_closure_checklist_id: i.id,
        event_closure_checklist_title: i.event_closure_checklist_title,
        comment: '',
        event_closure_checklist_status: null,
        title: '',
        id: '',
        error: null
      });
    }
  }

  changeIndex(index) {
    if (this.indexChange == index) {
      this.indexChange = null;
    }
    else {
      this.indexChange = index;
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // * File Upload/Attach Modal

  openFileUploadModal(id) {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      fileUploadPopupStore.verificationId = id
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
    // this.clearFIleUploadPopupData()
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

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._eventClosureService.getThumbnailPreview(type, token);

  }

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
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

  createSaveData() {
    var returnData = {};
    let event_closure_checklists = [];
    for (let i of this.formNgModal) {
      this.updateArray = this.documentUpdateFn(i.event_closure_checklist_id, fileUploadPopupStore.getUpdateArray)
      this.khFilesArray = this.documentUpdateFn(i.event_closure_checklist_id, fileUploadPopupStore.getKHFiles)
      this.systemFilesArray = this.documentUpdateFn(i.event_closure_checklist_id, fileUploadPopupStore.getSystemFile)
      let items = {
        id: i.id,
        event_closure_checklist_id: i.event_closure_checklist_id,
        comment: i.comment,
        event_closure_checklist_status: i.event_closure_checklist_status,
        documents: this.source.type == "Edit" ? this._helperService.compareEditDataWithSelectedData(this.updateArray, this.khFilesArray, this.systemFilesArray) : this._helperService.sortFileuploadData(this.documentFn(i.event_closure_checklist_id), 'save')
      }
      if(i.comments || i.event_closure_checklist_status|| i.documents){
        event_closure_checklists.push(items);
      }      
    }
    returnData = {
      //'planned_event_completion': this.form.value?.planned_event_completion ? this.form.value?.planned_event_completion : null,
      //'actual_event_completion_date': this.form.value.actual_event_completion_date ? this._helperService.processDate(this.form.value.actual_event_completion_date, 'join') : '',
      'event_closure_checklists': event_closure_checklists.length > 0 ? event_closure_checklists : []
    }

    return returnData;
  }

  updateSaveData(){
    var returnData = {};
    let items
    let event_closure_checklists = [];
    for (let i of this.formNgModal) {
      this.updateArray = this.documentUpdateFn(i.event_closure_checklist_id, fileUploadPopupStore.getUpdateArray)
      this.khFilesArray = this.documentUpdateFn(i.event_closure_checklist_id, fileUploadPopupStore.getKHFiles)
      this.systemFilesArray = this.documentUpdateFn(i.event_closure_checklist_id, fileUploadPopupStore.getSystemFile)
      items = {
        id: i.id,
        event_closure_checklist_id: i.event_closure_checklist_id,
        comment: i.comment,
        event_closure_checklist_status: i.event_closure_checklist_status,
        documents: this.source.type == "Edit" ? this._helperService.compareEditDataWithSelectedData(this.updateArray, this.khFilesArray, this.systemFilesArray) : this._helperService.sortFileuploadData(this.documentFn(i.event_closure_checklist_id), 'save')
      }
      if(i.comments || i.event_closure_checklist_status|| i.documents){
        event_closure_checklists.push(items);
      }      
    }    

    return items;
  }

  documentFn(id) {
    let returnData = []
    fileUploadPopupStore.displayFiles.forEach(element => {
      if (element.verificationId == id) {
        returnData.push(element)
      }
    });
    return returnData
  }

  documentUpdateFn(id, docs) {
    let updateData = []
    docs.forEach(element => {
      if (element.verificationId == id) {
        updateData.push(element)
      }
    });
    return updateData
  }

  save(close: boolean = false) {
    this.formErrors = null;
    this.clearFormNgModalError();
    var saveData = this.createSaveData();
    if (saveData) {
      let save;
      AppStore.enableLoading();
      if (this.source.type == "Edit") {
        save = this._eventClosureService.updateClosure(EventClosureStore.indivitualEventClosure?.id, this.updateSaveData(), this.source.type);
      } else {
        save = this._eventClosureService.saveClosure(saveData, this.source.type);
      }

      save.subscribe((res: any) => {
        if (!this.eventClosureId) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error;
          this.processFormErrors();
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  processFormErrors() {
    var formData = this.getDataPresent();
    var errors = this.formErrors.errors;
    console.log(this.formErrors.actual_event_completion_date)
    if (!errors.actual_event_completion_date) {
      for (var key in errors) {
        if (errors.hasOwnProperty(key)) {
          if (key.includes('checklist') && key.includes('event_closure_checklist_title')) {
            let keyValueSplit = key.split('.');
            let errorPosition = keyValueSplit[1];
            let eventChecklistId = formData[errorPosition].event_closure_checklist_id;
            var formModalPosition = this.formNgModal.findIndex(e => e.event_closure_checklist_id == eventChecklistId);
            this.formNgModal[formModalPosition].error = errors[key];
          }
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  getDataPresent() {
    let stringifyData = JSON.stringify(this.formNgModal);
    let data = JSON.parse(stringifyData);
    for (var i = 0; i < data.length; i++) {
      if ((!data[i].event_closure_checklist_title || data[i].event_closure_checklist_title == '')) {
        data.splice(i, 1);
        i--;
      }
    }
    return data;
  }

  clearFormNgModalError() {
    for (let i of this.formNgModal) {
      i.error = null;
    }
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }

  // for closing the modal
  closeFormModal() {
    this._eventEmitterService.dismissEventClosureModal();
    this.resetForm();
  }

  // for resetting the form
  resetForm() {
    for (let i of this.formNgModal) {

      i.event_closure_checklist_id = null,
        i.comment = '',
        i.event_closure_checklist_status = '',
        //documents: []
        i.error = null;
    }
    // this.form.reset();
    // this.form.pristine;
    this.eventClosureId = null;
    this.formErrors = null;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

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

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    fileUploadPopupStore.clearFilesToDisplay()
    fileUploadPopupStore.clearKHFiles()
    fileUploadPopupStore.clearSystemFiles()
    fileUploadPopupStore.clearUpdateFiles()
    EventsStore.searchText = "";
    //EventsStore.unsetEventDetails();
    EventsStore.unsetEventsList();
    EventsStore.unsetEventSelectdId();
    EventClosureChecklistMasterStore.loaded = false
  }

}
