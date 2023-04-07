import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { UserAccessService } from 'src/app/core/services/human-capital/user/user-setting/user-access/user-access.service';
import { UserAccessStore } from 'src/app/stores/human-capital/users/user-setting/user-access.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UserAccessStore = UserAccessStore;
  active = '';
  organization_ids = [];
  branch_ids = [];
  msType_ids = [];
  division_ids = [];
  department_ids = [];
  section_ids = [];
  subSection_ids = [];
  AuthStore = AuthStore;
  NoDataItemStore = NoDataItemStore;
  UsersStore = UsersStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _userAccessService: UserAccessService,
    private _helperService:HelperServiceService) { }



  ngOnInit() {
    this._userAccessService.getItems('ms-types').subscribe();
    this._userAccessService.getItems('organization-structures').subscribe();

    this.getItems('branches', true);
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    // this.getItems('organization-structures', true);

    this.form = this._formBuilder.group({
      organization_ids: [''],
      branch_ids: [''],
      division_ids: [''],
      department_ids: [''],
      section_ids: [''],
      sub_section_ids: [''],
      ms_type_organization_ids: ['']
    });
    //this._userAccessService.getItems().subscribe();
  }

  getItems(type, initial: boolean = false) {
    if (this.active == type) {
      this.active = null;
    }
    else {
      this.active = type;
      this._userAccessService.getItems(type).subscribe(res => {
        //setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this.getChecked(type);
        //}, 100);

      });
    }

  }


  submitData() {
    AppStore.enableLoading();
    this.setSelected();
    this.form.patchValue({
      organization_ids: this.organization_ids,
      branch_ids: this.branch_ids,
      ms_type_organization_ids: this.msType_ids,
      division_ids: this.division_ids,
      department_ids: this.department_ids,
      section_ids: this.section_ids,
      sub_section_ids: this.subSection_ids,
    })

    this.formErrors = null;
    if (this.form.valid) {


      this._userAccessService.saveItem(this.form.value).subscribe((res: any) => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 200);

        AppStore.disableLoading();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;

        }
        
      });
    }
  }

  getChecked(type) {
    let disabled = false;
    let details = [];
    if (type == 'branches') {
      details = UserAccessStore.accessBranchDetails;
    }
    else if (type == 'organization-structures') {
      details = UserAccessStore.accessOrganizationDetails;
    }
    for (let i of details) {
      if (i.is_enabled) {

      }
      else {
        disabled = true;
      }
    }
    if (disabled)
      return false;
    else
      return true;

  }

  changeBranchEnabled(type, event, index?: number, subIndex?: number) {
    // console.log(type);
    switch (type) {
      case 'branches':
        if (event.currentTarget.checked) {
          UserAccessStore.accessBranchDetails[0].is_enabled = true;
          for (let i of UserAccessStore.accessBranchDetails[0].organizations) {
            i.is_enabled = true;
            if (i.branches) {
              for (let j of i.branches) {
                j.is_enabled = true;
              }
            }

          }

        }

        else {
          UserAccessStore.accessBranchDetails[0].is_enabled = false;
          for (let i of UserAccessStore.accessBranchDetails[0].organizations) {
            i.is_enabled = false;
            if (i.branches) {
              for (let j of i.branches) {
                j.is_enabled = false;
              }
            }

          }
        }

        break;
      case 'branch_name':
        if (event.currentTarget.checked) {
          
          UserAccessStore.accessBranchDetails[0].organizations[index].is_enabled = true;
          for (let i of UserAccessStore.accessBranchDetails[0].organizations[index].branches) {
            i.is_enabled = true;
          }
          // this.checkAllBranchNameEnabled();
        }
        else {
          // UserAccessStore.accessBranchDetails[0].is_enabled = false;
          UserAccessStore.accessBranchDetails[0].organizations[index].is_enabled = false;
          for (let i of UserAccessStore.accessBranchDetails[0].organizations[index].branches) {
            i.is_enabled = false;
          }
        }
        break;
      case 'branch':
        if (event.currentTarget.checked){
          UserAccessStore.accessBranchDetails[0].organizations[index].branches[subIndex].is_enabled = true;
          // this.checkAllBranchEnabled(index);
        }
         

        else {
          // UserAccessStore.accessBranchDetails[0].is_enabled = false;
          // UserAccessStore.accessBranchDetails[0].organizations[index].is_enabled = false;
          UserAccessStore.accessBranchDetails[0].organizations[index].branches[subIndex].is_enabled = false
        }
        break;


    }
  }

  checkAllBranchNameEnabled() {
    let brNameEnabled = 0;
    for (let i of UserAccessStore.accessBranchDetails[0].organizations) {
      if (i.is_enabled == false)
        brNameEnabled++;

    }
    if (brNameEnabled == 0) {
      UserAccessStore.accessBranchDetails[0].is_enabled = true;
    }
  }

  checkAllBranchEnabled(index){
    let brEnabled = 0;
    for(let i of UserAccessStore.accessBranchDetails[0].organizations[index].branches){
      if(i.is_enabled==false)
      brEnabled++;
    }
    if(brEnabled == 0){
      UserAccessStore.accessBranchDetails[0].organizations[index].is_enabled=true;
      this.checkAllBranchNameEnabled();
    }
  }


  changeMsTypeEnabled(type, event, index?: number) {
    switch (type) {
      case 'ms-type':
        if (event.currentTarget.checked) {
          UserAccessStore.accessMsTypeDetails[0].is_enabled = true;
          for (let i of UserAccessStore.accessMsTypeDetails[0].ms_types) {
            i.is_enabled = true;
          }
        }

        else {
          UserAccessStore.accessMsTypeDetails[0].is_enabled = false;
          for (let i of UserAccessStore.accessMsTypeDetails[0].ms_types) {
            i.is_enabled = false;
          }
        }

        break;
      case 'types':
        if (event.currentTarget.checked) {
          UserAccessStore.accessMsTypeDetails[0].ms_types[index].is_enabled = true;
          // this.checkAllMsTypeEnabled();
        }


        else {
          // UserAccessStore.accessMsTypeDetails[0].is_enabled = false;
          UserAccessStore.accessMsTypeDetails[0].ms_types[index].is_enabled = false;
        }
        break;
    }
  }

  checkAllMsTypeEnabled() {
    let notEnabledCount = 0;

    for (let i of UserAccessStore.accessMsTypeDetails[0].ms_types) {
      if (!i.is_enabled == true) {
        notEnabledCount++;
        break;
      }
    }
    if (notEnabledCount == 0)
      UserAccessStore.accessMsTypeDetails[0].is_enabled = true;

  }


  changeOrganizationEnabled(type, event, organization?: number, division?: number, department?: number, section?: number, sub_section?: number) {
    // console.log(type);
    switch (type) {
      case 'organizations':
        if (event.currentTarget.checked) {
          UserAccessStore.accessOrganizationDetails[0].is_enabled = true;
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization) {
            i.is_enabled = true;
            for (let j of i.divisions) {
              j.is_enabled = true;
              for (let k of j.departments) {
                k.is_enabled = true;
                for (let l of k.sections) {
                  l.is_enabled = true;
                  for (let m of l.sub_sections) {
                    m.is_enabled = true;
                  }
                }
              }
            }
          }
        }

        else {
          UserAccessStore.accessOrganizationDetails[0].is_enabled = false;
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization) {
            i.is_enabled = false;
            for (let j of i.divisions) {
              j.is_enabled = false;
              for (let k of j.departments) {
                k.is_enabled = false;
                for (let l of k.sections) {
                  l.is_enabled = false;
                  for (let m of l.sub_sections) {
                    m.is_enabled = false;
                  }
                }
              }
            }
          }
        }


        break;
      case 'organization_title':
        if (event.currentTarget.checked) {
          UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = true;
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions) {
            i.is_enabled = true;
            for (let j of i.departments) {
              j.is_enabled = true;
              for (let k of j.sections) {
                k.is_enabled = true;
                for (let l of k.sub_sections) {
                  l.is_enabled = true;
                }
              }
            }
          }
          // this.checkAllOrgTitleEnabled();
        }


        else {
          // UserAccessStore.accessOrganizationDetails[0].is_enabled = false;
          UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = false;
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions) {
            i.is_enabled = false;
            for (let j of i.departments) {
              j.is_enabled = false;
              for (let k of j.sections) {
                k.is_enabled = false;
                for (let l of k.sub_sections) {
                  l.is_enabled = false;
                }
              }
            }
          }
        }
        break;
      case 'division':
        if (event.currentTarget.checked) {
          UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = true;
          
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled = true;
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments) {
            i.is_enabled = true;
            for (let j of i.sections) {
              j.is_enabled = true;
              for (let k of j.sub_sections) {
                k.is_enabled = true;
              }
            }
          }

          // this.checkOrgDivisionEnabled(organization);
        }
        else {
          // UserAccessStore.accessOrganizationDetails[0].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = false;
          
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled = false;
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments) {
            i.is_enabled = false;
            for (let j of i.sections) {
              j.is_enabled = false;
              for (let k of j.sub_sections) {
                k.is_enabled = false;
              }
            }
          }
        }
        break;

      case 'department':
        if (event.currentTarget.checked) {
          UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = true;
          
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled = true;
        
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].is_enabled = true;
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections) {
            i.is_enabled = true;
            for (let j of i.sub_sections) {
              j.is_enabled = true;

            }
          }
          // this.checkOrgDepartmentEnabled(organization,division);
        }
        else {
          // UserAccessStore.accessOrganizationDetails[0].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled = false;
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].is_enabled = false
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections) {
            i.is_enabled = false;
            for (let j of i.sub_sections) {
              j.is_enabled = false;

            }
          }
        }
        break;

      case 'section':
        if (event.currentTarget.checked) {
          UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = true;
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled = true;
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].is_enabled = true;
         
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].is_enabled = true;
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].sub_sections) {
            i.is_enabled = true;

          }
          // this.checkOrgSectionEnabled(organization,division,department);
        }
        else {
          // UserAccessStore.accessOrganizationDetails[0].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].is_enabled = false
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].is_enabled = false
          for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].sub_sections) {
            i.is_enabled = false;

          }
        }
        break;

      case 'sub_section':
        if (event.currentTarget.checked) {
          UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = true;
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled = true;
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].is_enabled = true;
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].is_enabled = true;
         
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].sub_sections[sub_section].is_enabled = true;
          // this.checkOrgSubSectionEnabled(organization,division,department,section);
        }
        else {
          // UserAccessStore.accessOrganizationDetails[0].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled = false;
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].is_enabled = false
          // UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].is_enabled = false
          UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].sub_sections[sub_section].is_enabled = false

        }
        break;
    }
  }

  checkAllOrgTitleEnabled(){
    let getCount = 0;
    for (let i of UserAccessStore.accessOrganizationDetails[0].organization){
      if(!i.is_enabled){
        getCount++;
      }
    }
    if(getCount == 0){
      UserAccessStore.accessOrganizationDetails[0].is_enabled=true;
    }
  }

  checkOrgDivisionEnabled(organization){
    let getCount = 0;
    for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions){
      if(!i.is_enabled){
        getCount++;
      }
    }
    if(getCount==0){
      UserAccessStore.accessOrganizationDetails[0].organization[organization].is_enabled=true;
      this.checkAllOrgTitleEnabled();
    }

  }

  checkOrgDepartmentEnabled(organization,division){
    let getCount = 0;
    for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments){
      if(!i.is_enabled){
        getCount++;
      }
    }
    if(getCount == 0){
      UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].is_enabled=true;
      this.checkOrgDivisionEnabled(organization);
    }
  }

  checkOrgSectionEnabled(organization,division,department){
    let getCount = 0;
    for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections){
      if(!i.is_enabled){
        getCount++;
      }
    }
    if(getCount == 0){
      UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].is_enabled=true;
      this.checkOrgDepartmentEnabled(organization,division);
    }
  }

  checkOrgSubSectionEnabled(organization,division,department,section){
    let getCount = 0;
    for (let i of UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].sub_sections){
      if(!i.is_enabled){
        getCount++;
      }
    }
    if(getCount == 0){
      UserAccessStore.accessOrganizationDetails[0].organization[organization].divisions[division].departments[department].sections[section].is_enabled=true;
      this.checkOrgSectionEnabled(organization,division,department);
    }
  }

  checkAvailableMsTypes(){
    if(UserAccessStore?.accessMsTypeDetails && UserAccessStore?.accessMsTypeDetails?.length > 0 && UserAccessStore?.accessMsTypeDetails[0].ms_types){
      return UserAccessStore?.accessMsTypeDetails[0].ms_types;
    }
    else{
      return []
    }
  }


  setSelected() {
    this.branch_ids = [];
    this.organization_ids = [];
    this.msType_ids = [];
    this.division_ids = [];
    this.department_ids = [];
    this.section_ids = [];
    this.subSection_ids = [];
    if(UserAccessStore.accessBranchDetails[0]?.organizations?.length>0){
      for (let i of UserAccessStore.accessBranchDetails[0].organizations) {
        if (i.branches) {
          for (let j of i.branches) {
            if (j.is_enabled == true) {
              this.branch_ids.push(j.id);
            }
          }
        }
  
      }
    }
    
    if(UserAccessStore.accessMsTypeDetails[0]?.ms_types?.length>0){
      for (let i of UserAccessStore.accessMsTypeDetails[0].ms_types) {
        if (i.is_enabled == true) {
          this.msType_ids.push(i.ms_type_organization_id);
        }
      }
    }
   
    if(UserAccessStore.accessOrganizationDetails[0]?.organization?.length>0){
      for (let i of UserAccessStore.accessOrganizationDetails[0].organization) {
        if (i.is_enabled == true)
          this.organization_ids.push(i.id);
        for (let j of i.divisions) {
          if (j.is_enabled == true)
            this.division_ids.push(j.id);
          for (let k of j.departments) {
            if (k.is_enabled == true)
              this.department_ids.push(k.id);
            for (let l of k.sections) {
              if (l.is_enabled == true)
                this.section_ids.push(l.id);
              for (let m of l.sub_sections) {
                if (m.is_enabled == true)
                  this.subSection_ids.push(m.id);
              }
            }
          }
        }
      }
    }
    
  }

  
  
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
