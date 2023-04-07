
import { Image } from "src/app/core/models/image.model";
import { observable, action, computed } from "mobx-angular";
import { Incident, IncidentInvestigators, IncidentMapping, IncidentPaginationResponse, rootCause } from "src/app/core/models/incident-management/incident/incident";



class Store {
    @observable
    private _incidents: Incident[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    projects=[];

    @observable
    orderItem: string = 'incidents.created_at';

    @observable
    individualLoaded: boolean = false;

    @observable
    individualIncidentItem: Incident;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    otherInvolvedUserDetails = [];

    @observable
    otherInvolvedUserDetailsEdit = [];

    @observable
    selectedIndexForEdit : number = null

    @observable
    otherWitnessUserDetails = [];

    @observable
    otherWitnessUserDetailsEdit = [];

    @observable
    selectedIndexForWitnessEdit : number = null

    @observable
    incidentInvestigations = []

    @observable
    significantObservations = []

    @observable
    recommendations = []

    @observable
    references = []

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    selected_incident_loaded = false;

    @observable
    selectedIincident: Incident;

    @observable
    incident_select_form_modal:boolean=false;

    @observable
    saveSelected: boolean = false;

    @observable
    selectedIincidentForMapping:Incident[]=[]


    addSelectedIncidents(issues){
        this.selectedIincidentForMapping = issues;
    }

    @observable
    selectedNeedsExpectations: any[] = [];

    @observable
     selectedIncidentId: number

    @observable
    searchText: string;

    @observable
    mappingList: IncidentMapping ;

    @observable
    investigatorsList :IncidentInvestigators = null 

    @observable
    rootCauseAnalysis :rootCause

    @observable
    mappingIssueItemsLoaded:  boolean = false;

    @observable
    investigatorsListLoaded:  boolean = false;

    @observable
    rootCauseLoaded : boolean = false;

    @observable
    totalRootCause : number = 0;

    @observable
    hideTabs: boolean = false;

    @observable
    otherUsers: any = [];

    @observable
    rootCauseDetails 

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
    setOtherInvolvedUserDetails(details){
        this.otherInvolvedUserDetails.push(details)
    }

    @action 
    setOtherInvolvedUserDetailsEdit(details,index){
        this.otherInvolvedUserDetailsEdit.push(details)
        this.selectedIndexForEdit = index
    }

    @action
    setRootCauseDetails(data){
        this.rootCauseDetails = data
    }

    @computed
    get rootCaseEditData(){
        return this.rootCauseDetails;
    }


    @action 
    setOtherWitnessUserDetailsEdit(details,index){
        this.selectedIndexForWitnessEdit = index
        this.otherWitnessUserDetailsEdit.push(details)
    }
    @action 
    setOtherWitnessUserDetails(details){
        this.otherWitnessUserDetails.push(details)
    }

    @action 
    setSignificantObservations(details){
        this.significantObservations.push(details)
    }

    @action 
    setIncidentInvestigations(details){
        this.incidentInvestigations.push(details)
    }

    @action 
    setRecommendations(details){
        this.recommendations.push(details)
    }

    @action 
    setReferences(details){
        this.references.push(details)
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
    unsetInvestigationUsers(){
        this.individualLoaded = false;
        this.otherInvolvedUserDetails = [] 
        this.otherWitnessUserDetails = []     
        // this.selectedNeedsExpectations = [];
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
    setIncidents(response: IncidentPaginationResponse) {
        

        this._incidents = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIncidents(incident: Incident[]) {
       
        this._incidents = incident;
        this.loaded = true;
        
    }

    @action
    setIndividualIncidentItem(incident: Incident) {       
        this.individualIncidentItem = incident;
        this.individualLoaded = true;
        
    }

    @action
    unsetIndividualIncidentItem() {       
        this.individualIncidentItem = null;
        this.individualLoaded = false;   
    }

    @action
    setIncidentMappingItems(items:IncidentMapping){
        this.mappingList = items
        this.mappingIssueItemsLoaded = true;
    }

    @action
    unsetIncidentMappingItems(){
        this.mappingList = null;
        this.mappingIssueItemsLoaded = false;
    }

    @action
    setIncidentInvestigators(items : IncidentInvestigators){
        this.investigatorsList = items
        this.investigatorsListLoaded = true;
    }

    @action
    unsetIncidentInvestigators(){
        this.investigatorsList = null
        this.investigatorsListLoaded = false;
    }


    @action
    setRootCauseAnalysis(items : rootCause){
        this.rootCauseAnalysis = items
        this.rootCauseLoaded = true;
    }

    @action
    unsetRootCauseAnalysis(){
        this.rootCauseAnalysis = null
        this.rootCauseLoaded = false;
    }

    @action
    setTotalItems(item:number){
        this.totalRootCause = item
    }

    @action 
    setOthersItems(items){
        this.otherUsers = items
    }



    @action
    setSelectedIncidentId(id: number){
        this.selectedIncidentId = id;
    }

    @action
    unsetIssueDetails(){
        this.selected_incident_loaded = false;
        this.selectedIincident = null;
        this.selectedNeedsExpectations = [];
    }

    unsetPoints(){
        this.incidentInvestigations = [];
        this. significantObservations = []
        this.recommendations = []
        this.references = []

    }
@action
    setTabHide(value:boolean){
        this.hideTabs = value
    }

    @computed
    get othersData(){
        return this.otherUsers
    }

    @computed
    get tabHides(){
        return this.hideTabs;
    }
    
    @computed
    get allItems(): Incident[] {
        
        return this._incidents.slice();
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @computed
    get investigatorsDetails():IncidentInvestigators{
        return this.investigatorsList
    }

    @computed
    get rootCaseDetails():rootCause{
        return this.rootCauseAnalysis
    }

   
    get IncidentItemDetails() : Incident{
        return this.individualIncidentItem;
    } 

    @computed
    get involvedOtherUserDetails(){
        return this.otherInvolvedUserDetails;
    }

    @computed
    get involvedOtherUserDetailsEdit(){
        return this.otherInvolvedUserDetailsEdit;
    }

    @computed
    get investigationsDes(){
        return this.incidentInvestigations;
    }

    @computed
    get significantObservationsDes(){
        return this.significantObservations;
    }

    @computed 
    get rootCauseTotalCount(){
        return this.totalRootCause;
    }

    @computed
    get recommendationsDes(){
        return this.recommendations;
    }

    @computed
    get referencesDes(){
        return this.references;
    }

    @computed
    get involvedWitnessUserDetails(){
        return this.otherWitnessUserDetails;
    }


    @computed
    get involvedWitnessUserDetailsEdit(){
        return this.otherWitnessUserDetailsEdit;
    }

    @computed
    get selectedId(): number{
        return this.selectedIncidentId;
    }

    @computed
    get mappingItemList() : IncidentMapping{
        return this.mappingList;
    }
   

    @action
    getIncidentsById(id: number): Incident {
        return this._incidents.slice().find(e => e.id == id);
    }

    
  
}

export const 

IncidentStore = new Store();

