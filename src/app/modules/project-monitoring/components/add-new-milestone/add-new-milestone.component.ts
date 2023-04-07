import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';

@Component({
  selector: 'app-add-new-milestone',
  templateUrl: './add-new-milestone.component.html',
  styleUrls: ['./add-new-milestone.component.scss']
})
export class AddNewMilestoneComponent implements OnInit {
  @Input('source') projectWorkflowSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore
  ProjectMonitoringStore = ProjectMonitoringStore;
  ProjectMilestoneStore = ProjectMilestoneStore
  selectedDate: string = '';
  is_completionExceded: boolean = false;
  selectedMaxDate: any = '';
  constructor(private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,    
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _projectMilestoneService : ProjectMilestoneService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      project_id : null,
      title: ['', [Validators.required, Validators.maxLength(255)]],
      due_date: [null,[Validators.required]],
      // completion : [null,[Validators.required,Validators.pattern(/[0-9]+(\.[0-9]{1,2})?%?/)]],

      previous_milestone_id : null,
    });
    this.getMileStoneList()
    if(this.projectWorkflowSource.type == "Edit"){
      this.editData()
    }
      this.setOrder()
    
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  searchMilestone(e){
    this._projectMilestoneService.getMilestons( '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  changeProgress(){
    if(this.form.value.completion > 100){
      this.is_completionExceded = true
    }else {
      this.is_completionExceded = false

    }
  }

  processSaveData() {
    let saveData = {
      previous_milestone_id  : this.form.value.previous_milestone_id ? this.form.value.previous_milestone_id : null,
      project_id : ProjectMonitoringStore.selectedProjectId ,
      title : this.form.value.title ? this.form.value.title : null,
      // completion : this.form.value.completion ? this.form.value.completion : null,
      due_date : this.form.value.due_date ? this._helperService.processDate(this.form.value.due_date,'join') : null,
    }
    
    return saveData;
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.projectWorkflowSource.type=='Edit') {
        save = this._projectMilestoneService.updateMileston(this.processSaveData(),this.projectWorkflowSource.value.id);
      } else {
        delete this.form.value.id
        save = this._projectMilestoneService.saveMileston(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  resetForm() {
    this.form.reset();
    this.formErrors = null;
    this.is_completionExceded = false
    this.selectedDate = ''
    this.selectedMaxDate = ''
  }

  cancel(){
   this._eventEmitterService.dissmissProjectMilestoneModal()
   this.is_completionExceded = false
   this.selectedDate = ''
   this.selectedMaxDate = ''

  }
  getMileStoneList(){
    this._projectMilestoneService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  setOrder(){
    let id = null
    if(ProjectMilestoneStore.milesstones.length > 0 && this.projectWorkflowSource.type=='Add'){
      id = ProjectMilestoneStore.milesstones.slice(-1)[0].id
      this.selectedDate = this._helperService.processDate(ProjectMilestoneStore.milesstones.slice(-1)[0].due,'split')
      this.form.patchValue({
        previous_milestone_id : id
      })
    } else if(ProjectMilestoneStore.milesstones.length > 0 && this.projectWorkflowSource.type=='Edit'){
      let pos = ProjectMilestoneStore.milesstones.findIndex(e => e.id == this.projectWorkflowSource.value.id )

      this.selectedDate =  this.projectWorkflowSource.value.previus_milestone ? this._helperService.processDate(this.projectWorkflowSource.value.previus_milestone.due,'split') : ''
      if(pos != -1){
        this.selectedMaxDate = this.ProjectMilestoneStore.milesstones[pos+1] ? this._helperService.processDate(this.ProjectMilestoneStore.milesstones[pos+1].due,'split') : ''
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  changePreviousMilestone(){
    if(ProjectMilestoneStore.milesstones.length > 0 ){
     let pos = ProjectMilestoneStore.milesstones.findIndex(e => e.id == this.form.value.previous_milestone_id )
     if(pos != -1){
      this.selectedDate = this._helperService.processDate(ProjectMilestoneStore.milesstones[pos].due,'split');
      this.selectedMaxDate = ProjectMilestoneStore.milesstones[pos + 1] ? this._helperService.processDate(ProjectMilestoneStore.milesstones[pos + 1].due,'split') : ''
     }
    }
  }

  setMaxDate(){

  }

  clearMilestone(){
    this.selectedDate = ''
    this.selectedMaxDate = ''
    this.getMileStoneList()
  }

  editData(){
    this.form.patchValue({
      previous_milestone_id : this.projectWorkflowSource.value.previus_milestone ? this.projectWorkflowSource.value.previus_milestone.id : null,
      project_id : ProjectMonitoringStore.selectedProjectId ,
      title : this.projectWorkflowSource.value.title ? this.projectWorkflowSource.value.title : null,
      // completion: this.projectWorkflowSource.value.completion ? this.projectWorkflowSource.value.completion : null,
      due_date : this.projectWorkflowSource.value.due_date ? this._helperService.processDate(this.projectWorkflowSource.value.due_date,'split') : null,
    })
    
  }

}
