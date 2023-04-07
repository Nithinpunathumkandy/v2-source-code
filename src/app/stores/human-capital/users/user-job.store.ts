import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { UserJob, UserJobPaginationResponse, IndividualJob } from 'src/app/core/models/human-capital/users/user-job';
import { Image } from "src/app/core/models/image.model";
import { User } from 'src/app/core/models/user.model';
class Store {
    @observable
    private _userJobList: UserJob[] = [];

    @observable
    private _usedJds = [];

    @observable
    loaded: boolean = false;

    @observable
    job_preview_available = false;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    selected_preview_url: string;

    @observable
    private _jobDocumentDetails: Image[] = [];

    @observable
    private _individualJobDetails: IndividualJob;

    @observable
    individual_job_loaded: boolean = false;

    @observable
    _usedJdLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    
    @observable
    selected: number = null;


    @action
    setUserJobDetails(response: UserJobPaginationResponse) {
        this._userJobList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetUserJobDetails() {
        this._userJobList = [];
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateUserJob(job: UserJob) {
        const jobs: UserJob[] = this._userJobList.slice();
        const index: number = jobs.findIndex(e => e.id == job.id);
        if (index != -1) {
           // jobs[index] = job;
            //this._userJobList = jobs;
            this.unsetJobListAccordion(index);
        }
    }



    @computed
    get userJobDetails(): UserJob[] {

        return this._userJobList.slice();
    }

    setJobListAccordion(index) {
        if (this._userJobList.length > 0) {
            if (this._userJobList[index].is_accordion_active == true)
                this._userJobList[index].is_accordion_active = false;
            else
                this._userJobList[index].is_accordion_active = true;
            this.unsetJobListAccordion(index);
        }

    }

    unsetJobListAccordion(index) {
        if (this._userJobList.length > 0) {
            for (let i = 0; i < this._userJobList.length; i++) {
                if (i != index) {
                    this._userJobList[i].is_accordion_active = false;
                }

            }
        }
    }

    getUserJobById(id: number): IndividualJob {
        let userJobList;

        userJobList = this._userJobList.slice().find(e => e.id == id);
        UserJobStore.setIndividualJobDetails(userJobList);
        return userJobList;
    }

    @action
    setUsedJds(details) {
        this._usedJdLoaded = true;
        this._usedJds = details;
    }

    @action
    setIndividualJobDetails(details) {
        this.individual_job_loaded = true;
        this._individualJobDetails = details;
            // const jobs: UserJob[] = this._userJobList.slice();
            //   const index: number = jobs.findIndex(e => e.id == details.id);
           // this.setJobListAccordion(index);
        this.updateUserJob(details);
    }

    unsetIndiviudalJobDetails() {
        this._individualJobDetails = null;
        this.individual_job_loaded = false;
    }

    @action
    clearDocumentDetails() {
        this._jobDocumentDetails = [];
        this.preview_url = null;
    }

    get userJobById() {

        return this._individualJobDetails;
    }

    
    @computed
    get usedJds(){
        return this._usedJds;
    } 

    

    @computed
    get initialJobId():number{
        return this._userJobList[0].id
    }



    @computed
    get individualJobDetails(): IndividualJob {
        return this._individualJobDetails;
    }


    @computed
    get jobDetails(): Image[] {
        return this._jobDocumentDetails.slice();
    }

    @action
    setDocumentDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
            this.preview_url = url;
        }
        else {
            this._jobDocumentDetails.push(details);
            this.preview_url = url;
        }
    }

    @action
    clearJobDetails() {
        this._jobDocumentDetails = [];
        this.preview_url = null;
    }


    getDocumentByType(): Image {

        return this._imageDetails;
        // else
        //     this.getBrochureDetails;
    }

    @action
    unsetDocumentDetails(type: string, token?: string) {
        if (type == 'logo') {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
            }
        }
        else {
           
            var b_pos = this._jobDocumentDetails.findIndex(e => e.token == token)
            if (b_pos != -1) {
                if (this._jobDocumentDetails[b_pos].hasOwnProperty('is_new')) {
                    this._jobDocumentDetails.splice(b_pos, 1);
                }
                else {
                    this._jobDocumentDetails[b_pos]['is_deleted'] = true;
                }
            }

        }


    }

    @action
    setSelected(value:number){
        this.selected = value;
    }

    get selectedItem():number{
        return this.selected;
    }




    get JobImageDetails(): Image {
        return this._imageDetails;
    }

    @action
    setSelectedDocumentDetails(imageDetails) {

        this.selected_preview_url = imageDetails;
    }



}

export const UserJobStore = new Store();