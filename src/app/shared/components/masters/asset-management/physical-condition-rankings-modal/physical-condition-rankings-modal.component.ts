import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { PhysicalConditionRankingsService } from 'src/app/core/services/masters/asset-management/physical-condition-rankings/physical-condition-rankings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { PhysicalConditionRankingsMasterStore } from 'src/app/stores/masters/asset-management/physical-condition-rankings-store';

@Component({
  selector: 'app-physical-condition-rankings-modal',
  templateUrl: './physical-condition-rankings-modal.component.html',
  styleUrls: ['./physical-condition-rankings-modal.component.scss']
})
export class PhysicalConditionRankingsModalComponent implements OnInit {
  @Input('source') PhysicalConditionRankings: any;

  PhysicalConditionRankingsMasterStore = PhysicalConditionRankingsMasterStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
	constructor(
    private _physicalConditionRankingsService: PhysicalConditionRankingsService,
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

		if (this.PhysicalConditionRankings) {
			this.setFormValues();
		}
	}
	ngDoCheck() {
		if (this.PhysicalConditionRankings && this.PhysicalConditionRankings.hasOwnProperty('values') && this.PhysicalConditionRankings.values && !this.form.value.id)
			this.setFormValues();
	}

	setFormValues() {
		if (this.PhysicalConditionRankings.hasOwnProperty('values') && this.PhysicalConditionRankings.values) {
			let { id, title, description } = this.PhysicalConditionRankings.values
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
		this._eventEmitterService.dismissPhysicalConditionRankingsModal();
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._physicalConditionRankingsService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._physicalConditionRankingsService.saveItem(this.form.value);
			}

			save.subscribe((res: any) => {
				this.PhysicalConditionRankingsMasterStore.lastInsertedId = res.id
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
