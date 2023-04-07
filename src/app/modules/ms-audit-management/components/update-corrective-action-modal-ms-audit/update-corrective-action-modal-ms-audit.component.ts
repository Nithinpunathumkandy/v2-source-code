import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MsAuditFindingCaStatusesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-ca-statuses/ms-audit-finding-ca-statuses.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MSAuditFindingCAStatusesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-ca-statuses-store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditCorrectiveActionStore } from 'src/app/stores/ms-audit-management/corrective-acction/corrective-action.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  selector: 'app-update-corrective-action-modal-ms-audit',
  templateUrl: './update-corrective-action-modal-ms-audit.component.html',
  styleUrls: ['./update-corrective-action-modal-ms-audit.component.scss']
})
export class UpdateCorrectiveActionModalMsAuditComponent implements OnInit {
  @Input('source') updateObject: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  updateForm: FormGroup;
  AppStore = AppStore;
  // FindingsStore = FindingsStore;
  AuditCorrectiveActionStore = AuditCorrectiveActionStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
 // CorrectiveActionMasterStore = CorrectiveActionMasterStore;
 MSAuditFindingCAStatusesMasterStore = MSAuditFindingCAStatusesMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  formErrors = null;
  fileUploadProgress = 0;
  fileUploadsArray: any = [];
  percentage = [];
  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _msAuditFindingCaStatusesService: MsAuditFindingCaStatusesService,
    private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder, 
    private  _followUpService : FollowUpService) { }

  ngOnInit(): void {
    this.updateForm = this._formBuilder.group({

      finding_corrective_action_status_id: [null, Validators.required],
      percentage: [null, Validators.required],
      comment: [''],
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
      ms_audit_finding_corrective_action_status_id: this.updateForm.value.finding_corrective_action_status_id,
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
   
    this._msAuditFindingCaStatusesService.getItems().subscribe(res => {
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchStatus(event) {
    
    this._msAuditFindingCaStatusesService.getItems(false, '?q=' + event.term).subscribe(res => {
      
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
      documents: this._followUpService.getDocuments()


      // amount_used:this.updateForm.value.amount_used?this.updateForm.value.amount_used.toFixed(2):''
      // amount_used:this.updateForm.value.amount_used?parseInt(this.updateForm.value.amount_used).toFixed(2):'',
    })
    this.formErrors = null;
    AppStore.enableLoading();
    this._followUpService.updateCorrectiveAction(AuditCorrectiveActionStore?.correctiveActionDetails.id, this.saveData()).subscribe(res => {
      // this._findingCorrectiveActionService.getItem(this.updateObject?.id).subscribe();
      AppStore.disableLoading();
      this._followUpService.getCorrectiveActionDetails(AuditCorrectiveActionStore?.correctiveActionDetails.id).subscribe(response => {
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

  closeUpdateModal() {
    this.fileUploadsArray = [];
    this.AuditCorrectiveActionStore.clearUpdateDocumentDetails();
    this.updateForm.reset();
    this._eventEmitterService.dismissExternalAuditCaUpdateModal();
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
          AuditCorrectiveActionStore.update_document_preview_available = true;
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

                  AuditCorrectiveActionStore.update_document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  $("#file").val('');
                  AuditCorrectiveActionStore.update_document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            $("#file").val('');
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            AuditCorrectiveActionStore.update_document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else {
          $("#file").val('');
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
    event.srcElement.value = null;

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
        this._followUpService.setImageDetails(imageDetails, logo_url, type);
      else
        this._followUpService.setSelectedImageDetails(logo_url, type);
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
    AuditCorrectiveActionStore.unsetProductImageDetails('support-file', token);
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
    else if (status == 2) {
      this.updateForm.patchValue({
        percentage: 100
      })

    }
    else {
      this.updateForm.patchValue({
        percentage: 0
      })
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getUpdateModalDetails() {
    this.AuditCorrectiveActionStore.clearUpdateDocumentDetails();
    this.getStatus();
    //   this.historyPageChange(1);
    this._followUpService.getCorrectiveActionDetails(this.updateObject.values.ca_id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    this.updateForm.patchValue({
      percentage: AuditCorrectiveActionStore?.correctiveActionDetails?.ms_audit_finding_corrective_action_status_updates?.slice(-1)[0]?.percentage ? AuditCorrectiveActionStore?.correctiveActionDetails?.ms_audit_finding_corrective_action_status_updates?.slice(-1)[0]?.percentage : 0,
      finding_corrective_action_status_id: AuditCorrectiveActionStore?.correctiveActionDetails?.ms_audit_finding_corrective_action_status.id
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
    //
    this.updateForm.patchValue({
      amount_used: e.target.value
    })
  }

}
