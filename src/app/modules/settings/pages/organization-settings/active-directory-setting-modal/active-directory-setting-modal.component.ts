import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ActiveDirectorySettingService } from 'src/app/core/services/settings/organization_settings/active-directory-setting/active-directory-setting.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'active-directory-setting-modal',
  templateUrl: './active-directory-setting-modal.component.html'
})
export class ActiveDirectorySettingModalComponent implements OnInit {
  @Input('source') activeDirectorySetting: any;
	
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  togglePassword: boolean = false;

  constructor(
	private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
	private _utilityService: UtilityService,
    private _formBuilder: FormBuilder,
	private _activeDirectorySettingService: ActiveDirectorySettingService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ActiveDirectorySettingModalComponent
   */
  ngOnInit(): void {
	this.initForm();
    if (this.activeDirectorySetting.type == 'Edit') {
      this.setFormValues()
    }
  }

  initForm() {
	this.form = this._formBuilder.group({
		id: [''],
		host: ['',Validators.required],
		port: ['',Validators.required],
		username: ['',Validators.required],
		password: ['',Validators.required],
		organization_unit: ['',Validators.required],
		domain_controller: ['',Validators.required],
		common_name: ['',Validators.required]
	  })
  }


  setFormValues() {
    this.formErrors = null;
    this.resetForm();
    this.form.patchValue({
      id: this.activeDirectorySetting.values.id,
      host: this.activeDirectorySetting.values.host ? this.activeDirectorySetting.values.host : '',
	  port: this.activeDirectorySetting.values.port ? this.activeDirectorySetting.values.port : '',
	  organization_unit: this.activeDirectorySetting.values.organization_unit ? this.activeDirectorySetting.values.organization_unit : '',
	  username: this.activeDirectorySetting.values.username ? this.activeDirectorySetting.values.username : '',
	  common_name: this.activeDirectorySetting.values.common_name ? this.activeDirectorySetting.values.common_name : '',
	  domain_controller: this.activeDirectorySetting.values.domain_controller ? this.activeDirectorySetting.values.domain_controller : '',
    })
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
		this.resetForm();
		this._eventEmitterService.dismissActiveDirectorySettingModal();
	}

  cancel() {
		this.closeFormModal();
	}

  resetForm() {
		this.form.reset();
		this.form.pristine;
		this.formErrors = null;
		AppStore.disableLoading();
	}
  
  toggleFieldTextType() {
		this.togglePassword = !this.togglePassword;
	}

  processDataForSave() {
		let saveData = this.form.value;
		// saveData['organization_unit'] = this.form.value.organization_unit ? `OU=${this.form.value.organization_unit}` : '';
		return saveData;
	}

  save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save: any;
			AppStore.enableLoading();

			// if (this.activeDirectorySetting.type == 'Edit') {
			if (this.form.value.id) {
				save = this._activeDirectorySettingService.updateItem(this.activeDirectorySetting.values.id,this.processDataForSave());
			} else {
				delete this.form.value.id
				save = this._activeDirectorySettingService.saveItem(this.processDataForSave());
			}

			save.subscribe((res: any) => {
				if (!this.form.value.id) {
					this.resetForm();
				}
				AppStore.disableLoading();
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				if (close) this.closeFormModal();
			}, (err: HttpErrorResponse) => {
				if (err.status == 422) {
					this.formErrors = err.error.errors;
				}
				else if (err.status == 500 || err.status == 403) {
					this.closeFormModal();
				}
				AppStore.disableLoading();
				this._utilityService.detectChanges(this._cdr);

			});
		}
	}


}
