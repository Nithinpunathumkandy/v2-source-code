import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { BusinessProjects, BusinessProjectsResponse, BusinessProjectDetails } from 'src/app/core/models/organization/business_profile/business-projects';
import { Location } from "src/app/core/models/location.model";
import { AllUsers } from 'src/app/core/models/organization/business_profile/all-user.model';
import { Image } from "src/app/core/models/image.model";

class Store {

    @observable
    private _projectsList: BusinessProjects[] = [];

    @observable
    private _selectedProjectDetails: BusinessProjectDetails;

    @observable
    selectedProjectList: BusinessProjects[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    logo_preview_available = false;

    @observable
    saveSelected: boolean = false;

    // @observable
    // private _allUserList: AllUsers[] = [];

    @observable
    private _imageDetails: Image = null;

    // @observable
    // preview_url: string;

    @observable
    private _brocureDetails: Image[] = [];

    // @observable
    // brochure_preview_url: string;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable // String to perform Search on
    searchText: string = '';
    project_select_form_modal: boolean=false;//used for project modal

    @action // Set Projects List
    setProjectDetails(response: BusinessProjectsResponse) {
        this._projectsList = response.data;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.currentPage = response.current_page;
        this.loaded = true;
    }

    @computed // Get Projects List
    get projectDetails(): BusinessProjects[] {
        return this._projectsList.slice();
    }

    getProjectDetailsById(id: number): BusinessProjects {
        return this._projectsList.slice().find(e => e.id == id);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    addSelectedProject(issues) {
        this.selectedProjectList = issues;
    }

    get selectedProjectsList() {
        return this.selectedProjectList;
    }

    // @action
    // setUsersList(users: AllUsers[]){
    //     this._allUserList = users;
    // }

    // @computed
    // get usersList():AllUsers[]{
    //     return this._allUserList.slice();
    // }

    @action
    setFileDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
            // this.preview_url = url;
        }
        else {
            this._brocureDetails.push(details);
            // this.brochure_preview_url = url;
        }
    }

    @action
    unsetFileDetails(type: string, token?: string) {
        if (type == 'logo') {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }
        }
        else {
            var b_pos = this._brocureDetails.findIndex(e => e.token == token)
            if (b_pos != -1) {
                if (this._brocureDetails[b_pos].hasOwnProperty('is_new')) {
                    this._brocureDetails.splice(b_pos, 1);
                }
                else {
                    this._brocureDetails[b_pos]['is_deleted'] = true;
                }
            }
        }
    }

    getFileDetailsByType(type: string): Image {
        if (type == 'logo')
            return this._imageDetails;
    }

    // @action
    // setSelectedFileDetails(imageDetails,type){
    //     if(type == 'logo')
    //         this.preview_url = imageDetails;
    // }

    // getSelectedFileDetails(type):string {
    //     if(type == 'logo')
    //         return this.preview_url;
    // }

    @action
    setSelectedProjectDetails(projectDetails: BusinessProjectDetails) {
        this._selectedProjectDetails = projectDetails;
    }

    get selectedProjectDetails(): BusinessProjectDetails {
        return this._selectedProjectDetails;
    }

    get getBrochureDetails(): Image[] {
        return this._brocureDetails;
    }

    @action
    clearBrochureDetails() {
        this._brocureDetails = [];
    }

    @action
    unSetAllData() {
        this._projectsList = [];
        this.loaded = false;
        this.itemsPerPage = null;
        this.totalItems = null;
        this.currentPage = 1;
    }

}

export const BusinessProjectsStore = new Store();