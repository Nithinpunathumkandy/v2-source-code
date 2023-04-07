import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TestAndExerciseTypesService } from 'src/app/core/services/masters/bcm/test-and-exercise-types/test-and-exercise-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { TestAndExerciseTypesMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-types.master.store';

@Component({
  selector: 'app-test-and-exercise-types-modal',
  templateUrl: './test-and-exercise-types-modal.component.html'
})
export class TestAndExerciseTypesModalComponent implements OnInit {

  @Input('source') testAndExerciseTypesSource: any;

	TestAndExerciseTypesMasterStore = TestAndExerciseTypesMasterStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;

  constructor(
    	private _testAndExerciseTypesService: TestAndExerciseTypesService,
		private _formBuilder: FormBuilder,
    	private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof TestAndExerciseTypesModalComponent
   */
  ngOnInit(): void {
	  
		this.form = this._formBuilder.group({
			id: [''],
			title: ['', [Validators.required, Validators.maxLength(255)]]
		});
		this.resetForm();

		// Checking if Source has Values and Setting Form Value
		if (this.testAndExerciseTypesSource) {
			this.setFormValues();
		}
	}

  ngDoCheck() {
		if (this.testAndExerciseTypesSource && this.testAndExerciseTypesSource.hasOwnProperty('values') && 
		this.testAndExerciseTypesSource.values && !this.form.value.id)
		this.setFormValues();
	}

	setFormValues() {
		if (this.testAndExerciseTypesSource.hasOwnProperty('values') && this.testAndExerciseTypesSource.values) {
			let { id, title } = this.testAndExerciseTypesSource.values;
			this.form.setValue({
				id: id,
				title: title,
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
		this.closeFormModal();
	}


	// for closing the modal
	closeFormModal() {
		this.resetForm();
		this._eventEmitterService.dismissTestAndExerciseTypesModal();
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._testAndExerciseTypesService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._testAndExerciseTypesService.saveItem(this.form.value);
			}

			save.subscribe((res: any) => {
				this.TestAndExerciseTypesMasterStore.lastInsertedId = res.id
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

