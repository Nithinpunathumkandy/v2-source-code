import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { UtilityService } from '../../services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { AppStore } from 'src/app/stores/app.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
declare var $: any;
@Component({
  selector: 'app-file-upload-popup',
  templateUrl: './file-upload-popup.component.html',
  styleUrls: ['./file-upload-popup.component.scss']
})
export class FileUploadPopupComponent implements OnInit , OnDestroy{
  @Input('source') source: any;
  @Input('system') system: boolean=true;
  @Input('khEnabled')khEnabled:boolean=true;

  @ViewChild("systemFileUploadArea", { static: false }) systemFileUploadArea: ElementRef;

  OrganizationModulesStore = OrganizationModulesStore;
  DocumentsStore = DocumentsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore=fileUploadPopupStore;
  DocumentTypeMasterStore=DocumentTypeMasterStore;
  AppStore = AppStore;
  moduleEnabled:boolean;
  folderClicked:boolean=false;
  breadCrumbData:any;
  documentTypeId:number;
  documentEmptyList = "no_document"
  systemFileArray = [];
  searchText = ' ';
  selectedTab:string;
  selectedDocuments=[];
  disableKHSelection:boolean=false
  disableSystemFileSelection:boolean=false

  selectAll:boolean = false;

  constructor(
    private documentsService: DocumentsService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService:HumanCapitalService,
    private _documentFileService: DocumentFileService,
    private _helperService: HelperServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventEmitterService:EventEmitterService,
    private _documentTypeService: DocumentTypesService,
  ) { }

  ngOnInit(): void {

    this.selectedDocuments = JSON.parse(JSON.stringify(fileUploadPopupStore.getKHFiles));

    this.setRootData()
    this.moduleCheck()
    this.pageChange(1,false)
  }
  pageChange(newPage: number = null,folderPagination) {
    DocumentsStore.itemsPerPage = 15;
    if (newPage && !folderPagination) { 
     DocumentsStore.setCurrentPage(newPage);
    DocumentsStore.setRootCurrentPage(newPage)
    }else
    DocumentsStore.setCurrentPage(newPage);
    
      this.listDocuments()
    
  }
  // * Listing Different Document Types
  listDocumentTypes() {
    this._documentTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })

  }

  listDocuments(){

    let param=`/public?is_published=true&department_ids=${this.source?.department_ids? this.source?.department_ids:''}&`;

    this.documentsService.getAllItems(param).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setRootData(){
    this.folderClicked=false;
    this.breadCrumbData=null;
    this.listDocumentTypes();
  }

  clearSearchBar(){
    DocumentsStore.searchText = '';
    this.pageChange(1,false);
  }


  // * To Check if KH Module is Enabled
  moduleCheck() {
    this.moduleEnabled=OrganizationModulesStore.checkOrganizationModules(700)
    if(this.moduleEnabled)
    this.setTab('kh')
  }
  createImageUrl(type,token) {
    if(type=='user-profile-picture'){
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }else{
      return this._documentFileService.getThumbnailPreview(type, token);
    }
  }
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
  selectDocument(document) {
    
    if(!fileUploadPopupStore.singleFileUpload){
      if(fileUploadPopupStore.verificationId){
        var pos = this.selectedDocuments.findIndex(e=>((e.token == document.token) && (e.verificationId == fileUploadPopupStore.verificationId)));
        if(pos != -1)
            this.selectedDocuments.splice(pos,1);
        else
            this.selectedDocuments.push({
              'is_kh_document':true,
              'verificationId':fileUploadPopupStore.verificationId,
                ...document
            });
      }
      else{
        var pos = this.selectedDocuments.findIndex(e=>e.token == document.token);
        if(pos != -1)
            this.selectedDocuments.splice(pos,1);
        else
            this.selectedDocuments.push({
              'is_kh_document':true,
              'verificationId':fileUploadPopupStore.verificationId,
                ...document
            });
      }
    }else{
      fileUploadPopupStore.clearSystemFiles();
      this.selectedDocuments = [{
        'is_kh_document':true,
        'verificationId':fileUploadPopupStore.verificationId,
        ...document
      }]
      // this.singleFileUploadValidation()
    }

  }

  submitDocuments(){
      this._fileUploadPopupService.setKHFile(this.selectedDocuments);
      this._fileUploadPopupService.submitDocuments()
    
    this.closePopup()
  }

  closePopup(){
    DocumentsStore.searchText=null;
    DocumentsStore.departmentId='';
    setTimeout(() => { 
      fileUploadPopupStore.listStyle='grid';
      DocumentsStore.unsetDocuments();
    }, 500);
    this._eventEmitterService.dismissFileUploadPopup();
    this._eventEmitterService.setFileUploadPreviewFocus();
  }

  cancel(){
    this.closePopup();
    this.selectedDocuments=[];
    // fileUploadPopupStore.clearKHFiles();
    // fileUploadPopupStore.clearSystemFiles();
    this.listDocuments()
  }

  checkSelectedStatus(id: number) {
    var pos = null;

    if(fileUploadPopupStore.verificationId){
      pos = this.selectedDocuments.findIndex(e => ((e.id == id ||e.document_id==id) && (e.verificationId == fileUploadPopupStore.verificationId)));
    }
    else{
      pos = this.selectedDocuments.findIndex(e => e.id == id ||e.document_id==id);
    }
    if (pos != -1) return true;
    else return false;


  }


  goToFolder(documentTypeId,title){

    this.documentTypeId=documentTypeId;
    this.breadCrumbData={
      documentTypeId:documentTypeId,
      title:title
    }
    this.folderClicked=true;
    DocumentsStore.unsetDocuments();
    DocumentsStore.currentPage=1;
    let param=`?document_type_ids=${documentTypeId}&department_ids=${this.source?.department_ids? this.source?.department_ids:''}&`;

    this.documentsService.getAllItems(param).subscribe((res) => {
      DocumentsStore.documentId = null;
       this._utilityService.detectChanges(this._cdr);
    });



  }

  // *** File Upload Functions Starts Here ***

 onFileChange(event,type:string){
  
    var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles,elem=>{
        const file = elem;
        if(this._imageService.validateFile(file,type)){
          const formData = new FormData();
          formData.append('file',file);
          var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
          this._imageService.uploadImageWithProgress(formData,typeParams) // Upload file to temporary storage
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
           
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if(uploadEvent.loaded){
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress,file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                $("#file").val('');
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null,file,true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew,temp,type); // Convert blob to base64 string
                },(error)=>{
                  $("#file").val('');
                  this.assignFileUploadProgress(null,file,true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            $("#file").val('');
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            this.assignFileUploadProgress(null,file,true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          $("#file").val('');
          this.assignFileUploadProgress(null,file,true);
        }
      });
    }
  }

addItemsToFileUploadProgressArray(files, type) {

    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.systemFileArray);
    this.systemFileArray = result.fileUploadsArray;
    return result.files;
    
}
  
