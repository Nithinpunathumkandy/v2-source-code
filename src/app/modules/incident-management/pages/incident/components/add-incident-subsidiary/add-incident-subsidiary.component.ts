import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';


@Component({
  selector: 'app-add-incident-subsidiary',
  templateUrl: './add-incident-subsidiary.component.html',
  styleUrls: ['./add-incident-subsidiary.component.scss']
})
export class AddIncidentSubsidiaryComponent implements OnInit {
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SubsidiaryStore = SubsidiaryStore;

  selectedSubsidiary: any;
  clearClicked = false;
  formSub: FormGroup;
  formErrors: any;
  constructor(private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,private _subsiadiaryService: SubsidiaryService,
    ) { }

  ngOnInit(): void {
    this.formSub = this._formBuilder.group({
      id: [''],
      organization_ids: [null, [Validators.required, Validators.maxLength(255)]]
    });
    this.getOrganization();
  }

  ngDoCheck(){
    if(!this.formSub.value.organization_ids  && IncidentInvestigationStore.investigationIncidentObjects.organization_ids.length > 0){
      if(!this.clearClicked){
        this.formSub.patchValue({
          organization_ids : IncidentInvestigationStore.investigationIncidentObjects.organization_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.organization_ids[0].id : []
        })
        this.selectedSubsidiary  = IncidentInvestigationStore.investigationIncidentObjects.organization_ids[0]
        if(IncidentInvestigationStore.investigationIncidentObjects.organization_ids.length > 0) this.searchOrganization({term: IncidentInvestigationStore.investigationIncidentObjects.organization_ids[0].id})
        this._utilityService.detectChanges(this._cdr);
      }
    }
   }

    // for searching organization

    searchOrganization(event) {
      if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        this._subsiadiaryService.searchSubsidiary('?is_full_list=true&q='+event.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        })
      }
  
  
    }

    subsidiarySelected(e){
      if(e)
        this.selectedSubsidiary = SubsidiaryStore.getSubsidiaryById(e);
      else {
        this.clearClicked = true;
        this.selectedSubsidiary = null;
        this.formSub.reset();
      }
    }

    getOrganization(){
      this._subsiadiaryService.getAllItems(false).subscribe((res:any)=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }

    cancel(){
      this.formSub.reset();
      this.selectedSubsidiary = null;
      this.clearClicked = false;
    }

    save(){
      IncidentInvestigationStore.investigationIncidentObjects.organization_ids = [JSON.parse(JSON.stringify(this.selectedSubsidiary))]
      this._utilityService.showSuccessMessage('success','incident_subsidiary_added');
      this._utilityService.detectChanges(this._cdr);
      this.formSub.reset();
  
    }
}
