import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { AuditableItem, AuditFindings ,AuditFindingsPaginationResponse  } from 'src/app/core/models/internal-audit/audit-findings/audit-findings';
class Store {

    @observable
    private _auditableItems: AuditableItem[] = [];

    @observable
    private _findings: AuditFindings[] = [];

    @observable
    private _findingsFromAuditProgram: AuditFindings[] = [];

    @observable
    individualAuditFindings: AuditFindings;

    @observable
    individualLoaded: boolean = false;

    @observable
    auditFindingId: number = null;

    $observable
    auditSChedule_Id: number = null;


    @observable
    rcaDataLength: number = null;

    @observable 
    loaded:boolean=false;

    @observable 
    auditLoaded:boolean=false;

    @observable 
    findingsFromAuditProgramloaded:boolean=false;

    @observable
    currentPage: number = 1;

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
    selectedAUdittableList: AuditableItem[] = [];

    @observable
    _selectedFindingItemAll: any[] = [];

    @observable
    finding_select_form_modal:boolean=false;
    
    @observable
    saveSelected:boolean=false;

    @observable
    auditableItemToDisplay: any = [];

    @observable
    ChecklistToDisplay: any = [];

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];


    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setAuditFindingId(id: number) {
        this.auditFindingId = id;

    }

    @action
    addSelectedAuditableItem(auditableItem, auditableItemToDisplay) {
        this.selectedAUdittableList = auditableItem;
        this.auditableItemToDisplay = auditableItemToDisplay;
    }

    @action
    addSelectedChecklists(checklists) {
        this.ChecklistToDisplay = checklists;
    }

    @action
    unSelectChecklists(){
        this.ChecklistToDisplay = [];
    }



    @action
    unSelectAuditableItem(){
        this.selectedAUdittableList = [];
        this.auditableItemToDisplay = [];
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
    setIndividualAuditableItem(audit: AuditableItem[]) {
       
        this._auditableItems = audit;
        this.auditLoaded = true;
        
    }

    @action
    setAllAuditableItem(audit: AuditableItem[]) {
       
        this._auditableItems = audit;
        this.auditLoaded = true;
        
    }

    @computed
    get auditableItems(): AuditableItem[] {
        
        return this._auditableItems.slice();
    }


    @action
    setFinding(response: AuditFindingsPaginationResponse) {
        

        this._findings = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllFindingsFromProgram(res: AuditFindings[]) {
       
        this._findingsFromAuditProgram = res;
        this.findingsFromAuditProgramloaded = true;
        
    }

    @action
    unsetAllFindingsFromProgram() {    
        this._findingsFromAuditProgram = [];
        this.findingsFromAuditProgramloaded = false;     
    }


    @action
    setAllFindings(finding: AuditFindings[]) {
       
        this._findings = finding;
        this.loaded = true;
        
    }

    @action
    unsetFindings() {  
        this._findings = [];
        this.loaded = true;  
    }

    @action
    setIndividualAuditFindingItem(finding: AuditFindings) {   
        this.individualAuditFindings = finding;
        this.individualLoaded = true;    
    }

    @action
    unsetIndividualAuditFindingItem() {     
        this.individualAuditFindings = null;
        this.individualLoaded = false;       
    }

    @computed
    get allItems(): AuditFindings[] {
        
        return this._findings.slice();
    }

    @computed
    get allFindingsFromProgram(): AuditFindings[] {
        
        return this._findingsFromAuditProgram.slice();
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
    getFindingsById(id: number): AuditFindings {
        return this._findings.slice().find(e => e.id == id);
    }

    get findingsDetails(){
        return this.individualAuditFindings;
    } 

    @action
    addSelectedFinding(items){
        this._selectedFindingItemAll = items;
    }


}



export const AuditFindingsStore = new Store();
