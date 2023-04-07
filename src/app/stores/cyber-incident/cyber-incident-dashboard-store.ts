import { action, observable, computed } from "mobx-angular";
import { IncidentCorrectiveActionCountByDepartments, IncidentCount, IncidentCountByDepartments, IncidentCountByMonths, IncidentCountByYears } from "src/app/core/models/cyber-incident/cyber-incident-dashboard";


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
    private _incidentCorrectiveActionCountByDepartmentsDetails: IncidentCorrectiveActionCountByDepartments[];
    
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
    setIncidentCorrectiveActionCountByDepartments(response: IncidentCorrectiveActionCountByDepartments[]) {
        this._incidentCorrectiveActionCountByDepartmentsDetails = response; 
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
    get incidentCorrectiveActionCountByDepartments():IncidentCorrectiveActionCountByDepartments[]{
        return this._incidentCorrectiveActionCountByDepartmentsDetails;
    }

    

 }
 export const CyberIncidentDashBoardStore = new Store();