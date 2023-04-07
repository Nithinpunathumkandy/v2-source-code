import { observable, action, computed } from "mobx-angular";
import { Access, AccessibleOrganizationLevels } from 'src/app/core/models/human-capital/users/user-setting';

class Store {
    @observable
    private _accessBranchList: Access[] = [];

    @observable
    private _accessOrganizationList: Access[] = [];

    @observable
    private _accessMsTypeList: Access[] = [];

    @observable
    private _loggedUseraccessBranchList: Access[] = [];

    @observable
    private _loggedUseraccessOrganizationList: Access[] = [];

    @observable
    private _loggedUseraccessMsTypeList: Access[] = [];

    @observable
    private _accessibleDivisions: AccessibleOrganizationLevels[] = [];

    @observable
    private _accessibleDepartments: AccessibleOrganizationLevels[] = [];

    @observable
    private _accessibleSection: AccessibleOrganizationLevels[] = [];

    @observable
    private _accessibleSubSection: AccessibleOrganizationLevels[] = [];

    @observable
    loaded: boolean = false;


    @action
    setAccesses(response: Access[], type) {
  
        if (type == 'branches'){
            this._accessBranchList = response;
        }
        else if (type == 'organization-structures')
            this._accessOrganizationList = response;
        else if (type == 'ms-types')
            this._accessMsTypeList = response;
        this.loaded = true;
    }

    @action
    setLoggedUserAccesses(response: Access[], type) {
        if (type == 'branches'){
            this._loggedUseraccessBranchList = response;
        } 
        else if (type == 'organization-structures')
            this._loggedUseraccessOrganizationList = response;
        else if (type == 'ms-types')
            this._loggedUseraccessMsTypeList = response;
    }

    getLoggedUserAccessDetails(type: string): Access[]{
        if (type == 'branches')
            return this._loggedUseraccessBranchList.slice();
        else if (type == 'organization-structures')
            return this._loggedUseraccessOrganizationList.slice();
        else if (type == 'ms-types')
            return this._loggedUseraccessMsTypeList.slice();
    }

    
    get accessBranchDetails(): Access[] {

        return this._accessBranchList.slice();
    }

    get accessOrganizationDetails(): Access[] {

        return this._accessOrganizationList.slice();
    }

   
    get accessMsTypeDetails(): Access[] {
        return this._accessMsTypeList.slice();
    }

    @action
    setAccessibleDivisions(divisions: AccessibleOrganizationLevels[]){
        this._accessibleDivisions = divisions;
    }

    @action
    setAccessibleDepartments(departments: AccessibleOrganizationLevels[]){
        this._accessibleDepartments = departments;
    }

    @action
    setAccessibleSections(sections: AccessibleOrganizationLevels[]){
        this._accessibleSection = sections;
    }

    @action
    setAccessibleSubSection(subSections: AccessibleOrganizationLevels[]){
        this._accessibleSubSection = subSections;
    }

    get accessibleDivisions():AccessibleOrganizationLevels[]{
        return this._accessibleDivisions;
    }

    get accessibleDepartments():AccessibleOrganizationLevels[]{
        return this._accessibleDepartments;
    }

    get accessibleSections():AccessibleOrganizationLevels[]{
        return this._accessibleSection;
    }

    get accessibleSubSections():AccessibleOrganizationLevels[]{
        return this._accessibleSubSection;
    }
}

export const UserAccessStore = new Store();