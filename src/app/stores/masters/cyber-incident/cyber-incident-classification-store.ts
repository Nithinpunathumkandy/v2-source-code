import { observable, action, computed } from "mobx-angular";
import { CyberIncidentClassification, CyberIncidentClassificationResponse, CyberIncidentClassificationSingle } from "src/app/core/models/masters/cyber-incident/cyber-incident-classification";

class Store{
    @observable 
    private _cyberIncidentClassification:CyberIncidentClassification[]=[];

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
    orderItem:string = 'cyber_incident_classification.created_at';

    @observable
    from: number = null;
    
    @observable
    lastInsertedCIClassification: number = null;

    searchText: string;

    @observable
    individualCyberIncidentClassification: CyberIncidentClassificationSingle;

    @observable
    individualLoaded: boolean = false;

    @action
    setCyberIncidentClassification(response:CyberIncidentClassificationResponse){
        this._cyberIncidentClassification=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
    }

    
    @action
    setAllCyberIncidentClassification(type: CyberIncidentClassification[]) {
       
        this._cyberIncidentClassification = type;
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
    get CIClassification(): CyberIncidentClassification[] {
        
        return this._cyberIncidentClassification.slice();
    }

    @action
    getClassificationById(id: number): CyberIncidentClassification {
        return this._cyberIncidentClassification.slice().find(e => e.id == id);
    }

    @action
    setindividualCyberIncidentClassificationSingle(data: CyberIncidentClassificationSingle){
        this.individualCyberIncidentClassification=data;
        this.individualLoaded = true;
    }

    @action
    setLastInsertedCIClassification(CIClassificationId: number){
        this.lastInsertedCIClassification = CIClassificationId;
    }

    get LastInsertedCIClassification():number{
        if(this.lastInsertedCIClassification) 
            return this.lastInsertedCIClassification;
        else 
            return null;
    }

}

export const CyberIncidentClassificationMasterStore = new Store();