import { observable, action, computed } from "mobx-angular";
import { TotalCounts , CountByDepartment , CountByDesignation , CountByRoles } from 'src/app/core/models/human-capital/dashoard/dashboard'

class Store{

    @observable
    private _totalCounts:TotalCounts;

    @observable
    private _countByDepartment:CountByDepartment[]=[]

    @observable
    private _countByDesignation:CountByDesignation[]=[]

    @observable
    private _countByRoles:CountByRoles[]=[]

    @observable
    loaded:boolean=false

    @observable
    routeParam:string=null

    @action
    setToalCount(response){
        this._totalCounts=response
        this.loaded=true
    }

    @computed
    get totalCount(){
        return this._totalCounts
    }

    @action
    setCountByDepartment(response){
        this._countByDepartment=response
        this.loaded=true
    }

    @computed
    get countByDepartment(){
        return this._countByDepartment
    }

    @action
    setCountByDesignation(response){
        this._countByDesignation=response
        this.loaded=true
    }

    @computed
    get countByDesignation(){
        return this._countByDesignation
    }

    @action
    setCountByRole(response){
        this._countByRoles=response
        this.loaded=true
    }

    @computed
    get countByRole(){
        return this._countByRoles
    }

    @action
    setHCDashboardParam(param){
        this.routeParam=param
    }

    @computed
    get dashboardParam(){
        return this.routeParam
    }

    @action
    unsetDashboardParam(){
        this.routeParam=null
    }


}
export const HumanCapitalDashboardStore = new Store()