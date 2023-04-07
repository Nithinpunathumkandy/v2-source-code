import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TestAndExerciseCommunicationsService } from 'src/app/core/services/masters/bcm/test-and-exercise-communications/test-and-exercise-communications.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { TestAndExerciseCommunicationsMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-communications.store';

@Component({
  selector: 'app-test-and-exercise-communications-modal',
  templateUrl: './test-and-exercise-communications-modal.component.html'
})
export class TestAndExerciseCommunicationsModalComponent implements OnInit {

  @Input('source') testAndExerciseCommunicationsSource: any;

	TestAndExerciseCommunicationsMasterStore = TestAndExerciseCommunicationsMasterStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;

  constructor(
    	private _testAndExerciseCommunicationsService: TestAndExerciseCommunicationsService,
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
   * @memberof TestAndExerciseCommunicationsModalComponent
   */
  ngOnInit(): void {
	  
		this.form = this._formBuilder.group({
			id: [''],
			title: ['', [Validators.required, Validators.maxLength(255)]]
		});
		this.resetForm();

		// Checking if Source has Values and Setting Form Value
		if (this.testAndExerciseCommunicationsSource) {
			this.setFormValues();
		}
	}

  ngDoCheck() {
		if (this.testAndExerciseCommunicationsSource && this.testAndExerciseCommunicationsSource.hasOwnProperty('values') && 
		this.testAndExerciseCommunicationsSource.values && !this.form.value.id)
		this.setFormValues();
	}

	setFormValues() {
		if (this.testAndExerciseCommunicationsSource.hasOwnProperty('values') && this.testAndExerciseCommunicationsSource.values) {
			let { id, title } = this.testAndExerciseCommunicationsSource.values;
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
				save = this._testAndExerciseCommunicationsService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._testAndExerciseCommunicationsService.saveItem(this.form.value);
			}

			save.subscribe((res: any) => {
				this.TestAndExerciseCommunicationsMasterStore.lastInsertedId = res.id
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

