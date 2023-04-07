import { observable, action, computed } from "mobx-angular";
import { CallTreeUsers } from "src/app/core/models/bcm/bcp/bcp-calltree";
import { IndividualTestAndExercise, Scenario, ScenarioPaginationResponse, Solutions, SolutionsPaginationResponse, TestAndExercise, TestAndExercisePaginationResponse } from "src/app/core/models/bcm/test-and-exercise/test-and-exercise";
import { Image } from "src/app/core/models/image.model";
import {RiskTreatment,RiskTreatmentPaginationResponse, RiskSummary, HistoryData, History} from 'src/app/core/models/risk-management/risks/risk-treatment';

class Store {

    @observable
    private _individualTestAndExercise: IndividualTestAndExercise = null;

    
    @observable
    private _treatmentUpdateData: History[];

    @observable
    private _testAndExerciseList: TestAndExercise[] = [];

    @observable
    private _bcpCallTreeList: CallTreeUsers[] = [];

    @observable
    private _bcpSolutions: Solutions[] = [];

    @observable
    private _bcpScenario: Scenario[] = [];


    @observable
    private _summaryDetails:RiskSummary = null;

    @observable
    private _riskProcessDetails: TestAndExercise = null;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    treatment_id: number = null;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    loaded: boolean = false;

    @observable
    detailsLoaded: boolean = false;

    @observable
    isRiskTreatmentPlan: boolean = false;

    @observable
    processIndex:number = null;

    @observable
    selectedId:number = null;

    @observable
    selectedRiskControls =[];

    
    @observable
    individualTreatmentLoaded: boolean = false;

    @observable
    selected_preview_url: string;
    
    
    @observable
    treatmentUpdateDataLoaded: boolean = false;

    
    @observable
    document_preview_available = false;

    
    @observable
    processLoaded: boolean = false;

    @observable
    summaryLoaded: boolean = false;

    @observable
    editFlag: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'test_and_exercises.reference_code';

    @observable
    searchText: string;


    @action
    setTestEndExercise(response: TestAndExercisePaginationResponse) {
        this._testAndExerciseList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetTestEndExercise() {
        this._testAndExerciseList = [];
    }

    @action
    riskTreatmentById(id: number){
        let treatment = this._testAndExerciseList.findIndex(e=>e.id == id);
        return treatment;
    }
    

    @action
    setIndividualTestAndExercise(response: IndividualTestAndExercise) {
        this._individualTestAndExercise = response;
        this.selectedId = response.id
        this.detailsLoaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetIndividualTestEndExercise() {
        this._individualTestAndExercise = null;
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

    getUserDocumentById(id: number): History {
        let documentList;
       
        documentList= this._treatmentUpdateData.slice().find(e => e.id == id);
        // RiskTreatmentStore.setIndividualDocumentDetails(documentList);
        return documentList;
    }

    
    @action
    setSummaryDetails(response: RiskSummary) {
        this._summaryDetails = response;
        this.summaryLoaded = true;
        //this.updateUserJob(response.data);
    }
    
    @action
    setBcpCallTree(tree: CallTreeUsers[]){
        this._bcpCallTreeList = tree;
    }

    @action
    setBcpSolutions(tree: SolutionsPaginationResponse){
        this._bcpSolutions = tree.data;
    }

    @action
    unSetBcpSolutions(){
        this._bcpSolutions =[]
    }


    @action
    setBcpScenario(tree: ScenarioPaginationResponse){
        this._bcpScenario = tree.data;
    }

    @action
    unsetBcpCallTree() {
        this._bcpCallTreeList = [];
    }

    @action
    unsetSolutions() {
        this._bcpSolutions = [];
    }

    @action
    unsetBcpScenario() {
        this._bcpScenario = [];
    }
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }

    @computed
    get BcpScenario(): Scenario[] {
        return this._bcpScenario.slice();
    }

    @computed
    get BcpSolutions(): Solutions[] {
        return this._bcpSolutions.slice();
    }

    @computed
    get BcpCallTree(): CallTreeUsers[] {
        return this._bcpCallTreeList.slice();
    }

    @computed
    get historyData():History[]{
        return this._treatmentUpdateData.slice();
    }


    @computed
    get allItems(): TestAndExercise[] {

        return this._testAndExerciseList.slice();
    }

    @computed
    get riskTestEndExercise(): IndividualTestAndExercise {

        return this._individualTestAndExercise;
    }
    
    
    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    @action
    unsetProductImageDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
            }
        }
        else{
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

       
    }

    @action
    setDocumentImageDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            this.preview_url = url;
        }
        else{
            this._documentDetails.push(details);
            this.preview_url = url;
        }
    }

    @action
    setSelectedImageDetails(imageDetails){
        
            this.selected_preview_url = imageDetails;
    }

    getSelectedImageDetails():string {
       
        return this.selected_preview_url;
}

    
    @computed
    get getDocumentDetails(): Image[]{
        return this._documentDetails.slice();
    }

    @computed
    get summaryDetails(){
        return this._summaryDetails;
    }


    @action
    clearDocumentDetails(){
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    unsetTreatmentList(){
        this._testAndExerciseList = [];
        this.loaded = false;
    }


}

export const TestAndExerciseStore = new Store();