import { action, observable, computed } from "mobx-angular";
import { KpiCountByCategory, KpiCountByDepartment, KpiCountByStatus, KpiCounts, KpiImprovementPlanCounts, KpiLeastPerforming, KpiPerformancebyTypeCounts, KpiTopPerforming } from "src/app/core/models/kpi-management/dashboard/kpi-dashboard";


class Store {
   
    @observable
    private _kpiCountByStatus: KpiCountByStatus[]=[];
   
    @observable
    private _kpiPerformancebyTypeCounts: KpiPerformancebyTypeCounts[]=[];
   
    @observable
    private _kpiCountByCategory: KpiCountByCategory[]=[];
    
    @observable
    private _kpiCountByDepartment: KpiCountByDepartment[]=[];
    
    @observable
    private _kpiTopPerformingFrist: KpiTopPerforming[]=[];
    @observable
    private _kpiTopPerformingSecond: KpiTopPerforming[]=[];
    
    @observable
    private _kpiLeastPerformingFrist: KpiLeastPerforming[]=[];
    @observable
    private _kpiLeastPerformingSencond: KpiLeastPerforming[]=[];

    @observable
    dashboardLoaded: boolean = false;

    @observable
    dashboardParam: string = null;

    // 1
    // Kpi count by status
    @action
    setKpiCountByStatus(res: KpiCountByStatus[]) {
        this._kpiCountByStatus = res;
        setTimeout(() => {
            this.dashboardLoaded=true;
        }, 500);//it is loading issue overcome
    }

    @action
    unsetKpiCountByStatus() {
        this._kpiCountByStatus = [];
        this.dashboardLoaded=false;
    }

    @computed
    get kpiCountByStatus():KpiCountByStatus[]{
        return this._kpiCountByStatus.slice();
    }
    //**  Kpi count by status
 

    // 2
    // Kpi count by status
    @action
    setKpiPerformancebyTypeCounts(res: KpiPerformancebyTypeCounts[]) {
        this._kpiPerformancebyTypeCounts = res;
    }

    @action
    unsetKpiPerformancebyTypeCounts() {
        this._kpiPerformancebyTypeCounts = [];
    }

    @computed
    get KpiPerformancebyTypeCounts():KpiPerformancebyTypeCounts[]{
        return this._kpiPerformancebyTypeCounts.slice();
    }
    //**  Kpi count by status
 
    

    // Kpi count by category
    @action
    setKpiCountByCategory(res: KpiCountByCategory[]) {
        this._kpiCountByCategory = res;
    }

    @action
    unsetKpiCountByCategory() {
        this._kpiCountByCategory = [];
    }

    @computed
    get kpiCountByCategory():KpiCountByCategory[]{
        return this._kpiCountByCategory.slice();
    }
    //** Kpi count by category

    

    // Kpi Count By Department
    @action
    setKpiCountByDepartment(res: KpiCountByDepartment[]) {
        this._kpiCountByDepartment = res;
    }

    @action
    unsetKpiCountByDepartment() {
        this._kpiCountByDepartment = [];
    }

    @computed
    get KpiCountByDepartment():KpiCountByDepartment[]{
        return this._kpiCountByDepartment.slice();
    }
    //** Kpi Count By Department
    

    // Kpi Top Performing
    @action
    setKpiTopPerforming(res: KpiTopPerforming[]) {
        
        this._kpiTopPerformingFrist = res.splice(0, 10).map(data => {
            return data;
        });
        
        this._kpiTopPerformingSecond = res.splice(0, 10).map(data => {
            return data;
        });

    }

    @action
    unsetKpiTopPerforming() {
        this._kpiTopPerformingFrist = [];
        this._kpiTopPerformingSecond = [];
    }

    @computed
    get KpiTopPerformingFrist():KpiTopPerforming[]{
        return this._kpiTopPerformingFrist.slice();
    }

    @computed
    get KpiTopPerformingSecond():KpiTopPerforming[]{
        return this._kpiTopPerformingSecond.slice();
    }
    //** Kpi Top Performing


    //Kpi Least Performing
    @action
    setKpiLeastPerforming(res: KpiLeastPerforming[]) {
        this._kpiLeastPerformingFrist = res.splice(0, 10).map(data => {
            return data;
        });
        
        this._kpiLeastPerformingSencond = res.splice(0, 10).map(data => {
            return data;
        });
    }

    @action
    unsetKpiLeastPerforming() {
        this._kpiLeastPerformingFrist = [];
        this._kpiLeastPerformingSencond = [];
    }

    @computed
    get KpiLeastPerformingFrist():KpiLeastPerforming[]{
        return this._kpiLeastPerformingFrist.slice();
    }

    @computed
    get KpiLeastPerformingSencond():KpiLeastPerforming[]{
        return this._kpiLeastPerformingSencond.slice();
    }
    //**Kpi Least Performing

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
}

export const KPIDetialsDashboardStore = new Store();