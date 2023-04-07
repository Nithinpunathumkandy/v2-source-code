import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { StakeholderService } from 'src/app/core/services/masters/organization/stakeholder/stakeholder.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { StakeholdersStore } from 'src/app/stores/organization/stakeholders/stakeholders.store';

@Component({
  selector: 'app-add-incident-involved-party',
  templateUrl: './add-incident-involved-party.component.html',
  styleUrls: ['./add-incident-involved-party.component.scss']
})
export class AddIncidentInvolvedPartyComponent implements OnInit {
  StakeholderMasterStore = StakeholdersStore;
  selectedInvolved: any;
  clearClicked = false;
  form: FormGroup;
  formErrors: any;


  constructor(private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,private _userService: UsersService,private _stakeholderService: StakeholderService,
    private _helperService: HelperServiceService,private _imageService: ImageServiceService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      incident_stakeholder_ids: [null, [Validators.required, Validators.maxLength(255)]]
    });
  
    this.getInvolvedUsers();
  }

  
  ngDoCheck(){
    if(!this.form.value.incident_stakeholder_ids  && IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids.length > 0){
      if(!this.clearClicked){
     this.form.patchValue({
      incident_stakeholder_ids : IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids ? IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids[0].id : []
       
     })
     this.selectedInvolved =  IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids[0]
     this._utilityService.detectChanges(this._cdr);
    }
    }
   }
  searchInvolved(e){
    this._stakeholderService.getItems(false,'&q='+e.term)
    .subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  involvedSelected(e){
    if(e)
      this.selectedInvolved = StakeholdersStore.getStakeholderById(e);
    else {
      this.clearClicked = true;
      this.selectedInvolved = null;
      this.form.reset();
    }
  }

  getInvolvedUsers(){
    // let params = '?department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
    this._stakeholderService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

}


cancel(){
  this.form.reset();
  this.selectedInvolved = null;
  this.clearClicked = false;
}
save(){
  IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids = [JSON.parse(JSON.stringify(this.selectedInvolved))]
  this._utilityService.showSuccessMessage('success','incident_involved_party_added');
  this._utilityService.detectChanges(this._cdr);
  this.form.reset();

}

}
