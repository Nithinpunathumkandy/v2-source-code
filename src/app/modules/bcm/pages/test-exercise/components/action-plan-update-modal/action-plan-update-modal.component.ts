import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { TestAndExerciseActionPlanStatusService } from 'src/app/core/services/masters/bcm/test-and-exercise-action-plan-status/test-and-exercise-action-plan-status.service';
import { TestAndExerciseStatusesService } from 'src/app/core/services/masters/bcm/test-and-exercise-statuses/test-and-exercise-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { TestActionPlanStore } from 'src/app/stores/bcm/test-exercise/test-exercise-action-plan-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { TestAndExerciseActionPlanStatusMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-action-plan-status.store';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-action-plan-update-modal',
  templateUrl: './action-plan-update-modal.component.html',
  styleUrls: ['./action-plan-update-modal.component.scss']
})
export class ActionPlanUpdateModalComponent implements OnInit {

  @Input('source') source;
  @Input('completion') completion: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;

  AppStore = AppStore;
  //ActionPlansStore = ActionPlansStore;
  ActionPlansStore = TestActionPlanStore
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  loader:boolean=false;
  statuses: any = [];
  fileUploadsArray = []; //doc
  percentages: string[] = [];
  percentage = [];
  fileUploadPopupSubscriptionEvent: any = null;
  TestAndExerciseActionPlanStatusMasterStore = TestAndExerciseActionPlanStatusMasterStore

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _actionPlansService: TestAndExerciseService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _testExcerciseStatusService: TestAndExerciseStatusesService,
    private _testAndExerciseActionPlanStatusService: TestAndExerciseActionPlanStatusService,
    
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({

      percentage: [null, Validators.required],
      test_and_exercise_action_plan_status_id: [null, Validators.required],
      comment: [''],
      documents: [[], '']
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})
    for (let i = 0; i <= 100; i = i + 5) {
      this.percentage.push(i);
    }
    if(this.source)
      this.setFormData(this.source);
      this.getUpdateModalDetails()
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
      this.form.controls['test_and_exercise_action_plan_status_id'].setValue(3);
    else if (percentage == '0%')
      this.form.controls['test_and_exercise_action_plan_status_id'].setValue(1);
    else
      this.form.controls['test_and_exercise_action_plan_status_id'].setValue(2);
 
  }

  setFormData(data) {
    
    this.form.patchValue({
      percentage: data.completion ? data.completion + '%' : '0%',
      test_and_exercise_action_plan_status_id: data?.status ? data.status.id : 1,
    })
  }

  getStatus() {
    this._testAndExerciseActionPlanStatusService.getItems(false, null, true).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);

    })
  }
  checkForStatus(status) {
    if (status == 1) {
      this.form.patchValue({
        percentage: 0
      })
    }
    else if (status == 3) {
      this.form.patchValue({
        percentage: 100
      })

    }
    else {
      this.form.patchValue({
        percentage: null
      })
    }
  }
  checkForPercentage(event) {
    let percentage = event
    if (percentage == 0) {
      this.form.patchValue({
        test_and_exercise_action_plan_status_id: 1
      })

    }
    else if (percentage == 100) {
      this.form.patchValue({
        test_and_exercise_action_plan_status_id: 3
      })

    }
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
      console.log(imageDetails,type)
        //this._actionPlansService.setDocumentDetails(imageDetails, type);
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

    let saveData = {
      percentage: this.form.value.percentage ? this.form.value.percentage : '',
      test_and_exercise_action_plan_status_id: this.form.value.test_and_exercise_action_plan_status_id ? this.form.value.test_and_exercise_action_plan_status_id : null,
      comment: this.form.value.comment ? this.form.value.comment : '',
      // documents: this.form.value.documents ? this.form.value.documents : '',
    }
   
			saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
      return saveData;
  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      //this.getSaveData();
      if (this.form.value) {
        save = this._actionPlansService.updateActionPlanStatus(this.source.id,this.getSaveData());
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
  getUpdateModalDetails() {
    //this.FindingCorrectiveActionStore.clearupdateDocumentDetails();
    this.getStatus();
    let getData: any =[];
    this._actionPlansService.getActionPlanData(this.source.id).subscribe(res=>{
      getData = res;
      this.form.patchValue({
        percentage:  getData?.action_plan_updates[getData?.action_plan_updates?.length-1]?.percentage ? getData?.action_plan_updates[getData?.action_plan_updates?.length-1]?.percentage : 0,
        test_and_exercise_action_plan_status_id: getData?.action_plan_updates[getData?.action_plan_updates?.length-1]?.test_and_exercise_action_plan_status_id ? (typeof(getData?.action_plan_updates[getData?.action_plan_updates?.length-1]?.test_and_exercise_action_plan_status_id) == "string" ? parseInt(getData?.action_plan_updates[getData?.action_plan_updates?.length-1]?.test_and_exercise_action_plan_status_id.toString()) : getData?.action_plan_updates[getData?.action_plan_updates?.length-1]?.test_and_exercise_action_plan_status_id) : null,
      })
      this._utilityService.detectChanges(this._cdr);
    })
   
    this._utilityService.detectChanges(this._cdr);
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
