import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';

@Component({
  selector: 'app-add-milestone-progress',
  templateUrl: './add-milestone-progress.component.html',
  styleUrls: ['./add-milestone-progress.component.scss']
})
export class AddMilestoneProgressComponent implements OnInit {
  @Input('source') milestoneProgressSource: any;

	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
  ProjectMilestoneStore = ProjectMilestoneStore;

  constructor(
    private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
    private _projectService : ProjectMonitoringService,
    private _projectMilestoneService : ProjectMilestoneService,

  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
			completion : [null,[Validators.required,Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      milestone_id : null,
    });
      if(this.milestoneProgressSource.type =="Edit"){
        this.editData()
      }
    }

  editData(){
     this.form.patchValue({
      completion: this.milestoneProgressSource.value.completion ? this.milestoneProgressSource.value.completion : null,
      milestone_id : this.milestoneProgressSource.value.milestone_id ?this.milestoneProgressSource.value.milestone_id : null,
    })
   }
  
   processSaveData() {
    let saveData = {
      completion : this.form.value.completion ? this.form.value.completion : null,
      // milestone : this.form.value.milestone ? this.form.value.milestone : null,
    }
    
    return saveData;
  }

  getMilestones() {
    this._projectMilestoneService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeMilestone(event){
    if (event && ProjectMilestoneStore.milesstones.length>0){
      for(let data of ProjectMilestoneStore.milesstones){
        if(data.id==event){
          this.form.patchValue({
            completion:data.completion
          })
        }
      }
    }
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.milestoneProgressSource.type == "Edit") {
        save = this._projectMilestoneService.updateMileston(this.processSaveData(), this.milestoneProgressSource.value.id);
      } else {
        save = this._projectMilestoneService.saveMilestonProgress(this.processSaveData(),
         this.form.value.milestone_id);
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
  }

  cancel(){
    this._eventEmitterService.dissmissProjectMProgressModal();
   }

getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}
  

}
