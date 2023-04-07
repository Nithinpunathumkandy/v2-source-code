import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';

@Component({
  selector: 'app-add-scope-of-work',
  templateUrl: './add-scope-of-work.component.html',
  styleUrls: ['./add-scope-of-work.component.scss']
})
export class AddScopeOfWorkComponent implements OnInit {
  @Input('source') scopeOfWorkSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore
  subtitle = ''
  body: string;
  placeHolder: string;
  constructor(private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,    
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _projectService : ProjectMonitoringService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      project_id : null,
      title: ['', [Validators.required, Validators.maxLength(255)]],
      type: null,
    });
    if(this.scopeOfWorkSource.type =="Edit"){
      this.editData()
    }
    if(this.scopeOfWorkSource.scopeType =="in_scope"){
     this.subtitle = "In Scope"
     this.placeHolder = "Enter the in scope of the project"
     this.body = 'Activities that fall within the boundaries of the scope statement are considered in scope and are accounted for in the schedule and budget'
    }else if(this.scopeOfWorkSource.scopeType =="out_scope"){
      this.subtitle = "Out of Scope"
      this.placeHolder = "Enter the out scope of the project"
      this.body = 'If an activity falls outside the boundaries, it is considered out of scope'

    }else if(this.scopeOfWorkSource.scopeType =="assumption"){
      this.subtitle = "Assumptions"
      this.placeHolder = "Enter the assumptions of the project"
      this.body = 'An assumption is any project factor that is considered to be true, real, or certain without empirical proof or demonstration'

    }
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  processSaveData() {
    let saveData = {
      project_id : ProjectMonitoringStore.selectedProjectId ,
      title : this.form.value.title ? this.form.value.title : null,
      type : this.scopeOfWorkSource.scopeType,
    }
    
    return saveData;
  }

  editData(){
    this.form.patchValue({
      title: this.scopeOfWorkSource.value.title
    })
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.scopeOfWorkSource.type == "Edit") {
        save = this._projectService.updateScope(this.processSaveData(), this.scopeOfWorkSource.value.id,this.scopeOfWorkSource.scopeType);
      } else {
        save = this._projectService.saveScope(this.processSaveData(),this.scopeOfWorkSource.scopeType);
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
   this._eventEmitterService.dissmissProjectScopeModal();
   this.subtitle = ''
   this.body = ''
   this.placeHolder = ''
  }
}
