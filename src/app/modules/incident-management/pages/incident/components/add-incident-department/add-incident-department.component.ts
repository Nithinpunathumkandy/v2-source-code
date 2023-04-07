import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';

@Component({
  selector: 'app-add-incident-department',
  templateUrl: './add-incident-department.component.html',
  styleUrls: ['./add-incident-department.component.scss']
})
export class AddIncidentDepartmentComponent implements OnInit {
  DepartmentMasterStore = DepartmentMasterStore;
  DepartmentStore = DepartmentMasterStore;

  form: FormGroup;
  formErrors: any;
  selectedIndidentDepartment: any;
  clearClicked = false;
  constructor(private _cdr: ChangeDetectorRef,private _formBuilder: FormBuilder,private _departmentService: DepartmentService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      department_ids: [null, [Validators.required, Validators.maxLength(255)]]
    });

    this.getDepartment();

  
  }

  ngDoCheck(){
    if(!this.form.value.department_ids  && IncidentInvestigationStore.investigationIncidentObjects.department_ids.length > 0){
      if(!this.clearClicked){
      this.form.patchValue({
        department_ids : IncidentInvestigationStore.investigationIncidentObjects.department_ids ? IncidentInvestigationStore.investigationIncidentObjects.department_ids[0].id : null
        
      })
      this.selectedIndidentDepartment = IncidentInvestigationStore.investigationIncidentObjects.department_ids[0];
      if(IncidentInvestigationStore.investigationIncidentObjects.department_ids.length > 0) this.searchDepartment({term: IncidentInvestigationStore.investigationIncidentObjects.department_ids[0].id})
    }
    this._utilityService.detectChanges(this._cdr);

    }
   }


   departmentSelected(e){
    if(e)
      this.selectedIndidentDepartment = DepartmentMasterStore.getDepartmentById(e);
    else {
      this.clearClicked = true;
      this.selectedIndidentDepartment = null;
      this.form.reset();
    }
  }

  

  searchDepartment(e,patchValue:boolean = false){
    this._departmentService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDepartment(){
      var params = '';
     
    this._departmentService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  cancel(){
    this.form.reset();
    this.selectedIndidentDepartment = null;
    this.clearClicked = false;
  }


  save(){
    IncidentInvestigationStore.investigationIncidentObjects.department_ids = [JSON.parse(JSON.stringify(this.selectedIndidentDepartment))];
    this._utilityService.showSuccessMessage('success','incident_department_added');
    this._utilityService.detectChanges(this._cdr);
    this.form.reset();

  }


}
