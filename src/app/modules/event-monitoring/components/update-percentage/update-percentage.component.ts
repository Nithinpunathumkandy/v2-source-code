import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { EventTaskService } from 'src/app/core/services/event-monitoring/events/event-task/event-task.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { TaskStatusService } from 'src/app/core/services/masters/event-monitoring/task-status/task-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { TaskstatusMasterStore } from 'src/app/stores/masters/event-monitoring/task-status-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-update-percentage',
  templateUrl: './update-percentage.component.html',
  styleUrls: ['./update-percentage.component.scss']
})
export class UpdatePercentageComponent implements OnInit , OnDestroy {

  @Input('source') source
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  percentages:number[] = [];
  statuses=[]
  form: FormGroup;
  formErrors: any;

  AppStore=AppStore
  fileUploadPopupStore = fileUploadPopupStore;
  TaskstatusMasterStore = TaskstatusMasterStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  fileUploadsArray = [];  
  fileUploadPopupSubscriptionEvent: any = null;

  constructor(
    private _renderer2: Renderer2,
    private _cdr:ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _statusService:TaskStatusService,
    private _utilityService:UtilityService,
    private _imageService: ImageServiceService,
    private _eventTaskService: EventTaskService,
    private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,    
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      percentage: [null, Validators.required],
      event_task_status_id: [null, Validators.required],
      comment: [''],      
    });  

    if(this.source.values){
      this.form.patchValue({percentage:this.source.values?.percentage})
      this.statuses = [];
      this._statusService.getItems().subscribe(res=>{
        this.form.patchValue({event_task_status_id:res.data.filter(item=>item.type==this.source.values?.event_task_status?.type)[0] ? res.data.filter(item=>item.type==this.source.values?.event_task_status?.type)[0]:null})
        this._utilityService.detectChanges(this._cdr);
      })
      this._eventTaskService.getHistory(this.source.id).subscribe(res => {
        if(res.length){
          this.form.patchValue({comments:res[0]?.comment ? res[0]?.comment:null})
        }        
        this._utilityService.detectChanges(this._cdr)
      })
    }


    for(let i=0;i<=100;i++){
      this.percentages.push(i);
      i=i+4;
    }

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }

  getSaveData(){

    let saveData = {
      percentage: this.form.value.percentage ? this.form.value.percentage : '',
      event_task_status_id: this.form.value.event_task_status_id ? this.form.value.event_task_status_id?.id : null,
      comment: this.form.value.comment ? this.form.value.comment : '',      
    } 
    
		saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');		
    return saveData
    
  }

  //It'll update the percentage of the task
  save(close: boolean = false) {    
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      this.getSaveData();
      if (this.form.value) {
        save = this._eventTaskService.updateTaskPercentage(this.source?.id,this.getSaveData());
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
            this._utilityService.showErrorMessage('error','something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  setStatus(statusId) {
    if (statusId == 3)
      this.form.controls['percentage'].setValue(100);    
    else
      this.form.controls['percentage'].reset();
  }

  setPercentage(percentage) {
    if (percentage == 100)
      this.form.controls['event_task_status_id'].setValue(3);    
    else
      this.form.controls['event_task_status_id'].setValue(2);
  }

  getStatus(){
    this.statuses = [];
    
    this._statusService.getItems().subscribe(res=>{
      TaskstatusMasterStore._taskstatus=TaskstatusMasterStore?.taskstatus.filter(function(emp){
        return emp.type==='in-progress'|| emp.type=='completed'
    })
      // for(let i of res.data){
      //   if(i.type=="in-progress"|| i.type=="completed"){
      //     this.statuses.push(i);
      //   }
      // }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  cancel() {
    this.closeFormModal();
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  //File Upload/Attach Modal
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;      
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
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
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._eventTaskService.getThumbnailPreview(type, token);

  }

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

    // Check any upload process is going on
    checkFileIsUploading() {
      return this._helperService.checkFileisUploaded(this.fileUploadsArray);
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

  closeFormModal() {
    // this.resetForm();   
    this._eventEmitterService.dismissPercentageUpdateModal();  
  }

  ngOnDestroy(): void {
    this.fileUploadPopupSubscriptionEvent.unsubscribe()
  }

}
