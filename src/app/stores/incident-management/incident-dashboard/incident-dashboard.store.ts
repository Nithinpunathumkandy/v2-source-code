import { action, observable, computed } from "mobx-angular";
import { IncidentCorrectiveActionCountByDepartments, IncidentCount, IncidentCountByCategories, IncidentCountByDepartments, IncidentCountByMonths, IncidentCountByYears, IncidentEmployeesVsPersonInvolved } from "src/app/core/models/incident-management/incident-dashboard/incident-dashboard";

 class Store {

    @observable
    private _incidentCountDetails: IncidentCount;

    @observable
    private _incidentCountByYearsDetails: IncidentCountByYears[];

    @observable
    private _incidentCountByMonthssDetails : IncidentCountByMonths[];

    @observable
    private _incidentCountByDepartmentssDetails: IncidentCountByDepartments[];

    @observable
    private _incidentCountByCategoriesDetails: IncidentCountByCategories[];

    @observable
    private _incidentCorrectiveActionCountByDepartmentsDetails: IncidentCorrectiveActionCountByDepartments[];

    @observable
    private _incidentEmployeesVsPersonInvolvedDetails: IncidentEmployeesVsPersonInvolved[];
    
    @observable
    incidentDashboardParam: string = null;


    @action
    setIncidentDashboardParam(param:string){
        this.incidentDashboardParam = param
    }

    @action
    unsetincidentDashboardParam() {
        this.incidentDashboardParam = null;
    }

    @action
    setIncidentCountDetails(response: IncidentCount) {
        this._incidentCountDetails = response; 
    }

    @action
    setIncidentCountByYearsDetails(response: IncidentCountByYears[]) {
        this._incidentCountByYearsDetails = response; 
    }

    @action
    setIncidentCountByMonthsDetails(response: IncidentCountByMonths[]) {
        this._incidentCountByMonthssDetails = response; 
    }

    @action
    setIncidentCountByDepartments(response: IncidentCountByDepartments[]) {
        this._incidentCountByDepartmentssDetails = response; 
    }

    @action
    setIncidentCountByCategories(response: IncidentCountByCategories[]) {
        this._incidentCountByCategoriesDetails = response; 
    }

    @action
    setIncidentCorrectiveActionCountByDepartments(response: IncidentCorrectiveActionCountByDepartments[]) {
        this._incidentCorrectiveActionCountByDepartmentsDetails = response; 
    }

    @action
    setIncidentEmployeesVsPersonInvolved(response: IncidentEmployeesVsPersonInvolved[]) {
        this._incidentEmployeesVsPersonInvolvedDetails = response; 
    }



    @computed
    get incidentCountDetails():IncidentCount{
        return this._incidentCountDetails;
    }

    @computed
    get dashboardParam(){
        return this.incidentDashboardParam;
    }


    @computed
    get incidentCountByYears():IncidentCountByYears[]{
        return this._incidentCountByYearsDetails;
    }

    
    @computed
    get incidentCountByMonths():IncidentCountByMonths[]{
        return this._incidentCountByMonthssDetails;
    }

    @computed
    get incidentCountByDepartments():IncidentCountByDepartments[]{
        return this._incidentCountByDepartmentssDetails;
    }

    @computed
    get incidentCountByCategories():IncidentCountByCategories[]{
        return this._incidentCountByCategoriesDetails;
    }

    @computed
    get incidentCorrectiveActionCountByDepartments():IncidentCorrectiveActionCountByDepartments[]{
        return this._incidentCorrectiveActionCountByDepartmentsDetails;
    }

    @computed
    get incidentEmployeesVsPersonInvolved():IncidentEmployeesVsPersonInvolved[]{
        return this._incidentEmployeesVsPersonInvolvedDetails;
    }

    

 }
 export const IncidentDashBoardStore = new Store();