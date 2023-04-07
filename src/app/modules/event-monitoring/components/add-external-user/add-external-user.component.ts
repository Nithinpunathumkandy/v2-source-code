import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventTeamService } from 'src/app/core/services/event-monitoring/event-team/event-team.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-add-external-user',
  templateUrl: './add-external-user.component.html',
  styleUrls: ['./add-external-user.component.scss']
})
export class AddExternalUserComponent implements OnInit {
  @Input('source') ExternalUsersSource: any;

	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
  // genderType = 'male';
  constructor(
		private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
    private _externalUsersService: EventTeamService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AddExternalUsersComponent
   */   
  ngOnInit(): void {
    console.log(this.ExternalUsersSource.type);
    
    this.form = this._formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      designation: [''],
      company:[''],
      email:['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      phone_number:['',[Validators.required,Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      remarks:[''],
    });

    this.resetForm();
    if (this.ExternalUsersSource.type == 'Edit') {
      this.setFormValues();
    }
  }


    setFormValues(){
        this.form.patchValue({
          id: this.ExternalUsersSource.value?.id,
          name: this.ExternalUsersSource.value?.name ? this.ExternalUsersSource.value?.name : '',
          designation: this.ExternalUsersSource.value?.designation ? this.ExternalUsersSource.value?.designation : '',
          email: this.ExternalUsersSource.value?.email ? this.ExternalUsersSource.value?.email : '',
          phone_number: this.ExternalUsersSource.value?.phone_number ? this.ExternalUsersSource.value?.phone_number : '',
          remarks: this.ExternalUsersSource.value?.remarks ? this.ExternalUsersSource.value?.remarks : '',
          company: this.ExternalUsersSource.value?.company ? this.ExternalUsersSource.value?.company : '',
        })
    }
 
  // getting description count
  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.remarks.replace(regex,"");
    return result.length;
  }


  processDataForSave() {
    let saveData = this.form.value;
        // saveData['project_id'] = this.form.value.project_id ? this.form.value.project_id : null;
      return saveData;
    }  

    save(close: boolean = false) {
      this.formErrors = null;
      if (this.form.valid) {
        let save;
        AppStore.enableLoading();
        if (this.form.value.id) {
          save = this._externalUsersService.updateExternalUser(this.form.value.id, this.processDataForSave());
        } else {
          delete this.form.value.id
          save = this._externalUsersService.saveExternalUser(this.processDataForSave());
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
      this.form.pristine;
      this.formErrors = null;
      AppStore.disableLoading();
    }

    cancel(){
      this._eventEmitterService.dismissEventExternalUsersModalModal();
     }

    getButtonText(text) {
      return this._helperService.translateToUserLanguage(text);
    }

}