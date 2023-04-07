import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RiskLibraryService } from 'src/app/core/services/masters/risk-management/risk-library/risk-library.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskAreaPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-area';
import { RiskSourcePaginationResponse } from 'src/app/core/models/masters/risk-management/risk-source';
import { RiskAreaMasterStore } from 'src/app/stores/masters/risk-management/risk-area-store';
import { RiskSourceMasterStore } from 'src/app/stores/masters/risk-management/risk-source-store';
import { RiskTypeMasterStore } from 'src/app/stores/masters/risk-management/risk-type-store';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskSourceService } from 'src/app/core/services/masters/risk-management/risk-source/risk-source.service';
import { RiskAreaService } from 'src/app/core/services/masters/risk-management/risk-area/risk-area.service';
import { RiskTypeService } from 'src/app/core/services/masters/risk-management/risk-type/risk-type.service';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';

@Component({
  selector: 'app-risk-library-modal',
  templateUrl: './risk-library-modal.component.html',
  styleUrls: ['./risk-library-modal.component.scss']
})
export class RiskLibraryModalComponent implements OnInit {

  @Input('source') RiskLibrarySource: any;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  RiskAreaMasterStore = RiskAreaMasterStore;
  RiskSourceMasterStore = RiskSourceMasterStore;
  RiskTypeMasterStore = RiskTypeMasterStore;
  RiskCategoryMasterStore=RiskCategoryMasterStore;
  
  constructor(private _formBuilder: FormBuilder,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService:HelperServiceService,
    private _riskLibraryService: RiskLibraryService,
    private _utilityService: UtilityService,
    private _riskSourceService:RiskSourceService,
    private _riskAreaService:RiskAreaService,
    private _riskTypeService:RiskTypeService,
    private _riskCategoryService:RiskCategoryService) { }

  ngOnInit(): void {    
     
     this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      // risk_source_ids:[[]],
      // risk_area_ids:[[]],
      // risk_type_ids:[[]],
      description:[],
      // risk_category_id:['',[Validators.required, Validators.maxLength(255)]],
      // impact:['']
    });

    this.resetForm();

    // Checking if Source has Values and Setting Form Value
  if (this.RiskLibrarySource) {
    // this.getCategory();
    // this.getRiskSource();
    // this.getRiskArea();
    // this.getRiskType();
    this.setFormValues();
  }
  }

  // ngDoCheck(){
  //   if (this.RiskLibrarySource && this.RiskLibrarySource.hasOwnProperty('values') && this.RiskLibrarySource.values && !this.form.value.id)
  //     this.setFormValues();
  //     console.log(this.RiskLibrarySource);
  // console.log(this.RiskLibrarySource.values);
  // }
//setting values for edit
  setFormValues(){
    if (this.RiskLibrarySource.hasOwnProperty('values') && this.RiskLibrarySource.values) {
      let { id, title, description} = this.RiskLibrarySource.values
      this.form.patchValue({
        id: id,
        title: title,
        description:description,
        // risk_source_ids:risk_source ? risk_source:[],
        // risk_category_id:category_title,
        // risk_type_ids:risk_type ? risk_type:[],
        // risk_area_ids:risk_areas ? risk_areas:[],
        // impact:impact
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

getDescriptionLength(){
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.description.replace(regex,"");
  return result.length;
}

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissRiskLibraryControlModal();
  }
  save(close: boolean = false) {
    console.log(this.form.value);
    this.formErrors = null;
    if (this.form.value) {
      console.log(this.form.value);
      
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._riskLibraryService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._riskLibraryService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
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

  // searchRiskType(e) {
  //   this._riskTypeService.getItems(false, 'q=' + e.term).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   })

  // }
  // getRiskType(fetch: boolean = false) {
  //   this._riskTypeService.getItems(fetch).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  // }


    /**
  * Search Risk Area
  * @param e e.term - character to search
  * @param patchValue boolean value - to patch form value
  */
//  searchRiskArea(e, patchValue: boolean = false) {
//   this._riskAreaService.getItems(false, '&q=' + e.term).subscribe((res: RiskAreaPaginationResponse) => {
//     if (res.data.length > 0 && patchValue) {
//       for (let i of res.data) {
//         if (i.id == e.term) {
//           let risk_areas = this.form.value.risk_area_ids ? this.form.value.risk_area_ids : [];
//           risk_areas.push(i);
//           this.form.patchValue({ risk_area_ids: risk_areas });
//           break;
//         }
//       }
//     }
//     this._utilityService.detectChanges(this._cdr);
//   });
// }
// getRiskArea() {
//   this._riskAreaService.getItems(false).subscribe(res => {
//     this._utilityService.detectChanges(this._cdr);
//   })

// }


// getRiskSource() {
//   this._riskSourceService.getItems(false).subscribe(res => {
//     this._utilityService.detectChanges(this._cdr);
//   })
// }

// getCategory(){
//   this._riskCategoryService.getItems(false).subscribe(res =>{
//     this._utilityService.detectChanges(this._cdr);
//   })
// }

// searchRiskCategory(e,patchValue:boolean=false){
//   this._riskCategoryService.getItems(false, 'q=' + e.term).subscribe(res => {
//     this._utilityService.detectChanges(this._cdr);
//   })

// }


// searchRiskSource(e,patchValue:boolean=false) {
//   this._riskSourceService.getItems(false, '&q=' + e.term).subscribe((res: RiskSourcePaginationResponse) => {
//     if (res.data.length > 0 && patchValue) {
//       for (let i of res.data) {
//         if (i.id == e.term) {
//           let risk_sources = this.form.value.risk_source_ids ? this.form.value.risk_source_ids : [];
//           risk_sources.push(i);
//           this.form.patchValue({ risk_source_ids: risk_sources });
//           break;
//         }
//       }
//     }
//     this._utilityService.detectChanges(this._cdr);
//   });
// }


}
