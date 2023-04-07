import { action, observable, computed } from "mobx-angular";
import { KpiByPerformanceCounts, KpiByType, KpiByTypePaginationResponse, KpiCounts, KpiImprovementPlanCounts, KpiPerformanceByDepartmentCounts, KpiPerformanceByTypeCounts } from "src/app/core/models/kpi-management/dashboard/kpi-dashboard";


class Store {

    @observable
    private _kpiCounts: KpiCounts=null;

    @observable
    private _kpiImprovementPlanCounts: KpiImprovementPlanCounts=null;
    
    @observable
    private _kpiByPerformanceCounts: KpiByPerformanceCounts=null;
   
    @observable
    private _kpiPerformanceByDepartmentCounts: KpiPerformanceByDepartmentCounts[]=[];
   
    @observable
    private _kpiPerformanceByTypeCounts: KpiPerformanceByTypeCounts[]=[];
    
    @observable
    private _kpiByTypes: KpiByType[]=[];


    @observable
    dashboardLoaded: boolean = false;

    @observable
    kpiByTypesloaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = 0;

    @observable
    from: number = null;

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    dashboardParam: string = null;

    @observable
    improvementDashboardParam: string = null;


    // Kpi counts - 1
    @action
    setKpiCounts(res: KpiCounts) {
        this._kpiCounts = res;
        this.dashboardLoaded= true;
    }

    @action
    unsetKpiCounts() {
        this._kpiCounts = null;
        this.dashboardLoaded=false;
    }

    @computed
    get kpiCounts():KpiCounts{
        return this._kpiCounts;
    }
    
    // Kpi Improvement Plan Counts-2
    @action
    setKpiImprovementPlanCounts(res: KpiImprovementPlanCounts) {
        this._kpiImprovementPlanCounts = res;
    }

    @action
    unsetKpiImprovementPlanCounts() {
        this._kpiImprovementPlanCounts = null;
    }

    @computed
    get kpiImprovementPlanCounts():KpiImprovementPlanCounts{
        return this._kpiImprovementPlanCounts;
    }


    
    // Kpi By Performance Counts-3
    @action
    setKpiByPerformanceCounts(res: KpiByPerformanceCounts) {
        this._kpiByPerformanceCounts = res;
    }

    @action
    unsetKpiByPerformanceCounts() {
        this._kpiByPerformanceCounts = null;
    }

    @computed
    get kpiByPerformanceCounts():KpiByPerformanceCounts{
        return this._kpiByPerformanceCounts;
    }

    
    //Kpi Performance By Department Counts-4
    @action
    setKpiPerformanceByDepartmentCounts(res: KpiPerformanceByDepartmentCounts[]) {
        this._kpiPerformanceByDepartmentCounts = res;
    }

    @action
    unsetKpiPerformanceByDepartmentCounts() {
        this._kpiPerformanceByDepartmentCounts = [];
    }

    @computed
    get KpiPerformanceByDepartmentCounts():KpiPerformanceByDepartmentCounts[]{
        return this._kpiPerformanceByDepartmentCounts.slice();
    }

 
 
    //Kpi Performance By Type Counts -6
    @action
    setKpiPerformanceByTypeCounts(res: KpiPerformanceByTypeCounts[]) {
        this._kpiPerformanceByTypeCounts = res;
    }

    @action
    usetKpiPerformanceByTypeCounts() {
        this._kpiPerformanceByTypeCounts = [];
    }

    @computed
    get kpiPerformanceByTypeCounts():KpiPerformanceByTypeCounts[]{
        return this._kpiPerformanceByTypeCounts.slice();
    }

    //Kpi by Type -5

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setKpiByTypes(response: KpiByTypePaginationResponse) {

        this._kpiByTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.kpiByTypesloaded = true;
    }

    
    @action
    unSetKpiBytypes(){
        this.kpiByTypesloaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._kpiByTypes = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItemsKpiByTypes(): KpiByType[] {
        return this._kpiByTypes.slice();
    }

    @action
    setDashboardParam(param:string){
        this.dashboardParam = param
    }

    @computed
    get dashboardParameter(){
        return this.dashboardParam;
    }

    @action
    unsetDashboardParam() {
        this.dashboardParam = null;
    }

    @action
    setImprovementDashboardParam(param:string){
        this.improvementDashboardParam = param
    }

    @computed
    get improvementDashboardParameter(){
        return this.improvementDashboardParam;
    }

    @action
    unsetImprovementDashboardParam() {
        this.improvementDashboardParam = null;
    }

}

export const KPIDashboardStore = new Store();