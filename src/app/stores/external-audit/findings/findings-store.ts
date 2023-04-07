import { observable, action, computed } from "mobx-angular";

import { Findings ,FindingsPaginationResponse  } from 'src/app/core/models/external-audit/findings/findings';
import { Image } from "src/app/core/models/image.model";
class Store {

    @observable
    private _findings: Findings[] = [];

    @observable
    individualExternalAuditFindingItem: Findings;

    @observable
    individualLoaded: boolean = false;

    @observable
    auditFindingId: number = null;

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    rcaDataLength: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'findings.created_at';

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


    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    ea_audit_id:number = null

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'desc'| 'asc' ) {
        this.orderBy = order_by;
    }

    @action
    setAuditFindingId(id: number) {
        this.auditFindingId = id;

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
    setFinding(response: FindingsPaginationResponse) {
        

        this._findings = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllFindings(finding: Findings[]) {
       
        this._findings = finding;
        this.loaded = true;
        
    }

    @action
    unsetFindings() {
        this._findings = [];
        this.currentPage = 1;
        this.loaded = false; 
    }

    @action
    setIndividualExternalAuditFindingItem(finding: Findings) {
       
        this.individualExternalAuditFindingItem = finding;
        this.individualLoaded = true;
        
    }

    @action
    unsetIndividualExternalAuditFindingItem() {   
        this.individualExternalAuditFindingItem = null;
        this.individualLoaded = false;    
    }

    @computed
    get allItems(): Findings[] {
        
        return this._findings.slice();
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails;
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getFindingsById(id: number): Findings {
        return this._findings.slice().find(e => e.id == id);
    }

    get individualExternalAuditFindingItemId(){
        return this.individualExternalAuditFindingItem;
    } 


}



export const FindingMasterStore = new Store();
