import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentCategoriesService } from 'src/app/core/services/masters/incident-management/incident-categories/incident-categories.service';
import { IncidentDamageTypeService } from 'src/app/core/services/masters/incident-management/incident-damage-type/incident-damage-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { IncidentCategoriesMasterStore } from 'src/app/stores/masters/incident-management/incident-categories-master-store';

@Component({
  selector: 'app-add-incident-category',
  templateUrl: './add-incident-category.component.html',
  styleUrls: ['./add-incident-category.component.scss']
})
export class AddIncidentCategoryComponent implements OnInit {
  IncidentCategoriesMasterStore = IncidentCategoriesMasterStore;
  form: FormGroup;
  formErrors: any;
  selectedIndidentCategory: any = null;
  clearClicked = false;
  constructor(private _incidentCategoriesService: IncidentCategoriesService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      incident_category_ids: [null, [Validators.required]]
    });

  
    this.getIncidentCategory();
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i );
    }
    return returnValues;
  }

  ngDoCheck(){
    if(!this.form.value.incident_category_ids  && IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids.length > 0){
      if(!this.clearClicked){
        this.form.patchValue({
          incident_category_ids : IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids[0].id : null
        })
        this.selectedIndidentCategory = IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids[0];
        if(IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids.length > 0) this.searchIncidentCategory({term: IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids[0].id})
        this._utilityService.detectChanges(this._cdr);
      }
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

  incidentCategorySelected(e){
    if(e)
      this.selectedIndidentCategory = IncidentCategoriesMasterStore.getIncidentCategoriesById(e);
    else {
      this.clearClicked = true;
      this.selectedIndidentCategory = null;
      this.form.reset();
    }
  }

  cancel(){
    this.form.reset();
    this.selectedIndidentCategory = null;
    this.clearClicked = false;
  }
  
  getIncidentCategory(){
    this._incidentCategoriesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  save(){
    IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids = [JSON.parse(JSON.stringify(this.selectedIndidentCategory))];
    this._utilityService.showSuccessMessage('success','incident_category_added');
    this._utilityService.detectChanges(this._cdr);
    
    // this.form.reset();
  }

}
