import { action, computed, observable } from "mobx-angular";
import { MatrixPlan, MatrixPlanPaginationResponse, MatrixPlanDetails,MatrixType,MatrixAsessement} from "src/app/core/models/event-monitoring/event-maturity-matrix/maturity-matrix-plan"

class Store {
    @observable
    private _maturityMatrixPlan: MatrixPlan[] = [];

    @observable  
    loaded:boolean=false;

    @observable  
    matrixTypeLoaded:boolean=false;

    
    @observable  
    matrixAsessmentLoaded:boolean=false;

    @observable  
    _matrixAsessment:MatrixAsessement=null;

    @observable
    currentPage: number = 1;
    
    @observable 
    _individualMaturityMatrixDetails: MatrixPlanDetails = null;

    @observable 
    _matrixType: MatrixType = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'matrix_plan.created_at';

    @observable
    individualLoaded: boolean = false;

   
    @observable
    totalItems: number = null;

    @observable
    from: number = null;
    
    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    selectedMatrixPlanId: number =null;

    @observable
    _selectedId : number = null;

    @observable
    selectedPlanId : number = null;

    @observable
    _chartDataAsessment : any[]=[];

    @observable
    loadedAsessmentChart: boolean = false;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMatrixType(matrixType: MatrixType) {
        this._matrixType = matrixType;
        this.matrixTypeLoaded=true;
    }

    @action
    setMatrixAsessment(matrixAsessment: MatrixAsessement) {
        this._matrixAsessment = matrixAsessment;
        this.matrixAsessmentLoaded=true;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setMatrixPlanList(response: MatrixPlanPaginationResponse) {
        this._maturityMatrixPlan = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @action
    setMatrixPlanDetails(individualMatrixPlan: MatrixPlanDetails) {       
        this._individualMaturityMatrixDetails = individualMatrixPlan;
        this.individualLoaded = true;
    }

    @action
    setMatrixPlanAsessmentChart(data: any) {       
        this._chartDataAsessment = data;
        this.loadedAsessmentChart = true;
    }

   

    @action
    unsetMatricPlanDetails() {       
        this._individualMaturityMatrixDetails = null;
        this.individualLoaded = false;   
    }

   
    @computed
    get matrixPlanDetails(){
        return this._individualMaturityMatrixDetails;
    }

    @computed
    get matrixPlanList():MatrixPlan[]{
        return this._maturityMatrixPlan.slice();
    }

    @action
    unsetMaturityMatrixPlanList(){
        this._maturityMatrixPlan = [];
        this.currentPage = 1;
        this.loaded = false;
    }
    @action unsetMatrixTypeList()
    {
        this.matrixTypeLoaded=false;
        this._matrixType=null;
    }

    @action unsetMatrixAsessment()
    {
        this.matrixAsessmentLoaded=false;
        this._matrixAsessment=null;
        this._chartDataAsessment = [];
        this.loadedAsessmentChart = false;
    }

}

export const MaturityMatrixPlanStore = new Store();