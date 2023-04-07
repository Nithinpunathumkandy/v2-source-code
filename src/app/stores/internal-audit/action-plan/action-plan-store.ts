import { observable, action, computed } from "mobx-angular";

import { ActionPlan, ActionPlanPaginationResponse  } from 'src/app/core/models/internal-audit/action-plan/action-plan';
import { Image } from "src/app/core/models/image.model";
class Store {

    @observable
    private _actionPlans: ActionPlan[] = [];

    @observable 
    loaded:boolean=false;
    

    @observable
    auditFindingId: number = null;
    @observable
    individualLoaded: boolean = false;

    @observable
    individualActionPlan: ActionPlan;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];


    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
   

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }
    @action
    setDocumentDetails(details: Image,url: string) {
        
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
    setAllActionPlan(response: ActionPlanPaginationResponse) {
       
        this._actionPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
        
    }
    @action
    clearAllActionPlans(){
        this._actionPlans=[];
        this.loaded=false;
    }


    @action
    unsetSelectedItemDetails(){
        this.individualLoaded = false;
        this.individualActionPlan = null;
    }

    @action
    setIndividualActionPlanDetails(actionPlan: ActionPlan) {
       
        this.individualActionPlan = actionPlan;
        this.individualLoaded = true;
        
    }


    @computed
    get allItems(): ActionPlan[] {
        
        return this._actionPlans;
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails;
    }
    

    @action
    getActionPlanById(id: number): ActionPlan {
        return this._actionPlans.slice().find(e => e.id == id);
    }
    
    get actionPlanDetails(){
        return this.individualActionPlan;
    } 

  

}



export const ActionPlanStore = new Store();
