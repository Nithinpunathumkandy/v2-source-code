import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserAccessService } from 'src/app/core/services/human-capital/user/user-setting/user-access/user-access.service';
import { UserAccessStore } from 'src/app/stores/human-capital/users/user-setting/user-access.store';
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";

import { UtilityService } from 'src/app/shared/services/utility.service';
import { JwtService } from 'src/app/core/auth/services/jwt.service';

import { Access } from 'src/app/core/models/human-capital/users/user-setting';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-access-configuration',
  templateUrl: './access-configuration.component.html',
  styleUrls: ['./access-configuration.component.scss']
})
export class AccessConfigurationComponent implements OnInit {

  UserAccessStore = UserAccessStore;
  selectedOrganization: Access;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  AuthStore = AuthStore;
  constructor(private _userAccessService: UserAccessService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _jwtService: JwtService,) { }

  ngOnInit(): void {
    this.getItems('branches');
    // this.getItems('ms-types');
    this.getDivisions();
    this.getDepartment();
    this.getSection();
    this.getSubSection();
  }

  getItems(type){
    this._userAccessService.getUserAccessConfiguration(type).subscribe((res:any) => {
      if(type == 'branches' && res.length > 0){
        if(res[0].hasOwnProperty('organizations')){
          this.organizationSelected(res[0]['organizations'][0]);
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDivisions(){
    this._userAccessService.getAccessibleDivisions().subscribe((res:any)=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDepartment(){
    this._userAccessService.getAccessibleDepartments().subscribe((res:any)=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSection(){
    this._userAccessService.getAccessibleSections().subscribe((res:any)=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSubSection(){
    if(AuthStore.getActivityPermission(100,'USER_ME_SUB_SECTION_LIST')){
      this._userAccessService.getAccessibleSubSections().subscribe((res:any)=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    
  }

  organizationSelected(organization: Access){
    this.selectedOrganization = organization;
  }

}
