import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import{SectionMasterStore} from 'src/app/stores/masters/organization/section-store';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';


@Component({
  selector: 'app-sub-section-modal',
  templateUrl: './sub-section-modal.component.html',
  styleUrls: ['./sub-section-modal.component.scss']
})
export class SubSectionModalComponent implements OnInit {
  @Input('source') SubSectionSource: any;

  AppStore = AppStore;
  AuthStore = AuthStore;
  SubsidiaryStore = SubsidiaryStore;
  SectionMasterStore = SectionMasterStore;
  DivisionMasterStore = DivisionMasterStore;
  DepartmentMasterStore = DepartmentMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  form: FormGroup;
  formErrors: any;
  divisionId: number;
  departmentId: number;


  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _subsiadiaryService: SubsidiaryService,
    private _helperService: HelperServiceService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService, private _departmentService: DepartmentService,
    private _utilityService: UtilityService, private _divisionService: DivisionService) { }

  ngOnInit(): void {
   // Form Object to add Control Category

   this.form = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    organization_id: ['', [Validators.required]],
    section_id: ['']
  });

  if(OrganizationLevelSettingsStore.organizationLevelSettings.is_section == AppStore.activeStatusId){
    this.form.get('section_id').setValidators([Validators.required])
  }
  // restingForm on initial load
  this.resetForm();

  // for open organization

  this.getOrganization();


  // Checking if Source has Values and Setting Form Value

  if (this.SubSectionSource) {
    this.setFormValues();
  }

  // set Initial OrganizationLevels for add
  if(this.SubSectionSource.type == 'Add')
  this.setInitialOrganizationLevels();
}

setFormValues(){
  if (this.SubSectionSource.hasOwnProperty('values') && this.SubSectionSource.values) {
    let { id, title, organization_id, section_id,division_id, department_id } = this.SubSectionSource.values
    this.form.setValue({
      id: id,
      title: title,
      organization_id: organization_id,
      section_id: section_id
    })
    this.divisionId = division_id;
    this.departmentId = department_id;
    this.searchDivision({term: division_id});
    this.searchDepartment({term: department_id});
    this.getSection();
    this._utilityService.detectChanges(this._cdr);
  }
}

ngDoCheck(){
  if (this.SubSectionSource && this.SubSectionSource.hasOwnProperty('values') && this.SubSectionSource.values && !this.form.value.id)
    this.setFormValues();
}

getOrganization() {
  this._subsiadiaryService.getAllItems().subscribe((res:any) => {
    if(!OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary){
      this.form.patchValue({organization_id: res.data[0].id});
    }
    this._utilityService.detectChanges(this._cdr);
  })


}

getDivision(type?) {
  if(AuthStore.getActivityPermission(100,'DIVISION_LIST')){
    let params='';
    if (this.form.get('organization_id').value) {
      if(type){
        this.divisionId = null;
        DivisionMasterStore.setAllDivision([]);
        this.getDepartment(type);
        this.getSection(type);
      }
      params = `&organization_ids=${this.form.get('organization_id').value}`;
      this._divisionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      this.divisionId = null;
      DivisionMasterStore.setAllDivision([]);
      this.getDepartment(type);
      this.getSection(type);
    }
  }
}

