import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';

@Component({
  selector: 'app-quick-correction-add',
  templateUrl: './quick-correction-add.component.html',
  styleUrls: ['./quick-correction-add.component.scss']
})
export class QuickCorrectionAddComponent implements OnInit {
  @Input('source') QuickCorrectionsSource: any;

	FindingsStore = FindingsStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;

  constructor(
    private _findingsService: FindingsService,
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
			description: ['',[Validators.required]]
		});

		// restingForm on initial load
		this.resetForm();

		// Checking if Source has Values and Setting Form Value

		if (this.QuickCorrectionsSource) {
			this.setFormValues();
		}
	}

  ngDoCheck() {
		if (this.QuickCorrectionsSource && this.QuickCorrectionsSource.hasOwnProperty('values') && this.QuickCorrectionsSource.values && !this.form.value.id)
			this.setFormValues();
	}

	setFormValues() {
		if (this.QuickCorrectionsSource.hasOwnProperty('values') && this.QuickCorrectionsSource.values) {
      let { id, title, description } = this.QuickCorrectionsSource.values
			this.form.setValue({
				id: id,
				title: title,
				description: description,
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
		this._eventEmitterService.dismissFindingsQuickCorrectionModal();
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._findingsService.updateCorrection(FindingsStore.findingDetails?.id,this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._findingsService.saveCorrection(FindingsStore.findingDetails?.id,this.form.value);
			}

			save.subscribe((res: any) => {
				this.FindingsStore.lastInsertedId = res.id
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

	//getting button name by language
	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

}

