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
  selector: 'app-add-deliverables-modal',
  templateUrl: './add-deliverables-modal.component.html',
  styleUrls: ['./add-deliverables-modal.component.scss']
})
export class AddDeliverablesModalComponent implements OnInit {
  @Input('source') deliverablesSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore
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
    });
    if(this.deliverablesSource.type =="Edit"){
      this.editData()
    }
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  editData(){
    this.form.patchValue({
      project_id : this.deliverablesSource.value.projectId,
      title: this.deliverablesSource.value.title
    })
  }

  processSaveData() {
    let saveData = {
      project_id : ProjectMonitoringStore.selectedProjectId ,
      title : this.form.value.title ? this.form.value.title : null,
    }
    
    return saveData;
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.deliverablesSource.type == "Edit") {
        save = this._projectService.updateDeliverable(this.processSaveData(), this.deliverablesSource.value.id);
      } else {
        save = this._projectService.saveDeliverable(this.processSaveData());
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
   this._eventEmitterService.dissmissProjectDeliverablesModal();
  }
}
