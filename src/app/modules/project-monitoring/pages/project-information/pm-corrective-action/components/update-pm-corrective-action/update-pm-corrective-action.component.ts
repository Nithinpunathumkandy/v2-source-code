import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentCorrectiveActionStatusService } from 'src/app/core/services/masters/incident-management/incident-corrective-action-status/incident-corrective-action-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { ProjectIssueCaService } from 'src/app/core/services/project-monitoring/project-ca/project-issue-ca.service';
import { CaStore } from 'src/app/stores/project-monitoring/project-issue-ca-store';


@Component({
  selector: 'app-update-pm-corrective-action',
  templateUrl: './update-pm-corrective-action.component.html'
})
export class UpdatePmCorrectiveActionComponent implements OnInit {
  @Input('source') updateObject: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  updateForm :FormGroup;

  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  CaStore = CaStore;

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
    private  incidentCorrectiveAcctionStatusService : IncidentCorrectiveActionStatusService,
    private _imageService:ImageServiceService,
    private _formBuilder:FormBuilder,
    private _projectIssueCaService: ProjectIssueCaService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof UpdatePmCorrectiveActionComponent
   */
  ngOnInit(): void {
    this.updateForm = this._formBuilder.group({
      percentage: [null, Validators.required],
      project_issue_corrective_action_status_id: [null, Validators.required],
      comment: [''],
      documents: [[], ''],
    })
    this.getStatus();

    for(let i=0;i<=100;i = i+5){
      this.percentage.push(i);
    }
  }

  updateData(){
    console.log('values',this.updateObject.values)
    this.updateForm.patchValue({
      percentage:this.updateObject.values.percentage ? this.updateObject.values.percentage : '',
      project_issue_corrective_action_status_id:this.updateObject.values.project_issue_corrective_action_status_id ? this.updateObject.values.project_issue_corrective_action_status_id : null,
      comment:this.updateObject.values.comment ? this.updateObject.values.comment : '',
    })
  }

  saveData(){
    let saveData={
      percentage:this.updateForm.value.percentage,
      project_issue_corrective_action_status_id: this.updateForm.value.project_issue_corrective_action_status_id,
      comment: this.updateForm.value.comment,
      documents: this.updateForm.value.documents,
    }
    return saveData;
  }

  updateTreatment(close:boolean=false){
    this.updateForm.patchValue({
      documents: this._projectIssueCaService.getDocuments(),
      amount_used:this.updateForm.value.amount_used?parseInt(this.updateForm.value.amount_used).toFixed(2):'',
    })
    this.formErrors=null;
    AppStore.enableLoading();
    this._projectIssueCaService.updateCorrectiveActionStatus(CaStore.correctiveActionDetails?.id,this.saveData()).subscribe(res=>{
      AppStore.disableLoading();
      CaStore.clearDocumentDetailsUpdate()
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
    this.updateForm.reset();
    CaStore.clearDocumentDetailsUpdate()
    this._eventEmitterService.dismissIncidentCorrectiveActionUpdateModal();
  }

  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress, file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
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
        this._projectIssueCaService.setImageDetails(imageDetails, logo_url, type);
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
    CaStore.unsetProductImageDetails('support-file', token);
    this._utilityService.detectChanges(this._cdr);
    
  }

  getStatus(){
    this.statuses = [];
    this._projectIssueCaService.getCaStatus().subscribe(res=>{
      for(let i of res['data']){
        if(CaStore?.correctiveActionDetails?.corrective_action_status?.type == 'new' || CaStore?.correctiveActionDetails?.corrective_action_status.type == 'reopen' || CaStore?.correctiveActionDetails?.corrective_action_status.type == 'wip'){
          if(i.type=='wip' || i.type=='resolved'){
            this.statuses.push(i);
          }
        }else if(CaStore?.correctiveActionDetails?.corrective_action_status?.type == 'resolved'){
          if(i.type=='reopen' || i.type=='completed'){
            this.statuses.push(i);
          } 
        }
       
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchStatus(event){
    this.statuses = [];
    this._projectIssueCaService.getCaStatus('?q='+event.term).subscribe(res=>{
      for(let i of res['data']){
        if(i.type=='new' || i.type=='wip' || i.type=='resolved'){
          this.statuses.push(i);
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  checkForStatus(status){
    if(status==3){
      this.updateForm.patchValue({
        percentage:0
      })
    }
    else if(status==4){
      this.updateForm.patchValue({
        percentage:100
      })

    }
    else if(status==5){
      this.updateForm.patchValue({
        percentage:100
      })

    }
    else {
      this.updateForm.patchValue({
        percentage: null
      })
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
