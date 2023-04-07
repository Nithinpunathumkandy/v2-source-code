import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventChangeRequestService } from 'src/app/core/services/event-monitoring/event-change-request/event-change-request.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
declare var $:any;
@Component({
  selector: 'app-edit-event-date-change-request',
  templateUrl: './edit-event-date-change-request.component.html',
  styleUrls: ['./edit-event-date-change-request.component.scss']
})
export class EditEventDateChangeRequestComponent implements OnInit,OnDestroy {
  @Input('source') eventChangeRequestSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  EventsStore = EventsStore;
  EventChangeRequestStore=EventChangeRequestStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore
  AppStore = AppStore;
  AuthStore = AuthStore;
  form: FormGroup;
  formErrors :any;
  fileUploadType;
  fileUploadPopupSubscriptionEvent: any;
  editFlag:boolean=false;
  durationFiles=[];
  constructor( private _renderer2: Renderer2,
    private _utilityService: UtilityService, private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService, private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService, private _eventChangeRequestService: EventChangeRequestService,
    private _fileUploadPopupService: FileUploadPopupService, 
    private _eventFileService: EventFileServiceService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      new_start_date:['',[Validators.required]],
      new_end_date:['',[Validators.required]],
      existing_start_date:[''],
      existing_end_date:[''],
      justification_event_date:['',[Validators.required]],
      documents:[],
    });
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.closeFileUploadModal();
    });
    this.setRequestDataForEdit();
  }
  cancel(){
    this.form.reset();
    this._eventEmitterService.dismissEventChangeReqEventDateModal();
  }

  setRequestDataForEdit(){
    this.form.patchValue({
      existing_start_date:EventChangeRequestStore.individualChangeRequestItem.event?.start_date ?  new Date(EventChangeRequestStore.individualChangeRequestItem.event?.start_date) : '',
      existing_end_date:EventChangeRequestStore.individualChangeRequestItem.event?.end_date ?  new Date(EventChangeRequestStore.individualChangeRequestItem.event?.end_date) : '',
    })
    if(EventChangeRequestStore.individualChangeRequestItem.event_date){
      this.editFlag=true;
      this.form.patchValue({
        new_start_date:EventChangeRequestStore.individualChangeRequestItem.event_date ?  new Date(EventChangeRequestStore.individualChangeRequestItem.event_date.new_start_date) : '',
        new_end_date:EventChangeRequestStore.individualChangeRequestItem.event_date ? new Date(EventChangeRequestStore.individualChangeRequestItem.event_date.new_end_date) : '',
        justification_event_date:EventChangeRequestStore.individualChangeRequestItem.event_date.justification ? EventChangeRequestStore.individualChangeRequestItem.event_date.justification : '',
      })
      // this.durationFiles = EventChangeRequestStore.individualChangeRequestItem.event_date.documents;
      if(EventChangeRequestStore.individualChangeRequestItem.event_date && EventChangeRequestStore.individualChangeRequestItem.event_date.documents.length > 0){
        this.durationFiles = this.setDocuments(EventChangeRequestStore.individualChangeRequestItem.event_date.documents,'event-date',true);
      }
      else{
        this.durationFiles = [];
      }
     }
  }
  openFileUploadModal(type) {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      this.fileUploadType = type;
      this.setorUsetFiles(true,type);
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

  setorUsetFiles(setOrUnset,type){
    if(setOrUnset){
      this.clearAttachments();
      this.processDocuments(this.durationFiles,'event-date');
    }
    else this.clearAttachments()
  }

  clearAttachments(){
    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

  processDocuments(documents,type){
    this.clearAttachments()
		let khDocuments = [];
    let systemFiles = [];
    documents.forEach(element=>{
      // if(!element.is_deleted){
        if(element.document_id || element.is_kh_document){
          khDocuments.push({
            ...element,
            'is_kh_document': true,
          })
          fileUploadPopupStore.setUpdateFileArray({
            'updateId': element.id,
            ...element
          })
        }
        else{
          if (element && element.token) {
            var purl = '';
            if(element.is_new){
              purl = element.preview;
            }
            else{
              purl = this._eventFileService.getThumbnailPreview(type, element.token);
            }
            var lDetails = {
              title: element.title ? element.title : element.name,
              name: element.title ? element.title : element.name,
              ext: element.ext,
              size: element.size,
              url: element.url,
              token: element.token,
              thumbnail_url: element.thumbnail_url,
              preview: purl,
              id: element.id,
              'is_kh_document': false,
            }
            if(element.is_new) lDetails['is_new'] = true;
            systemFiles.push(lDetails);
            this._fileUploadPopupService.setSystemFile(lDetails, purl)
          }
        }
      // }
    })
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    // else
      // return this._incidentFileService.getThumbnailPreview(type, token);
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  removeDocument(doc,type) {
    let dpos = this.durationFiles.findIndex(e =>e.token == doc.token);
    this.durationFiles.splice(dpos,1);
    this._utilityService.detectChanges(this._cdr);
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      
      switch(this.fileUploadType){
        case 'duration': this.durationFiles = fileUploadPopupStore.displayFiles;
                          break;
      }
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this.clearAttachments()
        this.fileUploadType = ''
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  save(close: boolean = false)
  {
    this.setorUsetFiles(true,'duration');
    AppStore.enableLoading();
    let obj = {
      existing_start_date : this._helperService.processDate(EventsStore.eventDetails?.start_date,'join'),
      existing_end_date : this._helperService.processDate(EventsStore.eventDetails?.end_date,'join'),
      new_start_date : this.form.value.new_start_date?this._helperService.passSaveFormatDate(this.form.value.new_start_date):'',
      new_end_date : this.form.value.new_end_date?this._helperService.passSaveFormatDate(this.form.value.new_end_date):'',
      justification : this.form.value.justification_event_date ? this.form.value.justification_event_date : null,
      documents:this.editFlag ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(this.durationFiles, 'save')
    }
    this._eventChangeRequestService.saveDuration(obj,EventChangeRequestStore.selectedCRId).subscribe(res=>{
      AppStore.disableLoading();
      this.cancel();
      this._utilityService.detectChanges(this._cdr); 
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setDocuments(documents,type,setorunset?) {
    this.clearAttachments()
		let khDocuments = [];
    let systemFiles = [];
		documents.forEach(element => {
			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {
					if (innerElement.is_latest) {
						khDocuments.push({
							...innerElement,
							'is_kh_document': true,
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
					var purl = this._eventFileService.getThumbnailPreview(type, element.token)
					var lDetails = {
            title: element.title ? element.title : element.name,
						name: element.title ? element.title : element.name,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						'is_kh_document': false,
            // 'verificationId':element.verificationId
					}
          systemFiles.push(lDetails);
				}
				if(!setorunset) this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
    if(!setorunset){
      fileUploadPopupStore.setKHFile(khDocuments)
      let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
      fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    }
    else{
      let allDocuments = [...khDocuments, ...systemFiles]
      return allDocuments;
    }
	}

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }

}
