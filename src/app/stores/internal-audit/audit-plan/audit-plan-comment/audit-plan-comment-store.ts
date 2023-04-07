import { observable, action, computed } from "mobx-angular";

import { AuditPlanComment, AuditPlanCommentPaginationResponse  } from 'src/app/core/models/internal-audit/audit-plan/audit-plan-comment/audit-plan-comment';
import { Image } from "src/app/core/models/image.model";
class Store {

    @observable
    private _auditPlanComment: AuditPlanComment[] = [];

    @observable 
    loaded:boolean=false;

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
    setAllAuditPlanComments(response: AuditPlanCommentPaginationResponse) {
       
        this._auditPlanComment = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }



    @computed
    get allItems(): AuditPlanComment[] {
        
        return this._auditPlanComment;
    }


    @computed
    get docDetails(): Image[] {
        return this._documentDetails;
    }

    
    @action
    getAuditPlanCommentById(id: number): AuditPlanComment {
        return this._auditPlanComment.slice().find(e => e.id == id);
    }
    

  

}



export const AuditPlanCommentsStore = new Store();
