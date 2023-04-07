import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentCorrectiveActionService } from 'src/app/core/services/incident-management/incident-corrective-action/incident-corrective-action.service';
import { IncidentCorrectiveActionStatusService } from 'src/app/core/services/masters/incident-management/incident-corrective-action-status/incident-corrective-action-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { IncidentCorrectiveActionStatusMasterStore } from 'src/app/stores/masters/incident-management/incident-corrective-action-status-store';


@Component({
  selector: 'app-update-correctiveaction-progress',
  templateUrl: './update-correctiveaction-progress.component.html',
  styleUrls: ['./update-correctiveaction-progress.component.scss']
})
export class UpdateCorrectiveactionProgressComponent implements OnInit {
  @Input('source') updateObject: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  updateForm :FormGroup;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  IncidentCorrectiveActionStore = IncidentCorrectiveActionStore;
  IncidentCorrectiveActionStatusMasterStore = IncidentCorrectiveActionStatusMasterStore;
  formErrors=null;
  statuses:any = [];
  // sliderValue = null;
  fileUploadProgress = 0;
  fileUploadsArray: any = [];
  percentage = [];
  userDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  riskDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  constructor(private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _eventEmitterService : EventEmitterService,
    // private _riskTreatmentService:RiskTreatmentService,
    private  _correctiveActionService : IncidentCorrectiveActionService,
    private  incidentCorrectiveAcctionStatusService : IncidentCorrectiveActionStatusService,
    private _imageService:ImageServiceService,
    private _formBuilder:FormBuilder,) { }

  ngOnInit(): void {

    this.updateForm = this._formBuilder.group({
      percentage: [null, Validators.required],
      incident_corrective_action_status_id: [null, Validators.required],
      // amount_used: [''],
      comment: [''],
      // actual_start_date:[null],
      // revised_target_date:[null],
      documents: [[], ''],
    })
    this.getStatus();

    for(let i=0;i<=100;i = i+5){
      this.percentage.push(i);
    }
    if(this.updateObject.values){
      this.updateData();
    }
   
  }

  updateData(){
   
    this.updateForm.patchValue({
      percentage:this.updateObject.values.percentage ? this.updateObject.values.percentage : '',
      incident_corrective_action_status_id:this.updateObject.values.incident_corrective_action_status_id ? this.updateObject.values.incident_corrective_action_status_id : null,
      // amount_used:this.updateObject.values.amount_used,
      // comment:this.updateObject.values.comment ? this.updateObject.values.comment : '',
      // documents : this.updateObject.values.documents ? this.updateObject.values.documents : []

    })
    // IncidentCorrectiveActionStore.setDocumentImageDetails(this.updateObject.values.documents)
  }

  saveData(){
    let saveData={
      percentage:this.updateForm.value.percentage,
      incident_corrective_action_status_id: this.updateForm.value.incident_corrective_action_status_id,
      // amount_used: this.updateForm.value.amount_used?this.updateForm.value.amount_used:0,
      comment: this.updateForm.value.comment,
      // actual_start_date:this._helperService.processDate(this.updateForm.value.actual_start_date,'join'),
      // revised_target_date:this._helperService.processDate(this.updateForm.value.revised_target_date,'join'),
      documents: this.updateForm.value.documents,
     
    }
    return saveData;
  }

  updateTreatment(close:boolean=false){
    this.updateForm.patchValue({
      documents: this._correctiveActionService.getDocuments(),
      // amount_used:this.updateForm.value.amount_used?this.updateForm.value.amount_used.toFixed(2):''
      amount_used:this.updateForm.value.amount_used?parseInt(this.updateForm.value.amount_used).toFixed(2):'',
    })
    this.formErrors=null;
    AppStore.enableLoading();
    this._correctiveActionService.updateCorrectiveActionStatus(IncidentCorrectiveActionStore.IncidentCAList.id,this.saveData()).subscribe(res=>{
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if(close){
        this.closeUpdateModal();
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if(err.status == 500 || err.status==404){
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

  closeUpdateModal(){
    this.fileUploadsArray = [];
    this.IncidentCorrectiveActionStore.clearDocumentDetailsUpdate();
    this.updateForm.reset();
    this._eventEmitterService.dismissIncidentCorrectiveActionUpdateModal();
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
          // RiskTreatmentStore.document_preview_available = true;
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

                  // RiskTreatmentStore.document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  // RiskTreatmentStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            // RiskTreatmentStore.document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,true);
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
        this._correctiveActionService.setImageDetails(imageDetails, logo_url, type);
      // else
      //   this._riskTreatmentService.setSelectedImageDetails(logo_url, type);
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
    IncidentCorrectiveActionStore.unsetProductImageDetails('support-file', token);
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  getStatus(){
    this.statuses = [];
    this.incidentCorrectiveAcctionStatusService.getItems().subscribe(res=>{
      // for(let i of res['data']){
      //   if(i.type=='new' || i.type=='wip' || i.type=='resolved' || i.type == 'closed'){
      //     this.statuses.push(i);
      //   }
      // }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchStatus(event){
    this.statuses = [];
    this.incidentCorrectiveAcctionStatusService.getItems(false,'?q='+event.term).subscribe(res=>{
      // for(let i of res['data']){
      //   if(i.type=='new' || i.type=='wip' || i.type=='resolved'){
      //     this.statuses.push(i);
      //   }
      // }
      this._utilityService.detectChanges(this._cdr);
    })
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

  checkForStatus(status){
    let item = IncidentCorrectiveActionStatusMasterStore.allItems.find(e =>e.id == status);
    if(item.type == 'new'){
      this.updateForm.patchValue({
        percentage:0
      })
    }
    else if(item.type == 'resolved'){
      this.updateForm.patchValue({
        percentage:100
      })
    }
    else if(item.type == 'closed'){
      this.updateForm.patchValue({
        percentage:100
      })

    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
