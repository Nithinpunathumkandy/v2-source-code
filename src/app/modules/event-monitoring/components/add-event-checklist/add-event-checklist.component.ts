import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { ChecklistMasterStore } from 'src/app/stores/masters/event-monitoring/checklist-store';
import { EventChecklistStore } from 'src/app/stores/event-monitoring/events/event-checklist-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ChecklistService } from 'src/app/core/services/masters/event-monitoring/checklist/checklist.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { EventChecklistService } from 'src/app/core/services/event-monitoring/event-monitoring-closure/event-checklist.service';
import { toJS } from 'mobx';

declare var $: any;
@Component({
  selector: 'app-add-event-checklist',
  templateUrl: './add-event-checklist.component.html',
  styleUrls: ['./add-event-checklist.component.scss']
})
export class AddEventChecklistComponent implements OnInit {

  @Input('source') source: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  AppStore = AppStore;
  EventChecklistStore = EventChecklistStore
  fileUploadPopupStore = fileUploadPopupStore;
  ChecklistMasterStore = ChecklistMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  form: FormGroup;  
  formErrors: any;
  fileUploadsArray = [];
  indexChange = 0;
  fileUploadPopupSubscriptionEvent: any = null;
  common_nodata_title="common_nodata_title"

  ChecklistStatus = ["Yes", "No", "Not Applicable"]

  eventClosureId = null;
  flag:boolean=false
  EventsStore = EventsStore;
  formNgModal=[];

