import { ChangeDetectorRef,Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { TimeTrackerService } from 'src/app/core/services/project-management/time-tracker/time-tracker.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { TimeTrackerStore } from 'src/app/stores/project-management/time-tracker/time-tracker.store';
import { ProjectManagementInfoService } from 'src/app/core/services/project-management/project-details/info/project-management-info.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { projectDetailStore } from 'src/app/stores/project-management/project-details/project-details.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';

@Component({
  selector: 'app-project-activity-modal',
  templateUrl: './project-activity-modal.component.html',
  styleUrls: ['./project-activity-modal.component.scss']
})
export class ProjectActivityModalComponent implements OnInit {
  @Input('source') source: any;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  selectedId: any = null;


  AppStore = AppStore;
  ProjectsStore = ProjectsStore;
  TimeTrackerStore = TimeTrackerStore;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _timeTrackerService:TimeTrackerService,
    private _pmInfoService : ProjectManagementInfoService,

  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id:[null],
      projected_man_days : [null],
      project_time_tracker_activity_id : [null,[Validators.required]],
    });
    this.resetForm();

    if(this.source.type=='Edit'){
      this.setEditDetails();
    }
    
  }

  setEditDetails() {
    
    this.form.setValue({
      id: this.source?.values?.id,
      projected_man_days: this.source?.values?.projected_man_days,
      project_time_tracker_activity_id:{
        id:this.source?.values?.project_time_tracker_activity.id,
        project_time_tracker_activity_language_title:this.source?.values?.project_time_tracker_activity?.language[0]?.pivot?.title
      } 

    });
  }

  getAllProjectsTimeTrackerActivity(searchVal) {
    let param='';
    if(searchVal)
    {
       param="?q="+searchVal.term
    }
    this._timeTrackerService.getTimeTrackerActivity(param).subscribe(() => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  processData(){
    let saveData = {
      projected_man_days : this.form.value.projected_man_days,
      project_time_tracker_activity_id : this.form.value.project_time_tracker_activity_id?.id   
     }
    return saveData;
  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        
        save = this._pmInfoService.updateProjectInfo(this.form.value.id, this.processData());
      }
      else {
				delete this.form.value.id
				save = this._pmInfoService.saveProjectInfo(this.processData());
			}
      save.subscribe((res: any) => {
				projectDetailStore.lastInsertedId = res.id
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
      this._utilityService.detectChanges(this._cdr);
    }
  }

  cancel() {
    this.resetForm();
    this._eventEmitterService.dismissProjectActivityModal();
    this._utilityService.detectChanges(this._cdr)
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
