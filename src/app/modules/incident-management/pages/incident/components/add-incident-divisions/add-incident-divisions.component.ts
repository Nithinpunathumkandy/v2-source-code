import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';

@Component({
  selector: 'app-add-incident-divisions',
  templateUrl: './add-incident-divisions.component.html',
  styleUrls: ['./add-incident-divisions.component.scss']
})
export class AddIncidentDivisionsComponent implements OnInit {
  DivisionMasterStore = DivisionMasterStore;
  form: FormGroup;
  formErrors: any;
  selectedIndidentDevision: any;
  clearClicked = false;
  constructor(
    private _utilityService: UtilityService,private _divisionService: DivisionService,
    private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,private _helperService: HelperServiceService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      division_ids: [null, [Validators.required, Validators.maxLength(255)]]
    });

    this.getDevisions();

   
  }


  ngDoCheck(){
    if(!this.form.value.division_ids  && IncidentInvestigationStore.investigationIncidentObjects.division_ids.length > 0){
      if(!this.clearClicked){
        this.form.patchValue({
          division_ids : IncidentInvestigationStore.investigationIncidentObjects.division_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.division_ids[0].id : []
        })
        if(IncidentInvestigationStore.investigationIncidentObjects.division_ids.length > 0) this.searchDivision({term: IncidentInvestigationStore.investigationIncidentObjects.division_ids[0].id});
        this.selectedIndidentDevision = IncidentInvestigationStore.investigationIncidentObjects.division_ids[0]
        this._utilityService.detectChanges(this._cdr);
      }
    }
   }

   divisionSelected(e){
    if(e)
      this.selectedIndidentDevision = DivisionMasterStore.getDivisionById(e);
    else {
      this.clearClicked = true;
      this.selectedIndidentDevision = null;
      this.form.reset();
    }
  }


  getDevisions(){
    // if(this.form.get('organization_ids').value){
    //   let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
    this._divisionService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  // }else{
  //   this.DivisionStore.setAllDivision([]);
  // }
  }

  searchDivision(event) {
      this._divisionService.getItems(false,'&q='+event.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
  }

  cancel(){
    this.form.reset();
    this.selectedIndidentDevision = null;
    this.clearClicked = false;
   
  }

  save(){
    IncidentInvestigationStore.investigationIncidentObjects.division_ids = [JSON.parse(JSON.stringify(this.selectedIndidentDevision))]
    this._utilityService.showSuccessMessage('success','incident_division_added');
    this._utilityService.detectChanges(this._cdr);
    this.form.reset();

  }
}
