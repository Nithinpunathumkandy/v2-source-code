import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { ProjectClosureService } from 'src/app/core/services/project-monitoring/project-closure/project-closure.service';
import { ProjectClosureStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-closure-status-store';
import { ProjectClosureStatusService } from 'src/app/core/services/masters/project-monitoring/project-closure-status/project-closure-status.service';
import { Router } from '@angular/router';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
declare var $: any;

@Component({
  selector: 'app-add-project-closure-modal',
  templateUrl: './add-project-closure-modal.component.html'
})
export class AddProjectClosureModalComponent implements OnInit {

  @Input ('source') projectClosureSource: any;

  form: FormGroup;
  formErrors: any;
  reactionDisposer: IReactionDisposer;
  fileUploadPopupSubscriptionEvent: any = null;
  
  AppStore = AppStore;
  ProjectClosureStatusMasterStore = ProjectClosureStatusMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  ProjectMonitoringStore = ProjectMonitoringStore;
  ProjectClosureStore = ProjectClosureStore
  selectedId: any;
  showProjectDetails: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _projectClosureStatusService: ProjectClosureStatusService,
    private _projectClosureService: ProjectClosureService,
    public _msTypeService: MstypesService,
    private _projectService : ProjectMonitoringService,
    private _router:Router) 
    { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AddProjectClosureModalComponent
   */    
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      budget: ['', [Validators.required, Validators.maxLength(255)]],
      project_schedule: ['',[Validators.required,]],
      project_output_quality: ['',[Validators.required,]],
      scope_of_work: ['',[Validators.required,]],
      lesson_learned_titles: [[]],
      project_id : null
      // project_monitor_closure_status_id: [null],
    });

    this.resetForm();
    this.getProjectClosureStatus();
    if (this.projectClosureSource.type == 'Edit') {
      this.setFormValues();
    }

    if (this._router.url.indexOf('project-closures') == -1) {
      ProjectClosureStore.hideSubMenu=true;
        this.form.patchValue({
          project_id: ProjectMonitoringStore.selectedProjectId? ProjectMonitoringStore.selectedProjectId : ''
        })
        this.changeProject(ProjectMonitoringStore.selectedProjectId)
        this._utilityService.detectChanges(this._cdr);

    }
    this.getProjectList()

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

  changeProject(event){
    this.selectedId = event
    if(event){
      ProjectMonitoringStore.setSelectedProjectId(this.selectedId)
      this._projectService.getItem(event).subscribe(res=>{
        this.showProjectDetails = true;
        // this.getMilestone()
        this._utilityService.detectChanges(this._cdr);
      })
    }
   
  }



  setFormValues(){
    this.formErrors = null;
    this.resetForm();
    ProjectClosureStatusMasterStore.lessonLearnedList = [];
      this.form.patchValue({
        id: this.projectClosureSource.value?.id,
        // project_monitor_closure_status_id: this.projectClosureSource.value?.project_monitor_closure_status ? this.projectClosureSource.value?.project_monitor_closure_status?.id : null,
        project_output_quality: this.projectClosureSource.value?.project_output_quality ? this.projectClosureSource.value?.project_output_quality : '',
        project_schedule: this.projectClosureSource.value?.project_schedule ? this.projectClosureSource.value?.project_schedule : null,
        scope_of_work: this.projectClosureSource.value?.scope_of_work ? this.projectClosureSource.value?.scope_of_work : null,
        budget: this.projectClosureSource.value?.budget ? this.projectClosureSource.value?.budget : '',
        lesson_learned_titles: ''
      })
      for(let i of this.projectClosureSource?.value?.lesson_learned_titles){
        ProjectClosureStatusMasterStore.lessonLearnedList.push({
          title: i.title
        });
      }
  }

  

  getProjectClosureStatus(){
    this._projectClosureStatusService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchProjectClosureStatus(e){
    this._projectClosureStatusService.getItems(false,'&q=' + e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }


  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }
  
  // for closing the modal
  closeFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissprojectClosureModal();
  }

  // getting description count
  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex,"");
    return result.length;
  }

  processSaveData() {
    let saveData = this.form.value;
    saveData['lesson_learned_titles'] = ProjectClosureStatusMasterStore.lessonLearnedList; 
    return saveData;
  }
  
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._projectClosureService.updateItem(ProjectMonitoringStore.selectedProjectId,this.form.value.id, this.processSaveData());
      } else {
        save = this._projectClosureService.saveProjectDocument(ProjectMonitoringStore.selectedProjectId, this.processSaveData());
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

   addLessonLearned(){
    if(this.form.value.lesson_learned_titles){
      let titleFromList;
      for (const item of ProjectClosureStatusMasterStore.lessonLearnedList) {
        titleFromList = item.title
      }
      if (this.form.value.lesson_learned_titles != titleFromList )
      ProjectClosureStatusMasterStore.lessonLearnedList.push({title: this.form.value.lesson_learned_titles});
      else
      this.formErrors = {lesson_learned_titles: 'Lesson Learned already added'};
    }
    this.form.patchValue({
      lesson_learned_titles:''
    })
    this._utilityService.detectChanges(this._cdr);
  }
  
  removeLessonLearned(index){
    ProjectClosureStatusMasterStore.lessonLearnedList.splice(index,1);
  }
  
  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
    ProjectClosureStore.hideSubMenu=false;
  }

}
