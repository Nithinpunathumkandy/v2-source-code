import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Job,JobPaginationResponse } from 'src/app/core/models/masters/human-capital/user-job';
import { Image } from "src/app/core/models/image.model";

class Store {
  
    @observable
    private _jobs: Job[]=[];;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    document_preview_available: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem:string = 'jds.created_at';

    @observable
    from: number = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    private _individualJobDetails: Job;

    @observable
    individual_job_loaded: boolean = false;

    searchText: string;

    @observable
    lastInsertedId: number = null;
   

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }


    @action
    setJobs(response: JobPaginationResponse) {
        this._jobs = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    
    @computed
    get jobs(): Job[] {

        return this._jobs.slice();
    }

    getJobsById(id: number):Job{
        return this._jobs.slice().find(e => e.id == id);
    }

    @action
    setDocumentDetails(details: Image, url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url;
        
    }

    @action
    unsetDocumentDetails(token?:string){
        
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        

       
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setIndividualJobDetails(details) {
        this.individual_job_loaded = true;
        this._individualJobDetails = details;

    }

    unsetIndiviudalJobDetails() {
        this._individualJobDetails = null;
        this.individual_job_loaded = false;
    }

    @computed
    get individualJobDetails(): Job {
        return this._individualJobDetails;
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

}

export const JobMasterStore = new Store();