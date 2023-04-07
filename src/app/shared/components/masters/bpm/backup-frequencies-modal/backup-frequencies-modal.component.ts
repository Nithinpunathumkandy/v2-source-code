import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { FrequencyBackupService } from 'src/app/core/services/masters/bpm/frequency-backup/frequency-backup.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { FrequencyBackupMasterStore } from 'src/app/stores/masters/bpm/frequency-backup.store';

@Component({
	selector: 'app-backup-frequencies-modal',
	templateUrl: './backup-frequencies-modal.component.html',
	styleUrls: ['./backup-frequencies-modal.component.scss']
})
export class BackupFrequenciesModalComponent implements OnInit {

	@Input('source') BackupFrequenciesSource: any;

	StorageLocationMasterStore = FrequencyBackupMasterStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;

	constructor(
		private _frequencyBackupService: FrequencyBackupService,
		private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
	) { }

	ngOnInit(): void {
		// Form Object to add Control Category

		this.form = this._formBuilder.group({
			id: [''],
			title: ['', [Validators.required, Validators.maxLength(255)]],
			// description: ['']
		});

		// restingForm on initial load
		this.resetForm();

		// Checking if Source has Values and Setting Form Value

		if (this.BackupFrequenciesSource) {
			this.setFormValues();
		}
	}

	ngDoCheck() {
		if (this.BackupFrequenciesSource && this.BackupFrequenciesSource.hasOwnProperty('values') && this.BackupFrequenciesSource.values && !this.form.value.id)
			this.setFormValues();
	}

	setFormValues() {
		if (this.BackupFrequenciesSource.hasOwnProperty('values') && this.BackupFrequenciesSource.values) {
			let { id, title } = this.BackupFrequenciesSource.values
			// let { id, title, description } = this.BackupFrequenciesSource.values
			this.form.setValue({
				id: id,
				title: title,
				// description: description
			})
		}
	}

	// for resetting the form
	resetForm() {
		this.form.reset();
		this.form.pristine;
		this.formErrors = null;
		AppStore.disableLoading();
	}

	// cancel modal
	cancel() {
		// FormErrorStore.setErrors(null);
		this.closeFormModal();

	}
	// getting description count
	getDescriptionLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.form.value.description.replace(regex, "");
		return result.length;
	}

	// for closing the modal
	closeFormModal() {
		this.resetForm();
		this._eventEmitterService.dismissBackupFrequencyModal();
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._frequencyBackupService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._frequencyBackupService.saveItem(this.form.value);
			}

			save.subscribe((res: any) => {
				this.StorageLocationMasterStore.lastInsertedId = res.id
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

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

		if(event.key == 'Escape' || event.code == 'Escape'){     
	
			this.cancel();
	
		}
	
	  }

	//getting button name by language
	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

}

