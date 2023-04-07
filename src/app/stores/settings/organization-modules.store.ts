import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { OrganizationModuleGroup, OrganizationModules,SubMenus,ModuleGroupsResponse, Labels } from 'src/app/core/models/settings/organization-modules';

class Store {
    @observable
    private _organizationModules: OrganizationModuleGroup[] = [];

    @observable
    private _moduleLanguageLabelDetails: Labels[] = [];
    
    @observable
    private _subModuleLanguageLabelDetails: Labels[] = [];
    
    @observable
    moduleId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    private _organizationModulesSettings: OrganizationModuleGroup[] = [];

    @observable
    settings_loaded: boolean = false;

    @observable
    private _moduleData: ModuleGroupsResponse;

    @action
    setOrganizationModules(modules: OrganizationModuleGroup[]) {
        this._organizationModules = modules;
        this.loaded = true;
    }

    @action
    setModuleLaguageLabelDetails(details) {
        this._moduleLanguageLabelDetails=details;
    }

    @action
    setSubModuleLaguageLabelDetails(details) {
        this._subModuleLanguageLabelDetails=details;
    }

    @computed
    get organizationModules(): OrganizationModuleGroup[] {
        return this._organizationModules.length > 0 ? this._organizationModules.slice() : [];
    }

    @action
    setOrganizationModulesSettings(modules: OrganizationModuleGroup[]) {
        this._organizationModulesSettings = modules;
        this.settings_loaded = true;
    }

    @computed
    get organizationModulesSettings(): OrganizationModuleGroup[] {
        return this._organizationModulesSettings.length > 0 ? this._organizationModulesSettings.slice() : [];
    }

    getOrganizationSubmenuByid(id) {
        let subMenu =[];
        let subMenuDetail;
        for (const modules of  this.organizationModulesSettings) {
          for (const sub of modules.modules) {
            subMenu.push(sub);
            subMenuDetail = subMenu.find(e=>e.module_id == id);
          }
        }
        return subMenuDetail;
    }

    getOrganizationModuleByid(id) {
        let moduleDetail;
        moduleDetail = this.organizationModulesSettings.find(e=>e.id == id)
        return moduleDetail;
    }


    @action
    setModuleGroups(response: ModuleGroupsResponse) {
        this._moduleData = response;
    }
    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._moduleData;
    }
    
    /*************************************** Get Module List by Id****************************************************************/

    getOrganziationModulesByModuleGroup(moduleGroupId: number):OrganizationModules[]{
        var pos = this._organizationModules.findIndex(e=>e.id == moduleGroupId);
        if(pos != -1) return this._organizationModules[pos].modules;
        else return [];
    }


    getOrganizationSubModules(moduleGroupId: number,moduleId: number): SubMenus[]{
        var pos = this._organizationModules.findIndex(e=>e.id == moduleGroupId);
        if(pos != -1){
            var subModulesPos =  this._organizationModules[pos]?.modules.findIndex(e=>e.module_id == moduleId);
            return this._organizationModules[pos].modules[subModulesPos].sub_menus;
        }
        else
            return ([]);
    }

    checkSubModules(moduleGroupId: number): boolean{
        var returnValue = false;
        var pos = this._organizationModules.findIndex(e=>e.id == moduleGroupId);
        for(let i of this._organizationModules[pos].modules){
            if(i.hasOwnProperty('is_menu') && i.is_menu != 0){
                returnValue = true;
                break;
            }
        }
        return returnValue;
    }

    
    checkIndividualSubModule(moduleGroupId: number,subModuleId:number):boolean{
        var returnValue = false;
        var pos = this._organizationModules.findIndex(e=>e.id == moduleGroupId);
        var pos2 = this._organizationModules[pos]?.modules.findIndex(d=>d.module_id == subModuleId);
        if(pos!=-1 && pos2!=-1){
            returnValue=true;
        }
        else
        returnValue=false;
        
        return returnValue;
    }

    checkOrganizationSubModulesPermission(moduleGroupId: number,moduleId: number): boolean{
        var pos = this._organizationModules.findIndex(e=>e.id == moduleGroupId);
        if(pos != -1){
            var subModulesPos =  this._organizationModules[pos].modules.findIndex(e=>e.module_id == moduleId);
            if(subModulesPos == -1 || (subModulesPos != -1 && this._organizationModules[pos]?.modules[subModulesPos].inactive)) return false;
            else return true;
        }
        else
            return false;
    }

    checkOrganizationModules(moduleGroupId: number){
        var pos = this._organizationModules.findIndex(e=>e.id == moduleGroupId);
        if(pos != -1){
            return true;
        }
        else
            return false;
    }

    /*************************************** Get Module List by Id****************************************************************/

    /*************************************** Get Module List by Client Side Url ****************************************************************/

    checkOrganizationModulesByUrl(url){
        var pos = this._organizationModules.findIndex(e=>e.client_side_url == url);
        if(pos != -1){
            return true;
        }
        else
            return false;
    }

    checkOrganizationSubModulesPermissionByUrl(moduleGroupUrl: string, moduleUrl: string): boolean{
        var pos = this._organizationModules.findIndex(e=>e.client_side_url == moduleGroupUrl);
        if(pos != -1){
            var subModulesPos =  this._organizationModules[pos].modules.findIndex(e=>e.client_side_url == moduleUrl);
            if(subModulesPos == -1 || (subModulesPos != -1 && this._organizationModules[pos]?.modules[subModulesPos].inactive)) return false;
            else return true;
        }
        else
            return false;
    }
    
    /*************************************** Get Module List by Client Side Url ****************************************************************/
}

export const OrganizationModulesStore = new Store();