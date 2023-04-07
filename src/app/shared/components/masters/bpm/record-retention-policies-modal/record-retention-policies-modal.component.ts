import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RecordRetentionPoliciesService } from 'src/app/core/services/masters/bpm/record-retention-policies/record-retention-policies.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RecordRetentionPoliciesMasterStore } from 'src/app/stores/masters/bpm/record-retention-policies.master.store';

@Component({
  selector: 'app-record-retention-policies-modal',
  templateUrl: './record-retention-policies-modal.component.html',
  styleUrls: ['./record-retention-policies-modal.component.scss']
})
export class RecordRetentionPoliciesModalComponent implements OnInit {

  @Input('source') RecordRetentionPoliciesSource: any;

	RecordRetentionPoliciesMasterStore = RecordRetentionPoliciesMasterStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;

  constructor(
    	private _recordRetentionPoliciesService: RecordRetentionPoliciesService,
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
   * @memberof RecordRetentionPoliciesModalComponent
   */
  ngOnInit(): void {
	  
		this.form = this._formBuilder.group({
			id: [''],
			title: ['', [Validators.required, Validators.maxLength(255)]]
		});
		this.resetForm();

		// Checking if Source has Values and Setting Form Value
		if (this.RecordRetentionPoliciesSource) {
			this.setFormValues();
		}
	}

  ngDoCheck() {
		if (this.RecordRetentionPoliciesSource && this.RecordRetentionPoliciesSource.hasOwnProperty('values') && 
		this.RecordRetentionPoliciesSource.values && !this.form.value.id)
		this.setFormValues();
	}

	setFormValues() {
		if (this.RecordRetentionPoliciesSource.hasOwnProperty('values') && this.RecordRetentionPoliciesSource.values) {
			let { id, title } = this.RecordRetentionPoliciesSource.values;
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
		this._eventEmitterService.dismissRecordRetentionPoliciesModal();
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._recordRetentionPoliciesService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._recordRetentionPoliciesService.saveItem(this.form.value);
			}

			save.subscribe((res: any) => {
				this.RecordRetentionPoliciesMasterStore.lastInsertedId = res.id
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
					this.formErrors = err.error.message;
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

