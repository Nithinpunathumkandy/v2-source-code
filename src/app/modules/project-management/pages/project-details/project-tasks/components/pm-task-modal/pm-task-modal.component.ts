import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ProjectTaskCategoryService } from 'src/app/core/services/masters/project-management/project-task-category/project-task-category.service';
import { TaskPrioritiesService } from 'src/app/core/services/masters/project-management/task-priorities/task-priorities.service';
import { TaskStatusesService } from 'src/app/core/services/masters/project-management/task-statuses/task-statuses.service';
import { ProjectTasksService } from 'src/app/core/services/project-management/project-details/project-tasks/project-tasks.service';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { TaskCategoryMasterStore } from 'src/app/stores/masters/project-management/project-task-category-store';
import { TaskPrioritiesMasterStore } from 'src/app/stores/masters/project-management/task-priorities';
import { TaskStatusesMasterStore } from 'src/app/stores/masters/project-management/task-statuses.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  selector: 'app-pm-task-modal',
  templateUrl: './pm-task-modal.component.html'
})
export class PmTaskModalComponent implements OnInit {

  @Input('source') projectTasksSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;

  form: FormGroup;
  formErrors: any;
  selectedId: any;
  showProjectDetails: boolean = false;

  AppStore = AppStore;
  fileUploadPopupStore = fileUploadPopupStore;
  CustomerComplaintStore = CustomerComplaintStore;
  UsersStore = UsersStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  ProjectMonitoringStore = ProjectMonitoringStore;
  TaskCategoryMasterStore = TaskCategoryMasterStore;
  TaskPrioritiesMasterStore = TaskPrioritiesMasterStore;
  TaskStatusesMasterStore = TaskStatusesMasterStore;

  fileUploadsArray = [];
  fileUploadPopupSubscriptionEvent: any = null;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _userService: UsersService,
    private _renderer2: Renderer2,
    private _documentFileService : DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _projectTasksService: ProjectTasksService,
    private _taskPrioritiesService: TaskPrioritiesService,
    private _taskStatusesService: TaskStatusesService,
    private _projectService : ProjectMonitoringService,
    private _taskCategoryService: ProjectTaskCategoryService,
    private _projectMilestoneService : ProjectMilestoneService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof PmTaskModalComponent
   */
  ngOnInit(): void {
    this.getProjectTaskStatus()
    this.form = this._formBuilder.group({
      id: [""],
      project_id :[null, [Validators.required]],
      task_category_id : [null, [Validators.required]],
      title: ["", [Validators.required]],
      description: [""],
      start_date: [""],
      target_date: [""],
      percentage: [""],
      task_status_id: [null, [Validators.required]],
      task_priority_id: [null, [Validators.required]],
      // target_date: [""],
      estimated_hours: [""],
      responsible_user_id: [null, [Validators.required]],
      watcher_user_ids: [[], [Validators.required]],
      task_checklists: [[]],
      // documents:[]
    });
    if (this.projectTasksSource.type == 'Edit') {
      this.setFormValues()
    }
    else{
      this.form.patchValue({
        start_date: this._helperService.getTodaysDateObject(),
        target_date: this._helperService.getTodaysDateObject()
      })
    }


    this.getUsers();

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    // this.setProjectId()
  }

  setProjectId(){
    this._projectService.getItem(ProjectsStore.selectedProjectID).subscribe(res=>{
      if(res){
        this.form.patchValue({
          project_id:res.id,
          task_status_id:TaskStatusesMasterStore.allItems[0]['id']
        })
      }
      this._utilityService.detectChanges(this._cdr);
    })
    this._utilityService.detectChanges(this._cdr);
  }

  setFormValues() {
    this.formErrors = null;
    this.resetForm();
    // setTimeout(() => {
    //   if(this.projectTasksSource.values?.documents.length > 0){
    //     this.setDocuments(this.projectTasksSource.values.documents)          
    //   }
    // }, 200);
    this.form.patchValue({
      id: this.projectTasksSource.values.id,
      project_id: this.projectTasksSource.values?.project ? this.projectTasksSource.values?.project : '',
      task_category_id: this.projectTasksSource.values?.task_category ? this.projectTasksSource.values?.task_category : '',
      task_status_id: this.projectTasksSource.values?.task_status ? this.projectTasksSource.values?.task_status : '',
      task_priority_id: this.projectTasksSource.values?.task_priority ? this.projectTasksSource.values?.task_priority : '',
      responsible_user_id: this.projectTasksSource.values?.responsible_user ? this.projectTasksSource.values?.responsible_user : null,
      start_date: this.projectTasksSource.values?.start_date ? this._helperService.processDate(this.projectTasksSource.values?.start_date, 'split') : null,
      target_date: this.projectTasksSource.values?.target_date ? this._helperService.processDate(this.projectTasksSource.values?.target_date, 'split') : null,
      description: this.projectTasksSource.values.description ? this.projectTasksSource.values.description : '',
      title: this.projectTasksSource.values.title ? this.projectTasksSource.values.title : '',
      percentage: this.projectTasksSource.values.percentage ? this.projectTasksSource.values.percentage : '',
      watcher_user_ids: this.projectTasksSource.values.task_watchers ? this._helperService.getArrayProcessed(this.projectTasksSource.values.task_watchers, false) : [],
      estimated_hours: this.projectTasksSource.values?.estimated_hours ? this.projectTasksSource.values?.estimated_hours : '',
      // documents:''
    })
    this._utilityService.detectChanges(this._cdr);
    console.log(this.form.value);
  }