searchDivision(event) {
  let params= '';
  if(this.form.get('organization_id').value){
    if(this.form.get('organization_id').value)
      params = params + `&organization_ids=${this.form.get('organization_id').value}`;
    this._divisionService.getItems(false, '&q=' + event.term+params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

  if(event.key == 'Escape' || event.code == 'Escape'){     

      this.cancel();

  }

}

getDepartment(type?) {
  let params= '';
  if(AuthStore.getActivityPermission(100,'DEPARTMENT_LIST')){
    if(this.form.get('organization_id').value) {
      if(type){
        this.departmentId = null;
        DepartmentMasterStore.setAllDepartment([]);
        this.getSection(type);
      }
      if (params)
        params = params + `&organization_ids=${this.form.get('organization_id').value}`;
      else
        params = `&organization_ids=${this.form.get('organization_id').value}`;
      if(this.divisionId){
        if(params)
          params = params + '&division_ids='+this.divisionId;
        else
          params = '&division_ids='+this.divisionId;
      }
      this._departmentService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.departmentId = null;
      DepartmentMasterStore.setAllDepartment([]);
      this.getSection(type);
    }
  }

}

// for searching the department

searchDepartment(event) {
  let params = '';
  if(this.form.get('organization_id').value){
    if(this.form.get('organization_id').value)
      params = params + `&organization_ids=${this.form.get('organization_id').value}`;
    if(this.divisionId){
      if(params)
        params = params + '&division_ids='+this.divisionId;
      else
        params = '&division_ids='+this.divisionId;
    }
    this._departmentService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
}



getSection(type?) {
  if(AuthStore.getActivityPermission(100,'SECTION_LIST')){
    let params= '';
    if(this.form.get('organization_id').value){
      if(type){
        this.form.controls["section_id"].reset();
        SectionMasterStore.setAllSection([]);
      }
      if (params)
        params = params + `&organization_ids=${this.form.get('organization_id').value}`;
      else
        params=`&organization_ids=${this.form.get('organization_id').value}`;
      if(this.divisionId){
        if(params)
          params = params + '&division_ids='+this.divisionId;
        else
          params = '&division_ids='+this.divisionId;
      }
      if(this.departmentId){
        if(params)
          params = params + '&department_ids='+this.departmentId;
        else
          params = '&department_ids='+this.departmentId;
      }
      this._sectionService.getItems(false, params).subscribe(res => {

        this._utilityService.detectChanges(this._cdr);
      })

    } else {
      this.form.controls["section_id"].reset();
      SectionMasterStore.setAllSection([]);
    }
  }
}



// for searching the Section

searchSection(event) {
  let params = '';
  if(this.form.get('organization_id').value){
    if(this.form.get('organization_id').value)
      params = params + `&organization_ids=${this.form.get('organization_id').value}`;
    if(this.divisionId){
      if(params)
        params = params + '&division_ids='+this.divisionId;
      else
        params = '&division_ids='+this.divisionId;
    }
    if(this.departmentId){
      if(params)
        params = params + '&department_ids='+this.departmentId;
      else
        params = '&department_ids='+this.departmentId;
    }
    this._sectionService.getItems(false, '&q=' + event.term + params ).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

// for searching organization

searchOrganization(event) {
  if(OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary){
    this._subsiadiaryService.getAllItems(false, '&q=' + event.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });  
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

// for closing the modal
closeFormModal() {
  this.resetForm();
  this._eventEmitterService.dismissOrganizationSubSectionControlModal();
}

// for save
save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._subSectionService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._subSectionService.saveItem(this.form.value);
    }

    save.subscribe((res: any) => {
      if (!this.form.value.id) {
        // this.resetForm();
        this.form.controls['title'].reset();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
      else if(err.status == 500 || err.status == 403){
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      
    });
  }
}

//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

setInitialOrganizationLevels(){
  this.form.patchValue({
    section_id:AuthStore.user.section ? AuthStore.user.section.id : null,
    organization_id: AuthStore?.user?.organization ? AuthStore?.user?.organization.id : null
  });
  this.departmentId = AuthStore.user.department ? AuthStore.user.department.id : null;
  this.divisionId = AuthStore.user.division ? AuthStore.user.division.id : null;
  // if(OrganizationLevelSettingsStore?.organizationLevelSettings?.is_subsidiary){
  //   this.form.patchValue({ organization_id: AuthStore?.user?.organization.id});
  // }
  if(OrganizationLevelSettingsStore?.organizationLevelSettings?.is_division) this.searchDivision({term: this.form.value.division_id});
  this.searchDepartment({term: this.departmentId});
  if(OrganizationLevelSettingsStore?.organizationLevelSettings?.is_section) this.searchSection({term: this.form.value.section_id});
  this._utilityService.detectChanges(this._cdr);
  this.getDivision();
  this.getDepartment();
  this.getSection();
}
}


