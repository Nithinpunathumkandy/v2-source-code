import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProjectStatus, ProjectStatusResponse } from "src/app/core/models/project-status.model";

class Store {

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    private _statusList: ProjectStatus[] = [];

    @action 
    setProjectStatusList(status: ProjectStatusResponse){
        this.loaded = true;
        this._statusList = status.data;
    }

    @computed
    get projectStatus(): ProjectStatus[]{
        return this._statusList.slice();
    }
    
}

export const ProjectStatusStore = new Store();