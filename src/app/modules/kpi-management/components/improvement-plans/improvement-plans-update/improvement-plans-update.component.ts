import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImprovementLansService } from 'src/app/core/services/kpi-management/improvement-plans/improvement-lans.service';
import { KpiImprovementPlanStatuesService } from 'src/app/core/services/masters/kpi-management/kpi-improvement-plan-statues/kpi-improvement-plan-statues.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { ImprovementPlansStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-store';
import { KpiImprovementPlanStatusMasterStore } from 'src/app/stores/masters/kpi-management/kpi-improvement-plan-status';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-improvement-plans-update',
  templateUrl: './improvement-plans-update.component.html',
  styleUrls: ['./improvement-plans-update.component.scss']
})
export class ImprovementPlansUpdateComponent implements OnInit, OnDestroy {

  @Input('source') source: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;

  AppStore = AppStore;
  ImprovementPlansStore = ImprovementPlansStore;
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  KpiImprovementPlanStatusMasterStore = KpiImprovementPlanStatusMasterStore; //Master

  loader:boolean=false;
  fileUploadsArray = []; //doc
  percentages: string[] = [];
  statuses: any = [];

  fileUploadPopupSubscriptionEvent: any = null;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _improvementLansService: ImprovementLansService,
    private _kpiImprovementPlanStatuesService: KpiImprovementPlanStatuesService, //Master
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      percentage: [null, Validators.required],
      kpi_management_kpi_improvement_plan_status_id: [null, Validators.required],
      comment: [''],
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		});

    this.getStatus();
    this.setPercentageData();

    if (this.source)
      this.setFormData(this.source);
  }

  getStatus() {
    KpiImprovementPlanStatusMasterStore.orderBy='asc';
    if (!(this.statuses.length > 0))
      this._kpiImprovementPlanStatuesService.getItems().subscribe(res => {
        this.loader=true;
        for (let i of res.data) {

          if (i.type == "wip" || i.type == "resolved" || i.type == "closed") {
            this.statuses.push(i);
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
  }


  setPercentageData() {
    for (let i = 0; i <= 100; i++) {
      this.percentages.push(i + '%');
      i = i + 4;
    }
  }

  setStatus(statusId) {
    if (statusId == 3||statusId == 4)
      this.form.controls['percentage'].setValue(100 + '%');
    else if (statusId == 2)
      this.form.controls['percentage'].setValue(10 + '%');
    else
      this.form.controls['percentage'].reset();
  }

  setPercentage(percentage) {
    if (percentage == '100%')
      this.form.controls['kpi_management_kpi_improvement_plan_status_id'].setValue(3);
    else if (percentage == '0%')
      this.form.controls['kpi_management_kpi_improvement_plan_status_id'].setValue(2);
    else
      this.form.controls['kpi_management_kpi_improvement_plan_status_id'].setValue(2);
  }

  setFormData(data) {  
    
    this.form.patchValue({
      percentage: data.kpi_management_kpi_improvement_plan_updates[data.kpi_management_kpi_improvement_plan_updates.length-1]?.percentage ? data.kpi_management_kpi_improvement_plan_updates[data.kpi_management_kpi_improvement_plan_updates.length-1]?.percentage + '%' : '0%',
      kpi_management_kpi_improvement_plan_status_id: data.improvement_plan_status.id!=1? data.improvement_plan_status.id : 2,
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
    this._eventEmitterService.dismissKpiImprovementPlansUpdateModal(close);
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
    this._utilityService.detectChanges(this._cdr);
  }

	enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

  createImageUrl(type,token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

	// *Common  File Upload/Attach Modal Functions Ends Here

  getSaveData() {

    this.saveData = {
      percentage: this.form.value.percentage ? this.form.value.percentage : '',
      kpi_management_kpi_improvement_plan_status_id: this.form.value.kpi_management_kpi_improvement_plan_status_id ? this.form.value.kpi_management_kpi_improvement_plan_status_id : null,
      comment: this.form.value.comment ? this.form.value.comment : '',
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
        save = this._improvementLansService.updateProgressItem(this.source.id, this.saveData);
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