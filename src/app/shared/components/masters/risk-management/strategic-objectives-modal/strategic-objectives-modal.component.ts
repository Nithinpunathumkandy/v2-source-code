import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategicObjectivesService } from 'src/app/core/services/masters/risk-management/strategic-objectives/strategic-objectives.service';
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';
import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";
import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-strategic-objectives-modal',
  templateUrl: './strategic-objectives-modal.component.html',
  styleUrls: ['./strategic-objectives-modal.component.scss']
})
export class StrategicObjectivesModalComponent implements OnInit {

  @Input('source') RiskSourceSource: any;
  form: FormGroup;
  formErrors: any;
  saveData

  SubsidiaryStore = SubsidiaryStore;
  BranchesStore = BranchesStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  AppStore = AppStore;

  constructor(
    private _formBuilder: FormBuilder,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService:HelperServiceService,
    private _strategicObjectivesService: StrategicObjectivesService,
    private _utilityService: UtilityService,
    private _subsidiaryService: SubsidiaryService,
    private _branchService: BranchService,
    private _departmentService: DepartmentService,
    private _divisionService: DivisionService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      description: [''],
      department_ids: [[],[Validators.required]],
      organization_ids: [[],[Validators.required]],
      branch_ids: [[]],
      division_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
    });

    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
    // this.form.controls['branch_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    this.form.controls['division_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    this.form.controls['section_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    this.form.controls['sub_section_ids'].setValidators(Validators.required);

    // if(OrganizationLevelSettingsStore.organizationLevelSettings.is_section == AppStore.activeStatusId){
    //   this.form.get('section_ids').setValidators([Validators.required])
    // }
    // if(OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section == AppStore.activeStatusId){
    //   this.form.get('sub_section_ids').setValidators([Validators.required])
    // }
    // if(OrganizationLevelSettingsStore.organizationLevelSettings.is_division == AppStore.activeStatusId){
    //   this.form.get('division_ids').setValidators([Validators.required])
    // }
    // if(OrganizationLevelSettingsStore.organizationLevelSettings.is_branch == AppStore.activeStatusId){
    //   this.form.get('branch_ids').setValidators([Validators.required])
    // }
    this.resetForm();
    if(this.RiskSourceSource){
      this.getSubsidiary();
      this.getBranches();
      this.getDivision()
      this.getDepartment()
      this.getSubSection()
      this.getSection()
      this.setFormValues();
    }
  }

  setFormValues(){
    //console.log(this.RiskSourceSource.values);
    //console.log(this.RiskSourceSource.values.organization_ids);
    if (this.RiskSourceSource.hasOwnProperty('values') && this.RiskSourceSource.values) {
      let { id, title, description,organization_ids,department_ids,division_ids,section_ids,sub_section_ids} = this.RiskSourceSource.values
      this.form.patchValue({
        id: id,
        title: title,
        description:description,
        organization_ids:organization_ids,
        division_ids:this.RiskSourceSource.values.division_ids,
        branch_ids:this.RiskSourceSource.values.branch_ids,
        department_ids:this.RiskSourceSource.values.department_ids,
        section_ids:this.RiskSourceSource.values.section_ids,
        sub_section_ids:this.RiskSourceSource.values.sub_section_ids
      })
    } else {
      this.setInitialOrganizationLevels();
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


getTypes(data){
  let type=[];
  for(let i of data){
    type.push(i.id);
  }
  return type;
}

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissStrategicObjectivesModal();
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      this.saveData = {
        title:this.form.value.title ? this.form.value.title : '',
        description: this.form.value.description ? this.form.value.description : '',
        
      organization_ids:this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids,'id') : null,
      division_ids:this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids,'id') : null,
      branch_ids:this.form.value.branch_ids ? this._helperService.getArrayProcessed(this.form.value.branch_ids,'id') : null,
      department_ids:this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids,'id') : null,
      section_ids:this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids,'id') : null,
      sub_section_ids:this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids,'id') : null
      }
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._strategicObjectivesService.updateItem(this.form.value.id, this.saveData);
      } else {
        save = this._strategicObjectivesService.saveItem(this.saveData);
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
          console.log('chk',this.formErrors)
          this.formErrors = err.error.errors;
          this.processFormErrors();
        }
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
         
      });
    }
    }

    processFormErrors(){
      var errors = this.formErrors;
      for (var key in errors) {
        if (errors.hasOwnProperty(key)) {
          if(key.startsWith('organization_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['organization_ids'] = this.formErrors['organization_ids']? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('branch_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['branch_ids'] = this.formErrors['branch_ids']? this.formErrors['branch_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('division_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['division_ids'] = this.formErrors['division_ids']? this.formErrors['division_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('department_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['department_ids'] = this.formErrors['department_ids']? this.formErrors['department_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('section_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['section_ids'] = this.formErrors['section_ids']? this.formErrors['section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('sub_section_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids']? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
         
        }
      }
      this._utilityService.detectChanges(this._cdr);
    }
    
   
//getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


  searchSubsidiary(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  getSubsidiary() {
    this._subsidiaryService.getAllItems(false, '?access_all=true&is_full_list=true').subscribe(res => {
      //this.form.value.division_ids = [];
      this.DivisionStore.setAllDivision([]);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDivision(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
        //this.form.value.department_ids = [];
        this.DepartmentStore.setAllDepartment([]);
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getBranches(){
    if (this.form.get('organization_ids').value) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._branchService.getAllItems(false, '?organization_ids=' + parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();  
    }
  }
  
  searchBranches(e){
    if (this.form.get('organization_ids').value) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._branchService.getAllItems(false, '?organization_ids=' + parameters+ '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();  
    }
  }

  // Get Division
  getDivision() {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
        //this.form.value.department_ids = [];
        this.DepartmentStore.setAllDepartment([]);
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DivisionStore.setAllDivision([]);
    }
  }

  searchDepartment(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      //let parameters = this._helperService.createParameterFromArray(this.riskForm.get('division_ids').value);
      this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this.SectionStore.setAllSection([]);
        //this.form.value.section_ids = [];
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Department
  getDepartment() {
    // console.log('department');
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      //let parameters = this._helperService.createParameterFromArray(this.riskForm.get('division_ids').value);
      this._departmentService.getItems(false, params).subscribe(res => {
        this.SectionStore.setAllSection([]);
        //this.form.value.section_ids = [];
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  // Get Section
  getSection() {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      this._sectionService.getItems(false, params).subscribe(res => {
        //this.form.value.sub_section_ids = [];
        this.SubSectionStore.setAllSubSection([]);
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.SectionStore.setAllSection([]);
    }
  }

  /**
  * Search Section
  * @param e e.term - character to search
  */
  searchSection(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      //let parameters = this._helperService.createParameterFromArray(this.riskForm.get('department_ids').value);
      this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        //this.form.value.sub_section_ids = [];
        this.SubSectionStore.setAllSubSection([]);
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Sub Section
  getSubSection() {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
      this._subSectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.SubSectionStore.setAllSubSection([]);
    }
  }

  /**
  * Search Sub Section
  * @param e e.term - character to search
  */
  searchSubSection(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
      this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }


  setInitialOrganizationLevels(){
    this.form.patchValue({
      branch_ids: [AuthStore?.user?.branch],
      division_ids: (AuthStore?.user?.division && OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)? [AuthStore?.user?.division] : [],
      department_ids:AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      section_ids:(AuthStore?.user?.section && OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) ? [AuthStore?.user?.section] : [],
      sub_section_ids: (AuthStore?.user?.sub_section && OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) ? [AuthStore?.user?.sub_section] : [],
      organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []
    });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.form.patchValue({ organization_ids: [AuthStore.user?.organization]});
    // }
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) 
    // this.searchBranches({term: this.form.value.branch_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) 
    this.searchDivision({term: this.form.value.division_ids});
    this.searchDepartment({term: this.form.value.department_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) 
    this.searchSection({term: this.form.value.section_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) 
    this.searchSubSection({term: this.form.value.sub_section_ids});
    this._utilityService.detectChanges(this._cdr);
     
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.key == 'Escape' || event.code == 'Escape'){
        this.cancel();
    }
  }


}
