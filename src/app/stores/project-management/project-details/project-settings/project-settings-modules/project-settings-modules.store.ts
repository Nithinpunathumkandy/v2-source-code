import { action, computed, observable } from "mobx";
import { ProjectSettingsModules } from "src/app/core/models/project-management/project-details/project-settings/project-settings";

class Store {
    @observable
    public modules: ProjectSettingsModules[] = [];

    @observable
    modulesLoaded = false;

    @action
    setProjectSettingsModules(res){
        this.modules = res
    }

    @computed
    get getProjectSettingsModules(){
        return this.modules
    }


}

export const ProjectSettingsModulesStore = new Store();