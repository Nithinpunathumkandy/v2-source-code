import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { ProjectIssueStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-issue-store';
import { ProjectIssueStatusService } from 'src/app/core/services/masters/project-monitoring/project-issue-status/project-issue-status.service';
import { ProjectIssueService } from 'src/app/core/services/project-monitoring/project-issue/project-issue.service';
import { number } from '@amcharts/amcharts4/core';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-add-issue-modal',
  templateUrl: './add-issue-modal.component.html'
})
export class AddIssueModalComponent implements OnInit {

  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input ('source') projectIssueSource: any;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  form: FormGroup;
  formErrors: any;
  reactionDisposer: IReactionDisposer;
  fileUploadPopupSubscriptionEvent: any = null;

  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProjectMonitoringStore = ProjectMonitoringStore;
  
  ProjectIssueStatusMasterStore = ProjectIssueStatusMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  ProjectMilestoneStore = ProjectMilestoneStore;
  ProjectIssueStore = ProjectIssueStore
  selectedId: any;
  showProjectDetails: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    public _msTypeService: MstypesService,
    private _projectService : ProjectMonitoringService,
    private _projectIssueStatusService: ProjectIssueStatusService,
    private _projectIssueService: ProjectIssueService,
    private _projectMilestoneService : ProjectMilestoneService,
    private _router:Router
    ) 
    { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AddDocumentModalComponent
   */    
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      project_milestone_id: [null],
      project_id : [null,[Validators.required]],
      // project_issue_status_id: [null],
      document:[]
    });

    this.resetForm();
    this.getProjectList();
    if (this.projectIssueSource.type == 'Edit') {
      this.setFormValues();
    }

    if (this._router.url.indexOf('issues-list') != -1) {
      ProjectIssueStore.hideSubMenu=true;
        this.form.patchValue({
          project_id: ProjectMonitoringStore.selectedProjectId? ProjectMonitoringStore.selectedProjectId : ''
        })
        this.changeProject(ProjectMonitoringStore.selectedProjectId)
        this._utilityService.detectChanges(this._cdr);

    }

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    this.getIssueStatus();
    this.getProjectList()
  }

  changeProject(event){
    this.selectedId = event
    if(event){
      ProjectMonitoringStore.setSelectedProjectId(this.selectedId)
      this._projectService.getItem(event).subscribe(res=>{
        this.showProjectDetails = true;
        this.getMilestone()
        this._utilityService.detectChanges(this._cdr);
      })
    }
   
  }


  getProjectList(){
    this._projectService.getItems(false,'&is_monitor=1').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchProject(e){
    this._projectService.getItems(false,'&q=' + e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }


  setFormValues(){
    console.log(this.projectIssueSource.value);
    this.searchProject({term:this.projectIssueSource.value.project.id});
    this.changeProject(this.projectIssueSource.value.project.id)
      this.form.patchValue({
        id: this.projectIssueSource.value?.id,
        title: this.projectIssueSource.value?.title,
        project_id : this.projectIssueSource.value.project.id,
        description: this.projectIssueSource.value?.description,
        project_milestone_id: this.projectIssueSource.value?.project_milestone ? this.projectIssueSource.value?.project_milestone.id : null,
        // project_issue_status_id: this.projectIssueSource.value?.project_issue_status ? this.projectIssueSource.value?.project_issue_status?.id : null,
      })
      
  }

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.singleFileUpload = true;
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.singleFileUpload = false;
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
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
    return this._msTypeService.getThumbnailPreview(type,token);
    
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }


  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  getMilestone(){
    this._projectMilestoneService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchMilestone(e){
    this._projectMilestoneService.getMilestons('&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getIssueStatus(){
    this._projectIssueStatusService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchIssueStatus(e){
    this._projectIssueStatusService.getItems(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }


  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    ProjectIssueStore.hideSubMenu=false;
    this.showProjectDetails = false;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }
  
  // for closing the modal
  closeFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissProjectDocumentModal();
  }

  // getting description count
  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex,"");
    return result.length;
  }


  processDataForSave() {
    let saveData = this.form.value;
    saveData['project_milestone_id'] = this.form.value.project_milestone_id ? this.form.value.project_milestone_id : null
    // saveData['project_issue_status_id'] = this.form.value?.project_issue_status_id ?  this.form.value?.project_issue_status_id : null
    if(this.form.value.id){
      saveData['document']= {...this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)[0]}
    }else
     saveData['document']= {...this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')[0]}
    return saveData;
  }
  
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      let id = this.selectedId ? this.selectedId : null
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._projectIssueService.updateItem(id,this.form.value.id, this.processDataForSave());
      } else {
        save = this._projectIssueService.saveProjectIssue(id, this.processDataForSave());
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }
  
  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  removeDocument(doc) {
    if(doc.hasOwnProperty('is_kh_document')){
      if(!doc['is_kh_document']){
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else{
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else{
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // PolicyStore.unsetFileDetails('brochure', token);
    this.enableScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }
  

  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    ProjectIssueStore.hideSubMenu=false;
    this.showProjectDetails = false;

  }
}
