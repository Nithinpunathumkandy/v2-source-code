import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentWorkflowService } from 'src/app/core/services/knowledge-hub/documents/document-workflow.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-document-checkin-popup',
  templateUrl: './document-checkin-popup.component.html',
  styleUrls: ['./document-checkin-popup.component.scss']
})
export class DocumentCheckinPopupComponent implements OnInit {

  documentWorkFlowStore = documentWorkFlowStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;

  checkinFileArray: any = [];

    // Form Variables
  checkinForm: FormGroup;
  checkinFormErrors: any;
  saveData: any = null;
  checkinFile = null;

  constructor(
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _documentWorkflowService: DocumentWorkflowService
  ) { }

  ngOnInit(): void {

        // Form Intialization

        this.checkinForm = this._formBuilder.group({
         
          name: [""],
          ext: [""],
          mime_type: [""],
          size: [""],
          url: [""],
          thumbnail_url: [""],
          token: [""],
        });

  }

  // *** File Upload Functions Starts Here ***

  
  //To get file details when selected
  onFileChange(event,type:string){
  
    var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
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
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null,file,true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew,temp); // Convert blob to base64 string
                },(error)=>{
                  this.assignFileUploadProgress(null,file,true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            this.assignFileUploadProgress(null,file,true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,true);
        }
      });
    }
  }

      /**
 * 
 * @param files Selected files array
 * @param type type of selected files - logo or brochure
 */
addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.checkinFileArray);
    this.checkinFileArray = result.fileUploadsArray;
    return result.files;


}
  
createImageFromBlob(image: Blob, fileDetails) {

    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      fileDetails['preview'] = logo_url;
      if(fileDetails != null){
        this._documentWorkflowService.setCheckinFile(fileDetails,logo_url);
      }
      this._utilityService.detectChanges(this._cdr);
    }, false);
  
    if (image) {
       reader.readAsDataURL(image);
    }
  

}
/**
 * Deletes a Document
 * @param token Token of Document
 */
removeBrochure() {
  documentWorkFlowStore.unsetFileDetails();
  this._utilityService.detectChanges(this._cdr);
}

checkExtension(ext, extType) {
  var res = this._imageService.checkFileExtensions(ext, extType);
  return res;
}
  
      /**
  * 
  * @param progress File Upload Progress
  * @param file Selected File
  * @param success Boolean value whether file upload success 
  */
 assignFileUploadProgress(progress, file,success = false) {
   
 
   let temporaryFileUploadsArray = this.checkinFileArray;
    this.checkinFileArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  


 }

 checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
 }

  
 checkFileStatus() {
  if (documentWorkFlowStore.getCheckinFile)
    return false;
  else
    return true;
}

  // *** File Upload Functions Ends Here ***



  saveFiles(close:boolean=false){
    this.checkinFormErrors=null;
    if (documentWorkFlowStore.getCheckinFile) {

      this.createCheckinFile()
      
      let save
      AppStore.enableLoading();
      save = this._documentWorkflowService.checkinDocument(this.saveData)  
      
      save.subscribe(res => {

        this.resetForm()
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.checkinFormErrors = err.error.errors

          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
        }
      });
    }
  }

    
  createCheckinFile() {

    this.checkinFile = documentWorkFlowStore.getCheckinFile;

    this.saveData = {
      "name": this.checkinFile?.name?this.checkinFile.name:'',
      "ext": this.checkinFile?.ext?this.checkinFile.ext:'',
      "mime_type": this.checkinFile?.mime_type?this.checkinFile.mime_type:'',
      "size": this.checkinFile?.size?this.checkinFile.size:null,
      "url": this.checkinFile?.url?this.checkinFile.url:'',
      "thumbnail_url": this.checkinFile?.thumbnail_url?this.checkinFile.thumbnail_url:'',
      "token": this.checkinFile?.token?this.checkinFile.token:'',
    }

  
    }
  
  resetForm() {
      documentWorkFlowStore.clearCheckinFile();
      this.checkinFileArray = [];
      this.checkinForm.reset();
      this.checkinForm.pristine;
      this.checkinFormErrors = null;
    }
  
  
    closeFormModal(){
      this.resetForm();
      this._eventEmitterService.dismissCheckinModal()
    }


}
