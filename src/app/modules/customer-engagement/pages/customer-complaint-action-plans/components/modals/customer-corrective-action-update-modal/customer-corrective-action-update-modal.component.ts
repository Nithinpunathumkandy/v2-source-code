import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerComplaintActionPlanService } from 'src/app/core/services/customer-satisfaction/customer-complaint-action-plan/customer-complaint-action-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { CustomerComplaintActionPlanStatusesService } from 'src/app/core/services/masters/customer-engagement/customer-complaint-action-plan-statuses/customer-complaint-action-plan-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CustomerComplaintActionPlanStore } from 'src/app/stores/customer-engagement/customer-complaint-action-plans/customer-complaint-action-plans-store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { CustomerComplaintActionPlanStatusesMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-action-plan-statuses';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  selector: 'app-customer-corrective-action-update-modal',
  templateUrl: './customer-corrective-action-update-modal.component.html',
  styleUrls: ['./customer-corrective-action-update-modal.component.scss']
})
export class CustomerCorrectiveActionUpdateModalComponent implements OnInit {

  @Input('source') updateObject: any;

  updateForm: FormGroup;
  AppStore = AppStore;
  CustomerComplaintActionPlanStore = CustomerComplaintActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  CustomerComplaintActionPlanStatusesMasterStore = CustomerComplaintActionPlanStatusesMasterStore;
  CustomerComplaintStore = CustomerComplaintStore;
  
  formErrors = null;
  statuses: any = [];
  fileUploadProgress = 0;
  fileUploadsArray: any = [];
  percentage = [];

  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _actionPlanStatusService : CustomerComplaintActionPlanStatusesService,
    private _customerComplaintActionPlanService: CustomerComplaintActionPlanService,
    private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.updateForm = this._formBuilder.group({
      customer_complaint_action_plan_status_id: [null],
      percentage: [null, Validators.required],    
      comment: [''],
      documents: [[], ''],
    })

    for (let i = 0; i <= 100; i = i + 5) {
      this.percentage.push(i);
    }
    this.getUpdateModalDetails();
  }

  saveData() {
    let saveData = {
      customer_complaint_action_plan_status_id: this.updateForm.value.customer_complaint_action_plan_status_id,
      percentage: this.updateForm.value.percentage,
      comment: this.updateForm.value.comment,
      documents: this.updateForm.value.documents,
    }
    return saveData;
  }

  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }
      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      userInfoObject.designation = user?.designation;
      userInfoObject.image_token = user?.image.token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status.id
      userInfoObject.department = user?.department;
      return userInfoObject;
    }
  }

  getStatus() {
    CustomerComplaintActionPlanStatusesMasterStore.orderItem = 'customer_complaint_action_plan_status_language.id'
    this._actionPlanStatusService.getItems().subscribe(res => {              
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchStatus(event) {
    this._actionPlanStatusService.getItems(false, '?q=' + event.term).subscribe(res => {    
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  updateCA(close: boolean = false) {
    this.updateForm.patchValue({
      documents: this._customerComplaintActionPlanService.getDocuments(),
    })
    this.formErrors = null;
    AppStore.enableLoading();
    this._customerComplaintActionPlanService.markAsResolved(CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan.id, this.saveData()).subscribe(res => {
      AppStore.disableLoading();
      this._customerComplaintActionPlanService.getItem(CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan.id).subscribe(response => {
        this._utilityService.detectChanges(this._cdr);
      })
    
      if (close) {
        this.closeUpdateModal();
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 404) {
        this.closeUpdateModal();
        AppStore.disableLoading();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  closeUpdateModal() {
    this.fileUploadsArray = [];
    this.CustomerComplaintActionPlanStore.clearUpdateDocumentDetails();
    this.updateForm.reset();
    this._eventEmitterService.dismissCaResolveModalControlModal();
  }

  onFileChange(event, type: string) {
    //this.fileUploadProgress = 0;
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      // this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {


        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          CustomerComplaintActionPlanStore.update_document_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
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
                $("#file").val('');
                let temp: any = uploadEvent['body'];

                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                  CustomerComplaintActionPlanStore.update_document_preview_available = false;
                  this.createImageFromBlob(prew, temp, type);
                }, (error) => {
                  $("#file").val('');
                  CustomerComplaintActionPlanStore.update_document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            $("#file").val('');
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            CustomerComplaintActionPlanStore.update_document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else {
          this.assignFileUploadProgress(null, file, true);
          $("#file").val('');
        }
      });
    }
  }

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  assignFileUploadProgress(progress, file, success = false) {
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._customerComplaintActionPlanService.setImageDetails(imageDetails, logo_url, type);
      else
        this._customerComplaintActionPlanService.setSelectedImageDetails(logo_url, type);
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  removeDocument(token) {
    CustomerComplaintActionPlanStore.unsetProductImageDetails('support-file', token);
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  checkForPercentage() {
    if (this.updateForm.value.percentage == 0) {
      this.updateForm.patchValue({
        customer_complaint_action_plan_status_id: 1
      })

    }
    else if (this.updateForm.value.percentage == 100) {
      this.updateForm.patchValue({
        customer_complaint_action_plan_status_id: 3
      })

    }
  }

  convertToNumber(data) {
    return parseInt(data);
  }

  checkForStatus(status) {
    if (status == 1) {
      this.updateForm.patchValue({
        percentage: 0
      })
    }
    else if (status == 3) {
      this.updateForm.patchValue({
        percentage: 100
      })

    }
    else {
      this.updateForm.patchValue({
        percentage: null
      })
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getUpdateModalDetails() {
    this.CustomerComplaintActionPlanStore.clearUpdateDocumentDetails();
    this.getStatus();
    this._customerComplaintActionPlanService.getItem(this.updateObject.values.ca_id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    this.updateForm.patchValue({
      percentage: CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.customer_complaint_action_plan_update.slice(-1)[0]?.percentage ? CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.customer_complaint_action_plan_update.slice(-1)[0]?.percentage : 0,
      customer_complaint_action_plan_status_id: CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.customer_complaint_action_plan_update.slice(-1)[0]?.customer_complaint_action_plan_status_id ? CustomerComplaintActionPlanStore.indivitualCustomerComplaintActionPlan?.customer_complaint_action_plan_update.slice(-1)[0]?.customer_complaint_action_plan_status_id : null,
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getValue(e) {
    this.updateForm.patchValue({
      amount_used: e.target.value
    })
  }
}
