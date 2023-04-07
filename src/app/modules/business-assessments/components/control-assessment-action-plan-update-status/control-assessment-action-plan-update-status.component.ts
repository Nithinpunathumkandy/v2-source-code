import { HttpErrorResponse} from '@angular/common/http';
import { ChangeDetectorRef, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlAssessmentActionPlanService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-action-plan/control-assessment-action-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ControlAssessmentActionPlanStatusService } from 'src/app/core/services/masters/business-assessment/control-assessment-action-plan-status/control-assessment-action-plan-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CAActionPlanStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-action-plan-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-control-assessment-action-plan-update-status',
  templateUrl: './control-assessment-action-plan-update-status.component.html',
  styleUrls: ['./control-assessment-action-plan-update-status.component.scss']
})
export class ControlAssessmentActionPlanUpdateStatusComponent implements OnInit {
  @Input('source') source: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  form: FormGroup;
  formErrors: any;
  saveData: any = null;

  AppStore = AppStore;
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  CAActionPlanStore=CAActionPlanStore;

  loader: boolean = false;
  statuses: any = [];
  fileUploadsArray = []; //doc
  percentages: string[] = [];

  fileUploadPopupSubscriptionEvent: any = null;
  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _controlAssessmentActionPlanService:ControlAssessmentActionPlanService,
    private _controlAssessmentActionPlanStatusService: ControlAssessmentActionPlanStatusService,
    private _imageService:ImageServiceService
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({

      percentage: [null, Validators.required],
      control_assessment_action_plan_status_id: [null, Validators.required],
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
    if (statusId == 3 || statusId == 5)
      this.form.controls['percentage'].setValue(100 + '%');
    else
      this.form.controls['percentage'].reset();
  }

  setPercentage(percentage) {
    if (percentage == '100%')
      this.form.controls['control_assessment_action_plan_status_id'].setValue(3);
    else if (percentage == '0%')
      this.form.controls['control_assessment_action_plan_status_id'].setValue(1);
    else
      this.form.controls['control_assessment_action_plan_status_id'].setValue(2);
  }

  setFormData(data) {

    this.form.patchValue({
      percentage: data.completion ? data.completion + '%' : '0%',
      control_assessment_action_plan_status_id: data?.status ? data.status.id : 1,
    })
  }

  getStatus() {
    if (!(this.statuses.length > 0))

      this._controlAssessmentActionPlanStatusService.getItems().subscribe(res => {
        if (res) {
          this.loader = true;
          for (let i of res.data) {
            this.statuses.push(i);
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
    this.loader = false;
  }

  closeFormModal() {
    this._eventEmitterService.dismissControlAssessmentUpdateActionPlanModal();
  }

  checkForFileUploadsScrollbar() {//doc-add scrollbar function
    if (CAActionPlanStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
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

  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

     // extension check function
     checkExtension(ext, extType) {

      return this._imageService.checkFileExtensions(ext, extType)
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
      control_assessment_action_plan_status_id: this.form.value.control_assessment_action_plan_status_id ? this.form.value.control_assessment_action_plan_status_id : null,
      comment: this.form.value.comment ? this.form.value.comment : '',
    }
    if (this.source.id) {
      this.saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
    } else {
      this.saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');

    }
  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      this.getSaveData();

      if (this.form.value) {
        save = this._controlAssessmentActionPlanService.updateActionPlanStatus(this.source.id, this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm();
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (close) this.closeFormModal();
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

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.loader = false;

    //document clear
   this.clearCommonFilePopupDocuments()
  }

}
