import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-add-incident-evidence',
  templateUrl: './add-incident-evidence.component.html',
  styleUrls: ['./add-incident-evidence.component.scss']
})
export class AddIncidentEvidenceComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  AppStore = AppStore
  IncidentInvestigationStore = IncidentInvestigationStore
  fileUploadsArray = [];
  IncidentStore = IncidentStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  imageData: any;

  constructor( private _helperService: HelperServiceService, private _imageService: ImageServiceService,
    private _utilityService: UtilityService,private _incidentService : IncidentService, private _investigationService : InvestigationService,
    private _cdr: ChangeDetectorRef,private _incidentFileService : IncidentFileService,

    ) { }

  ngOnInit(): void {
  }

  cancel(){

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
  
  
    /**
     * removing document file from the selected list
     * @param token -image token
     */
    removeDocument(token) {
      IncidentInvestigationStore.unsetDocumentDetails(token);
      this.checkForFileUploadsScrollbar();
      for (let i = 0; i < IncidentInvestigationStore.investigationIncidentObjects.documents.length; i++) {
        if( token == IncidentInvestigationStore.investigationIncidentObjects.documents[i].token ){
          IncidentInvestigationStore.investigationIncidentObjects.documents.splice(i,1)
        }
        
      }
      this._utilityService.detectChanges(this._cdr);
    }
    // file change function
  
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
                    $("#file").val('');
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
        this.imageData = imageDetails
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          var logo_url = reader.result;
    
          imageDetails['preview'] = logo_url;
          if (imageDetails != null)
            this._investigationService.setDocumentDetails(imageDetails, type);
            IncidentInvestigationStore.investigationIncidentObjects.documents.push(this.imageData)
          this.checkForFileUploadsScrollbar();
          this._utilityService.detectChanges(this._cdr);
        }, false);
    
        if (image) {
          reader.readAsDataURL(image);
        }
      }
  
        // scrollbar function
    checkForFileUploadsScrollbar() {
  
      if (IncidentInvestigationStore.investigationIncidentObjects.documents.length > 5 || this.fileUploadsArray.length > 5) {
        $(this.uploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        if(IncidentInvestigationStore.investigationIncidentObjects.documents.length > 0) $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }
  
    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }
  
    checkAcceptFileTypes(type){
      return this._imageService.getAcceptFileTypes(type); 
    }
  
     // extension check function
     checkExtension(ext, extType) {
  
      return this._imageService.checkFileExtensions(ext, extType)
  
    }

        // Returns default image
        getDefaultImage(type) {
          return this._imageService.getDefaultImageUrl(type);
        }
      
        // Returns image url according to type and token
        createImageUrl(type, token) {
          return this._incidentFileService.getThumbnailPreview(type, token);
        }
    
        createImagePreview(type, token) {
          return this._imageService.getThumbnailPreview(type, token)
        }

    save(){
      if(this.imageData){
        // AppStore.enableLoading();
        // IncidentInvestigationStore.investigationIncidentObjects.documents.push(this.imageData)
        AppStore.enableLoading();
        setTimeout(() => {
          AppStore.disableLoading()
        }, 1000);
        this._utilityService.showSuccessMessage('success', 'evidence_add');
        this.imageData = null;
      }
      IncidentInvestigationStore.clearDocumentDetails();

      $("#file").val('');

     

    }

}
