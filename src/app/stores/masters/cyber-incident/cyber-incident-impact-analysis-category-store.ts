import { observable, action, computed } from "mobx-angular";
import { CyberIncidentImpactAnalysisCategory, CyberIncidentImpactAnalysisCategoryResponse, CyberIncidentImpactAnalysisCategorySingle } from "src/app/core/models/masters/cyber-incident/cyber-incident-impact-analysis-category";

class Store{
    @observable 
    private _cyberIncidentImpactAnalysisCategory:CyberIncidentImpactAnalysisCategory[]=[];

    @observable 
    loaded:boolean=false;
   
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    addOrEditFlag = false;

    @observable
    orderItem:string = 'cyber_incident_impact_analysis_category.created_at';

    @observable
    from: number = null;
    
    @observable
    lastInsertedCIImpactAnalysisCategory: number = null;

    searchText: string;

    @observable
    individualCyberIncidentImpactAnalysisCategory: CyberIncidentImpactAnalysisCategorySingle;

    @observable
    individualLoaded: boolean = false;

    @action
    setCyberIncidentImpactAnalysisCategory(response:CyberIncidentImpactAnalysisCategoryResponse){
        this._cyberIncidentImpactAnalysisCategory=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
    }

    
    @action
    setAllCyberIncidentImpactAnalysisCategory(type: CyberIncidentImpactAnalysisCategory[]) {
       
        this._cyberIncidentImpactAnalysisCategory = type;
        this.loaded = true;
        
    }

    @action
    setCurrentPage(current_page:number){
        this.currentPage=current_page;
    }

   
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @computed
    get CIImpactAnalysisCategory(): CyberIncidentImpactAnalysisCategory[] {
        
        return this._cyberIncidentImpactAnalysisCategory.slice();
    }

    @action
    getCategoryById(id: number): CyberIncidentImpactAnalysisCategory {
        return this._cyberIncidentImpactAnalysisCategory.slice().find(e => e.id == id);
    }

    @action
    setIndividualCyberIncidentImpactAnalysisCategory(data: CyberIncidentImpactAnalysisCategorySingle){
        this.individualCyberIncidentImpactAnalysisCategory=data;
        this.individualLoaded = true;
    }

    @action
    setLastInsertedCICategory(CICategoryId: number){
        this.lastInsertedCIImpactAnalysisCategory = CICategoryId;
    }

    get LastInsertedCICategory():number{
        if(this.lastInsertedCIImpactAnalysisCategory) 
            return this.lastInsertedCIImpactAnalysisCategory;
        else 
            return null;
    }

}

export const CyberIncidentImpactAnalysisCategoryMasterStore = new Store();