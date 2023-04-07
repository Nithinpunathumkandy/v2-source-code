import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { LessonLearntCaStore } from 'src/app/stores/event-monitoring/events/event-lesson-learnt-ca-store';
import { EventLessonLearntCaService } from 'src/app/core/services/event-monitoring/event-lesson-learnt-ca/event-lesson-learnt-ca.service';
import { ProjectCorrectiveActionStatusService } from 'src/app/core/services/masters/project-monitoring/project-corrective-action-status/project-corrective-action-status.service';
import { ProjectCorrectiveActionStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-corrective-action-status-store';
import { Router } from '@angular/router';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';
import { EventLessonLearnedStore } from 'src/app/stores/event-monitoring/events/event-lesson-learned-store';

@Component({
  selector: 'app-update-ca-status-modal',
  templateUrl: './update-ca-status-modal.component.html',
  styleUrls: ['./update-ca-status-modal.component.scss']
})
export class UpdateCaStatusModalComponent implements OnInit {

  @Input('source') updateObject: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  updateForm :FormGroup;

  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  LessonLearntCaStore = LessonLearntCaStore;
  ProjectCorrectiveActionStatusMasterStore = ProjectCorrectiveActionStatusMasterStore;
  EventMonitoringStore = EventMonitoringStore;
  EventLessonLearnedStore = EventLessonLearnedStore;

  formErrors=null;
  statuses:any = [];
  fileUploadProgress = 0;
  fileUploadsArray: any = [];
  percentage = [];
  id;

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
    private _imageService:ImageServiceService,
    private _formBuilder:FormBuilder,
    private _eventLessonLearntCaService: EventLessonLearntCaService,
    private _projectCorrectiveActionStatusService: ProjectCorrectiveActionStatusService,
    private _router:Router) { }

  ngOnInit(): void {
    this.updateForm = this._formBuilder.group({
      percentage: [null, Validators.required],
      event_lesson_learned_corrective_action_status_id: [null, Validators.required],
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
      event_lesson_learned_corrective_action_status_id:this.updateObject.values.event_lesson_learned_corrective_action_status_id ? this.updateObject.values.event_lesson_learned_corrective_action_status_id : null,
      comment:this.updateObject.values.comment ? this.updateObject.values.comment : '',
    })
  }

  saveData(){
    let saveData={
      percentage:this.updateForm.value.percentage,
      event_lesson_learned_corrective_action_status_id: this.updateForm.value.event_lesson_learned_corrective_action_status_id,
      comment: this.updateForm.value.comment,
      documents: this.updateForm.value.documents,
    }
    return saveData;
  }

  updateTreatment(close:boolean=false){
    this.updateForm.patchValue({
      documents: this._eventLessonLearntCaService.getDocuments(),
    })
    this.formErrors=null;
    AppStore.enableLoading();
    this._eventLessonLearntCaService.updateCorrectiveActionStatus(LessonLearntCaStore.correctiveActionDetails?.id,this.saveData()).subscribe(res=>{
      AppStore.disableLoading();
      LessonLearntCaStore.clearDocumentDetailsUpdate()
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
    this.LessonLearntCaStore.clearDocumentDetailsUpdate()
    this._eventEmitterService.dismissLessonLearnedCaUpdateModal();
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
        this._eventLessonLearntCaService.setImageDetails(imageDetails, logo_url, type);
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
    LessonLearntCaStore.unsetProductImageDetails('support-file', token);
    this._utilityService.detectChanges(this._cdr);
    
  }

  getStatus(){
    this.statuses = [];
    this._eventLessonLearntCaService.getCaStatus().subscribe(res=>{
      for(let i of res['data']){
        if(LessonLearntCaStore?.correctiveActionDetails?.corrective_action_status?.type == 'new' || LessonLearntCaStore?.correctiveActionDetails?.corrective_action_status.type == 'reopen' || LessonLearntCaStore?.correctiveActionDetails?.corrective_action_status.type == 'wip'){
          if(i.type=='wip' || i.type=='resolved'){
            this.statuses.push(i);
          }
        }else if(LessonLearntCaStore?.correctiveActionDetails?.corrective_action_status?.type == 'resolved'){
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
    this._eventLessonLearntCaService.getCaStatus('?q=' + event.term).subscribe(res=>{
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
