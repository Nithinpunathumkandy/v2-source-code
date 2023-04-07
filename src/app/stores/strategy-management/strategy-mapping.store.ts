import { observable, action, computed } from 'mobx-angular';
import { StrategyMapping,objectiveType } from 'src/app/core/models/strategy-management/strategy-mapping';

class Store {

    @observable
    stratergyMapping : StrategyMapping [] = []

    @observable
    individualMapping : StrategyMapping;

    @observable
    _profileObjectives = null;

    @observable
    _profileInitiatives = null

    @observable
    _profileObjectiveByType = null;

    @observable
    _objectiveTypes: objectiveType;

    @observable
    _roleWiseData = null

    @observable
    _departmentWiseData = null

    @observable 
    individualLoaded = false    

    @observable
    departmentWiseChartLoaded = false;
    @observable
    userWiseChartLoaded = false;
    
    @observable
    objectiveTypeLoaded = false;

    @observable
    mappingId:number = null

    @observable
    profileId:number = null

    @observable
    userDetails = null

    @observable
    departmentDetails = null

    @observable
    mappingTab = null

    @observable
    focusAreaDetails = null

    @observable
    objectiveDetails = null

    @observable
    standardViewDetails = null

    @observable 
    standardViewLoaded = false    

    @observable 
    focusAreaDetailLoaded = false   

    @observable 
    objectiveDetailLoaded = false    
    @observable
    componentFrom = false;

    @action
    setMappingId(id: number) {
        this.mappingId = id;
    }

    @action
    setProfileId(id: number) {
        this.profileId = id;
    }

    @action
    setUser(response) {
        this.userDetails = response;
    }

    @action
    setDepartment(response) {
        this.departmentDetails = response;
    }

    @action
    setMappingTab(response) {
        this.mappingTab = response;
    }

    get ProfileId(){
        return this.profileId;
    }
    get getDepartmentDetails(){
        return this.departmentDetails;
    }
    get getUserDetails(){
        return this.userDetails;
    }
    
    @action
    setIndividualStrategyMapping(details:StrategyMapping) {        
        this.individualMapping = details;  
        this.individualLoaded = true;      
    }

    @computed
    get individualStrategyMapping(): StrategyMapping {
        return this.individualMapping;
    }

    @action
    unsetIndividualStrategyMapping() {        
        this.individualMapping = null; 
        this.individualLoaded = false;       
    }

    @action
    setObjectives(response) {
         this._profileObjectives = response.data; 
    }

    get strategyObjectives(){
        return this._profileObjectives;
    }

    @action
    setInitiatives(response) {
         this._profileInitiatives = response.data; 
    }

    get strategyInitiatives(){
        return this._profileInitiatives;
    }
    
    @action
    setObjectiveByType(response) {
         this._profileObjectiveByType = response; 
    }

    get strategyObjectiveByType(){
        return this._profileObjectiveByType;
    }

    @action
    setObjectiveTypes(response) {
        this.objectiveTypeLoaded = true;
        this._objectiveTypes = response; 
    }
    
    @computed
    get objectiveTypes(){ 
        return this._objectiveTypes;
    }


    @action
    setRoleWise(response) {
         this._roleWiseData = response; 
         this.userWiseChartLoaded = true;
    }

    get strategyRoleWise(){
        return this._roleWiseData;
    }

    @action
    setDepartmentWise(response) {
         this._departmentWiseData = response; 
         this.departmentWiseChartLoaded = true;
    }

    get strategyDepartmentWise(){
        return this._departmentWiseData;
    }

    @action
    setFocusArea(response) {
        this.focusAreaDetailLoaded = true;
        this.focusAreaDetails = response;
    }

    get getFocusAreaDetails(){
        return this.focusAreaDetails;
    }

    @action
    setObjectiveDetail(response) {
        this.objectiveDetailLoaded = true;
        this.objectiveDetails = response;
    }

    get getObjectiveDetails(){
        return this.objectiveDetails;
    }
    
    @action
    setStandardView(response) {
        this.standardViewDetails = response;
        this.standardViewLoaded = true;
    }

    get getStandardView(){
        return this.standardViewDetails;
    }
}
export const StrategyMappingStore = new Store();