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
import { AssetManagementService } from 'src/app/core/services/asset-management/asset-management-service/asset-management.service';

@Component({
  selector: 'app-asset-maintenance-review',
  templateUrl: './asset-maintenance-review.component.html',
  styleUrls: ['./asset-maintenance-review.component.scss']
})
export class AssetMaintenanceReviewComponent implements OnInit {
  @Input('source') scheduleSource: any;
  AssetMaintenanceStatusesMasterStore = AssetMaintenanceStatusesMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  scheduleForm: FormGroup;
  AppStore = AppStore;
  formErrors = null;
  AssetMaintenanceStore = AssetMaintenanceStore;
  fileUploadsArray: any = [];

  constructor(private _assetMaintenanceStatusesService: AssetMaintenanceStatusesService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _assetMaintenanceService: AssetMaintenanceService,
    private _helperService: HelperServiceService,
    private _assetManagementService: AssetManagementService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {


    this.scheduleForm = this._formBuilder.group({
      asset_maintenance_status_id: [null,[Validators.required]],
      comment: [''],
      actual_date: [null],
      documents: []
    })
    if (this.scheduleSource.values?.status) {
      this.scheduleForm.patchValue({
        asset_maintenance_status_id: this.scheduleSource.values?.status,
        //comment:this.scheduleSource.values?.comment,
      })
    }
    //console.log(this.scheduleSource.values.documents)
    // if(this.scheduleSource.values.documents.length)
    // {
    //   this.setDocuments(this.scheduleSource.values.documents);
    // }

    this.getStatuses();
  }



  getStatuses() {
    this._assetMaintenanceStatusesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchStatuses(e) {
    this._assetMaintenanceStatusesService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // setDocuments(documents) {
	// 	//console.log(documents, 'documents enter in setdoc');

	// 	let khDocuments = [];
	// 	documents.forEach(element => {

	// 	//	console.log(element, 'element');
	// 		if (element.document_id) {
	// 			element?.kh_document?.versions?.forEach(innerElement => {

	// 				if (innerElement.is_latest) {
	// 					//console.log('enter in kh push');
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
	// 				var purl = this._assetManagementService.getThumbnailPreview('maintenance-schedule', element.token)
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
	// 	AssetMaintenanceStore.setDocumentFile(khDocuments)
	// 	let submitedDocuments = [...AssetMaintenanceStore.getKHFiles, ...AssetMaintenanceStore.getSystemFile]
	// 	AssetMaintenanceStore.setFilestoDisplay(submitedDocuments);

		
	// }

  isCompleted() {
    let pos = AssetMaintenanceStatusesMasterStore.allItems.findIndex(e => e.id == this.scheduleForm.value.asset_maintenance_status_id)
    if (AssetMaintenanceStatusesMasterStore.allItems[pos]?.type == 'completed')
      return true
    else
      return false;

  }


  clear(type) {
    if (type == 'start_date') {
      this.scheduleForm.patchValue({
        actual_start_date: null
      })
    }
    if (type == 'end_date') {
      this.scheduleForm.patchValue({
        actual_end_date: null
      })
    }
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    this.formErrors = null;
    let saveData = {
      asset_maintenance_status_id: this.scheduleForm.value.asset_maintenance_status_id,
      comment: this.scheduleForm.value.comment,
      actual_date: this.scheduleForm.value.actual_date ? this._helperService.processDate(this.scheduleForm.value.actual_date, 'join') : null,
      documents: AssetMaintenanceStore.scheduleDocDetails
    }
    //console.log(saveData);
    this._assetMaintenanceService.updateScheduleReview(this.scheduleSource.maintenance_id, this.scheduleSource.schedule_id, saveData).subscribe(res => {
      AppStore.disableLoading();

      this._utilityService.detectChanges(this._cdr);
      if (close) {
        this.closeFormModal();
      }
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
      else {
        this.closeFormModal();
      }
    })
  }


  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
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
        this._assetMaintenanceService.setScheduleDocumentDetails(imageDetails, logo_url);

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


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    AssetMaintenanceStore.unsetScheduleDocumentDetails(token);
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    this.scheduleForm.reset();
    this.fileUploadsArray = [];
    AssetMaintenanceStore.clearDocFiles();
    AssetMaintenanceStore.clearSystemFiles();
    this._eventEmitterService.dismissMaintenanceScheduleReviewModal();

  }



}
