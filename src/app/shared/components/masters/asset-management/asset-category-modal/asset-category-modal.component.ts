import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetCategoryService } from 'src/app/core/services/masters/asset-management/asset-category/asset-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetCategoryStore } from 'src/app/stores/masters/asset-management/asset-category-store';

@Component({
  selector: 'app-asset-category-modal',
  templateUrl: './asset-category-modal.component.html',
  styleUrls: ['./asset-category-modal.component.scss']
})
export class AssetCategoryModalComponent implements OnInit {
  @Input('source') AssetCategorySource: any;

  AssetCategoryStore = AssetCategoryStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  constructor(
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _assetCategoryService: AssetCategoryService,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

    this.resetForm();

    // Checking if Source has Values and Setting Form Value
  
    if (this.AssetCategorySource) {
      this.setFormValues();
    }

  }
  ngDoCheck(){
    if (this.AssetCategorySource && this.AssetCategorySource.hasOwnProperty('values') && this.AssetCategorySource.values && !this.form.value.id)
      this.setFormValues();
  }
  
  setFormValues(){
    if (this.AssetCategorySource.hasOwnProperty('values') && this.AssetCategorySource.values) {
      let { id, title,description } = this.AssetCategorySource.values
      this.form.setValue({
        id: id,
        title: title,
        description:description
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
  
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAssetCategoryControlModal();
  }
  
  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._assetCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._assetCategoryService.saveItem(this.form.value);
      }
  
      save.subscribe((res: any) => {
        this.AssetCategoryStore.lastInsertedId = res.id
        if(!this.form.value.id){
        this.resetForm();}
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
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }
  
  
  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
