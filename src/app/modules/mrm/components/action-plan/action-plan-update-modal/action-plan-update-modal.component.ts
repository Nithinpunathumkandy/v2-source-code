import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MeetingActionPlanStatusService } from 'src/app/core/services/masters/mrm/meeting-action-plan-status/meeting-action-plan-status.service';
import { ActionPlansService } from 'src/app/core/services/mrm/action-plans/action-plans.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-action-plan-update-modal',
  templateUrl: './action-plan-update-modal.component.html',
  styleUrls: ['./action-plan-update-modal.component.scss']
})
export class ActionPlanUpdateModalComponent implements OnInit,OnDestroy {

  @Input('source') source: any;
  @Input('completion') completion: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;

  AppStore = AppStore;
  ActionPlansStore = ActionPlansStore;
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  loader:boolean=false;
  statuses: any = [];
  fileUploadsArray = []; //doc
  percentages: string[] = [];

  fileUploadPopupSubscriptionEvent: any = null;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _actionPlansService: ActionPlansService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _actionPlanStatusService: MeetingActionPlanStatusService,
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({

      percentage: [null, Validators.required],
      meeting_action_plan_status_id: [null, Validators.required],
      comment: [''],
      documents: [[], '']
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})

    this.getStatus();
    this.setPercentageData();

    if (this.source)
      this.setFormData(this.source);
  }

  setPercentageData() {
    for (let i = 0; i <= 100; i++) {
      this.percentages.push(i + '%');
      i = i + 4;
    }
  }

  setStatus(statusId) {
    if (statusId == 3||statusId == 5)
      this.form.controls['percentage'].setValue(100 + '%');
    else if (statusId == 2)
      this.form.controls['percentage'].setValue(10 + '%');
    else
      this.form.controls['percentage'].reset();
  }

  setPercentage(percentage) {
    if (percentage == '100%')
      this.form.controls['meeting_action_plan_status_id'].setValue(3);
    else if (percentage == '0%')
      this.form.controls['meeting_action_plan_status_id'].setValue(1);
    else
      this.form.controls['meeting_action_plan_status_id'].setValue(2);
  }

  setFormData(data) {
    
    this.form.patchValue({
      percentage: data.completion ? data.completion + '%' : '0%',
      meeting_action_plan_status_id: data?.meeting_action_plan_status ? data.meeting_action_plan_status.id : 1,
    })
  }

  getStatus() {
    if (!(this.statuses.length > 0))

      this._actionPlanStatusService.getAllItems().subscribe(res => {
        if(res){
          this.loader=true;

          for (let i of res.data) {

            if (i.type == "new" || i.type == "wip" || i.type == "resolved" || i.type == "closed") {
              this.statuses.push(i);
            }
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
    this.clearCommonFilePopupDocuments();
  }

  cancel() {
    this.closeFormModal();
    this.loader=false;
  }

  closeFormModal(close?) {
    this._eventEmitterService.dismissActionPlanUpdateModal(close);
  }

  checkForFileUploadsScrollbar() {//doc-add scrollbar function
    if (ActionPlansStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  onFileChange(event, type: string) {// doc-add  file change function
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams)
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
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                    this.createImageFromBlob(prew, temp, type);
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

  checkAcceptFileTypes(type) {// doc-add
    return this._imageService.getAcceptFileTypes(type);
  }

  checkLogoIsUploading() {// doc-add  Check if logo is being uploaded
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  createImageFromBlob(image: Blob, imageDetails, type) {//doc-add imageblob function
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._actionPlansService.setDocumentDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  assignFileUploadProgress(progress, file, success = false) {// doc-add
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  addItemsToFileUploadProgressArray(files, type) {// doc-add
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  checkExtension(ext, extType) {//doc-add
    return this._imageService.checkFileExtensions(ext, extType)
  }

  	// *Common  File Upload/Attach Modal Functions Starts Here

	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

	// setDocuments(documents) {
	// 	let khDocuments = [];
	// 	documents.forEach(element => {

	// 		if (element.document_id) {
	// 			element.kh_document.versions.forEach(innerElement => {

	// 				if (innerElement.is_latest) {

	// 					khDocuments.push({
	// 						...innerElement,
	// 						'is_kh_document': true
	// 					})
	// 					fileUploadPopupStore.setUpdateFileArray({
	// 						'updateId': element.id,
	// 						...innerElement

	// 					})
	// 				}

	// 			});
	// 		}
	// 		else {
	// 			if (element && element.token) {
	// 				var purl = this._meetingPlanFileService.getThumbnailPreview('meeting-plan-document', element.token)
	// 				var lDetails = {
	// 					name: element.title,
	// 					ext: element.ext,
	// 					size: element.size,
	// 					url: element.url,
	// 					token: element.token,
	// 					thumbnail_url: element.thumbnail_url,
	// 					preview: purl,
	// 					id: element.id,
	// 					'is_kh_document': false,
	// 				}
	// 			}
        
	// 			this._fileUploadPopupService.setSystemFile(lDetails, purl)

	// 		}

	// 	});

	// 	fileUploadPopupStore.setKHFile(khDocuments)
	// 	let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]

	// 	fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
	// }

	openFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
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
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
				this._utilityService.detectChanges(this._cdr)
			}, 200);
		}, 100);
	}

	enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

  createImageUrl(type,token) {
    return this._documentFileService.getThumbnailPreview(type, token);
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

	// *Common  File Upload/Attach Modal Functions Ends Here

  getSaveData() {

    this.saveData = {
      percentage: this.form.value.percentage ? this.form.value.percentage.slice(0, -1) : '',
      meeting_action_plan_status_id: this.form.value.meeting_action_plan_status_id ? this.form.value.meeting_action_plan_status_id : null,
      comment: this.form.value.comment ? this.form.value.comment : '',
      // documents: ActionPlansStore.docDetails,
    }
    if (this.source.id) {
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

      if (this.form.value) {
        save = this._actionPlansService.updateProgressItem(this.source.id, this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm();
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (close) this.closeFormModal(close);
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
    this.loader=false;
    
    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

}
