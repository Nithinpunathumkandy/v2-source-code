import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BiaCategoryPaginationResponse } from 'src/app/core/models/bcm/bia-category/bia-category';
import { BiaCategoryService } from 'src/app/core/services/bcm/bia-category/bia-category.service';
import { BiaRatingService } from 'src/app/core/services/bcm/bia-rating/bia-rating.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaImpactCategoryInformationService } from 'src/app/core/services/masters/bcm/bia-impact-category-information/bia-impact-category-information.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';
import { BiaImpactCategoryInformationMasterStore } from 'src/app/stores/masters/bcm/bia-impact-category-information';
import { ImpactCategoryMasterStore } from 'src/app/stores/masters/risk-management/impact-analysis-category-store';

@Component({
  selector: 'app-bia-impact-category-information-modal',
  templateUrl: './bia-impact-category-information-modal.component.html',
  styleUrls: ['./bia-impact-category-information-modal.component.scss']
})
export class BiaImpactCategoryInformationModalComponent implements OnInit {

  @Input('source') BiaImpactCategoryInformationSource: any;

  BiaImpactCategoryInformationMasterStore = BiaImpactCategoryInformationMasterStore;
  BiaCategoryStore = BiaCategoryStore;
  BiaRatingStore=BiaRatingStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  categoryId: any;

  constructor(
    private _biaImpactCategoryInformationService: BiaImpactCategoryInformationService,
    private _biaCategoryService: BiaCategoryService,
    private _biaRatingService: BiaRatingService,
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
      // title: ['', [Validators.required, Validators.maxLength(255)]],
      bia_impact_category_id: ['', [Validators.required]],
      bia_impact_rating_id:['', [Validators.required]],
      amount: ['', [Validators.required]],
      description: ['']
    });

    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.BiaImpactCategoryInformationSource) {
      this.setFormValues();
    }
    this.getBiaCategoryList();
  }

  ngDoCheck() {
    if (this.BiaImpactCategoryInformationSource && this.BiaImpactCategoryInformationSource.hasOwnProperty('values') && this.BiaImpactCategoryInformationSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues() {
    if (this.BiaImpactCategoryInformationSource.hasOwnProperty('values') && this.BiaImpactCategoryInformationSource.values) {
      let { id,amount, description,bia_impact_rating_id, bia_impact_category_id } = this.BiaImpactCategoryInformationSource.values
      console.log("catched");
      // let { id, title, description } = this.BiaImpactCategoryInformationSource.values
      this.form.patchValue({
        id: id,
        bia_impact_category_id: bia_impact_category_id,
        bia_impact_rating_id:bia_impact_rating_id,
        description: description,
        amount: amount,
        // from: from,
        // to: to,
        // bia_scale_category:bia_scale_category
        // description: description
      })
      this.searchImpactCategory({ term: bia_impact_category_id })
      this.searchImpactRating({term: bia_impact_rating_id})
    }
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  //BiaCategory dropdown--start
  getBiaCategoryList() {
    this._biaCategoryService.getItems(false,'first_rating_only=1',false).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchImpactCategory(e) {
    this._biaCategoryService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  

  searchBiaCategory(e, patchValue: boolean = false) {
    this._biaCategoryService.getItems(false, '&q=' + e.term).subscribe((res: BiaCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.form.patchValue({ scale_id: i.id });
            this.categoryId = i.id;
            this._utilityService.detectChanges(this._cdr);
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }


  //impact rating dropdown--start
  getImpactRatingList() {
    this._biaRatingService.getItems().subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchImpactRating(e) {
    this._biaRatingService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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
    this._eventEmitterService.dismissBiaImpactCategoryInformationModal();
  }


  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._biaImpactCategoryInformationService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._biaImpactCategoryInformationService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        this.BiaImpactCategoryInformationMasterStore.lastInsertedId = res.id
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