createImageFromBlob(image: Blob, fileDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      fileDetails['preview'] = logo_url;
      fileDetails['verificationId']=fileUploadPopupStore.verificationId
      if (fileDetails != null) {
        if(fileUploadPopupStore.singleFileUpload){
          fileUploadPopupStore.clearKHFiles();
          this.selectedDocuments=[]
        }
        this._fileUploadPopupService.setSystemFile(fileDetails,logo_url);
      }
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);
  
    if (image) {
       reader.readAsDataURL(image);
    }
}

removeBrochure(type,token) {
  fileUploadPopupStore.unsetFileDetails(type, token);
  this._utilityService.detectChanges(this._cdr);
}

 assignFileUploadProgress(progress, file, success = false) {
   

   let temporaryFileUploadsArray = this.systemFileArray;
    this.systemFileArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
 
 }

 checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
 }
 checkFileIsUploading(){
  return this._helperService.checkFileisUploaded(this.systemFileArray);
}


  checkForFileUploadsScrollbar() {

    if(fileUploadPopupStore.getSystemFile.length >= 5 || this.systemFileArray.length > 5){
      $(this.systemFileUploadArea?.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.systemFileUploadArea?.nativeElement).mCustomScrollbar("destroy");
      }
    
  }

  // *** File Upload Functions Ends Here ***

  setListStyle(type) {
    DocumentsStore.searchText=null;
    fileUploadPopupStore.listStyle = type;
  }

  searchData() {
    this.listDocuments()
  }
  setTab(type){
    this.selectedTab=type;
  }

  checkCondition(){

    var returnClass

    if(!this.khEnabled){
      return returnClass='tab-pane active show'
    }

    if(!this.moduleEnabled){
      return returnClass='tab-pane active show'
    }
    else {
      return returnClass='tab-pane fade'
    }

  }

  ngOnDestroy(){
    DocumentsStore.searchText=null;
    this.selectedDocuments=[];
    DocumentsStore.unsetDocuments();
    DocumentsStore.departmentId='';
    fileUploadPopupStore.verificationId=null
  }

}
