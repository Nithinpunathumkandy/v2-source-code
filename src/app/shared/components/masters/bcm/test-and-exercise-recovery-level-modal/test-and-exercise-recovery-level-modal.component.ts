import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TestAndExerciseRecoveryLevelService } from 'src/app/core/services/masters/bcm/test-and-exercise-recovery-level/test-and-exercise-recovery-level.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { TestAndExerciseRecoveryLevelMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-recovery-level.store';

@Component({
  selector: 'app-test-and-exercise-recovery-level-modal',
  templateUrl: './test-and-exercise-recovery-level-modal.component.html',
  styleUrls: ['./test-and-exercise-recovery-level-modal.component.scss']
})
export class TestAndExerciseRecoveryLevelModalComponent implements OnInit {

	@Input('source') TestAndExerciseRecoveryLevelSource: any;

	TestAndExerciseRecoveryLevelMasterStore = TestAndExerciseRecoveryLevelMasterStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
	constructor(
		private _testAndExerciseRecoveryLevelService: TestAndExerciseRecoveryLevelService,
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
			description: ['']
		});

		// restingForm on initial load
		this.resetForm();

		// Checking if Source has Values and Setting Form Value

		if (this.TestAndExerciseRecoveryLevelSource) {
			this.setFormValues();
		}
	}
	ngDoCheck() {
		if (this.TestAndExerciseRecoveryLevelSource && this.TestAndExerciseRecoveryLevelSource.hasOwnProperty('values') && this.TestAndExerciseRecoveryLevelSource.values && !this.form.value.id)
			this.setFormValues();
	}

	setFormValues() {
		if (this.TestAndExerciseRecoveryLevelSource.hasOwnProperty('values') && this.TestAndExerciseRecoveryLevelSource.values) {
			let { id, title, description } = this.TestAndExerciseRecoveryLevelSource.values
			this.form.setValue({
				id: id,
				title: title,
				 description: description
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

	// getDescriptionLength() {
	// 	var regex = /(<([^>]+)>)/ig;
	// 	var result = this.form.value.description.replace(regex, "");
	// 	return result.length;
	// }

	// for closing the modal
	closeFormModal() {
		this.resetForm();
		this._eventEmitterService.dismissTestAndExerciseRecoveryLevelControlModal();
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._testAndExerciseRecoveryLevelService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._testAndExerciseRecoveryLevelService.saveItem(this.form.value);
			}

			save.subscribe((res: any) => {
				this.TestAndExerciseRecoveryLevelMasterStore.lastInsertedId = res.id
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