  updateArray=[]
  khFilesArray=[]
  systemFilesArray=[]

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _checklistService: ChecklistService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
    private _eventFileService: EventFileServiceService,
    private _eventChecklistService: EventChecklistService,
    private _fileUploadPopupService: FileUploadPopupService,
  ) { }

  ngOnInit(): void {    
    this.form = this._formBuilder.group({
      id: [''],
      comments: [''],
      event_checklist_status: [null],
    });    

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    if (this.source.type == 'Edit') {
      this.getChecklist()
    }else if (this.source.type == 'Edit_Individual') {
      this.getChecklist()
      this.editIndividual()
    }
    else{
      this.getChecklist()
    }

  }

  changeIndex(index){
    if(this.indexChange == index){
      this.indexChange = null;
    }
    else {
      this.indexChange = index;
    } 
    this._utilityService.detectChanges(this._cdr);
  }

  editIndividual(){
    this.setIndividualDocument(EventChecklistStore?.individualEventChecklist?.documents)
    this.formNgModal.push({
      'event_checklist_title':EventChecklistStore?.individualEventChecklist?.checklist?.language[0]?.pivot?.title,
      'event_checklist_id':EventChecklistStore?.individualEventChecklist?.checklist?.id,
      'id':EventChecklistStore?.individualEventChecklist?.id,
      'comments':EventChecklistStore?.individualEventChecklist?.comments,
      'event_checklist_status':EventChecklistStore?.individualEventChecklist?.event_checklist_status,
      'documents':EventChecklistStore?.individualEventChecklist?.documents,
    })    
  }

  setIndividualDocument(documents){
    let dataArray=[]    
    
    for (let doc of documents) {
      dataArray.push({
        'verificationId':EventChecklistStore?.individualEventChecklist?.checklist?.id,
        ...doc})
    }    
    fileUploadPopupStore.setFilestoDisplay(dataArray)
    this.setDocuments(fileUploadPopupStore.displayFiles)
  }

  setEditValue(){    
    this.formNgModal=[]    
    for(let i=0;i<ChecklistMasterStore?.checklist.length;i++){      
      this.formNgModal.push({
        'event_checklist_title': ChecklistMasterStore?.checklist[i].event_checklist_title , 
        'event_checklist_id':ChecklistMasterStore?.checklist[i].id,
        'id':"",
        'comments':""
      });      
    }
    
    for (let index = 0; index < this.formNgModal.length; index++) {      
      for (let i=0; i<EventChecklistStore.allItems.length; i++){
        if(EventChecklistStore.allItems[i].event_checklist_id === this.formNgModal[index].event_checklist_id){
          this.formNgModal[index].event_checklist_id=EventChecklistStore.allItems[i].event_checklist_id
          this.formNgModal[index].event_checklist_title=EventChecklistStore.allItems[i].event_checklists?.language[0]?.pivot?.title
          this.formNgModal[index].comments=EventChecklistStore.allItems[i].comments
          this.formNgModal[index].id=EventChecklistStore.allItems[i].id
          this.formNgModal[index].event_checklist_status=EventChecklistStore.allItems[i].event_checklist_status
          this.formNgModal[index].documents=EventChecklistStore.allItems[i].documents
        }
      }
    }
    
    this.setDocument()
    this._utilityService.detectChanges(this._cdr);        
  }

  setDocument(){
    let dataArray=[]    

    for (let object of EventChecklistStore.allItems) {
      for (let doc of object.documents) {
        dataArray.push({
          'verificationId':object.event_checklist_id,
          ...doc})
      }
    }
    fileUploadPopupStore.setFilestoDisplay(dataArray)
    this.setDocuments(fileUploadPopupStore.displayFiles)
  }

  responseChange(data) {
    var returnValue = { id: data?.id, event_checklist_title: data?.language[0]?.pivot?.title }
    return returnValue
  }
  
  getChecklist() {
    this._checklistService.getItems(true,`?event_id=${EventsStore.selectedEventId}`).subscribe(res => {
      if (this.source.type == 'Add') {        
        let data=res['data']
      for(let i of data){
        this.formNgModal.push({
          event_checklist_id: i.id, 
          event_checklist_title: i.event_checklist_title,
          comments:'',
          event_checklist_status:null, 
          title: '',
          id: '', 
          error: null});
      }
      }if (this.source.type == 'Edit'){
        this.editIndividual()
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchChecklist(event) {
    this._checklistService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
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
              title:element?.kh_document.title,
							'is_kh_document': true,
              'verificationId':element.verificationId
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,
              'verificationId':element.verificationId,
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
            'verificationId':element.verificationId
					}
				}
				this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
	}

  //File Upload/Attach Modal
  openFileUploadModal(id) {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      fileUploadPopupStore.verificationId=id
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
      return this._eventChecklistService.getThumbnailPreview(type, token);

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
    let event_checklists=[]    
    for(let i of this.formNgModal){
      this.updateArray=this.documentUpdateFn(i.event_checklist_id,fileUploadPopupStore.getUpdateArray)
      this.khFilesArray=this.documentUpdateFn(i.event_checklist_id,fileUploadPopupStore.getKHFiles)
      this.systemFilesArray=this.documentUpdateFn(i.event_checklist_id,fileUploadPopupStore.getSystemFile)
      let items = {
        id : i.id,
        event_checklist_id : i.event_checklist_id,
        comments: i.comments,
        event_checklist_status:i.event_checklist_status,
        documents : this.source.type == "Edit" ? this._helperService.compareEditDataWithSelectedData(this.updateArray,this.khFilesArray,this.systemFilesArray) : this._helperService.sortFileuploadData(this.documentFn(i.event_checklist_id), 'save') 
      }
      if(i.comments || i.event_checklist_status|| i.documents){
        event_checklists.push(items);
      }      
    }

    let returnData = {
      'event_checklists':event_checklists.length > 0 ? event_checklists: []
    }

    return returnData;
  }

  updateSaveData(){
    let items
    for(let i of this.formNgModal){
      this.updateArray=this.documentUpdateFn(i.event_checklist_id,fileUploadPopupStore.getUpdateArray)
      this.khFilesArray=this.documentUpdateFn(i.event_checklist_id,fileUploadPopupStore.getKHFiles)
      this.systemFilesArray=this.documentUpdateFn(i.event_checklist_id,fileUploadPopupStore.getSystemFile)
      items = {
        id : i.id,
        event_checklist_id : i.event_checklist_id,
        comments: i.comments,
        event_checklist_status:i.event_checklist_status,
        documents : this.source.type == "Edit" ? this._helperService.compareEditDataWithSelectedData(this.updateArray,this.khFilesArray,this.systemFilesArray) : this._helperService.sortFileuploadData(this.documentFn(i.event_checklist_id), 'save') 
      }          
    }

    return items
  }

  documentFn(id){
    let returnData=[]
    fileUploadPopupStore.displayFiles.forEach(element => {
      if(element.verificationId==id){
        returnData.push(element)
      }
    });
    return returnData
  }

  documentUpdateFn(id,docs){
    let updateData=[]
    docs.forEach(element => {
      if(element.verificationId==id){        
        updateData.push(element)          
        }
    });    
    return updateData
  }

  save(close: boolean = false) {
    this.formErrors = null;
    var saveData = this.createSaveData();
    if (saveData) {
      let save;
      AppStore.enableLoading();
      if (this.source.type == 'Edit') {
        save = this._eventChecklistService.updateItem(EventChecklistStore?.individualEventChecklist?.id, this.updateSaveData());
      } else {
        save = this._eventChecklistService.saveItem(saveData);
      }

      save.subscribe((res: any) => {
        if (this.source.type == 'Add') {
          this.resetForm();
          this.clearFIleUploadPopupData()
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  // cancel modal
  cancel() {
    this.closeFormModal();

  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  // for closing the modal
  closeFormModal() {
    this._eventEmitterService.dismissEventChecklistModal();
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

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.clearFIleUploadPopupData()
    ChecklistMasterStore.loaded=false
  }

}
