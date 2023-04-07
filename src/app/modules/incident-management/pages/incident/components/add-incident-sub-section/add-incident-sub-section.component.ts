import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';

@Component({
  selector: 'app-add-incident-sub-section',
  templateUrl: './add-incident-sub-section.component.html',
  styleUrls: ['./add-incident-sub-section.component.scss']
})
export class AddIncidentSubSectionComponent implements OnInit {
  SubSectionMasterStore = SubSectionMasterStore;
  selectedSubSection: any;
  clearClicked = false;
  form: FormGroup;
  formErrors: any;
  constructor(private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,    private _subSectionService: SubSectionService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      sub_section_ids: [null, [Validators.required, Validators.maxLength(255)]]
    });
this.getSubSections();
  
  }

  ngDoCheck(){
    if(!this.form.value.sub_section_ids  && IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids.length > 0){
      if(!this.clearClicked){
        this.form.patchValue({
          sub_section_ids : IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids[0].id : []
          
        })
        this.selectedSubSection = IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids[0];
        if(IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids.length > 0) this.searchSubSections({term: IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids[0].id})
        this._utilityService.detectChanges(this._cdr);
      }
    }
   }

  searchSubSections(e,patchValue:boolean = false){

      var params = '';
      this._subSectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    
  }


  getSubSections(){

      var params = '';
    
    this._subSectionService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
 
  }
  subSectionSelected(e){
    if(e)
      this.selectedSubSection = SubSectionMasterStore.getSubSectionById(e);
    else {
      this.clearClicked = true;
      this.selectedSubSection = null;
      this.form.reset();
    }
  }
  save(){
    IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids =  [JSON.parse(JSON.stringify(this.selectedSubSection))]
    this._utilityService.detectChanges(this._cdr);
    this.form.reset();

  }

  cancel(){
    this.form.reset();
      this.selectedSubSection = null;
      this.clearClicked = false;
  }

}