  setDocuments(documents) { 
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document?.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }
        });
      }
      else {
        if (element && element.token) {
          var purl = this._imageService.getThumbnailPreview('document-version', element.token);
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    // this.enableScrollbar();
  }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }


  getAllUsers() {
    UsersStore.setAllUsers([]);
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getting  user
  getUsers() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // search users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchListclickValueClear(event) {
    return event.searchTerm = '';
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if (search) isWordThere.push(search.indexOf(arr_term) != -1);
    });
    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }




  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }
  
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  cancel() {
    this.closeFormModal();

  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.clearCommonFilePopupDocuments();
    this._eventEmitterService.dissmissProjectTaskModal();
  }

  // for resetting the form
  resetForm() {
      this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/gi;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }


  clear(type) {
    switch (type) {
      case 'start_date':
        this.form.patchValue({
          start_date: null,
        });
        break;
      case 'target_date':
        this.form.patchValue({
          target_date: null,
        });
        break;
      default:
        break;
    }
  }


 

  processSaveData() {
    let saveData = this.form.value;
    saveData['start_date'] = this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : null
    saveData['target_date'] = this.form.value.target_date ? this._helperService.processDate(this.form.value.target_date, 'join') : null
    saveData['responsible_user_id']= this.form.value.responsible_user_id ?this.form.value.responsible_user_id?.id : null
    // saveData['task_status_id']= this.form.value.task_status_id ? this.form.value.task_status_id : null
    // saveData['task_priority_id']= this.form.value.task_priority_id ? this.form.value.task_priority_id : null
    saveData['tag_ids'] =  []
    saveData['task_checklists']= []
    saveData['watcher_user_ids']= this.form.value.watcher_user_ids ? this.getId(this.form.value.watcher_user_ids) : []
    
      
      if (this.form.value.id) {
      saveData['task_category_id']= this.form.value.task_category_id ? this.form.value.task_category_id?.id : null
      saveData['task_priority_id']= this.form.value.task_priority_id ? this.form.value.task_priority_id?.id : null
      saveData['task_status_id']= this.form.value.task_status_id ? this.form.value.task_status_id?.id : null
      saveData['project_id']= this.form.value.project_id ? this.form.value.project_id?.id : null
      }
      else {
      saveData['task_status_id']= this.form.value.task_status_id ? this.form.value.task_status_id?.id : null
      saveData['project_id']= this.form.value.project_id ? this.form.value.project_id?.id : null
      }
   
    return saveData;
  }

  getId(value) {
    let data = [];
    for(let i of value) {
      data.push(i.id);
    }
    return data;
  }

  // save function
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._projectTasksService.updateItem( this.form.value.id, this.processSaveData(),);
      } else {
        save = this._projectTasksService.saveProjectDocument(this.processSaveData());
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        
      });
    }

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

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

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
        // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
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

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);    
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

   /**
 * 
 * @param progress File Upload Progress
 * @param file Selected File
 * @param success Boolean value whether file upload success 
 */
    assignFileUploadProgress(progress, file, success = false) {

      let temporaryFileUploadsArray = this.fileUploadsArray;
      this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
    }
  
    /**
     * 
     * @param files Selected files array
     * @param type type of selected files - logo or brochure
     */
    addItemsToFileUploadProgressArray(files, type) {
      var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
      this.fileUploadsArray = result.fileUploadsArray;
      return result.files;
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
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
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
  
    getProjectTaskCategory() {
      this._taskCategoryService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }
  
    searchProjectTaskCategory(e){
      this._taskCategoryService.getItems(false,'&q=' + e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
  
  
  getProjectTaskPriorities() {
    this._taskPrioritiesService.getItems(false, null, true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  
  searchProjectTaskPriorities(e){
    this._taskPrioritiesService.getItems(false,'&q=' + e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  getProjectTaskStatus() {
    this._taskStatusesService.getItems(false, null, true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  
  changeProject(event){
    this.selectedId = event.id
    if(event){
      ProjectsStore.setSelectedProjectId(this.selectedId)
      this._projectService.getItem(this.selectedId).subscribe(res=>{
        this.showProjectDetails = true;
        this.getMilestone()
        this._utilityService.detectChanges(this._cdr);
      })
    }
   
  }

  getMilestone(){
    this._projectMilestoneService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  searchProjectTaskStatus(e){
    this._taskStatusesService.getItems(false,'&q=' + e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
    
   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof PmTaskModalComponent
   */
    ngOnDestroy(){
      this.fileUploadPopupSubscriptionEvent.unsubscribe();
      this.clearCommonFilePopupDocuments();
    }
}
