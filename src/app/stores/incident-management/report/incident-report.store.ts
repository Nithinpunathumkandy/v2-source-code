import { observable, action, computed } from "mobx-angular";
import { Observable } from "rxjs";
import { Investigation } from "src/app/core/models/incident-management/investigation";
import { IncidentReport, IncidentReportPaginationResponse} from "src/app/core/models/incident-management/report/incident-report";

class Store {
    @observable
    currentPage: number = 1;

    @observable
    private _reports :IncidentReport[] = [] ;

    @observable
    totalItems: number = null;

    @observable
    individualItem : IncidentReport = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    reportorderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'investigation.created_at';

    @observable
    reportorderItem: string = 'investigation.created_at';

    @observable
    searchText: string;

    @observable 
    loaded:boolean=false;

    @observable
    itemsPerPage: number = null;

    @observable
    fullView: boolean = false;

    @observable
    hideSubMenu: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    reportId: number;

    @action
    setIncidentReport(response : IncidentReportPaginationResponse) {
        
        this._reports = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    
    @action
    setAllIncidents(incident: IncidentReport[]) {
       
        this._reports = incident;
        this.loaded = true;
        
    }

    @action
    unsetAllIncidents() {   
        this._reports = [];
        this.loaded = false;    
    }

    @action
    setIndividualIncidentReport(res : IncidentReport ){
        this.individualItem = res
        this.individualLoaded = true;

    }

    @action
    unsetIndividualIncidentReport() {   
        this.individualItem = null;
        this.individualLoaded = false;   
    }

    @action
    setSubMenuHide(value:boolean){
        this.hideSubMenu = value
    }

    @computed
    get tabHides(){
        return this.hideSubMenu;
    } 
    
    @computed
    get allItems(): IncidentReport[] {
        
        return this._reports.slice();
    }

    @computed
    get reportDetails(): IncidentReport {
        
        return this.individualItem;
    }
}
export const IncidentReportStore = new Store();