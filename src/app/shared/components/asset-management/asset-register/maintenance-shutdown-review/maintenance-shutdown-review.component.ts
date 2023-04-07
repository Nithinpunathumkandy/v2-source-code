import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetMaintenanceService } from 'src/app/core/services/asset-management/asset-register/asset-maintenance/asset-maintenance.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AssetMaintenanceStatusesService } from 'src/app/core/services/masters/asset-management/asset-maintenance-statuses/asset-maintenance-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';
import { AssetMaintenanceStatusesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-statuses';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';



@Component({
  selector: 'app-maintenance-shutdown-review',
  templateUrl: './maintenance-shutdown-review.component.html',
  styleUrls: ['./maintenance-shutdown-review.component.scss']
})
export class MaintenanceShutdownReviewComponent implements OnInit {
  @Input ('source') shutdownSource:any;
  AssetMaintenanceStatusesMasterStore = AssetMaintenanceStatusesMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  shutdownForm:FormGroup;
  AppStore = AppStore;
  formErrors = null;
  AssetMaintenanceStore = AssetMaintenanceStore;
  fileUploadsArray: any = [];

  constructor(private _assetMaintenanceStatusesService:AssetMaintenanceStatusesService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _formBuilder:FormBuilder,
    private _assetMaintenanceService:AssetMaintenanceService,
    private _helperService:HelperServiceService,
    private _imageService:ImageServiceService,
    private _eventEmitterService:EventEmitterService) { }

  ngOnInit(): void {
    this.getStatuses();
    this.shutdownForm = this._formBuilder.group({
      asset_maintenance_status_id: [null,[Validators.required]],
      comment: [''],
      actual_start_date: [null],
      actual_end_date: [null],
      documents:[]
    })
    if (this.shutdownSource.values?.status) {
      //console.log(this.shutdownSource.values)
      this.shutdownForm.patchValue({
        asset_maintenance_status_id: this.shutdownSource.values?.status,
        // comment:this.shutdownSource.values?.comment,
        // actual_start_date:this.shutdownSource.values?.actual_start_date,
        // actual_end_date:this.shutdownSource.values?.actual_end_date,
      })
    }
    // if(this.shutdownSource.values.documents.length)
    // {
    //   this.setDocuments(this.shutdownSource.values.documents);
    // }
  }

  

  getStatuses(){
    this._assetMaintenanceStatusesService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchStatuses(e){
    this._assetMaintenanceStatusesService.getItems(false,'q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  clear(type) {
		if (type == 'start_date') {
			this.shutdownForm.patchValue({
				actual_start_date: null
			})
		}
    if (type == 'end_date') {
			this.shutdownForm.patchValue({
				actual_end_date: null
			})
		}
  }

  save(close:boolean=false){
    AppStore.enableLoading();
    this.formErrors = null;
    let saveData = {
      asset_maintenance_status_id:this.shutdownForm.value.asset_maintenance_status_id,
      comment: this.shutdownForm.value.comment,
      actual_start_date: this.shutdownForm.value.actual_start_date?this._helperService.processDate(this.shutdownForm.value.actual_start_date,'join'):null,
      actual_end_date: this.shutdownForm.value.actual_end_date?this._helperService.processDate(this.shutdownForm.value.actual_end_date,'join'):null,
      documents:AssetMaintenanceStore.shutdownDocDetails
    }
    //console.log(saveData)
    this._assetMaintenanceService.updateShutdownReview(this.shutdownSource.maintenance_id,this.shutdownSource.schedule_id,this.shutdownSource.shutdown_id,saveData).subscribe(res=>{
      AppStore.disableLoading();
      
      this._utilityService.detectChanges(this._cdr);
      if(close){
        this.closeFormModal();
      }
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
      else{
        this.closeFormModal();
      }
    })
  }

  
  onFileChange(event,type:string){
    var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles,type); // Assign Files to Multiple File Uploads Array
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
                  this.createImageFromBlob(prew,temp,type); // Convert blob to base64 string
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

  
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._assetMaintenanceService.setShutdownDocumentDetails(imageDetails, logo_url);

      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
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

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType);
  }

  // setDocuments(documents) {
	// 	//console.log(documents, 'documents enter in setdoc');

	// 	let khDocuments = [];
	// 	documents.forEach(element => {

		
	// 		if (element.document_id) {
	// 			element?.kh_document?.versions?.forEach(innerElement => {

	// 				if (innerElement.is_latest) {
					
	// 					khDocuments.push({
	// 						...innerElement,
	// 						'is_kh_document': true
	// 					})
	// 					AssetMaintenanceStore.setUpdateFileArray({
	// 						'updateId': element.id,
	// 						...innerElement

	// 					})
	// 				}

	// 			});
	// 		}
	// 		else {
	// 			if (element && element.token) {
	// 				var purl = this._assetManagementService.getThumbnailPreview('maintenance-shutdown', element.token)
	// 				var lDetails = {
	// 					created_at: element.created_at,
	// 					created_by: element.created_by,
	// 					updated_at: element.updated_at,
	// 					updated_by: element.updated_by,
	// 					name: element.title,
	// 					ext: element.ext,
	// 					size: element.size,
	// 					url: element.url,
	// 					token: element.token,
	// 					thumbnail_url: element.thumbnail_url,
	// 					preview: purl,
	// 					id: element.id,
	// 					asset_id: element.asset_id,
	// 					'is_kh_document': false,
	// 				}
	// 			}
	// 			this._assetMaintenanceService.setSystemFile(lDetails, purl);

	// 		}

	// 	});
	// 	AssetMaintenanceStore.setDocumentShutdownFile(khDocuments)
	// 	let submitedDocuments = [...AssetMaintenanceStore.getShutDownFiles, ...AssetMaintenanceStore.getSystemSutdownFile]
	// 	AssetMaintenanceStore.setShutDownFilestoDisplay(submitedDocuments);

		
	// }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    AssetMaintenanceStore.unsetShutdownDocumentDetails(token);
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    this.shutdownForm.reset();
    AssetMaintenanceStore.clearDocFiles();
    AssetMaintenanceStore.clearSystemFiles();
    this.fileUploadsArray = [];
    this._eventEmitterService.dismissMaintenanceShutdownReviewModal();

  }


}
