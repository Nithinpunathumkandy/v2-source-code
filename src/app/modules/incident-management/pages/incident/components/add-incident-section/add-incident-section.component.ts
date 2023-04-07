import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';

@Component({
  selector: 'app-add-incident-section',
  templateUrl: './add-incident-section.component.html',
  styleUrls: ['./add-incident-section.component.scss']
})
export class AddIncidentSectionComponent implements OnInit {
  SectionMasterStore = SectionMasterStore;
  form: FormGroup;
  formErrors: any;
  selectedSection: any;
  clearClicked = false;
  constructor(private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,
    private _sectionService: SectionService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      section_ids: [null, [Validators.required, Validators.maxLength(255)]]
    });
    this.getSections();

  }

  ngDoCheck(){
    if(!this.form.value.section_ids  && IncidentInvestigationStore.investigationIncidentObjects.section_ids.length > 0){
      if(!this.clearClicked){
        this.form.patchValue({
          section_ids : IncidentInvestigationStore.investigationIncidentObjects.section_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.section_ids[0].id : []
        })
        this.selectedSection = IncidentInvestigationStore.investigationIncidentObjects.section_ids[0];
        if(IncidentInvestigationStore.investigationIncidentObjects.section_ids.length > 0) this.searchSections({term: IncidentInvestigationStore.investigationIncidentObjects.section_ids[0].id});
        this._utilityService.detectChanges(this._cdr);
      }
    }
   }

   sectionSelected(e){
    if(e)
      this.selectedSection = SectionMasterStore.getSectionById(e);
    else {
      this.clearClicked = true;
      this.selectedSection = null;
      this.form.reset();
    }
  }

  getSections(){

    this._sectionService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
 
  }

  searchSections(e,patchValue:boolean = false){
      var params = '';
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      this._sectionService.getItems(false,'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
  
    }

    save(){
      IncidentInvestigationStore.investigationIncidentObjects.section_ids = [JSON.parse(JSON.stringify(this.selectedSection))]
      this._utilityService.detectChanges(this._cdr);
      this.form.reset();
    }

    cancel(){
      this.form.reset();
      this.selectedSection = null;
      this.clearClicked = false;
    }
}
