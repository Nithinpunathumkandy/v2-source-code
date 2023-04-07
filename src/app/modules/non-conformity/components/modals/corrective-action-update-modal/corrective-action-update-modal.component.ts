import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { FindingCorrectiveActionStatusesService } from 'src/app/core/services/masters/internal-audit/finding-corrective-action-statuses/finding-corrective-action-statuses.service';
import { FindingCorrectiveActionService } from 'src/app/core/services/non-conformity/findings/finding-corrective-action/finding-corrective-action.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { FindingCorrectiveActionStatusesMasterStore } from 'src/app/stores/masters/internal-audit/finding-corrective-action-statuses.store';
import { FindingCorrectiveActionStore } from 'src/app/stores/non-conformity/findings/finding-corrective-action-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  selector: 'app-corrective-action-update-modal',
  templateUrl: './corrective-action-update-modal.component.html',
  styleUrls: ['./corrective-action-update-modal.component.scss']
})
export class CorrectiveActionUpdateModalComponent implements OnInit {

  @Input('source') updateObject: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  updateForm: FormGroup;
  AppStore = AppStore;
  FindingsStore = FindingsStore;
  FindingCorrectiveActionStore = FindingCorrectiveActionStore;
  FindingCorrectiveActionStatusesMasterStore = FindingCorrectiveActionStatusesMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  formErrors = null;
  statuses: any = [];
  // sliderValue = null;
  fileUploadProgress = 0;
  fileUploadsArray: any = [];
  percentage = [];
  // userDetailObject = {
  //   first_name: '',
  //   last_name: '',
  //   designation: '',
  //   image_token: '',
  //   mobile: null,
  //   email: '',
  //   id: null,
  //   department: '',
  //   status_id: null,
  // }

