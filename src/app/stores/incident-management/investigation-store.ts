import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { Incident } from "src/app/core/models/incident-management/incident/incident";
import { History, HistoryData, Investigation, InvestigationPaginationResponse, IncidentStatusPaginationResponse, IncidentStatus } from "src/app/core/models/incident-management/investigation";

class Store {
    @observable
    currentPage: number = 1;

    @observable
    ststuscurrentPage: number = 1;

    @observable
    involvedUserDetails = [];

    @observable
    witnessUserDetails = [];

    @observable
    private _documentDetails: Image[] = [];

    @observable
    investigationIncidentObjects = {
        title : '',
        description : '',
        incident_at : '',
        incident_damage_type_id : null,
        action : '',
        reported_at : '',
        reported_by : null,
        organization_ids : [],
        division_ids : [],
        department_ids : [],
        section_ids : [],
        sub_section_ids : [],
        incident_sub_category_ids : [],
        incident_category_ids : [], 
        incident_stakeholder_ids : [],
        documents : [],
        location : '',
    }

    @observable 
    loaded:boolean=false;

    @observable
    statusloaded: boolean = false;

    @observable
    itemsPerPage: number = null;

    @observable
    statusitemsPerPage: number = null;

    @observable
    private _investigations :Investigation[] = [] ;

    @observable
    private _investigationsStatus :IncidentStatus[] = [] ;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualInvestigationItem: Investigation = null;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @observable
    totalItems: number = null;

    @observable
    statustotalItems: number = null;

    @observable
    from: number = null;

    @observable
    statusfrom: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'investigation.created_at';

    @observable
    searchText: string;

    @observable
    preview_url: string;

    @observable
    selectedInvestigationId: number
    @observable
    private _treatmentUpdateData: History[];

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    treatmentUpdateDataLoaded: boolean = false;

    @observable
    editFlag :boolean = false

    @action
    setInvestigations(response : InvestigationPaginationResponse) {
        
        this._investigations = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setInvestigationStatus(response : IncidentStatusPaginationResponse) {
        
        this._investigationsStatus = response.data;
        this.ststuscurrentPage = response.current_page;
        this.statusitemsPerPage = response.per_page;
        this.statustotalItems = response.total;
        this.statusfrom = response.from;
        this.statusloaded = true;
       
    }

    @computed
    get incidentInvestigationStatus(): IncidentStatus[]{
        return this._investigationsStatus.slice();
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
    setIncidentInvestigationDetails(data ){
        this.investigationIncidentObjects = data
    }
  @computed
    get incidentInvestigation(){
        return this.investigationIncidentObjects
    }
    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action 
    setInvolvedUserDetails(details){
        // this.unsetInvestigationUsers()
        if(details !=null)
        this.involvedUserDetails.push(details)
    }


    @action 
    setWitnessUserDetails(details){
        // this.unsetInvestigationUsers()
        if(details !=null)
        this.witnessUserDetails.push(details)
    }

    @action
    setIndividualInvestigationItem(incident: Investigation) {       
        this.individualInvestigationItem = incident;
        this.individualLoaded = true;
        
    }

    @action
    unsetInvestigationDetails(){
        this.individualLoaded = false;
        this.individualInvestigationItem = null;
        
        // this.selectedNeedsExpectations = [];
    }

    @action
    unsetInvestigationUsers(){
        this.witnessUserDetails = [] 
        this.involvedUserDetails = []     
        // this.selectedNeedsExpectations = [];
    }

    @action
    setSelectedInvestigationId(id: number){
        this.selectedInvestigationId = id;
    }

    get investigationItemDetails() : Investigation{
        return this.individualInvestigationItem;
    } 


    @computed
    get selectedId(): number{
        return this.selectedInvestigationId;
    }


    @computed
    get involvedWitnessUserDetails(){
        return this.witnessUserDetails;
    }

    @computed
    get involvedOtherUserDetails(){
        return this.involvedUserDetails;
    }

    @computed
    get allItems(): Investigation[] {
        
        return this._investigations.slice();
    }

    @action
    setTreatmentUpdateData(response: HistoryData) {
        this._treatmentUpdateData = response.data;
        this.historyCurrentPage = response.current_page;
        this.historyItemsPerPage = response.per_page;
        this.historyTotalItems = response.total;
        this.treatmentUpdateDataLoaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }

    @computed
    get historyData():History[]{
        return this._treatmentUpdateData.slice();
    }

}
export const IncidentInvestigationStore = new Store();