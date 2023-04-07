import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
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
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';

@Component({
  selector: 'app-organisation-change-modal',
  templateUrl: './organisation-change-modal.component.html',
  styleUrls: ['./organisation-change-modal.component.scss']
})
export class OrganisationChangeModalComponent implements OnInit {

  @Input('source') TrainingSourceSource: any;
  @Output() organizationChangeEvent = new EventEmitter<any>();
  form: FormGroup;
  formErrors: any;
  saveData: any;

  SubsidiaryStore = SubsidiaryStore;
  BranchesStore = BranchesStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  AppStore = AppStore;
  TrainingStore = TrainingsStore;

  OrganizationalSettingsStore = OrganizationalSettingsStore

  constructor(
    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
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
      // id: [''],
      department_ids: [[], [Validators.required]],
      organization_ids: [[]],
      branch_ids: [[]],
      division_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
    });

    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
      this.form.controls['organization_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.form.controls['division_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.form.controls['section_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.form.controls['sub_section_ids'].setValidators(Validators.required);
    this.resetForm();
    this.getSubsidiary();
    this.getBranches();
    this.getDivision()
    this.getDepartment()
    this.getSubSection()
    this.getSection()
    this.setFormValues();
  }

  setFormValues() {
    // if (this.TrainingSourceSource?.hasOwnProperty('values') && this.TrainingSourceSource?.values) {
    //   let { id, organization_ids, department_ids, division_ids, section_ids, sub_section_ids} = this.TrainingSourceSource.values
    if (this.TrainingSourceSource) {
      let { id, organization_ids, branch_ids, department_ids, division_ids, section_ids, sub_section_ids } = this.TrainingSourceSource
      this.form.patchValue({
        id: id,
        organization_ids: this.TrainingSourceSource.organization_ids ? this.TrainingSourceSource.organization_ids : this.TrainingSourceSource.document_organization_ids ? this.TrainingSourceSource.document_organization_ids : this.TrainingSourceSource.organization_id,
        division_ids: this.TrainingSourceSource.division_ids ? this.TrainingSourceSource.division_ids : this.TrainingSourceSource.document_division_ids ? this.TrainingSourceSource.document_division_ids : this.TrainingSourceSource.division_id,
        branch_ids: this.TrainingSourceSource.branch_ids ? this.TrainingSourceSource.branch_ids : this.TrainingSourceSource.branch_id,
        department_ids: this.TrainingSourceSource.department_ids ? this.TrainingSourceSource.department_ids : this.TrainingSourceSource.document_department_ids ? this.TrainingSourceSource.document_department_ids : this.TrainingSourceSource.department_id,
        section_ids: this.TrainingSourceSource.section_ids ? this.TrainingSourceSource.section_ids : this.TrainingSourceSource.document_section_ids ? this.TrainingSourceSource.document_section_ids : this.TrainingSourceSource.section_id,
        sub_section_ids: this.TrainingSourceSource.sub_section_ids ? this.TrainingSourceSource.sub_section_ids : this.TrainingSourceSource.document_sub_section_ids ? this.TrainingSourceSource.document_sub_section_ids : this.TrainingSourceSource.sub_section_id
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

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }


  getTypes(data) {
    let type = [];
    for (let i of data) {
      type.push(i.id);
    }
    return type;
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissOrganisationChangesModal();
  }



  processFormErrors() {
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (key.startsWith('organization_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['organization_ids'] = this.formErrors['organization_ids'] ? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('branch_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['branch_ids'] = this.formErrors['branch_ids'] ? this.formErrors['branch_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('division_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['division_ids'] = this.formErrors['division_ids'] ? this.formErrors['division_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('department_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['department_ids'] = this.formErrors['department_ids'] ? this.formErrors['department_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('section_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['section_ids'] = this.formErrors['section_ids'] ? this.formErrors['section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('sub_section_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids'] ? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }

      }
    }
    this._utilityService.detectChanges(this._cdr);
  }


  //getting button name by language
  getButtonText(text) {
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



  getBranches() {
    // if (this.form.get('organization_ids').value) {
    //   let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      if (this.form.get('organization_ids').value) {
        let parameters
        if (OrganizationalSettingsStore.isMultiple) {
          parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
        } else {
          parameters = this.form.value.organization_ids.id;
        }
        this._branchService.getAllItems(false, '?organization_ids=' + parameters).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        });
      }
      else {
        this.BranchesStore.clearBranchList();
      }
    }
    else {
      this._branchService.getAllItems(false, null).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchBranches(e) {
    // if (this.form.get('organization_ids').value) {
    //   let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      if (this.form.get('organization_ids').value) {
        let parameters
        if (OrganizationalSettingsStore.isMultiple) {
          parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
        } else {
          parameters = this.form.value.organization_ids.id;
        }
        this._branchService.getAllItems(false, '?organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        });
      }
      else {
        this.BranchesStore.clearBranchList();
      }
    }
    else {
      this._branchService.getAllItems(false, '?q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }



  setNull(type) {
    switch (type) {
      case 'organization':
        this.form.patchValue({
          division_ids: null,
          department_ids: null,
          section_ids: null,
          sub_section_ids: null
        })
        break;
      case 'division':
        this.form.patchValue({

          department_ids: null,
          section_ids: null,
          sub_section_ids: null
        })
        break;
      case 'department':
        this.form.patchValue({

          section_ids: null,
          sub_section_ids: null
        })
        break;
      case 'section':
        this.form.patchValue({

          sub_section_ids: null
        })
        break;


    }
  }
  searchDivision(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      if (this.form.get('organization_ids').value) {
        let parameters
        if (OrganizationalSettingsStore.isMultiple) {
          parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
        } else {
          parameters = this.form.value.organization_ids.id;
        }
        this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        });
      }
      else {
        this.DivisionStore.setAllDivision([]);
      }
    }
    else {
      this._divisionService.getItems(false, '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  // Get Division
  getDivision() {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      if (this.form.get('organization_ids').value) {
        let parameters
        if (OrganizationalSettingsStore.isMultiple) {
          parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
        } else {
          parameters = this.form.value.organization_ids.id;
        }
        this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        });
      }
      else {
        this.DivisionStore.setAllDivision([]);
      }
    }
    else {
      this._divisionService.getItems(false).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

  }

  searchDepartment(e) {
    var params = '';
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary && this.form.get('organization_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      } else {
        params = '&organization_ids=' + (this.form.value.organization_ids ? this.form.value.organization_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division && this.form.get('division_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      } else {
        params = params +
          '&division_ids=' + (this.form.value.division_ids ? this.form.value.division_ids.id : '')
      }
    }
    this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Get Department
  getDepartment() {
    var params = '';
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary && this.form.get('organization_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      } else {
        params = '&organization_ids=' + (this.form.value.organization_ids ? this.form.value.organization_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division && this.form.get('division_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      } else {
        params = params +
          '&division_ids=' + (this.form.value.division_ids ? this.form.value.division_ids.id : '')
      }
    }
    this._departmentService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Get Section
  getSection() {
    var params = '';
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary && this.form.get('organization_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)

      } else {
        params = '&organization_ids=' + (this.form.value.organization_ids ? this.form.value.organization_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division && this.form.get('division_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      } else {
        params = params +
          '&division_ids=' + (this.form.value.division_ids ? this.form.value.division_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department && this.form.get('department_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      } else {
        params = params +
          '&department_ids=' + (this.form.value.department_ids ? this.form.value.department_ids.id : '')
      }
    }
    this._sectionService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  /**
  * Search Section
  * @param e e.term - character to search
  */
  searchSection(e) {
    var params = '';
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary && this.form.get('organization_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      } else {
        params = '&organization_ids=' + (this.form.value.organization_ids ? this.form.value.organization_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division && this.form.get('division_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      } else {
        params = params +
          '&division_ids=' + (this.form.value.division_ids ? this.form.value.division_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department && this.form.get('department_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      } else {
        params = params +
          '&department_ids=' + (this.form.value.department_ids ? this.form.value.department_ids.id : '')
      }
    }
    this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  // Get Sub Section
  getSubSection() {
    var params = '';
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary && this.form.get('organization_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      } else {
        params = '&organization_ids=' + (this.form.value.organization_ids ? this.form.value.organization_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division && this.form.get('division_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      } else {
        params = params +
          '&division_ids=' + (this.form.value.division_ids ? this.form.value.division_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department && this.form.get('department_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      } else {
        params = params +
          '&department_ids=' + (this.form.value.department_ids ? this.form.value.department_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section && this.form.get('section_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
      } else {
        params = params +
          '&section_ids=' + (this.form.value.section_ids ? this.form.value.section_ids.id : '')
      }
    }
    this._subSectionService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  /**
  * Search Sub Section
  * @param e e.term - character to search
  */
  searchSubSection(e) {
    var params = '';
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary && this.form.get('organization_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)

      } else {
        params = '&organization_ids=' + (this.form.value.organization_ids ? this.form.value.organization_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division && this.form.get('division_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      } else {
        params = params +
          '&division_ids=' + (this.form.value.division_ids ? this.form.value.division_ids.id : '')
      }
    }

    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department && this.form.get('department_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      } else {
        params = params +
          '&department_ids=' + (this.form.value.department_ids ? this.form.value.department_ids.id : '')
      }
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section && this.form.get('section_ids').value) {
      if (OrganizationalSettingsStore.isMultiple) {
        params = params +
          '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
      } else {
        params = params +
          '&section_ids=' + (this.form.value.section_ids ? this.form.value.section_ids.id : '')
      }
    }
    this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    this.formErrors = null;
    if (this.form.value) {
      var organisationObj
      if (OrganizationalSettingsStore.isMultiple) {
        organisationObj = {
          organization_ids: this.getData(this.form.value.organization_ids),
          branch_ids: this.getData(this.form.value.branch_ids),
          division_ids: this.getData(this.form.value.division_ids),
          department_ids: this.getData(this.form.value.department_ids),
          section_ids: this.getData(this.form.value.section_ids),
          sub_section_ids: this.getData(this.form.value.sub_section_ids)
        }
      } else {
        organisationObj = {
          organization_ids: this.form.value.organization_ids,
          branch_ids: this.form.value.branch_ids,
          division_ids: this.form.value.division_ids,
          department_ids: this.form.value.department_ids,
          section_ids: this.form.value.section_ids,
          sub_section_ids: this.form.value.sub_section_ids
        }
      }
      if (!OrganizationalSettingsStore.showBranch) delete organisationObj.branch_ids;
    }
    if (close) {
      this.organizationChangeEvent.emit(organisationObj);
      AppStore.disableLoading();
      this.closeFormModal();
      this._utilityService.showSuccessMessage('success', 'Organization Unit Added Successfully');
      this._utilityService.detectChanges(this._cdr);
    }
  }

  getData(value) {
    let data = [];
    if (value) {
      for (let i of value) {
        data.push(i);
      }
    }
    return data;
  }

  getPlaceholder(type) {
    switch (type) {
      case 'organization':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_organizations') : this._helperService.translateToUserLanguage('select_organization');
        break;
      case 'branch':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_branches') : this._helperService.translateToUserLanguage('select_branch');
        break;
      case 'division':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_divisions') : this._helperService.translateToUserLanguage('select_division');
        break;
      case 'department':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_departments') : this._helperService.translateToUserLanguage('select_department');
        break;
      case 'section':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_sections') : this._helperService.translateToUserLanguage('select_section');
        break;
      case 'sub_section':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_sub_sections') : this._helperService.translateToUserLanguage('select_sub_section');
        break;
    }
  }

  setInitialOrganizationLevels() {
    if (OrganizationalSettingsStore.isMultiple) {
      this.form.patchValue({
        branch_ids: AuthStore?.user?.branch ? [AuthStore?.user?.branch] : [],
        division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
        department_ids: AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
        section_ids: AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
        sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
        organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []
      });
      if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
        this.searchBranches({ term: this.form.value.branch_ids });
      if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
        this.searchDivision({ term: this.form.value.division_ids });
      this.searchDepartment({ term: this.form.value.department_ids });
      if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
        this.searchSection({ term: this.form.value.section_ids });
      if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
        this.searchSubSection({ term: this.form.value.sub_section_ids });

    } else {
      this.form.patchValue({
        branch_ids: AuthStore?.user?.branch ? AuthStore?.user?.branch : null,
        division_ids: AuthStore?.user?.division ? AuthStore?.user?.division : null,
        department_ids: AuthStore?.user?.department ? AuthStore?.user?.department : null,
        section_ids: AuthStore?.user?.section ? AuthStore?.user?.section : null,
        sub_section_ids: AuthStore?.user?.sub_section ? AuthStore?.user?.sub_section : null,
        organization_ids: AuthStore.user?.organization ? AuthStore.user?.organization : null,

      });
      if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchBranches({ term: this.form.value.branch_ids.id });
      if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.form.value.division_ids.id });
      this.searchDepartment({ term: this.form.value.department_ids.id });
      if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.form.value.section_ids.id });
      if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.form.value.sub_section_ids.id });

    }
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.form.patchValue({ organization_ids: [AuthStore.user?.organization]});
    // }
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) 
    // this.searchBranches({term: this.form.value.branch_ids});

    this._utilityService.detectChanges(this._cdr);

  }


}
