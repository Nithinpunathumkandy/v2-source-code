import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProcessModesMasterService } from 'src/app/core/services/masters/bpm/process-modes/process-modes-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OperationModesMasterStore } from 'src/app/stores/masters/bpm/process-operation-modes.store';

@Component({
  selector: 'app-process-operation-mode-modal',
  templateUrl: './process-operation-mode-modal.component.html',
  styleUrls: ['./process-operation-mode-modal.component.scss']
})
export class ProcessOperationModeModalComponent implements OnInit {

  @Input('source') ProcessOperationModeSource: any;

	OperationModesMasterStore = OperationModesMasterStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;

  constructor(
    	private _processOperationModeService: ProcessModesMasterService,
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
   * @memberof ProcessOperationModeModalComponent
   */
  ngOnInit(): void {
	  
		this.form = this._formBuilder.group({
			id: [''],
			title: ['', [Validators.required, Validators.maxLength(255)]]
		});
		this.resetForm();

		// Checking if Source has Values and Setting Form Value
		if (this.ProcessOperationModeSource) {
			this.setFormValues();
		}
	}

  ngDoCheck() {
		if (this.ProcessOperationModeSource && this.ProcessOperationModeSource.hasOwnProperty('values') && 
		this.ProcessOperationModeSource.values && !this.form.value.id)
		this.setFormValues();
	}

	setFormValues() {
		if (this.ProcessOperationModeSource.hasOwnProperty('values') && this.ProcessOperationModeSource.values) {
			let { id, title } = this.ProcessOperationModeSource.values;
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
		this._eventEmitterService.dismissProcessOperationModeModal();
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._processOperationModeService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._processOperationModeService.saveItem(this.form.value);
			}

			save.subscribe((res: any) => {
				this.OperationModesMasterStore.lastInsertedId = res.id
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

