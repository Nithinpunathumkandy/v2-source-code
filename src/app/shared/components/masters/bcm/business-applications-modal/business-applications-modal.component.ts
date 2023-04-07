import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessApplicationTypesPaginationResponse } from 'src/app/core/models/masters/bcm/business-application-type';
import { SuppliersPaginationResponse } from 'src/app/core/models/masters/suppliers-management/suppliers';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessApplicationTypesService } from 'src/app/core/services/masters/bcm/business-application-types.service';
import { BusinessApplicationsService } from 'src/app/core/services/masters/bcm/business-applications/business-applications.service';
import { SuppliersService } from 'src/app/core/services/masters/suppliers-management/suppliers/suppliers.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BusinessApplicationTypesMasterStore } from 'src/app/stores/masters/bcm/business-application-types.master.store';
import { BusinessApplicationsMasterStore } from 'src/app/stores/masters/bcm/business-applications.master.store';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';
declare var $: any;
@Component({
	selector: 'app-business-applications-modal',
	templateUrl: './business-applications-modal.component.html',
	styleUrls: ['./business-applications-modal.component.scss']
})
export class BusinessApplicationsModalComponent implements OnInit {

	@Input('source') BusinessApplicationsSource: any;
	@ViewChild('supplierFormModal') supplierFormModal: ElementRef;


	BusinessApplicationsMasterStore = BusinessApplicationsMasterStore;
	BusinessApplicationtypesMasterStore = BusinessApplicationTypesMasterStore;
	SuppliersMasterStore = SuppliersMasterStore
	controlSupplierSubscriptionEvent: any = null;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;

	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
	// businessApplicationTypesId: any;
	// supplierId: any;
	isAmc: number;
	orderChanged: number;
	dropShow: boolean = false;

	suppliersObject = {
		component: 'Master',
		values: null,
		type: null
	};

	constructor(
		private _businessApplicationsService: BusinessApplicationsService,
		private _businessApplicationtypesService: BusinessApplicationTypesService,
		private _suppliersService: SuppliersService,
		private _renderer2: Renderer2,
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
			description: [''],
			business_application_type_id: [null, Validators.required],
			supplier_id: [null, Validators.required],
			quantity: [''],
			is_amc: [''],
			amc_start: [''],
			amc_end: [''],
		});

		// restingForm on initial load
		this.resetForm();

		// Checking if Source has Values and Setting Form Value

		if (this.BusinessApplicationsSource) {
			this.setFormValues();
		}

		this.controlSupplierSubscriptionEvent = this._eventEmitterService.supplier.subscribe(res => {
			this.closeSupplierFormModal();
		})
		this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
			this.changeZindex();
		})

		this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
			this.changeZindex();
		})
		this.getBusinessApplicationsList();
		this.getSuppliersList();
	}

	changeZindex() {
		if (!status && $(this.supplierFormModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.supplierFormModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.supplierFormModal.nativeElement, 'overflow', 'auto');
		}
	}


	ngDoCheck() {
		if (this.BusinessApplicationsSource && this.BusinessApplicationsSource.hasOwnProperty('values') && this.BusinessApplicationsSource.values && !this.form.value.id)
			this.setFormValues();
	}

	setFormValues() {
		if (this.BusinessApplicationsSource.hasOwnProperty('values') && this.BusinessApplicationsSource.values) {
			let { id, title, description, business_application_type_id, supplier_id, quantity, is_amc, amc_start, amc_end } = this.BusinessApplicationsSource.values
			this.form.patchValue({
				id: id,
				title: title,
				description: description,
				business_application_type_id: business_application_type_id,
				supplier_id: supplier_id,
				is_amc: is_amc,
				quantity: quantity,
				amc_start: this._helperService.processDate(amc_start, 'split'),
				amc_end: this._helperService.processDate(amc_end, 'split'),

			})
			this.searchBusinessApplicationTypes({ term: business_application_type_id });
			this.searchSuppliers({ term: supplier_id });
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
		this._eventEmitterService.dismissBusinessApplicationsModal();
	}

	//business application types dropdown--start
	getBusinessApplicationsList() {
		this._businessApplicationtypesService.getItems().subscribe(() =>
			setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}
	searchBusinessApplicationTypes(e, patchValue: boolean = false) {
		this._businessApplicationtypesService.getItems(false, '&q=' + e.term).subscribe((res: BusinessApplicationTypesPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.form.patchValue({ business_application_types_id: i.id });
						// this.businessApplicationTypesId = i.id;
						this._utilityService.detectChanges(this._cdr);
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}
	// business application types dropdown--close

	//supplier dropdown--start
	getSuppliersList() {
		this._suppliersService.getItems().subscribe(() =>
			setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}
	searchSuppliers(e, patchValue: boolean = false) {
		this._suppliersService.getItems(false, '&q=' + e.term).subscribe((res: SuppliersPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.form.patchValue({ supplier_id: i.id });
						// this.supplierId = i.id;
						this._utilityService.detectChanges(this._cdr);
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}
	// supplier dropdown--close

	// Open add supplier Modal
	addSupplier() {
		this.suppliersObject.type = "add";
		this._renderer2.setStyle(this.supplierFormModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
		this._renderer2.setStyle(this.supplierFormModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
		$(this.supplierFormModal.nativeElement).modal('show');
		this._utilityService.detectChanges(this._cdr);
	}

	// Close add supplier Modal
	closeSupplierFormModal() {
		$(this.supplierFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.supplierFormModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
		this._renderer2.setStyle(this.supplierFormModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
		$('.modal-backdrop').remove();
		if (SuppliersMasterStore.lastInsertedId)
			this.form.patchValue({ supplier_id: SuppliersMasterStore.lastInsertedId });
		this.getSuppliersList()
		this._utilityService.detectChanges(this._cdr);
	}

	processDataForSave() {
		let saveData = this.form.value;
		saveData['amc_start'] = this._helperService.processDate(this.form.value.amc_start, 'join');
		saveData['amc_end'] = this._helperService.processDate(this.form.value.amc_end, 'join');

		saveData['is_amc'] = this.form.value.is_amc ? true : false;
		return saveData;
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._businessApplicationsService.updateItem(this.form.value.id, this.processDataForSave());
			} else {
				delete this.form.value.id
				save = this._businessApplicationsService.saveItem(this.processDataForSave());
			}

			save.subscribe((res: any) => {
				this.BusinessApplicationsMasterStore.lastInsertedId = res.id
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

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		if(event.key == 'Escape' || event.code == 'Escape'){
			this.cancel();
		}
	  }

	ngOnDestroy() {
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
	}

}

