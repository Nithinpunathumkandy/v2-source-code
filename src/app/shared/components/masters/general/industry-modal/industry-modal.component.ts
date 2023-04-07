import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { IndustryCategoryMasterStore} from 'src/app/stores/masters/general/industry-category-store';
import { IndustryCategoryService } from 'src/app/core/services/masters/general/industry-category/industry-category.service';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IndustryService } from 'src/app/core/services/masters/general/industry/industry.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-industry-modal',
  templateUrl: './industry-modal.component.html',
  styleUrls: ['./industry-modal.component.scss']
})
export class IndustryModalComponent implements OnInit {
  @Input('source') IndustrySource: any;
  AppStore = AppStore;
  industryAddForm: FormGroup;
  formErrors: any;
  IndustryCategoryMasterStore = IndustryCategoryMasterStore;
  constructor(private _industryCategoryService: IndustryCategoryService,
    private _industryService: IndustryService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService
    ) { }

  ngOnInit(): void {

     // Form Object to add Control Category

     this.industryAddForm = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      industry_category_id: [null, [Validators.required]]
    });

    // restingForm on initial load
    this.resetForm();

    // getting region data
    this.getIndustryCategory();


    // Checking if Source has Values and Setting Form Value

    if (this.IndustrySource) {
      this.setFormValues();
    }

  }

  ngDoCheck(){
    if (this.IndustrySource && this.IndustrySource.hasOwnProperty('values') && this.IndustrySource.values && !this.industryAddForm.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.IndustrySource.hasOwnProperty('values') && this.IndustrySource.values) {
      let { id, title, industry_category_id } = this.IndustrySource.values
      this.industryAddForm.setValue({
        id: id,
        title: title,
        industry_category_id: parseInt(industry_category_id)
      })
    }
  }

  getIndustryCategory() {
    this._industryCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchIndustryCategory(e) {
    this._industryCategoryService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // for resetting the form
  resetForm() {
    this.industryAddForm.reset();
    this.industryAddForm.pristine;
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
    this._eventEmitterService.dismissIndustryModal();
  }

  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.industryAddForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.industryAddForm.value.id) {
        save = this._industryService.updateItem(this.industryAddForm.value.id, this.industryAddForm.value);
      } else {
        delete this.industryAddForm.value.id
        save = this._industryService.saveItem(this.industryAddForm.value);
      }

      save.subscribe((res: any) => {
        if (!this.industryAddForm.value.id) {
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

