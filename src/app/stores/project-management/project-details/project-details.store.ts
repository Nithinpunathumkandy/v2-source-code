import { observable, action, computed } from "mobx-angular";
import { ProjectManagementInfo } from "src/app/core/models/project-management/project-details/project-info";


class Store {
    @observable
    subProjectDetails: ProjectManagementInfo;

    @observable
    lastInsertedId: number = null;

    @observable
    selectedProjectId: number =null;

    @action
    setSubProjectDetails(subProjectDetails) {
        this.subProjectDetails = subProjectDetails;
    }

    @computed
    get getsubProjectDetails() {
        return this.subProjectDetails;
    }z

}

export const projectDetailStore = new Store();