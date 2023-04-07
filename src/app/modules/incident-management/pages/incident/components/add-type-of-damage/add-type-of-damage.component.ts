import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentDamageTypeService } from 'src/app/core/services/masters/incident-management/incident-damage-type/incident-damage-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { IncidentDamageTypeMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-type-master-store';

@Component({
  selector: 'app-add-type-of-damage',
  templateUrl: './add-type-of-damage.component.html',
  styleUrls: ['./add-type-of-damage.component.scss']
})
export class AddTypeOfDamageComponent implements OnInit {
  IncidentDamageTypeMasterStore = IncidentDamageTypeMasterStore;
  selectedDamage: any;
  clearClicked = false;
  form: FormGroup;
  formErrors: any;
  constructor( private _incidentDamageTypesService: IncidentDamageTypeService,  private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      incident_damage_type_id: [null, [Validators.required, Validators.maxLength(255)]]
    });

    this.getIncidentType();
  }

  ngDoCheck(){
    if(!this.form.value.incident_damage_type_id  && IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id !=null){
      if(!this.clearClicked){
        this.form.patchValue({
        incident_damage_type_id : IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id ? IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id.id : []
      })
      this.selectedDamage = IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id;
      if(IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id) this.searchIncidentType({term: IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id.id});
      this._utilityService.detectChanges(this._cdr);
      }
    }
   }

   damageSelected(e){
    if(e)
      this.selectedDamage = IncidentDamageTypeMasterStore.getIncidentDamageTypesById(e);
    else {
      this.clearClicked = true;
      this.selectedDamage = null;
      this.form.reset();
    }
  }

  searchIncidentType(e,patchValue:boolean = false){
    this._incidentDamageTypesService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            // this.form.patchValue({ incident_damage_type_id: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

   // for getting incident type
   getIncidentType() {
    this._incidentDamageTypesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  cancel(){
    this.form.reset();
    this.selectedDamage = null;
    this.clearClicked = false;
  }

  save(){
    IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id = this.selectedDamage
    this._utilityService.showSuccessMessage('success','incident_damage_type__added');
    this._utilityService.detectChanges(this._cdr);
    this.form.reset();

  }

}
