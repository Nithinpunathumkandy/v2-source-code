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
  selector: 'app-edit-event-scope-change-request',
  templateUrl: './edit-event-scope-change-request.component.html',
  styleUrls: ['./edit-event-scope-change-request.component.scss']
})
export class EditEventScopeChangeRequestComponent implements OnInit,OnDestroy {
  @Input('source') eventChangeRequestSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  EventsStore = EventsStore;
  EventChangeRequestStore=EventChangeRequestStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  form: FormGroup;
  formErrors :any;
  fileUploadType;
  fileUploadPopupSubscriptionEvent: any;
  editFlag:boolean=false;
  scopeFiles=[];
  inScope
  outScope
  assumption
  inScopes = [];
  outScopes = [];
  assumptions = [];
  noDataSourceInscope = {
    noData: "No in scope added", border: false
  }

  noDataSourceOutScope = {
    noData: "No out scope added", border: false
  }
  noDataSourceAssumption = {
    noData: "No assumption added", border: false
  }
  constructor( private _renderer2: Renderer2,
    private _utilityService: UtilityService, private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService, private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService, private _eventChangeRequestService: EventChangeRequestService,
    private _fileUploadPopupService: FileUploadPopupService, private _eventFileService: EventFileServiceService
    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      justification_event_scope:['',[Validators.required]],
    });
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.closeFileUploadModal();
    });
    this.setEditDataforScope();
   
  }
  setEventScopes(scopes){
    for(let i of scopes){
      if(i.type =='scope'){
        let obj = {
          id:i.id,
          title : i.title,
          type : 'existing',
          scope_type : 'scope', 
          is_deleted:0
        }
        this.inScopes.push(obj)
      }else if(i.type == 'exclusion'){
        let obj = {
          id:i.id,
          title : i.title,
          type : 'existing',
          scope_type : 'exclusion',
          is_deleted:0
        }
         this.outScopes.push(obj)
      }else if(i.type =="assumption") {
        let obj = {
          id:i.id,
          title : i.title,
          type : 'existing',
          scope_type : 'assumption',
          is_deleted:0
        }
        this.assumptions.push(obj)

      }
    }
  }

  setEditDataforScope(){
    if(EventChangeRequestStore?.individualChangeRequestItem?.event_scope?.length==0 || !EventChangeRequestStore?.individualChangeRequestItem)
    {
      //console.log(EventsStore.eventDetails);
      if(EventsStore.eventDetails.event_scopes)
      {
        this.setEventScopes(EventsStore.eventDetails.event_scopes);
      }
      
    }
    else{
      if(EventChangeRequestStore?.individualChangeRequestItem?.event_scope?.length > 0){
        this.editFlag=true;
        EventChangeRequestStore.scopeOfWorks = EventChangeRequestStore.individualChangeRequestItem.event_scope;
        if(EventChangeRequestStore.individualChangeRequestItem.event_scope.length >0){
          for(let data of EventChangeRequestStore.individualChangeRequestItem.event_scope){
            
            if(data.scope_type =='scope'){
              let obj = {
                id:data.id,
                title : data.title,
                type : data.type,
                scope_type : 'scope', 
                is_deleted: data.is_deleted
              }
               this.inScopes.push(obj)
            }else if(data.scope_type == 'exclusion'){
              let obj = {
                id:data.id,
                title : data.title,
                type : data.type,
                scope_type : 'exclusion',
                is_deleted: data.is_deleted
              }
               this.outScopes.push(obj)
            }else if(data.scope_type =="assumption") {
              let obj = {
                id:data.id,
                title : data.title,
                type : data.type,
                scope_type : 'assumption',
                is_deleted: data.is_deleted
              }
              this.assumptions.push(obj)
      
            }
          }
        }
        let scopeItemsCount = EventChangeRequestStore.individualChangeRequestItem.event_scope.length;
        this.form.patchValue({
          justification_event_scope:EventChangeRequestStore.individualChangeRequestItem.event_scope[scopeItemsCount-1].justification ? EventChangeRequestStore.individualChangeRequestItem.event_scope[0].justification : ''
        }) 
       
        
        if(scopeItemsCount > 0 && EventChangeRequestStore.individualChangeRequestItem.event_scope[scopeItemsCount-1].documents.length > 0){
          this.scopeFiles = this.setDocuments(EventChangeRequestStore.individualChangeRequestItem.event_scope[scopeItemsCount-1].documents,'event-scope',true);
        }
        else{
          this.scopeFiles = [];
        }
        
        this._utilityService.detectChanges(this._cdr);
  
      }
    }
    
  }

  addInscope(){
    if(this.inScope){
      let obj = {
        scope_type : 'scope',
        type : 'new',
        title : this.inScope,
        is_deleted:0
      }
      this.inScopes.push(obj)
      this.inScope = ''
    }
  }

  addOutScope(){
    if(this.outScope){
      let obj = {
        scope_type : 'exclusion',
        type : 'new',
        title : this.outScope,
        is_deleted:0
      }
      this.outScopes.push(obj)
      this.outScope = ''
    }
  }

  addAssumption(){
    if(this.assumption){
      let obj = {
        scope_type : 'assumption',
        type : 'new',
        title : this.assumption,
        is_deleted:0
      }
      this.assumptions.push(obj)
      this.assumption = ''
    }
  }

  deleteIn(data) {
    
    let pos = this.inScopes.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.inScopes[pos].type=='existing') {
        this.inScopes[pos].is_deleted = 1
        //this.inScopes[pos].type = 'deleted'
      }
      else {
        this.inScopes.splice(pos, 1)
      }
    } 
    else
    {
      this.inScopes.splice(pos, 1)
    }
  }

  revertInScope(data)
  {
    let pos = this.inScopes.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.inScopes[pos].type=='existing') {
        this.inScopes[pos].is_deleted = 0
        //this.inScopes[pos].type = 'deleted'
      }
    } 
  }

  deleteOut(data) {
    let pos = this.outScopes.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.outScopes[pos].type=='existing') {
        this.outScopes[pos].is_deleted = 1
        //this.outScopes[pos].type = 'deleted'
      }
      else  {
        this.outScopes.splice(pos, 1)
      }
    } 
    else{
      this.outScopes.splice(pos, 1)
    }
  }

  revertOutScope(data)
  {
    let pos = this.outScopes.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.outScopes[pos].type=='existing') {
        this.outScopes[pos].is_deleted = 0
        //this.inScopes[pos].type = 'deleted'
      }
    } 
  }

  deleteAssumption(data) {
    let pos = this.assumptions.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.assumptions[pos].type=='existing') {
        this.assumptions[pos].is_deleted = 1
        //this.assumptions[pos].type = 'deleted'
      }
      else {
        this.assumptions.splice(pos, 1)
      }
    } 
    else{
      this.assumptions.splice(pos, 1)
    }
  }

  revertAssumption(data)
  {
    let pos = this.assumptions.findIndex(e => e.title == data.title)
    if (data?.id) {
      if (pos != -1 &&  this.assumptions[pos].type=='existing') {
        this.assumptions[pos].is_deleted = 0
        //this.inScopes[pos].type = 'deleted'
      }
    } 
  }

  cancel(){
    this.form.reset();
    this._eventEmitterService.dismissEventChangeReqEventScopeModal();
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
      this.processDocuments(this.scopeFiles,'event-scope');
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
    let dpos = this.scopeFiles.findIndex(e =>e.token == doc.token);
    this.scopeFiles.splice(dpos,1);
    this._utilityService.detectChanges(this._cdr);
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      
      switch(this.fileUploadType){
        case 'scope': this.scopeFiles = fileUploadPopupStore.displayFiles;
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
  
  getScopesValue(){
    let selectedScopes = []
    if(this.inScopes.length > 0){
      for(let data of this.inScopes){
         selectedScopes.push(data)
      }
    }
    if(this.outScopes.length > 0){
      for(let data of this.outScopes){
         selectedScopes.push(data)
      }
    }
    if(this.assumptions.length > 0){
      for(let data of this.assumptions){
         selectedScopes.push(data)
      }
    }
    return selectedScopes
  }

  save(close: boolean = false)
  {
    this.setorUsetFiles(true,'scope');
    AppStore.enableLoading();
    let obj = {
      scopes : this.getScopesValue(),
      justification : this.form.value.justification_event_scope,
      documents:this.editFlag ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(this.scopeFiles, 'save')
    }
    this._eventChangeRequestService.saveScope(obj,EventChangeRequestStore.selectedCRId).subscribe(res=>{
      AppStore.disableLoading();
      this.cancel();
      this._utilityService.detectChanges(this._cdr); 
    },(err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){

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
