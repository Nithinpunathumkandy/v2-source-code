import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';


@Component({
  selector: 'app-specification-add',
  templateUrl: './specification-add.component.html',
  styleUrls: ['./specification-add.component.scss']
})
export class SpecificationAddComponent implements OnInit {
  @Input('source') AssetSpecSource: any;
  form: FormGroup;
  formErrors: any;

  public Editor;
  AppStore = AppStore;
  AssetRegisterStore = AssetRegisterStore;

  constructor(
    private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
		private _formBuilder: FormBuilder,
    private _http: HttpClient,
		private _imageService: ImageServiceService,
    private _assetRegisterService: AssetRegisterService,
  ) {
    this.Editor = myCkEditor;
   }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      specification: ['', [Validators.required]]
    });


    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.AssetSpecSource.type = 'Edit') {
      this.setFormValues();
    }

    if (AssetRegisterStore.editspecificationFlag && AssetRegisterStore.assetId) {
			AssetRegisterStore.unsetIndiviudalAssetDetails();
			AssetRegisterStore.clearDocumentDetails();
			this.setEditValues();
			this._utilityService.detectChanges(this._cdr);
		}
    // if(this.AssetLocationSource && this.AssetLocationSource.component == 'assetLocation')
		// this.patchAssetLocationValue();
  }

  setEditValues() {
		this._assetRegisterService.getItem(AssetRegisterStore.assetId).subscribe(res => {
			if (AssetRegisterStore.individual_asset_loaded) {
				var assetItem = AssetRegisterStore.individualAssetDetails;

				this.form.patchValue({
					specification: AssetRegisterStore.individualAssetDetails.specification,
				})
				this._utilityService.detectChanges(this._cdr);

			}

		})

	}

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  setFormValues(){
    let saveData = {
			specification: this.form.value.specification,
		}
		this._utilityService.detectChanges(this._cdr);
		return saveData;
  }

  descriptionValueChange(event) {
		this._utilityService.detectChanges(this._cdr);
	}

  // cancel modal
  cancel() {
    this.closeFormModal();
  }
  
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAssetSpecificationControl();
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
		this.formErrors = null;

		let save;

		save = this._assetRegisterService.saveSpecifications(AssetRegisterStore.assetId, this.setFormValues());
		this._assetRegisterService.getItem(AssetRegisterStore.assetId);
		this._utilityService.detectChanges(this._cdr);

		save.subscribe((res: any) => {
      if (!this.AssetSpecSource.id) {
        this.resetForm();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
      else if(err.status == 500 || err.status == 403){
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      
    });
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy() {
    AssetRegisterStore.editspecificationFlag = false;
  }

}