  // riskDetailObject = {
  //   first_name: '',
  //   last_name: '',
  //   designation: '',
  //   image_token: '',
  //   mobile: null,
  //   email: '',
  //   id: null,
  //   department: '',
  //   status_id: null,
  // }

  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _findingCorrectiveActionService: FindingCorrectiveActionService,
    private _findingCorrectiveActionStatusesService: FindingCorrectiveActionStatusesService,
    private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder,) { }

  ngOnInit(): void {

    this.updateForm = this._formBuilder.group({

      finding_corrective_action_status_id: [null],
      percentage: [null, Validators.required],
      // risk_treatment_status_id: [null, Validators.required],
      // amount_used: ['', [Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]],
      comment: [''],
      // actual_start_date:[null],
      // revised_target_date:[null],
      documents: [[], ''],
    })

    for (let i = 0; i <= 100; i = i + 5) {
      this.percentage.push(i);
    }
    // this._riskTreatmentService.getItem(this.Id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

    this.getUpdateModalDetails();

  }


  saveData() {
    let saveData = {
      finding_corrective_action_status_id: this.updateForm.value.finding_corrective_action_status_id,
      percentage: this.updateForm.value.percentage,
      // risk_treatment_status_id: this.updateForm.value.risk_treatment_status_id,
      // amount_used: this.updateForm.value.amount_used?this.updateForm.value.amount_used:'0.00',
      comment: this.updateForm.value.comment,
      // actual_start_date:this._helperService.processDate(this.updateForm.value.actual_start_date,'join'),
      // revised_target_date:this._helperService.processDate(this.updateForm.value.revised_target_date,'join'),
      documents: this.updateForm.value.documents,

    }
    return saveData;
  }


  // getPopupDetails(user) {
  //   // $('.modal-backdrop').remove();
  //   if (user) {
  //     this.userDetailObject.first_name = user.first_name;
  //     this.userDetailObject.last_name = user.last_name;
  //     this.userDetailObject.designation = user.designation;
  //     this.userDetailObject.image_token = user.image.token;
  //     this.userDetailObject.email = user.email;
  //     this.userDetailObject.mobile = user.mobile;
  //     this.userDetailObject.id = user.id;
  //     this.userDetailObject.department = user.department ? user.department : null;
  //     this.userDetailObject.status_id = user.status.id ? user.status.id : 1;
  //     return this.userDetailObject;
  //   }
  // }




  // getRiskPopupDetails(user) {
  //   // $('.modal-backdrop').remove();
  //   if (user) {
  //     this.riskDetailObject.first_name = user.first_name;
  //     this.riskDetailObject.last_name = user.last_name;
  //     this.riskDetailObject.designation = user.designation;
  //     this.riskDetailObject.image_token = user.image.token;
  //     this.riskDetailObject.email = user.email;
  //     this.riskDetailObject.mobile = user.mobile;
  //     this.riskDetailObject.id = user.id;
  //     this.riskDetailObject.department = user.department ? user.department : null;
  //     this.riskDetailObject.status_id = user.status.id ? user.status.id : 1;
  //     return this.riskDetailObject;
  //   }
  // }


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


   // Check any upload process is going on
   checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }


  getStatus() {
    this.statuses = [];
    this._findingCorrectiveActionStatusesService.getItems().subscribe(res => {
      for (let i of res['data']) {
        if (i.type == 'new' || i.type == 'wip' || i.type == 'resolved') {
          this.statuses.push(i);
        }
      }
      // res.forEach(data => {     
      //   if (data.id == 1 || data.id == 7) {
      //     this.processedDocumentStatusArray.push(data)
      //     this.quickUploadForm.patchValue({
      //       document_status_id: 1
      //     })
      //     this._utilityService.detectChanges(this._cdr)
      //   }             
      // })
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchStatus(event) {
    this.statuses = [];
    this._findingCorrectiveActionStatusesService.getItems(false, '?q=' + event.term).subscribe(res => {
      for (let i of res['data']) {
        if (i.type == 'new' || i.type == 'wip' || i.type == 'resolved') {
          this.statuses.push(i);
        }
      }
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
      documents: this._findingCorrectiveActionService.getDocuments(),
      // amount_used:this.updateForm.value.amount_used?this.updateForm.value.amount_used.toFixed(2):''
      // amount_used:this.updateForm.value.amount_used?parseInt(this.updateForm.value.amount_used).toFixed(2):'',
    })
    this.formErrors = null;
    AppStore.enableLoading();
    this._findingCorrectiveActionService.markAsResolved(FindingCorrectiveActionStore.correctiveActionDetails.id, this.saveData()).subscribe(res => {
      // this._findingCorrectiveActionService.getItem(this.updateObject?.id).subscribe();
      AppStore.disableLoading();
      this._findingCorrectiveActionService.getItem(FindingCorrectiveActionStore.correctiveActionDetails.id).subscribe(response => {
        this._utilityService.detectChanges(this._cdr);
      })

      // this._utilityService.detectChanges(this._cdr);
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

  // clear(type){
  //   if(type=='start_date'){
  //     this.updateForm.patchValue({
  //       actual_start_date:null
  //     })
  //   }
  //   else{
  //     this.updateForm.patchValue({
  //       revised_target_date:null
  //     })
  //   }
  // }

  closeUpdateModal() {
    this.fileUploadsArray = [];
    this.FindingCorrectiveActionStore.clearUpdateDocumentDetails();
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
          FindingCorrectiveActionStore.update_document_preview_available = true;
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
                let temp: any = uploadEvent['body'];

                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                  FindingCorrectiveActionStore.update_document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  FindingCorrectiveActionStore.update_document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            FindingCorrectiveActionStore.update_document_preview_available = false;
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

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  // checkForFileUploadsScrollbar() {
  //   if (RiskTreatmentStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
  //     $(this.uploadArea.nativeElement).mCustomScrollbar();
  //   }
  //   else {
  //     $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  //   }
  // }

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
        this._findingCorrectiveActionService.setImageDetails(imageDetails, logo_url, type);
      else
        this._findingCorrectiveActionService.setSelectedImageDetails(logo_url, type);
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
    FindingCorrectiveActionStore.unsetProductImageDetails('support-file', token);
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  checkForPercentage(percentage) {
    if (percentage == 0) {
      this.updateForm.patchValue({
        risk_treatment_status_id: 1
      })

    }
    else if (percentage == 100) {
      this.updateForm.patchValue({
        risk_treatment_status_id: 3
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
    this.FindingCorrectiveActionStore.clearupdateDocumentDetails();
    this.getStatus();
    //   this.historyPageChange(1);
    this._findingCorrectiveActionService.getItem(this.updateObject.values.ca_id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    this.updateForm.patchValue({
      percentage: FindingCorrectiveActionStore?.correctiveActionDetails?.finding_corrective_action_update.slice(-1)[0]?.percentage ? FindingCorrectiveActionStore?.correctiveActionDetails?.finding_corrective_action_update.slice(-1)[0]?.percentage : 0,
      finding_corrective_action_status_id: FindingCorrectiveActionStore?.correctiveActionDetails?.finding_corrective_action_update.slice(-1)[0]?.finding_corrective_action_status_id ? (typeof(FindingCorrectiveActionStore?.correctiveActionDetails?.finding_corrective_action_update.slice(-1)[0]?.finding_corrective_action_status_id) == "string" ? parseInt(FindingCorrectiveActionStore?.correctiveActionDetails?.finding_corrective_action_update.slice(-1)[0]?.finding_corrective_action_status_id.toString()) : FindingCorrectiveActionStore?.correctiveActionDetails?.finding_corrective_action_update.slice(-1)[0]?.finding_corrective_action_status_id) : null,
      //amount_used: RiskTreatmentStore?.riskTreatmentDetails?.amount_used ? RiskTreatmentStore?.riskTreatmentDetails?.amount_used : '0.00',
    })
    this._utilityService.detectChanges(this._cdr);
  }


  // historyPageChange(newPage: number = null) {
  //   if (newPage) RiskTreatmentStore.setHistoryCurrentPage(newPage);
  //   this._riskTreatmentService.getUpdateData(RiskTreatmentStore.riskTreatmentDetails.id).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);

  //   })
  // }

  getValue(e) {
    // console.log(e);
    this.updateForm.patchValue({
      amount_used: e.target.value
    })
  }
}
