import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentCategoriesService } from 'src/app/core/services/masters/incident-management/incident-categories/incident-categories.service';
import { IncidentSubCategoryService } from 'src/app/core/services/masters/incident-management/incident-sub-category/incident-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { IncidentCategoriesMasterStore } from 'src/app/stores/masters/incident-management/incident-categories-master-store';
import { IncidentSubCategoryMasterStore } from 'src/app/stores/masters/incident-management/incident-sub-category-master-store';

@Component({
  selector: 'app-add-sub-incident-category',
  templateUrl: './add-sub-incident-category.component.html',
  styleUrls: ['./add-sub-incident-category.component.scss']
})
export class AddSubIncidentCategoryComponent implements OnInit {
  IncidentSubCategoryMasterStore = IncidentSubCategoryMasterStore;
  IncidentCategoriesMasterStore = IncidentCategoriesMasterStore;

  form: FormGroup;
  formErrors: any;
  selectedSubCategory: any;
  clearClicked = false;
  selectedIndidentCategory: any = null;
  constructor(private _utilityService: UtilityService,
    private _incidentSubCategoryService: IncidentSubCategoryService,
    private _incidentCategoriesService: IncidentCategoriesService,
    private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,) { }
 

  ngOnInit(): void {
    
    this.form = this._formBuilder.group({
      id: [''],
      incident_sub_category_ids: [null, [Validators.required]],
    });
    this.getIncidentSubCategory()
  }

  ngDoCheck(){

    if(!this.form.value.incident_sub_category_ids  && IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids.length > 0){
      if(!this.clearClicked){
      this.form.patchValue({
      incident_sub_category_ids : IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids[0].id : []
       
     })
     //this.getIncidentSubCategory()
     if(IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids.length > 0) this.searchIncidentSubCategory({term: IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids[0].id});
     this.selectedSubCategory = IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids[0];
     this._utilityService.detectChanges(this._cdr);
    }
    }
   }

   subCategorySelected(e){
    if(e)
      this.selectedSubCategory = IncidentSubCategoryMasterStore.getIncidentSubCategoryById(e);
    else {
      this.clearClicked = true;
      this.selectedSubCategory = null;
      this.form.reset();
    }
  }
  
  incidentCategorySelected(e){
    if(e)
      this.selectedIndidentCategory = IncidentCategoriesMasterStore.getIncidentCategoriesById(e);
    else {
      this.clearClicked = true;
      this.selectedIndidentCategory = null;
      this.form.reset();
    }
  }

  searchIncidentCategory(e,patchValue:boolean = false){
    this._incidentCategoriesService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue({ incident_category_ids: i.id });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getIncidentCategory(){
    this._incidentCategoriesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchIncidentSubCategory(e,patchValue:boolean = false){
    let params =''
    if(this.form.get('incident_sub_category_ids').value){
       params = '&incident_sub_category_ids=' + this.form.get('incident_sub_category_ids').value.id;
      this._incidentSubCategoryService.getItems(false, '&q=' + e.term+params).subscribe((res) => {
        if(patchValue){
          for(let i of res.data){
            if(i.id == e.term){
              this.form.patchValue({ incident_sub_category_ids: i });
              break;
            }
          }
          // _incidentDamageTypesService.lastIsertedId = null;
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getIncidentSubCategory(){
    let params =''
    if(IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids.length > 0){
       params = '&incident_category_ids=' + IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids[0]?.id;
       this._incidentSubCategoryService.getItems(false,params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    // else{
    //   this._utilityService.toast('no_incident_category_selected','br');
    // }
  }

  cancel(){
    this.form.reset();
    this.selectedSubCategory = null;
    this.selectedIndidentCategory = null;
    this.clearClicked = false;
  }

  save(){
    // IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids = [JSON.parse(JSON.stringify(this.selectedIndidentCategory))];
    IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids = [JSON.parse(JSON.stringify(this.selectedSubCategory))]
    this._utilityService.detectChanges(this._cdr);
    this.form.reset();

  }

}
