import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UnsafeActionCategoryService } from 'src/app/core/services/masters/jso/unsafe-action-category/unsafe-action-category.service';
import { UnsafeActionSubCategoryService } from 'src/app/core/services/masters/jso/unsafe-action-sub-category/unsafe-action-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UnsafeActionSubCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-sub-category-store';
import { UnsafeActionCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-category-store';

@Component({
	selector: 'app-unsafe-action-sub-category-modal',
	templateUrl: './unsafe-action-sub-category-modal.component.html',
	styleUrls: ['./unsafe-action-sub-category-modal.component.scss']
})
export class UnsafeActionSubCategoryModalComponent implements OnInit {

	@Input('source') JsoUnsafeActionSubCategorySource: any;

	form: FormGroup;
	reactionDisposer: IReactionDisposer;
	formErrors: any;
	AppStore = AppStore;
	UnsafeActionSubCategoryMasterStore = UnsafeActionSubCategoryMasterStore;
	UnsafeActionCategoryMasterStore = UnsafeActionCategoryMasterStore;
	constructor(
		private _formBuilder: FormBuilder, public _jsoUnsafeActionSubCategoryService: UnsafeActionSubCategoryService,
		private _jsoUnsafeActionCategoryService: UnsafeActionCategoryService,
		private _helperService: HelperServiceService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService
	) { }

	ngOnInit(): void {
		// Form Object to Add Ms type

		this.form = this._formBuilder.group({
			id: [''],
			title: ['', [Validators.required, Validators.maxLength(255)]],
			description: [''],
			unsafe_action_category_id: [null, [Validators.required]]
		});

		// restingForm on initial load
		this.resetForm();

		// Checking if Source has Values and Setting Form Value

		if (this.JsoUnsafeActionSubCategorySource) {
			this.setFormValues();
		}

		if(this.JsoUnsafeActionSubCategorySource && this.JsoUnsafeActionSubCategorySource.component == 'jsoObservation')
		this.patchCategoryValue();
	}

	ngDoCheck() {
		if (this.JsoUnsafeActionSubCategorySource && this.JsoUnsafeActionSubCategorySource.hasOwnProperty('values') && this.JsoUnsafeActionSubCategorySource.values && !this.form.value.id)
			this.setFormValues();
	}

	setFormValues() {
		
		if (this.JsoUnsafeActionSubCategorySource.hasOwnProperty('values') && this.JsoUnsafeActionSubCategorySource.values) {
			let { id, title, description, unsafe_action_category_id } = this.JsoUnsafeActionSubCategorySource.values
			this.form.setValue({
				id: id,
				title: title,
				description: description,
				unsafe_action_category_id: unsafe_action_category_id
			})
			this._utilityService.detectChanges(this._cdr);
		}
	}

	patchCategoryValue(){
		this.form.patchValue({
			unsafe_action_category_id: this.JsoUnsafeActionSubCategorySource?.unsafe_action_category_id
		});
		this.unsafeActionCategory();
		this._utilityService.detectChanges(this._cdr);
	}

	unsafeActionCategory(){
		this._jsoUnsafeActionCategoryService.getItems().subscribe(res=>{
		  this._utilityService.detectChanges(this._cdr);
		})
		
		}

	searchUnsafeActionCategory(event){
		this._jsoUnsafeActionCategoryService.getItems(false,'&q='+event.term).subscribe(res=>{
		  this._utilityService.detectChanges(this._cdr);
		})
	  }
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

	// for closing the modal
	closeFormModal() {
		this.resetForm();
		this._eventEmitterService.dismissjsoUnsafeActionSubCategoryModal();

	}
	// getting description count

	getDescriptionLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.form.value.description.replace(regex, "");
		return result.length;
	}

	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._jsoUnsafeActionSubCategoryService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._jsoUnsafeActionSubCategoryService.saveItem(this.form.value);
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
