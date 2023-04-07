import { observable, action, computed } from "mobx-angular";
import { Activity,ActivityDetails,ActivityPaginationResponse } from '../../../core/models/bpm/process/activity'
import { Image } from "src/app/core/models/image.model";
class Store { 

    @observable //Store Subsidiary List
    private _activityList: Activity[] = [];
    @observable //Sets whether subsidiary list is stored or not
    loaded: boolean = false;

    @observable _activityDetails: ActivityDetails
    
    @observable
    private _activityDocuments: Image[] = [];

    @observable // Boolean flag to decide form opened for add / edit
    Editflag = false;

    @observable
    activity_details_loaded = false;

    @observable
    private _imageDetails: Image = null;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
 

    @action
    setActivity(response:ActivityPaginationResponse) {
        this.loaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._activityList = response.data;
    }

    unsetActivity() {
        this.loaded = false;
        this._activityList = [];
    }

    get activitiesList(): Activity[] {
        return this._activityList;
    }
    // Set Activity Details
    @action
    setActivityDetails(details: ActivityDetails) {
        this.activity_details_loaded = true
        this._activityDetails=details
    }

    unsetActivityDetails(){
        this.activity_details_loaded = false;
        this._activityDetails = null;
    }


    @action //Clears Activity Document Array
    clearActivityDocuements(){
        this._activityDocuments = [];
    }

    // Returns Actvity Documents Array
    get getActivityDocuments(): Image[]{
        return this._activityDocuments;
    }

     // Returns Actvity Details
     get getActivityDetails():ActivityDetails{
        return this._activityDetails;
    }

    @action //Sets Logo or Actvity details according to type
    setFileDetails(details: Image, url: string, type: string) {
        if(type == 'logo'){
            this._imageDetails = details;
            // this.preview_url = url;
        }
        else{
            this._activityDocuments.unshift(details);
            // this.brochure_preview_url = url;
        }
    }

    @action // When delete is clicked for logo or Actvity
    unsetFileDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }
        }
        else{
            var b_pos = this._activityDocuments.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._activityDocuments[b_pos].hasOwnProperty('is_new')){
                    this._activityDocuments.splice(b_pos,1);
                }
                else{
                    this._activityDocuments[b_pos]['is_deleted'] = true;
                }
            }
        }
    }

    // Setting Accordion Status For Activity
    setActivityAccordion(index){
        if(this._activityList[index].is_accordion_active == true)
            this._activityList[index].is_accordion_active = false;
        else
            this._activityList[index].is_accordion_active = true;
        this.unsetActivityAccordion(index);
      
    }
    unsetActivityAccordion(index){
        for(let i=0;i<this._activityList.length;i++){
            if(i != index){
                this._activityList[i].is_accordion_active = false;
            }
        }
    }

}

export const ActivityStore = new Store();